import { db } from '$lib/server/db';
import { projects, services, users, requirements, projectMilestones, cases, proposals, payments, requests, caseComments, requestComments, requirementComments, proposalComments, workspaces } from '$lib/server/schema';
import { uploadFile, getSignedUrlForFile } from '$lib/server/storage';
import { eq, asc, desc, sql, and, or, isNull } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
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

export const load: PageServerLoad = async ({ params, url, locals }) => {
    const projectId = Number(params.id);

    if (isNaN(projectId)) {
        throw error(400, 'Invalid Project ID');
    }

    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
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
            serviceName: services.name,
            clientName: sql<string>`TRIM(BOTH ' ' FROM COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`,
            clientCompany: users.company,
            clientEmail: users.email,
            clientId: users.id
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
                    )
                )
            )
        )
        .limit(1);

        if (projectData.length === 0) {
            throw error(404, 'Project not found or access denied');
        }

        const project = projectData[0];

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
                files,
                documentUrl: await getSignedUrlForFile(r.documentUrl, params.workspace)
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

        // Fetch comments for selected case
        let selectedCaseComments: any[] = [];
        const selectedCaseId = url.searchParams.get('caseId');
        if (selectedCaseId) {
            const rawComments = await db.select({
                id: caseComments.id,
                content: caseComments.content,
                createdAt: caseComments.createdAt,
                authorName: caseComments.authorName,
                subject: caseComments.subject,
                userId: caseComments.userId,
                userName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
                files: caseComments.files
            })
            .from(caseComments)
            .leftJoin(users, eq(caseComments.userId, users.id))
            .where(eq(caseComments.caseId, Number(selectedCaseId)))
            .orderBy(asc(caseComments.createdAt));

            selectedCaseComments = await Promise.all(rawComments.map(async (c) => {
                 let files = c.files as any[];
                 if (files && Array.isArray(files)) {
                     files = await Promise.all(files.map(async (f) => ({
                         ...f,
                         url: await getSignedUrlForFile(f.url, params.workspace)
                     })));
                 }
                 return { ...c, files };
            }));
        }

        // Fetch comments for selected request
        let selectedRequestComments: any[] = [];
        const selectedRequestId = url.searchParams.get('requestId');
        if (selectedRequestId) {
            const rawComments = await db.select({
                id: requestComments.id,
                content: requestComments.content,
                createdAt: requestComments.createdAt,
                authorName: requestComments.authorName,
                subject: requestComments.subject,
                userId: requestComments.userId,
                userName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
                files: requestComments.files
            })
            .from(requestComments)
            .leftJoin(users, eq(requestComments.userId, users.id))
            .where(eq(requestComments.requestId, Number(selectedRequestId)))
            .orderBy(asc(requestComments.createdAt));

            selectedRequestComments = await Promise.all(rawComments.map(async (c) => {
                 let files = c.files as any[];
                 if (files && Array.isArray(files)) {
                     files = await Promise.all(files.map(async (f) => ({
                         ...f,
                         url: await getSignedUrlForFile(f.url, params.workspace)
                     })));
                 }
                 return { ...c, files };
            }));
        }

        // Fetch comments for selected requirement
        let selectedRequirementComments: any[] = [];
        const selectedRequirementId = url.searchParams.get('requirementId');
        if (selectedRequirementId) {
            const rawComments = await db.select({
                id: requirementComments.id,
                content: requirementComments.content,
                createdAt: requirementComments.createdAt,
                authorName: requirementComments.authorName,
                subject: requirementComments.subject,
                userId: requirementComments.userId,
                userName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
                files: requirementComments.files
            })
            .from(requirementComments)
            .leftJoin(users, eq(requirementComments.userId, users.id))
            .where(eq(requirementComments.requirementId, Number(selectedRequirementId)))
            .orderBy(asc(requirementComments.createdAt));

            selectedRequirementComments = await Promise.all(rawComments.map(async (c) => {
                 let files = c.files as any[];
                 if (files && Array.isArray(files)) {
                     files = await Promise.all(files.map(async (f) => ({
                         ...f,
                         url: await getSignedUrlForFile(f.url, params.workspace)
                     })));
                 }
                 return { ...c, files };
            }));
        }

        // Fetch comments for selected proposal
        let selectedProposalComments: any[] = [];
        const selectedProposalId = url.searchParams.get('proposalId');
        if (selectedProposalId) {
            const rawComments = await db.select({
                id: proposalComments.id,
                content: proposalComments.content,
                createdAt: proposalComments.createdAt,
                authorName: proposalComments.authorName,
                subject: proposalComments.subject,
                userId: proposalComments.userId,
                userName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
                files: proposalComments.files
            })
            .from(proposalComments)
            .leftJoin(users, eq(proposalComments.userId, users.id))
            .where(eq(proposalComments.proposalId, Number(selectedProposalId)))
            .orderBy(asc(proposalComments.createdAt));

            selectedProposalComments = await Promise.all(rawComments.map(async (c) => {
                 let files = c.files as any[];
                 if (files && Array.isArray(files)) {
                     files = await Promise.all(files.map(async (f) => ({
                         ...f,
                         url: await getSignedUrlForFile(f.url, params.workspace)
                     })));
                 }
                 return { ...c, files };
            }));
        }

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
        const rawPayments = await db.select()
            .from(payments)
            .where(eq(payments.projectId, projectId))
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

        return {
            project,
            requirements: projectRequirements,
            milestones,
            supportCases,
            selectedCaseComments,
            selectedRequestComments,
            selectedRequirementComments,
            selectedProposalComments,
            proposals: projectProposals,
            payments: projectPayments,
            requests: projectRequests,
            user: locals.user
        };
    } catch (err) {
        console.error('Error fetching project details:', err);
        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        }
        throw error(500, 'Internal Server Error');
    }
};

