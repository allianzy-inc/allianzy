import { db } from '$lib/server/db';
import { projects, services, users, requirements, projectMilestones, cases, proposals, payments, requests, caseComments, requestComments, requirementComments, proposalComments } from '$lib/server/schema';
import { uploadFile, getSignedUrlForFile } from '$lib/server/storage';
import { eq, asc, desc, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
    const projectId = Number(params.id);

    if (isNaN(projectId)) {
        throw error(400, 'Invalid Project ID');
    }

    try {
        // 1. Fetch Project with Client and Service info
        const serviceUsers = alias(users, 'service_users');

        // Fetch all clients for the edit modal
        const allClients = await db.select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            company: users.company,
            email: users.email
        })
        .from(users)
        .where(eq(users.role, 'client'));

        // Fetch all services for the edit modal
        const allServices = await db.select({
            id: services.id,
            name: services.name,
            clientId: services.clientId,
            status: services.status
        })
        .from(services)
        .where(eq(services.status, 'Active'));

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
            // Prefer direct client link, fallback to service client link
            clientName: sql<string>`
                CASE 
                    WHEN ${users.id} IS NOT NULL THEN TRIM(BOTH ' ' FROM COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))
                    ELSE TRIM(BOTH ' ' FROM COALESCE(${serviceUsers.firstName}, '') || ' ' || COALESCE(${serviceUsers.lastName}, ''))
                END
            `,
            clientCompany: sql<string>`COALESCE(${users.company}, ${serviceUsers.company})`,
            clientEmail: sql<string>`COALESCE(${users.email}, ${serviceUsers.email})`,
            clientId: sql<number>`COALESCE(${users.id}, ${serviceUsers.id})`
        })
        .from(projects)
        .leftJoin(services, eq(projects.serviceId, services.id))
        .leftJoin(users, eq(projects.clientId, users.id))
        .leftJoin(serviceUsers, eq(services.clientId, serviceUsers.id))
        .where(eq(projects.id, projectId))
        .limit(1);

        if (projectData.length === 0) {
            throw error(404, 'Project not found');
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
                files = await Promise.all(files.map(async (f) => ({
                    ...f,
                    url: await getSignedUrlForFile(f.url, params.workspace)
                })));
            }
            return { 
                ...r, 
                files,
                documentUrl: await getSignedUrlForFile(r.documentUrl, params.workspace) // Keep backward compatibility for a moment if needed
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
                files = await Promise.all(files.map(async (f) => ({
                    ...f,
                    url: await getSignedUrlForFile(f.url, params.workspace)
                })));
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
                files = await Promise.all(files.map(async (f) => ({
                    ...f,
                    url: await getSignedUrlForFile(f.url, params.workspace)
                })));
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
                files = await Promise.all(files.map(async (f) => ({
                    ...f,
                    url: await getSignedUrlForFile(f.url, params.workspace)
                })));
            }
            return { ...r, files };
        }));

        return {
            project,
            requirements: projectRequirements,
            milestones,
            supportCases,
            proposals: projectProposals,
            payments: projectPayments,
            requests: projectRequests,
            selectedCaseComments,
            selectedRequestComments,
            selectedRequirementComments,
            selectedProposalComments,
            allClients,
            allServices
        };
    } catch (err) {
        console.error('Error fetching project details:', err);
        throw error(500, 'Internal Server Error');
    }
};

