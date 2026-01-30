// @ts-nocheck
import { db } from '$lib/server/db';
import { projects, services, workspaces } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    // SECURITY: Ensure we only fetch for the allowed workspace
    // locals.allowedWorkspace is set by hooks.server.ts based on Host header
    
    // We join projects -> services -> workspaces to filter by slug
    const workspaceProjects = await db.select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        serviceName: services.name
    })
    .from(projects)
    .innerJoin(services, eq(projects.serviceId, services.id))
    .innerJoin(workspaces, eq(services.workspaceId, workspaces.id))
    .where(eq(workspaces.slug, locals.allowedWorkspace));

    return {
        projects: workspaceProjects
    };
};