export const actions: Actions = {
    // Case Actions (Allowed for Client)
    createCase: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as string;
        const status = formData.get('status') as string || 'open';
        
        const uploadedFiles = [];
        const files = formData.getAll('files') as File[];
        
        for (const file of files) {
            if (file.size > 0 && file.name && file.name !== 'undefined') {
                 const url = await uploadFile(file, 'cases');
                 uploadedFiles.push({
                     name: file.name,
                     url: url,
                     type: file.type
                 });
            }
        }

        if (!title) {
            return fail(400, { message: 'Title is required' });
        }

        try {
            await db.insert(cases).values({
                projectId,
                title,
                description,
                priority,
                status,
                files: uploadedFiles
            });
            return { success: true };
        } catch (err) {
            console.error('Error creating case:', err);
            return fail(500, { message: 'Failed to create case' });
        }
    },

    addCaseComment: async ({ request, locals }) => {
        const formData = await request.formData();
        const caseId = Number(formData.get('caseId'));
        const content = formData.get('content') as string;
        const subject = formData.get('subject') as string;
        
        const uploadedFiles = [];
        const files = formData.getAll('files') as File[];
        
        for (const file of files) {
            if (file.size > 0 && file.name && file.name !== 'undefined') {
                 const url = await uploadFile(file, 'cases');
                 uploadedFiles.push({
                     name: file.name,
                     url: url,
                     type: file.type
                 });
            }
        }
        
        if (!caseId || !content) {
            return fail(400, { message: 'Case ID and Content are required' });
        }

        const authorName = locals.user ? `${locals.user.firstName} ${locals.user.lastName}` : 'Client';
        const userId = locals.user ? parseInt(locals.user.id) : null;

        try {
            await db.insert(caseComments).values({
                caseId,
                userId,
                authorName,
                subject,
                content,
                files: uploadedFiles
            });
            return { success: true };
        } catch (err) {
            console.error('Error adding comment:', err);
            return fail(500, { message: 'Failed to add comment' });
        }
    },

    addRequestComment: async ({ request, locals }) => {
        const formData = await request.formData();
        const requestId = Number(formData.get('requestId'));
        const content = formData.get('content') as string;
        const subject = formData.get('subject') as string;
        
        const uploadedFiles = [];
        const files = formData.getAll('files') as File[];
        
        for (const file of files) {
            if (file.size > 0 && file.name && file.name !== 'undefined') {
                 const url = await uploadFile(file, 'requests');
                 uploadedFiles.push({
                     name: file.name,
                     url: url,
                     type: file.type
                 });
            }
        }
        
        if (!requestId || !content) {
            return fail(400, { message: 'Request ID and Content are required' });
        }

        const authorName = locals.user ? `${locals.user.firstName} ${locals.user.lastName}` : 'Client';
        const userId = locals.user ? parseInt(locals.user.id) : null;

        try {
            await db.insert(requestComments).values({
                requestId,
                userId,
                authorName,
                subject,
                content,
                files: uploadedFiles
            });
            return { success: true };
        } catch (err) {
            console.error('Error adding request comment:', err);
            return fail(500, { message: 'Failed to add request comment' });
        }
    },

    addRequirementComment: async ({ request, locals }) => {
        const formData = await request.formData();
        const requirementId = Number(formData.get('requirementId'));
        const content = formData.get('content') as string;
        const subject = formData.get('subject') as string;
        
        const uploadedFiles = [];
        const files = formData.getAll('files') as File[];
        
        for (const file of files) {
            if (file.size > 0 && file.name && file.name !== 'undefined') {
                 const url = await uploadFile(file, 'requirements');
                 uploadedFiles.push({
                     name: file.name,
                     url: url,
                     type: file.type
                 });
            }
        }
        
        if (!requirementId || !content) {
            return fail(400, { message: 'Requirement ID and Content are required' });
        }

        const authorName = locals.user ? `${locals.user.firstName} ${locals.user.lastName}` : 'Client';
        const userId = locals.user ? parseInt(locals.user.id) : null;

        try {
            await db.insert(requirementComments).values({
                requirementId,
                userId,
                authorName,
                subject,
                content,
                files: uploadedFiles
            });
            return { success: true };
        } catch (err) {
            console.error('Error adding requirement comment:', err);
            return fail(500, { message: 'Failed to add requirement comment' });
        }
    },

    addProposalComment: async ({ request, locals }) => {
        const formData = await request.formData();
        const proposalId = Number(formData.get('proposalId'));
        const content = formData.get('content') as string;
        const subject = formData.get('subject') as string;
        
        const uploadedFiles = [];
        const files = formData.getAll('files') as File[];
        
        for (const file of files) {
            if (file.size > 0 && file.name && file.name !== 'undefined') {
                 const url = await uploadFile(file, 'proposals');
                 uploadedFiles.push({
                     name: file.name,
                     url: url,
                     type: file.type
                 });
            }
        }
        
        if (!proposalId || !content) {
            return fail(400, { message: 'Proposal ID and Content are required' });
        }

        const authorName = locals.user ? `${locals.user.firstName} ${locals.user.lastName}` : 'Client';
        const userId = locals.user ? parseInt(locals.user.id) : null;

        try {
            await db.insert(proposalComments).values({
                proposalId,
                userId,
                authorName,
                subject,
                content,
                files: uploadedFiles
            });
            return { success: true };
        } catch (err) {
            console.error('Error adding proposal comment:', err);
            return fail(500, { message: 'Failed to add proposal comment' });
        }
    }
};