export const actions: Actions = {
    // Project Actions
    updateProject: async ({ request, params }) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
        const name = formData.get('name') as string;
        const status = formData.get('status') as string;
        const provider = formData.get('provider') as string;
        const clientId = formData.get('clientId') ? Number(formData.get('clientId')) : null;
        const serviceId = Number(formData.get('serviceId'));
        const startDateStr = formData.get('startDate') as string;
        const startTimeStr = formData.get('startTime') as string;
        const linksJson = formData.get('links') as string;

        if (!name || !status || !provider || !serviceId || !startDateStr) {
            return fail(400, { message: 'All fields are required' });
        }

        try {
            const timeStr = startTimeStr || '12:00';
            const startDate = new Date(`${startDateStr}T${timeStr}Z`);
            
            let links = [];
            if (linksJson) {
                try {
                    links = JSON.parse(linksJson);
                } catch (e) {
                    console.error('Error parsing links:', e);
                }
            }

            await db.update(projects)
                .set({
                    name,
                    status,
                    provider,
                    clientId,
                    serviceId,
                    startDate,
                    links
                })
                .where(eq(projects.id, projectId));
            return { success: true };
        } catch (err) {
            console.error('Error updating project:', err);
            return fail(500, { message: 'Failed to update project' });
        }
    },

    // Requirements Actions
    createRequirement: async ({ request, params }) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const reqDate = formData.get('reqDate') as string;
        const reqTime = formData.get('reqTime') as string;
        
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

        if (!title) {
            return fail(400, { message: 'Title is required' });
        }

        try {
            let createdAt = new Date();
            if (reqDate) {
                const timeStr = reqTime || '12:00';
                createdAt = new Date(`${reqDate}T${timeStr}`);
            }

            await db.insert(requirements).values({
                projectId,
                title,
                description,
                status: 'pending',
                files: uploadedFiles,
                createdAt
            });
            return { success: true };
        } catch (err) {
            console.error('Error creating requirement:', err);
            return fail(500, { message: 'Failed to create requirement' });
        }
    },

    updateRequirement: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const status = formData.get('status') as string;
        const reqDate = formData.get('reqDate') as string;
        const reqTime = formData.get('reqTime') as string;
        
        if (!id || !title) {
            return fail(400, { message: 'ID and Title are required' });
        }

        try {
            const existingRequirement = await db.select().from(requirements).where(eq(requirements.id, id)).limit(1);
            let currentFiles: any[] = [];
            if (existingRequirement.length > 0 && Array.isArray(existingRequirement[0].files)) {
                currentFiles = existingRequirement[0].files as any[];
            }

            // Handle legacy existing files if passed from UI (as JSON string)
            // But usually we rely on what's in DB unless we want to delete some.
            // The UI pattern I used for requests sends `existingFiles` JSON string which contains the list of files to KEEP.
            
            const existingFilesJson = formData.get('existingFiles') as string;
            if (existingFilesJson) {
                try {
                    currentFiles = JSON.parse(existingFilesJson);
                } catch (e) {
                    console.error('Error parsing existingFiles:', e);
                }
            }

            const newFiles = [];
            const files = formData.getAll('files') as File[];
            
            for (const file of files) {
                if (file.size > 0 && file.name && file.name !== 'undefined') {
                     const url = await uploadFile(file, 'requirements');
                     newFiles.push({
                         name: file.name,
                         url: url,
                         type: file.type
                     });
                }
            }

            const updatedFiles = [...currentFiles, ...newFiles];

            const updateData: any = {
                title,
                description,
                status,
                files: updatedFiles
            };

            if (reqDate) {
                const timeStr = reqTime || '12:00';
                updateData.createdAt = new Date(`${reqDate}T${timeStr}`);
            }

            await db.update(requirements)
                .set(updateData)
                .where(eq(requirements.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error updating requirement:', err);
            return fail(500, { message: 'Failed to update requirement' });
        }
    },

    deleteRequirement: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            await db.delete(requirements).where(eq(requirements.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting requirement:', err);
            return fail(500, { message: 'Failed to delete requirement' });
        }
    },
    createMilestone: async ({ request, params }) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
        const title = formData.get('title') as string;
        const order = Number(formData.get('order'));

        if (!title || isNaN(order)) {
            return fail(400, { message: 'Title and order are required' });
        }

        try {
            await db.insert(projectMilestones).values({
                projectId,
                title,
                order,
                status: 'pending'
            });
            return { success: true };
        } catch (err) {
            console.error('Error creating milestone:', err);
            return fail(500, { message: 'Failed to create milestone' });
        }
    },

    updateMilestone: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const title = formData.get('title') as string;
        const status = formData.get('status') as string;
        const order = Number(formData.get('order'));
        const completedDate = formData.get('completedDate') as string;
        const completedTime = formData.get('completedTime') as string;

        if (!id || !title || isNaN(order)) {
            return fail(400, { message: 'ID, Title and Order are required' });
        }

        try {
            const updateData: any = {
                title,
                status,
                order
            };
            
            if (status === 'completed') {
                if (completedDate) {
                    // Combine date and time (default to 12:00 if time missing)
                    const timeStr = completedTime || '12:00';
                    updateData.completedAt = new Date(`${completedDate}T${timeStr}`);
                } else {
                    // If no date provided but status is completed, default to now
                    updateData.completedAt = new Date();
                }
            } else {
                updateData.completedAt = null;
            }

            await db.update(projectMilestones)
                .set(updateData)
                .where(eq(projectMilestones.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error updating milestone:', err);
            return fail(500, { message: 'Failed to update milestone' });
        }
    },

    deleteMilestone: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            await db.delete(projectMilestones).where(eq(projectMilestones.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting milestone:', err);
            return fail(500, { message: 'Failed to delete milestone' });
        }
    },

    // Proposal Actions
    createProposal: async ({ request, params }) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        let documentUrl = formData.get('documentUrl') as string;
        const propDate = formData.get('propDate') as string;
        const propTime = formData.get('propTime') as string;
        
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

        if (!title) {
            return fail(400, { message: 'Title is required' });
        }

        try {
            let createdAt = new Date();
            if (propDate) {
                const timeStr = propTime || '12:00';
                createdAt = new Date(`${propDate}T${timeStr}Z`);
            }

            await db.insert(proposals).values({
                projectId,
                title,
                description,
                documentUrl,
                status: 'pending',
                files: uploadedFiles,
                createdAt
            });
            return { success: true };
        } catch (err) {
            console.error('Error creating proposal:', err);
            return fail(500, { message: 'Failed to create proposal' });
        }
    },

    updateProposal: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        let documentUrl = formData.get('documentUrl') as string;
        const status = formData.get('status') as string;
        const propDate = formData.get('propDate') as string;
        const propTime = formData.get('propTime') as string;
        
        if (!id || !title) {
            return fail(400, { message: 'ID and Title are required' });
        }

        try {
            const existingProposal = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
            let currentFiles: any[] = [];
            if (existingProposal.length > 0 && Array.isArray(existingProposal[0].files)) {
                currentFiles = existingProposal[0].files as any[];
            }
            
            const existingFilesJson = formData.get('existingFiles') as string;
            if (existingFilesJson) {
                try {
                    currentFiles = JSON.parse(existingFilesJson);
                } catch (e) {
                    console.error('Error parsing existingFiles:', e);
                }
            }

            const newFiles = [];
            const files = formData.getAll('files') as File[];
            
            for (const file of files) {
                if (file.size > 0 && file.name && file.name !== 'undefined') {
                     const url = await uploadFile(file, 'proposals');
                     newFiles.push({
                         name: file.name,
                         url: url,
                         type: file.type
                     });
                }
            }

            const updatedFiles = [...currentFiles, ...newFiles];

            const updateData: any = {
                title,
                description,
                documentUrl,
                status,
                files: updatedFiles
            };

            if (propDate) {
                const timeStr = propTime || '12:00';
                updateData.createdAt = new Date(`${propDate}T${timeStr}Z`);
            }

            await db.update(proposals)
                .set(updateData)
                .where(eq(proposals.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error updating proposal:', err);
            return fail(500, { message: 'Failed to update proposal' });
        }
    },

    deleteProposal: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            await db.delete(proposals).where(eq(proposals.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting proposal:', err);
            return fail(500, { message: 'Failed to delete proposal' });
        }
    },

    // Payment Actions
    createPayment: async ({ request, params }) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
        const title = formData.get('title') as string;
        const amount = formData.get('amount') as string;
        const status = formData.get('status') as string;
        const dueDateStr = formData.get('dueDate') as string;
        const paidAtStr = formData.get('paidAt') as string;
        const file = formData.get('file') as File;

        if (!title || !amount) {
            return fail(400, { message: 'Title and amount are required' });
        }

        try {
            let documentUrl = null;
            if (file && file.size > 0) {
                documentUrl = await uploadFile(file, 'payments');
            }

            const dueDate = dueDateStr ? new Date(dueDateStr) : null;
            const paidAt = paidAtStr ? new Date(paidAtStr) : null;

            await db.insert(payments).values({
                projectId,
                title,
                amount,
                status: status || 'pending',
                dueDate,
                paidAt,
                documentUrl
            });
            return { success: true };
        } catch (err) {
            console.error('Error creating payment:', err);
            return fail(500, { message: 'Failed to create payment' });
        }
    },

    updatePayment: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const title = formData.get('title') as string;
        const amount = formData.get('amount') as string;
        const status = formData.get('status') as string;
        const dueDateStr = formData.get('dueDate') as string;
        const paidAtStr = formData.get('paidAt') as string;
        const file = formData.get('file') as File;

        if (!id || !title || !amount) {
            return fail(400, { message: 'ID, Title and Amount are required' });
        }

        try {
            const updateData: any = {
                title,
                amount,
                status,
                dueDate: dueDateStr ? new Date(dueDateStr) : null,
                paidAt: paidAtStr ? new Date(paidAtStr) : null
            };

            if (file && file.size > 0) {
                updateData.documentUrl = await uploadFile(file, 'payments');
            }

            await db.update(payments)
                .set(updateData)
                .where(eq(payments.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error updating payment:', err);
            return fail(500, { message: 'Failed to update payment' });
        }
    },

    deletePayment: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            await db.delete(payments).where(eq(payments.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting payment:', err);
            return fail(500, { message: 'Failed to delete payment' });
        }
    },

    // Request Actions
    createRequest: async ({ request, params }) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const reqDate = formData.get('reqDate') as string;
        const reqTime = formData.get('reqTime') as string;
        
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

        if (!title) {
            return fail(400, { message: 'Title is required' });
        }

        try {
            let createdAt = new Date();
            if (reqDate) {
                const timeStr = reqTime || '12:00';
                createdAt = new Date(`${reqDate}T${timeStr}`);
            }

            await db.insert(requests).values({
                projectId,
                title,
                description,
                status: 'pending',
                files: uploadedFiles,
                createdAt
            });
            return { success: true };
        } catch (err) {
            console.error('Error creating request:', err);
            return fail(500, { message: 'Failed to create request' });
        }
    },

    updateRequest: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const status = formData.get('status') as string;
        const reqDate = formData.get('reqDate') as string;
        const reqTime = formData.get('reqTime') as string;
        const existingFilesJson = formData.get('existingFiles') as string;
        
        if (!id || !title) {
            return fail(400, { message: 'ID and Title are required' });
        }

        try {
            // Get existing request to preserve existing files (if not provided by client)
            let currentFiles: any[] = [];
            
            if (existingFilesJson) {
                try {
                    currentFiles = JSON.parse(existingFilesJson);
                } catch (e) {
                    console.error('Error parsing existingFiles:', e);
                    // Fallback to DB if parsing fails
                    const existingRequest = await db.select().from(requests).where(eq(requests.id, id)).limit(1);
                    if (existingRequest.length > 0 && Array.isArray(existingRequest[0].files)) {
                        currentFiles = existingRequest[0].files as any[];
                    }
                }
            } else {
                // Legacy fallback or if no files were ever attached
                const existingRequest = await db.select().from(requests).where(eq(requests.id, id)).limit(1);
                if (existingRequest.length > 0 && Array.isArray(existingRequest[0].files)) {
                    currentFiles = existingRequest[0].files as any[];
                }
            }

            const newFiles = [];
            const files = formData.getAll('files') as File[];
            
            for (const file of files) {
                if (file.size > 0 && file.name && file.name !== 'undefined') {
                     const url = await uploadFile(file, 'requests');
                     newFiles.push({
                         name: file.name,
                         url: url,
                         type: file.type
                     });
                }
            }

            const updatedFiles = [...currentFiles, ...newFiles];

            const updateData: any = {
                title,
                description,
                status,
                files: updatedFiles,
                updatedAt: new Date()
            };

            if (reqDate) {
                const timeStr = reqTime || '12:00';
                updateData.createdAt = new Date(`${reqDate}T${timeStr}`);
            }

            await db.update(requests)
                .set(updateData)
                .where(eq(requests.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error updating request:', err);
            return fail(500, { message: 'Failed to update request' });
        }
    },

    deleteRequest: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            await db.delete(requests).where(eq(requests.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting request:', err);
            return fail(500, { message: 'Failed to delete request' });
        }
    },

    // Case Actions
    createCase: async ({ request, params }) => {
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

    updateCase: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as string;
        const status = formData.get('status') as string;
        
        if (!id || !title) {
            return fail(400, { message: 'ID and Title are required' });
        }

        try {
            const existingCase = await db.select().from(cases).where(eq(cases.id, id)).limit(1);
            let currentFiles: any[] = [];
            if (existingCase.length > 0 && Array.isArray(existingCase[0].files)) {
                currentFiles = existingCase[0].files as any[];
            }
            
            const existingFilesJson = formData.get('existingFiles') as string;
            if (existingFilesJson) {
                try {
                    currentFiles = JSON.parse(existingFilesJson);
                } catch (e) {
                    console.error('Error parsing existingFiles:', e);
                }
            }

            const newFiles = [];
            const files = formData.getAll('files') as File[];
            
            for (const file of files) {
                if (file.size > 0 && file.name && file.name !== 'undefined') {
                     const url = await uploadFile(file, 'cases');
                     newFiles.push({
                         name: file.name,
                         url: url,
                         type: file.type
                     });
                }
            }

            const updatedFiles = [...currentFiles, ...newFiles];
            
            // Check if closing
            let closedAt = existingCase[0]?.closedAt;
            if (status === 'closed' && existingCase[0]?.status !== 'closed') {
                closedAt = new Date();
            } else if (status !== 'closed') {
                closedAt = null;
            }

            await db.update(cases)
                .set({
                    title,
                    description,
                    priority,
                    status,
                    files: updatedFiles,
                    closedAt
                })
                .where(eq(cases.id, id));
            return { success: true };
        } catch (err) {
            console.error('Error updating case:', err);
            return fail(500, { message: 'Failed to update case' });
        }
    },

    addCaseComment: async ({ request }) => {
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

        const authorName = 'Admin'; 

        try {
            await db.insert(caseComments).values({
                caseId,
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

    addRequestComment: async ({ request }) => {
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

        const authorName = 'Admin'; 

        try {
            await db.insert(requestComments).values({
                requestId,
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

    addRequirementComment: async ({ request }) => {
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

        const authorName = 'Admin'; 

        try {
            await db.insert(requirementComments).values({
                requirementId,
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

    addProposalComment: async ({ request }) => {
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

        const authorName = 'Admin'; 

        try {
            await db.insert(proposalComments).values({
                proposalId,
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