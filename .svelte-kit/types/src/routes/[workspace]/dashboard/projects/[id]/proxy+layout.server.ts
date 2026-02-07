// @ts-nocheck
import { db } from '$lib/server/db';
import { projects, services, users, requirements, projectMilestones, cases, proposals, payments, requests, workspaces, projectPayments as projectPaymentsTable, userCompanies } from '$lib/server/schema';
import { getSignedUrlForFile } from '$lib/server/storage';
import { eq, asc, desc, sql, and, or, isNull, getTableColumns, inArray } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import * as fs from 'fs';
import * as path from 'path';

function logUrlDebug(message: string) {
    try {
        const logPath = path.resolve('debug-urls.log');
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    } catch (e) {
        // ignore
    }
}

export const load = async ({ params, locals }: Parameters<LayoutServerLoad>[0]) => {
    const projectId = Number(params.id);

    if (isNaN(projectId)) {
        throw error(400, 'Invalid Project ID');
    }

    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        // Fetch user permissions
        let allowedProjectIds: number[] = [];
        let currentProjectPermissions: string[] = [];
        
        if (locals.user.companyId) {
            const userCompany = await db.query.userCompanies.findFirst({
                where: and(
                    eq(userCompanies.userId, parseInt(locals.user.id)),
                    eq(userCompanies.companyId, locals.user.companyId)
                )
            });
            
            if (userCompany && userCompany.status === 'active' && userCompany.permissions) {
                const perms = userCompany.permissions as Record<string, any>;
                allowedProjectIds = Object.keys(perms).map(id => parseInt(id)).filter(id => !isNaN(id));
                
                // Get permissions for current project
                if (perms[projectId.toString()] && Array.isArray(perms[projectId.toString()])) {
                    currentProjectPermissions = perms[projectId.toString()];
                }
            }
        }

        // 1. Fetch Project with Client and Service info
        // Security: Ensure the project belongs to the user via service -> client
        const projectData = await db.select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            status: projects.status,
            provider: projects.provider,
            serviceId: projects.serviceId,
            links: projects.links,
            startDate: projects.startDate,
            endDate: projects.endDate,
            imageUrl: projects.imageUrl,
            serviceName: services.name,
            serviceClientId: services.clientId,
            clientName: sql<string>`TRIM(BOTH ' ' FROM COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`,
            clientCompany: users.company,
            clientEmail: users.email,
            clientId: users.id,
            projectClientId: projects.clientId
        })
        .from(projects)
        .leftJoin(services, eq(projects.serviceId, services.id))
        .leftJoin(users, eq(users.id, parseInt(locals.user.id)))
        .innerJoin(workspaces, eq(services.workspaceId, workspaces.id))
        .where(
            and(
                eq(projects.id, projectId),
                or(
                    // 1. Direct Project Assignment (Highest Priority)
                    eq(projects.clientId, parseInt(locals.user.id)),

                    // 2. Service Fallback (Only if Project has NO specific client assigned)
                    and(
                        eq(workspaces.slug, locals.allowedWorkspace),
                        eq(services.clientId, parseInt(locals.user.id)),
                        isNull(projects.clientId)
                    ),

                    // 3. Permission-based Access
                    allowedProjectIds.length > 0 ? inArray(projects.id, allowedProjectIds) : undefined
                )
            )
        )
        .limit(1);

        if (projectData.length === 0) {
            throw error(404, 'Project not found or access denied');
        }

        const project = projectData[0];
        
        if (project.imageUrl) {
            project.imageUrl = await getSignedUrlForFile(project.imageUrl, params.workspace);
        }

        // 2. Fetch Requirements
        const rawRequirements = await db.select()
            .from(requirements)
            .where(eq(requirements.projectId, projectId))
            .orderBy(desc(requirements.createdAt));
        
        const projectRequirements = await Promise.all(rawRequirements.map(async (r) => {
            let files = r.files as any[];
            if (files && Array.isArray(files)) {
                files = await Promise.all(files.map(async (f) => {
                    const newUrl = await getSignedUrlForFile(f.url, params.workspace);
                    logUrlDebug(`Requirement File: ${f.name}, Original: ${f.url}, Proxy: ${newUrl}`);
                    return {
                        ...f,
                        url: newUrl
                    };
                }));
            }
            return { 
                ...r, 
                files
            };
        }));

        // 3. Fetch Milestones (Process)
        const milestones = await db.select()
            .from(projectMilestones)
            .where(eq(projectMilestones.projectId, projectId))
            .orderBy(asc(projectMilestones.order));

        // 4. Fetch Support Cases
        const rawSupportCases = await db.select()
            .from(cases)
            .where(eq(cases.projectId, projectId))
            .orderBy(asc(cases.createdAt));

        const supportCases = await Promise.all(rawSupportCases.map(async (c) => {
            let files = c.files as any[];
            if (files && Array.isArray(files)) {
                files = await Promise.all(files.map(async (f) => {
                    const newUrl = await getSignedUrlForFile(f.url, params.workspace);
                    logUrlDebug(`Case File: ${f.name}, Original: ${f.url}, Proxy: ${newUrl}`);
                    return {
                        ...f,
                        url: newUrl
                    };
                }));
            }
            return { ...c, files };
        }));

        // 5. Fetch Proposals
        const rawProposals = await db.select()
            .from(proposals)
            .where(eq(proposals.projectId, projectId))
            .orderBy(desc(proposals.createdAt));

        const projectProposals = await Promise.all(rawProposals.map(async (p) => {
            let files = p.files as any[];
            if (files && Array.isArray(files)) {
                files = await Promise.all(files.map(async (f) => {
                    const newUrl = await getSignedUrlForFile(f.url, params.workspace);
                    logUrlDebug(`Proposal File: ${f.name}, Original: ${f.url}, Proxy: ${newUrl}`);
                    return {
                        ...f,
                        url: newUrl
                    };
                }));
            }
            return {
                ...p,
                files,
                documentUrl: await getSignedUrlForFile(p.documentUrl, params.workspace)
            };
        }));

        // 6. Fetch Payments
        const rawPayments = await db.select({
            ...getTableColumns(payments)
        })
            .from(payments)
            .innerJoin(projectPaymentsTable, eq(payments.id, projectPaymentsTable.paymentId))
            .where(eq(projectPaymentsTable.projectId, projectId))
            .orderBy(asc(payments.dueDate));
        
        const projectPayments = await Promise.all(rawPayments.map(async (p) => ({
            ...p,
            documentUrl: await getSignedUrlForFile(p.documentUrl, params.workspace)
        })));

        // 7. Fetch Requests
        const rawRequests = await db.select()
            .from(requests)
            .where(eq(requests.projectId, projectId))
            .orderBy(desc(requests.createdAt));

        const projectRequests = await Promise.all(rawRequests.map(async (r) => {
            let files = r.files as any[];
            if (files && Array.isArray(files)) {
                files = await Promise.all(files.map(async (f) => {
                    const newUrl = await getSignedUrlForFile(f.url, params.workspace);
                    logUrlDebug(`Request File: ${f.name}, Original: ${f.url}, Proxy: ${newUrl}`);
                    return {
                        ...f,
                        url: newUrl
                    };
                }));
            }
            return { ...r, files };
        }));

        // Determine effective permissions
        let effectivePermissions = currentProjectPermissions;
        
        // If user is the direct client (owner) or service owner, they get all permissions
        const isOwner = project.projectClientId === parseInt(locals.user.id);
        const isServiceOwner = !project.projectClientId && project.serviceClientId === parseInt(locals.user.id);
        
        if (isOwner || isServiceOwner) {
            effectivePermissions = ['process', 'requests', 'requirements', 'support', 'proposals', 'payments'];
        }

        return {
            project,
            requirements: projectRequirements,
            milestones,
            supportCases,
            proposals: projectProposals,
            payments: projectPayments,
            requests: projectRequests,
            user: locals.user,
            permissions: effectivePermissions
        };
    } catch (err) {
        console.error('Error fetching project details:', err);
        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        }
        throw error(500, 'Internal Server Error');
    }
};
