import { db } from '$lib/server/db';
import { projects, services, users, requirements, projectMilestones, cases, proposals, payments } from '$lib/server/schema';
import { uploadFile, getSignedUrlForFile } from '$lib/server/storage';
import { eq, asc, desc } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const projectId = Number(params.id);

    if (isNaN(projectId)) {
        throw error(400, 'Invalid Project ID');
    }

    try {
        // 1. Fetch Project with Client and Service info
        const projectData = await db.select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            status: projects.status,
            provider: projects.provider,
            serviceId: projects.serviceId,
            startDate: projects.startDate,
            endDate: projects.endDate,
            serviceName: services.name,
            clientName: users.name,
            clientEmail: users.email,
            clientId: users.id
        })
        .from(projects)
        .leftJoin(services, eq(projects.serviceId, services.id))
        .leftJoin(users, eq(services.clientId, users.id))
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
        
        const projectRequirements = await Promise.all(rawRequirements.map(async (r) => ({
            ...r,
            documentUrl: await getSignedUrlForFile(r.documentUrl)
        })));

        // 3. Fetch Milestones (Process)
        const milestones = await db.select()
            .from(projectMilestones)
            .where(eq(projectMilestones.projectId, projectId))
            .orderBy(asc(projectMilestones.order));

        // 4. Fetch Support Cases
        const supportCases = await db.select()
            .from(cases)
            .where(eq(cases.projectId, projectId))
            .orderBy(asc(cases.createdAt));

        // 5. Fetch Proposals
        const rawProposals = await db.select()
            .from(proposals)
            .where(eq(proposals.projectId, projectId))
            .orderBy(desc(proposals.createdAt));

        const projectProposals = await Promise.all(rawProposals.map(async (p) => ({
            ...p,
            documentUrl: await getSignedUrlForFile(p.documentUrl)
        })));

        // 6. Fetch Payments
        const rawPayments = await db.select()
            .from(payments)
            .where(eq(payments.projectId, projectId))
            .orderBy(asc(payments.dueDate));
        
        const projectPayments = await Promise.all(rawPayments.map(async (p) => ({
            ...p,
            documentUrl: await getSignedUrlForFile(p.documentUrl)
        })));

        // 7. Fetch All Clients and Services (for editing)
        const allClients = await db.select().from(users).where(eq(users.role, 'client'));
        const allServices = await db.select().from(services);

        return {
            project,
            requirements: projectRequirements,
            milestones,
            supportCases,
            proposals: projectProposals,
            payments: projectPayments,
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
        const serviceId = Number(formData.get('serviceId'));
        const startDateStr = formData.get('startDate') as string;
        const startTimeStr = formData.get('startTime') as string;

        if (!name || !status || !provider || !serviceId || !startDateStr) {
            return fail(400, { message: 'All fields are required' });
        }

        try {
            const timeStr = startTimeStr || '12:00';
            const startDate = new Date(`${startDateStr}T${timeStr}Z`);

            await db.update(projects)
                .set({
                    name,
                    status,
                    provider,
                    serviceId,
                    startDate
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
        const documentUrl = formData.get('documentUrl') as string;
        const reqDate = formData.get('reqDate') as string;
        const reqTime = formData.get('reqTime') as string;

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
                documentUrl,
                status: 'pending',
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
        const documentUrl = formData.get('documentUrl') as string;
        const status = formData.get('status') as string;
        const reqDate = formData.get('reqDate') as string;
        const reqTime = formData.get('reqTime') as string;

        if (!id || !title) {
            return fail(400, { message: 'ID and Title are required' });
        }

        try {
            const updateData: any = {
                title,
                description,
                documentUrl,
                status
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
        const file = formData.get('file') as File;

        if (!title) {
            return fail(400, { message: 'Title is required' });
        }

        try {
            if (file && file.size > 0) {
                documentUrl = await uploadFile(file, 'proposals');
            }

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
        const file = formData.get('file') as File;

        if (!id || !title) {
            return fail(400, { message: 'ID and Title are required' });
        }

        try {
            if (file && file.size > 0) {
                documentUrl = await uploadFile(file, 'proposals');
            }

            const updateData: any = {
                title,
                description,
                documentUrl,
                status
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
    }
};