// @ts-nocheck
import { db } from '$lib/server/db';
import { projects, services, workspaces, users, notifications, userCompanies } from '$lib/server/schema';
import { eq, and, or, isNull, desc, inArray } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { env } from '$env/dynamic/private';
import { getSignedUrlForFile } from '$lib/server/storage';
import { fail } from '@sveltejs/kit';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
    console.log(`[DASHBOARD-PAGE] Loading for user: ${locals.user?.email}`);
    if (!env.DATABASE_URL || !locals.user) {
        return {
            projects: []
        };
    }

    try {
        const userId = parseInt(locals.user.id);

        // Get user permissions for projects from user_companies
        let allowedProjectIds: number[] = [];
        if (locals.user.companyId) {
             const userCompany = await db.query.userCompanies.findFirst({
                where: and(
                    eq(userCompanies.userId, userId),
                    eq(userCompanies.companyId, locals.user.companyId)
                )
             });
             
             if (userCompany && userCompany.status === 'active' && userCompany.permissions) {
                 const perms = userCompany.permissions as Record<string, any>;
                 allowedProjectIds = Object.keys(perms).map(id => parseInt(id)).filter(id => !isNaN(id));
             }
        }

        // Build conditions for project visibility
        const visibilityConditions = [
            // 1. Direct Project Assignment (Highest Priority)
            eq(projects.clientId, userId),

            // 2. Service Fallback (Only if Project has NO specific client assigned)
            and(
                eq(workspaces.slug, locals.allowedWorkspace),
                eq(services.clientId, userId),
                isNull(projects.clientId)
            )
        ];

        // 3. Permission-based Access (from Company Settings)
        if (allowedProjectIds.length > 0) {
            visibilityConditions.push(inArray(projects.id, allowedProjectIds));
        }

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
        .where(or(...visibilityConditions))
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

export const actions = {
    archiveNotification: async ({ request, locals }: import('./$types').RequestEvent) => {
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

    archiveAllNotifications: async ({ locals }: import('./$types').RequestEvent) => {
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

    markNotificationRead: async ({ request, locals }: import('./$types').RequestEvent) => {
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

    deleteNotification: async ({ request, locals }: import('./$types').RequestEvent) => {
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
    },

    acceptInvitation: async ({ request, locals }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id || !locals.user) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            // 1. Get notification
            const [notification] = await db.select().from(notifications).where(and(
                eq(notifications.id, id),
                eq(notifications.userId, parseInt(locals.user.id))
            )).limit(1);

            if (!notification || notification.type !== 'invitation') {
                return fail(404, { message: 'Invitation not found' });
            }

            const metadata = notification.metadata as { companyId: number, companyName: string, role: string } | null;
            if (!metadata?.companyId) {
                return fail(400, { message: 'Invalid invitation data' });
            }

            // 2. Update User Company Status to Active
            await db.update(userCompanies)
                .set({ status: 'active' })
                .where(and(
                    eq(userCompanies.userId, parseInt(locals.user.id)),
                    eq(userCompanies.companyId, metadata.companyId)
                ));

            // 3. Update Notification (Mark as read/archived, maybe change title)
            await db.update(notifications)
                .set({ 
                    read: true, 
                    archived: true,
                    title: 'Invitation Accepted',
                    message: `You have joined ${metadata.companyName}.`,
                    type: 'success'
                })
                .where(eq(notifications.id, id));

            return { success: true };
        } catch (err) {
            console.error('Error accepting invitation:', err);
            return fail(500, { message: 'Failed to accept invitation' });
        }
    },

    rejectInvitation: async ({ request, locals }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id || !locals.user) {
            return fail(400, { message: 'ID is required' });
        }

        try {
             // 1. Get notification
             const [notification] = await db.select().from(notifications).where(and(
                eq(notifications.id, id),
                eq(notifications.userId, parseInt(locals.user.id))
            )).limit(1);

            if (!notification || notification.type !== 'invitation') {
                return fail(404, { message: 'Invitation not found' });
            }

            const metadata = notification.metadata as { companyId: number, companyName: string } | null;
            if (!metadata?.companyId) {
                return fail(400, { message: 'Invalid invitation data' });
            }

            // 2. Update User Company Status to Rejected
            await db.update(userCompanies)
                .set({ status: 'rejected' })
                .where(and(
                    eq(userCompanies.userId, parseInt(locals.user.id)),
                    eq(userCompanies.companyId, metadata.companyId)
                ));

            // 3. Update Notification
            await db.update(notifications)
                .set({ 
                    read: true, 
                    archived: true,
                    title: 'Invitation Rejected',
                    message: `You rejected the invitation to join ${metadata.companyName}.`,
                    type: 'warning'
                })
                .where(eq(notifications.id, id));

            return { success: true };
        } catch (err) {
            console.error('Error rejecting invitation:', err);
            return fail(500, { message: 'Failed to reject invitation' });
        }
    }
};
;null as any as Actions;