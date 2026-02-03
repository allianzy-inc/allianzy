import { db } from '$lib/server/db';
import { projects, services, workspaces } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
    // SECURITY: Ensure we only fetch for the allowed workspace
    // locals.allowedWorkspace is set by hooks.server.ts based on Host header
    
    if (!locals.user) {
        return {
            projects: [],
            workspace: params.workspace
        };
    }

    // We join projects -> services -> workspaces to filter by slug
    // And filter by services.clientId for the logged-in user
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
    .where(
        and(
            eq(workspaces.slug, locals.allowedWorkspace),
            eq(services.clientId, parseInt(locals.user.id))
        )
    );

    return {
        projects: workspaceProjects,
        workspace: params.workspace
    };
};
