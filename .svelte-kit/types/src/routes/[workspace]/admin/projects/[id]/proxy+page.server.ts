// @ts-nocheck
import { db } from '$lib/server/db';
import { projects, services, users, requirements, projectMilestones, cases, proposals, payments, requests, caseComments, requestComments, requirementComments, proposalComments, projectPayments as projectPaymentsTable, notifications, userCompanies, companies } from '$lib/server/schema';
import { uploadFile, getSignedUrlForFile, deleteFile } from '$lib/server/storage';
import * as billingService from '$lib/server/billing-domain/billing.service';
import * as paymentAccountsRepo from '$lib/server/billing-domain/payment-accounts.repository';
import * as providerConfigRepo from '$lib/server/billing-domain/provider-config.repository';
import { eq, asc, desc, sql, getTableColumns, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = async ({ params, url }: Parameters<PageServerLoad>[0]) => {
    const projectId = Number(params.id);

    if (isNaN(projectId)) {
        throw error(400, 'Invalid Project ID');
    }

    try {
        // 1. Fetch Project with Client and Service info
        const serviceUsers = alias(users, 'service_users');

        const allClients = await db.select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            company: users.company,
            email: users.email
        })
        .from(users)
        .where(eq(users.role, 'client'));

        const clientIds = allClients.map((c) => c.id).filter((id): id is number => id != null);
        const companiesByClientId: Record<number, { id: number; name: string }[]> = {};
        if (clientIds.length > 0) {
            const links = await db
                .select({
                    userId: userCompanies.userId,
                    companyId: companies.id,
                    companyName: companies.name
                })
                .from(userCompanies)
                .innerJoin(companies, eq(userCompanies.companyId, companies.id))
                .where(inArray(userCompanies.userId, clientIds));
            for (const row of links) {
                if (row.userId != null && row.companyId != null && row.companyName) {
                    if (!companiesByClientId[row.userId]) companiesByClientId[row.userId] = [];
                    if (!companiesByClientId[row.userId].some((c) => c.id === row.companyId)) {
                        companiesByClientId[row.userId].push({ id: row.companyId, name: row.companyName });
                    }
                }
            }
        }

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
            companyId: projects.companyId,
            name: projects.name,
            description: projects.description,
            status: projects.status,
            provider: projects.provider,
            serviceId: projects.serviceId,
            links: projects.links,
            startDate: projects.startDate,
            endDate: projects.endDate,
            serviceName: services.name,
            imageUrl: projects.imageUrl,
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
        if (project.imageUrl) {
            project.imageUrl = await getSignedUrlForFile(project.imageUrl, params.workspace);
        }

        // Empresa que se muestra al lado del usuario: la del proyecto (a la que pertenece el proyecto), no la primera del usuario
        let clientCompanyDisplay = project.clientCompany ?? '';
        if (project.companyId != null) {
            const projectCompanyRow = await db
                .select({ name: companies.name })
                .from(companies)
                .where(eq(companies.id, project.companyId))
                .limit(1);
            if (projectCompanyRow[0]?.name) {
                clientCompanyDisplay = projectCompanyRow[0].name;
            }
        } else if (project.clientId != null) {
            const companyRow = await db
                .select({ companyName: companies.name })
                .from(userCompanies)
                .innerJoin(companies, eq(userCompanies.companyId, companies.id))
                .where(eq(userCompanies.userId, project.clientId))
                .orderBy(desc(userCompanies.isPrimary))
                .limit(1);
            if (companyRow[0]?.companyName) {
                clientCompanyDisplay = companyRow[0].companyName;
            }
        }
        (project as Record<string, unknown>).clientCompanyDisplay = clientCompanyDisplay;

        // Fetch all projects for the payment modal (same client only)
        const allProjects = await db.select({
            id: projects.id,
            name: projects.name
        })
        .from(projects)
        .where(eq(projects.clientId, project.clientId));

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

        // 6. Fetch Payments (Many-to-Many)
        const rawPayments = await db.select({
            ...getTableColumns(payments)
        })
        .from(payments)
        .innerJoin(projectPaymentsTable, eq(payments.id, projectPaymentsTable.paymentId))
        .where(eq(projectPaymentsTable.projectId, projectId))
        .orderBy(asc(payments.dueDate));
        
        const projectPayments = await Promise.all(rawPayments.map(async (p) => {
            // Fetch all associated projects for this payment
            const associatedProjects = await db.select({
                projectId: projectPaymentsTable.projectId
            })
            .from(projectPaymentsTable)
            .where(eq(projectPaymentsTable.paymentId, p.id));

            return {
                ...p,
                projectIds: associatedProjects.map(ap => ap.projectId),
                documentUrl: await getSignedUrlForFile(p.documentUrl, params.workspace)
            };
        }));

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

        // Métodos de pago desde configuraciones (para el modal Nuevo/Editar Pago)
        const billingProviderConfigs = await providerConfigRepo.findAllProviderConfigs(true);
        const billingProviders = billingProviderConfigs.map((c) => ({
            code: c.code,
            label: c.label,
            isAutomatic: c.isAutomatic
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
            allServices,
            allProjects,
            companiesByClientId,
            billingProviders
        };
    } catch (err) {
        console.error('Error fetching project details:', err);
        throw error(500, 'Internal Server Error');
    }
};

export const actions = {
    // Project Actions
    updateProject: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
        const name = formData.get('name') as string;
        const status = formData.get('status') as string;
        const provider = formData.get('provider') as string;
        const clientId = formData.get('clientId') ? Number(formData.get('clientId')) : null;
        const companyIdRaw = formData.get('companyId');
        const companyId = companyIdRaw !== null && companyIdRaw !== undefined && String(companyIdRaw).trim() !== '' ? Number(companyIdRaw) : null;
        const serviceId = Number(formData.get('serviceId'));
        const startDateStr = formData.get('startDate') as string;
        const startTimeStr = formData.get('startTime') as string;
        const description = (formData.get('description') as string) ?? '';
        const linksJson = formData.get('links') as string;
        const imageFile = formData.get('image') as File;
        const removeImage = formData.get('removeImage') === 'true';
        const imageUrlFromInput = (formData.get('imageUrl') as string)?.trim() || '';

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

            const updateData: any = {
                name,
                description: description || null,
                status,
                provider,
                clientId,
                companyId: companyId ?? null,
                serviceId,
                startDate,
                links
            };

            if (removeImage) {
                updateData.imageUrl = null;
            } else if (imageFile && imageFile.size > 0) {
                updateData.imageUrl = await uploadFile(imageFile, 'project-covers');
            } else if (imageUrlFromInput && (imageUrlFromInput.startsWith('http://') || imageUrlFromInput.startsWith('https://'))) {
                updateData.imageUrl = imageUrlFromInput;
            }

            await db.update(projects)
                .set(updateData)
                .where(eq(projects.id, projectId));
            return { success: true };
        } catch (err) {
            console.error('Error updating project:', err);
            return fail(500, { message: 'Failed to update project' });
        }
    },

    // Requirements Actions
    createRequirement: async ({ request, params }: import('./$types').RequestEvent) => {
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

            const [newRequirement] = await db.insert(requirements).values({
                projectId,
                title,
                description,
                status: 'pending',
                files: uploadedFiles,
                createdAt
            }).returning({ id: requirements.id });

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Nuevo Requerimiento',
                    message: `Se ha creado un nuevo requerimiento: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/projects/${projectId}?requirementId=${newRequirement.id}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error creating requirement:', err);
            return fail(500, { message: 'Failed to create requirement' });
        }
    },

    updateRequirement: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
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

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Requerimiento Actualizado',
                    message: `Se ha actualizado el requerimiento: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/projects/${projectId}?requirementId=${id}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error updating requirement:', err);
            return fail(500, { message: 'Failed to update requirement' });
        }
    },

    deleteRequirement: async ({ request }: import('./$types').RequestEvent) => {
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
    createMilestone: async ({ request, params }: import('./$types').RequestEvent) => {
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

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Nuevo Hito en el Proceso',
                    message: `Se ha agregado un nuevo hito: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/projects/${projectId}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error creating milestone:', err);
            return fail(500, { message: 'Failed to create milestone' });
        }
    },

    updateMilestone: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
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

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Hito del Proceso Actualizado',
                    message: `Se ha actualizado el hito: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/projects/${projectId}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error updating milestone:', err);
            return fail(500, { message: 'Failed to update milestone' });
        }
    },

    deleteMilestone: async ({ request }: import('./$types').RequestEvent) => {
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
    createProposal: async ({ request, params }: import('./$types').RequestEvent) => {
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

            const [newProposal] = await db.insert(proposals).values({
                projectId,
                title,
                description,
                documentUrl,
                status: 'pending',
                files: uploadedFiles,
                createdAt
            }).returning({ id: proposals.id });

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Nueva Propuesta',
                    message: `Se ha creado una nueva propuesta: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/projects/${projectId}?proposalId=${newProposal.id}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error creating proposal:', err);
            return fail(500, { message: 'Failed to create proposal' });
        }
    },

    updateProposal: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
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

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Propuesta Actualizada',
                    message: `Se ha actualizado la propuesta: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/projects/${projectId}?proposalId=${id}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error updating proposal:', err);
            return fail(500, { message: 'Failed to update proposal' });
        }
    },

    deleteProposal: async ({ request }: import('./$types').RequestEvent) => {
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

    // Payment Actions — calcula tasa y USD desde monto original y monto abonado
    createPayment: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const currentProjectId = Number(params.id); // Context project
        const title = formData.get('title') as string;
        const status = formData.get('status') as string;
        const dueDateStr = formData.get('dueDate') as string;
        const dueTime = formData.get('dueTime') as string;
        const paidAtStr = formData.get('paidAt') as string;
        const paidTime = formData.get('paidTime') as string;
        const file = formData.get('file') as File;
        
        const amountOriginal = formData.get('amountOriginal') as string;
        const currencyOriginal = (formData.get('currencyOriginal') as string) || 'USD';
        const amountPaid = formData.get('amountPaid') as string;
        const currencyPaid = (formData.get('currencyPaid') as string) || 'USD';
        const paymentMethod = formData.get('paymentMethod') as string;
        const providerPaymentId = formData.get('providerPaymentId') as string;

        const projectIds = formData.getAll('projectIds').map(id => Number(id));
        if (projectIds.length === 0) projectIds.push(currentProjectId);

        if (!title?.trim()) return fail(400, { message: 'El concepto es obligatorio' });
        const numOriginal = parseFloat(String(amountOriginal).replace(',', '.')) || 0;
        const numPaid = parseFloat(String(amountPaid).replace(',', '.')) || 0;
        if (numOriginal <= 0 || numPaid <= 0) return fail(400, { message: 'Monto original y monto abonado son obligatorios y deben ser mayores a 0' });

        const exchangeRate = numPaid > 0 ? (numOriginal / numPaid).toFixed(6) : '1.000000';
        const amountUsd = currencyPaid.toUpperCase() === 'USD' ? String(numPaid) : (currencyOriginal.toUpperCase() === 'USD' ? String(numOriginal) : String(numPaid));
        const amount = `${numPaid} ${currencyPaid.toUpperCase()}`;

        try {
            let documentUrl = null;
            if (file && file.size > 0) {
                documentUrl = await uploadFile(file, 'payments');
            }

            let dueDate = null;
            if (dueDateStr) {
                const timeStr = dueTime || '12:00';
                dueDate = new Date(`${dueDateStr}T${timeStr}`);
            }

            let paidAt = null;
            if (paidAtStr) {
                const timeStr = paidTime || '12:00';
                paidAt = new Date(`${paidAtStr}T${timeStr}`);
            }

            const [newPayment] = await db.insert(payments).values({
                projectId: currentProjectId,
                title,
                amount,
                status: status || 'pending',
                dueDate,
                paidAt,
                documentUrl,
                amountOriginal: String(numOriginal),
                currencyOriginal: currencyOriginal.slice(0, 3),
                amountPaid: String(numPaid),
                currencyPaid: currencyPaid.slice(0, 3),
                exchangeRate,
                amountUsd,
                paymentMethod,
                providerPaymentId
            }).returning({ id: payments.id });

            // Insert Many-to-Many relationships
            if (newPayment && projectIds.length > 0) {
                const uniqueProjectIds = [...new Set(projectIds)]; // Remove duplicates
                await db.insert(projectPaymentsTable).values(
                    uniqueProjectIds.map(pid => ({
                        paymentId: newPayment.id,
                        projectId: pid
                    }))
                );
            }

            // Crear documento de facturación vinculado al pago del proyecto (siempre en USD para Historial)
            if (newPayment) {
                const [proj] = await db.select({ companyId: projects.companyId }).from(projects).where(eq(projects.id, currentProjectId)).limit(1);
                if (proj?.companyId != null) {
                    const amountNumUsd = parseFloat(String(amountUsd || amount).replace(/[^0-9.-]/g, '')) || 0;
                    const amountCentsUsd = Math.round(amountNumUsd * 100);
                    const isPaid = status === 'paid';
                    const providerCode = (paymentMethod || 'manual').toLowerCase().replace(/\s+/g, '_');
                    try {
                        const providerConfig = await providerConfigRepo.findProviderConfigByCode(providerCode);
                        const label = providerConfig?.label ?? providerCode;
                        const paymentAccountId = await paymentAccountsRepo.findOrCreateManualProviderAccount(proj.companyId, providerCode, label);
                        await billingService.createBillingDocument({
                            companyId: proj.companyId,
                            type: 'invoice',
                            provider: providerCode as any,
                            source: 'project',
                            paymentAccountId,
                            projectId: currentProjectId,
                            paymentId: newPayment.id,
                            currency: 'usd',
                            amountTotal: amountCentsUsd,
                            amountDue: isPaid ? 0 : amountCentsUsd,
                            status: isPaid ? 'paid' : 'open',
                            dueDate: dueDate || null,
                            issuedAt: new Date(),
                            description: title,
                            number: `PAY-${newPayment.id}`
                        });
                    } catch (e) {
                        console.error('Error creating billing document for payment:', e);
                    }
                }
            }

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, currentProjectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Nuevo Pago',
                    message: `Se ha creado un nuevo pago: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/projects/${currentProjectId}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error creating payment:', err);
            return fail(500, { message: 'Failed to create payment' });
        }
    },

    updatePayment: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const projectId = Number(params.id);
        const id = Number(formData.get('id'));
        const title = formData.get('title') as string;
        const status = formData.get('status') as string;
        const dueDateStr = formData.get('dueDate') as string;
        const dueTime = formData.get('dueTime') as string;
        const paidAtStr = formData.get('paidAt') as string;
        const paidTime = formData.get('paidTime') as string;
        const file = formData.get('file') as File;
        
        const amountOriginal = formData.get('amountOriginal') as string;
        const currencyOriginal = (formData.get('currencyOriginal') as string) || 'USD';
        const amountPaid = formData.get('amountPaid') as string;
        const currencyPaid = (formData.get('currencyPaid') as string) || 'USD';
        const paymentMethod = formData.get('paymentMethod') as string;
        const providerPaymentId = formData.get('providerPaymentId') as string;
        const projectIds = formData.getAll('projectIds').map(pid => Number(pid));

        if (!id || !title?.trim()) return fail(400, { message: 'ID y concepto son obligatorios' });
        const numOriginal = parseFloat(String(amountOriginal).replace(',', '.')) || 0;
        const numPaid = parseFloat(String(amountPaid).replace(',', '.')) || 0;
        if (numOriginal <= 0 || numPaid <= 0) return fail(400, { message: 'Monto original y monto abonado son obligatorios' });

        const exchangeRate = numPaid > 0 ? (numOriginal / numPaid).toFixed(6) : '1.000000';
        const amountUsd = currencyPaid.toUpperCase() === 'USD' ? String(numPaid) : (currencyOriginal.toUpperCase() === 'USD' ? String(numOriginal) : String(numPaid));
        const amount = `${numPaid} ${currencyPaid.toUpperCase()}`;

        try {
            let dueDate = null;
            if (dueDateStr) {
                const timeStr = dueTime || '12:00';
                dueDate = new Date(`${dueDateStr}T${timeStr}`);
            }

            let paidAt = null;
            if (paidAtStr) {
                const timeStr = paidTime || '12:00';
                paidAt = new Date(`${paidAtStr}T${timeStr}`);
            }

            const updateData: any = {
                title,
                amount,
                status,
                dueDate,
                paidAt,
                amountOriginal: String(numOriginal),
                currencyOriginal: currencyOriginal.slice(0, 3),
                amountPaid: String(numPaid),
                currencyPaid: currencyPaid.slice(0, 3),
                exchangeRate,
                amountUsd,
                paymentMethod,
                providerPaymentId
            };

            if (file && file.size > 0) {
                updateData.documentUrl = await uploadFile(file, 'payments');
            }

            await db.update(payments)
                .set(updateData)
                .where(eq(payments.id, id));

            const billingDocsRepo = await import('$lib/server/billing-domain/billing-documents.repository');
            const existingDoc = await billingDocsRepo.findBillingDocumentByPaymentId(id);

            // Sincronizar documento de facturación vinculado: siempre guardar monto en USD para que el historial muestre dólares
            if (existingDoc) {
                const amountUsdNum = parseFloat(String(amountUsd).replace(/[^0-9.-]/g, '')) || 0;
                const amountCentsUsd = Math.round(amountUsdNum * 100);
                await billingDocsRepo.updateBillingDocument(existingDoc.id, {
                    currency: 'usd',
                    amountTotal: amountCentsUsd,
                    amountDue: status === 'paid' ? 0 : amountCentsUsd,
                    ...(status === 'paid' && { status: 'paid' as const })
                });
            }

            // Si el pago no tiene documento de facturación pero tiene método (MercadoPago, PayPal, etc.), crear uno para que aparezca en Facturación → Historial (siempre en USD)
            const providerCode = (paymentMethod || '').toLowerCase().replace(/\s+/g, '_');
            if (!existingDoc && providerCode && providerCode !== 'stripe' && projectIds.length > 0) {
                const [proj] = await db.select({ companyId: projects.companyId }).from(projects).where(eq(projects.id, projectIds[0])).limit(1);
                if (proj?.companyId != null) {
                    const amountUsdNum = parseFloat(String(amountUsd).replace(/[^0-9.-]/g, '')) || 0;
                    const amountCentsUsd = Math.round(amountUsdNum * 100);
                    try {
                        const label = (await providerConfigRepo.findProviderConfigByCode(providerCode))?.label ?? providerCode;
                        const paymentAccountId = await paymentAccountsRepo.findOrCreateManualProviderAccount(proj.companyId, providerCode, label);
                        await billingService.createBillingDocument({
                            companyId: proj.companyId,
                            type: 'invoice',
                            provider: providerCode as any,
                            source: 'project',
                            paymentAccountId,
                            paymentId: id,
                            number: title,
                            currency: 'usd',
                            amountTotal: amountCentsUsd,
                            amountDue: status === 'paid' ? 0 : amountCentsUsd,
                            status: status === 'paid' ? 'paid' : 'open',
                            dueDate: dueDate ?? null,
                            issuedAt: new Date(),
                            description: title,
                            metadata: { projectIds }
                        });
                    } catch (e) {
                        console.error('Error creating billing document for updated payment:', e);
                    }
                }
            }

            // Update Many-to-Many relationships
            // 1. Delete existing for this payment
            await db.delete(projectPaymentsTable).where(eq(projectPaymentsTable.paymentId, id));

            // 2. Insert new selections
            if (projectIds.length > 0) {
                const uniqueProjectIds = [...new Set(projectIds)];
                await db.insert(projectPaymentsTable).values(
                    uniqueProjectIds.map(pid => ({
                        paymentId: id,
                        projectId: pid
                    }))
                );
            }

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Pago Actualizado',
                    message: `Se ha actualizado el pago: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/projects/${projectId}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error updating payment:', err);
            return fail(500, { message: 'Failed to update payment' });
        }
    },

    deletePayment: async ({ request }: import('./$types').RequestEvent) => {
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
    createRequest: async ({ request, params }: import('./$types').RequestEvent) => {
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

            const [newRequest] = await db.insert(requests).values({
                projectId,
                title,
                description,
                status: 'pending',
                files: uploadedFiles,
                createdAt
            }).returning({ id: requests.id });

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Nueva Solicitud',
                    message: `Se ha creado una nueva solicitud: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/projects/${projectId}?requestId=${newRequest.id}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error creating request:', err);
            return fail(500, { message: 'Failed to create request' });
        }
    },

    updateRequest: async ({ request }: import('./$types').RequestEvent) => {
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

    deleteRequest: async ({ request }: import('./$types').RequestEvent) => {
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
    createCase: async ({ request, params }: import('./$types').RequestEvent) => {
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
            const [newCase] = await db.insert(cases).values({
                projectId,
                title,
                description,
                content: description || '', // Use description as content since content is required
                priority,
                status,
                files: uploadedFiles
            }).returning({ id: cases.id });

            // Notify Client
            const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            if (project.length > 0 && project[0].clientId) {
                await db.insert(notifications).values({
                    userId: project[0].clientId,
                    title: 'Nuevo Ticket de Soporte',
                    message: `Se ha creado un nuevo ticket: ${title}`,
                    type: 'info',
                    link: `/${params.workspace}/dashboard/support?caseId=${newCase.id}`
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error creating case:', err);
            return fail(500, { message: 'Failed to create case' });
        }
    },

    updateCase: async ({ request }: import('./$types').RequestEvent) => {
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
                    content: description || '', // Keep content in sync with description
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

    addCaseComment: async ({ request, params }: import('./$types').RequestEvent) => {
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

            // Notify Client
            const caseData = await db.select({ projectId: cases.projectId }).from(cases).where(eq(cases.id, caseId)).limit(1);
            if (caseData.length > 0 && caseData[0].projectId) {
                const projectId = caseData[0].projectId;
                const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
                
                if (project.length > 0 && project[0].clientId) {
                    await db.insert(notifications).values({
                        userId: project[0].clientId,
                        title: 'Nuevo mensaje de soporte',
                        message: `Nuevo comentario en el ticket #${caseId}: ${subject || 'Sin asunto'}`,
                        type: 'info',
                        link: `/${params.workspace}/dashboard/support?caseId=${caseId}`
                    });
                }
            }

            return { success: true };
        } catch (err) {
            console.error('Error adding comment:', err);
            return fail(500, { message: 'Failed to add comment' });
        }
    },

    deleteCase: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) {
            return fail(400, { message: 'ID is required' });
        }

        try {
            // 1. Fetch case to get files
            const caseData = await db.select().from(cases).where(eq(cases.id, id)).limit(1);
            if (caseData.length === 0) {
                return fail(404, { message: 'Case not found' });
            }

            // 2. Fetch comments to get files
            const comments = await db.select().from(caseComments).where(eq(caseComments.caseId, id));

            // 3. Delete case files from storage
            if (caseData[0].files && Array.isArray(caseData[0].files)) {
                for (const file of caseData[0].files as any[]) {
                    if (file.url) await deleteFile(file.url);
                }
            }

            // 4. Delete comment files from storage
            for (const comment of comments) {
                if (comment.files && Array.isArray(comment.files)) {
                    for (const file of comment.files as any[]) {
                        if (file.url) await deleteFile(file.url);
                    }
                }
            }

            // 5. Delete comments from DB
            await db.delete(caseComments).where(eq(caseComments.caseId, id));

            // 6. Delete case from DB
            await db.delete(cases).where(eq(cases.id, id));

            return { success: true };
        } catch (err) {
            console.error('Error deleting case:', err);
            return fail(500, { message: 'Failed to delete case' });
        }
    },

    addRequestComment: async ({ request, params }: import('./$types').RequestEvent) => {
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

            // Notify Client
            const requestData = await db.select({ projectId: requests.projectId }).from(requests).where(eq(requests.id, requestId)).limit(1);
            if (requestData.length > 0 && requestData[0].projectId) {
                const projectId = requestData[0].projectId;
                const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
                
                if (project.length > 0 && project[0].clientId) {
                    await db.insert(notifications).values({
                        userId: project[0].clientId,
                        title: 'Nuevo Mensaje en Solicitud',
                        message: `Nuevo comentario en la solicitud: ${subject || 'Sin asunto'}`,
                        type: 'info',
                        link: `/${params.workspace}/dashboard/projects/${projectId}?requestId=${requestId}`
                    });
                }
            }

            return { success: true };
        } catch (err) {
            console.error('Error adding request comment:', err);
            return fail(500, { message: 'Failed to add request comment' });
        }
    },

    addRequirementComment: async ({ request, params }: import('./$types').RequestEvent) => {
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

            // Notify Client
            const requirementData = await db.select({ projectId: requirements.projectId }).from(requirements).where(eq(requirements.id, requirementId)).limit(1);
            if (requirementData.length > 0 && requirementData[0].projectId) {
                const projectId = requirementData[0].projectId;
                const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
                
                if (project.length > 0 && project[0].clientId) {
                    await db.insert(notifications).values({
                        userId: project[0].clientId,
                        title: 'Nuevo Mensaje en Requerimiento',
                        message: `Nuevo comentario en el requerimiento: ${subject || 'Sin asunto'}`,
                        type: 'info',
                        link: `/${params.workspace}/dashboard/projects/${projectId}?requirementId=${requirementId}`
                    });
                }
            }

            return { success: true };
        } catch (err) {
            console.error('Error adding requirement comment:', err);
            return fail(500, { message: 'Failed to add requirement comment' });
        }
    },

    addProposalComment: async ({ request, params }: import('./$types').RequestEvent) => {
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

            // Notify Client
            const proposalData = await db.select({ projectId: proposals.projectId }).from(proposals).where(eq(proposals.id, proposalId)).limit(1);
            if (proposalData.length > 0 && proposalData[0].projectId) {
                const projectId = proposalData[0].projectId;
                const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
                
                if (project.length > 0 && project[0].clientId) {
                    await db.insert(notifications).values({
                        userId: project[0].clientId,
                        title: 'Nuevo Mensaje en Propuesta',
                        message: `Nuevo comentario en la propuesta: ${subject || 'Sin asunto'}`,
                        type: 'info',
                        link: `/${params.workspace}/dashboard/projects/${projectId}?proposalId=${proposalId}`
                    });
                }
            }

            return { success: true };
        } catch (err) {
            console.error('Error adding proposal comment:', err);
            return fail(500, { message: 'Failed to add proposal comment' });
        }
    }
};;null as any as Actions;