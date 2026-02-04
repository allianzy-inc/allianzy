// @ts-nocheck
import { db } from '$lib/server/db';
import { projects, services, workspaces, users } from '$lib/server/schema';
import { eq, and, or, isNull, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { getSignedUrlForFile } from '$lib/server/storage';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
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
