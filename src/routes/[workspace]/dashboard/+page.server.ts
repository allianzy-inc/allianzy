import { db } from '$lib/server/db';
import { projects, services, workspaces, users, notifications } from '$lib/server/schema';
import { eq, and, or, isNull, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { env } from '$env/dynamic/private';
import { getSignedUrlForFile } from '$lib/server/storage';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
    console.log(`[DASHBOARD-PAGE] Loading for user: ${locals.user?.email}`);
    if (!env.DATABASE_URL || !locals.user) {
        return {
            projects: []
        };
    }

    try {
        const userId = parseInt(locals.user.id);

        // Fetch projects for the logged-in user
        // Logic matches /dashboard/projects/+page.server.ts
        const userProjects = await db.select({
            id: projects.id,
            name: projects.name,
            status: projects.status,
            imageUrl: projects.imageUrl,
            description: projects.description
        })
        .from(projects)
        .leftJoin(services, eq(projects.serviceId, services.id))
        .leftJoin(workspaces, eq(services.workspaceId, workspaces.id))
        .where(
            or(
                // 1. Direct Project Assignment (Highest Priority)
                eq(projects.clientId, userId),

                // 2. Service Fallback (Only if Project has NO specific client assigned)
                and(
                    eq(workspaces.slug, locals.allowedWorkspace),
                    eq(services.clientId, userId),
                    isNull(projects.clientId)
                )
            )
        )
        .orderBy(desc(projects.createdAt));
        
        // Process images with signed URLs
        const projectsWithSignedUrls = await Promise.all(userProjects.map(async (p) => {
            if (p.imageUrl) {
                p.imageUrl = await getSignedUrlForFile(p.imageUrl);
            }
            return p;
        }));

        return {
            projects: projectsWithSignedUrls
        };
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return {
            projects: []
        };
    }
};

export const actions: Actions = {
    archiveNotification: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id || !locals.user) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            await db.update(notifications)
                .set({ archived: true })
                .where(and(
                    eq(notifications.id, id),
                    eq(notifications.userId, parseInt(locals.user.id))
                ));
            return { success: true };
        } catch (err) {
            console.error('Error archiving notification:', err);
            return fail(500, { message: 'Failed to archive notification' });
        }
    },

    archiveAllNotifications: async ({ locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

        try {
            await db.update(notifications)
                .set({ archived: true })
                .where(eq(notifications.userId, parseInt(locals.user.id)));
            return { success: true };
        } catch (err) {
            console.error('Error archiving all notifications:', err);
            return fail(500, { message: 'Failed to archive all notifications' });
        }
    },

    markNotificationRead: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id || !locals.user) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            await db.update(notifications)
                .set({ read: true })
                .where(and(
                    eq(notifications.id, id),
                    eq(notifications.userId, parseInt(locals.user.id))
                ));
            return { success: true };
        } catch (err) {
            console.error('Error marking notification as read:', err);
            return fail(500, { message: 'Failed to mark notification as read' });
        }
    },

    deleteNotification: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id || !locals.user) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            const notification = await db.select().from(notifications).where(and(
                eq(notifications.id, id),
                eq(notifications.userId, parseInt(locals.user.id))
            )).limit(1);

            if (notification.length === 0) {
                return fail(404, { message: 'Notification not found' });
            }

            if (!notification[0].archived) {
                return fail(400, { message: 'Only archived notifications can be deleted' });
            }

            await db.delete(notifications)
                .where(and(
                    eq(notifications.id, id),
                    eq(notifications.userId, parseInt(locals.user.id))
                ));
            return { success: true };
        } catch (err) {
            console.error('Error deleting notification:', err);
            return fail(500, { message: 'Failed to delete notification' });
        }
    }
};
