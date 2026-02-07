import { db } from '$lib/server/db';
import { projects, services, workspaces, userCompanies } from '$lib/server/schema';
import { uploadFile, getSignedUrlForFile } from '$lib/server/storage';
import { eq, and, or, isNull, inArray } from 'drizzle-orm';
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

    console.log('[Dashboard Projects] User:', locals.user.id, 'Workspace:', locals.allowedWorkspace);

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

    // We join projects -> services -> workspaces to filter by slug
    // And filter by services.clientId or projects.clientId for the logged-in user
    const workspaceProjects = await db.select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        imageUrl: projects.imageUrl,
        serviceName: services.name
    })
    .from(projects)
    .leftJoin(services, eq(projects.serviceId, services.id))
    .leftJoin(workspaces, eq(services.workspaceId, workspaces.id))
    .where(or(...visibilityConditions));

    // Sign URLs for project images
    const projectsWithSignedUrls = await Promise.all(workspaceProjects.map(async (p) => {
        if (p.imageUrl) {
            p.imageUrl = await getSignedUrlForFile(p.imageUrl, params.workspace);
        }
        return p;
    }));

    return {
        projects: projectsWithSignedUrls,
        workspace: params.workspace
    };
};
