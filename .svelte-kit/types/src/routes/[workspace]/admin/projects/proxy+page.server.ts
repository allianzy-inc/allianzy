// @ts-nocheck
import { db } from '$lib/server/db';
import { projects, services, users } from '$lib/server/schema';
import { eq, sql, and, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
    try {
        // Fetch Clients
        const clients = await db.select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            company: users.company,
            email: users.email
        })
        .from(users)
        .where(eq(users.role, 'client'));

        // Fetch Services
        // We fetch all services. The UI can filter if needed, but for now just list them.
        const allServices = await db.select({
            id: services.id,
            name: services.name,
            price: services.price
        }).from(services)
        .where(eq(services.status, 'Active'));

        // Fetch Projects
        // Alias for legacy user link via service
        const serviceUsers = alias(users, 'service_users');

        const allProjects = await db.select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            status: projects.status,
            startDate: projects.startDate,
            endDate: projects.endDate,
            provider: projects.provider,
            serviceName: services.name,
            // Coalesce client details from project link (preferred) or service link (legacy)
            clientName: sql<string>`
                CASE 
                    WHEN ${users.id} IS NOT NULL THEN TRIM(BOTH ' ' FROM COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))
                    ELSE TRIM(BOTH ' ' FROM COALESCE(${serviceUsers.firstName}, '') || ' ' || COALESCE(${serviceUsers.lastName}, ''))
                END
            `,
            clientCompany: sql<string>`COALESCE(${users.company}, ${serviceUsers.company})`,
            clientEmail: sql<string>`COALESCE(${users.email}, ${serviceUsers.email})`
        })
        .from(projects)
        .leftJoin(services, eq(projects.serviceId, services.id))
        .leftJoin(users, eq(projects.clientId, users.id))
        .leftJoin(serviceUsers, eq(services.clientId, serviceUsers.id));

        return {
            projects: allProjects,
            clients,
            services: allServices
        };
    } catch (error) {
        console.error('Error fetching projects:', error);
        return {
            projects: [],
            clients: [],
            services: []
        };
    }
};

export const actions = {
    createProject: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const clientId = formData.get('clientId') ? parseInt(formData.get('clientId') as string) : null;
        const serviceId = formData.get('serviceId') ? parseInt(formData.get('serviceId') as string) : null;
        const provider = formData.get('provider') as string || 'Allianzy';
        const status = formData.get('status') as string || 'Pending';
        const startDateStr = formData.get('startDate') as string;
        const endDateStr = formData.get('endDate') as string;

        if (!name || !clientId || !serviceId) {
            return fail(400, { missing: true });
        }

        try {
            const [newProject] = await db.insert(projects).values({
                name,
                description,
                clientId,
                serviceId,
                provider,
                status,
                startDate: startDateStr ? new Date(startDateStr) : null,
                endDate: endDateStr ? new Date(endDateStr) : null
            }).returning({ id: projects.id });

            throw redirect(303, `/${params.workspace}/admin/projects/${newProject.id}`);
        } catch (error) {
            // Re-throw redirect
            if ((error as any).status === 303) {
                throw error;
            }
            console.error('Error creating project:', error);
            return fail(500, { error: 'Failed to create project' });
        }
    },

    updateProject: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const clientId = formData.get('clientId') ? parseInt(formData.get('clientId') as string) : null;
        const serviceId = formData.get('serviceId') ? parseInt(formData.get('serviceId') as string) : null;
        const provider = formData.get('provider') as string;
        const status = formData.get('status') as string;
        const startDateStr = formData.get('startDate') as string;
        const endDateStr = formData.get('endDate') as string;

        if (!id || !name) {
            return fail(400, { missing: true });
        }

        try {
            await db.update(projects)
                .set({
                    name,
                    description,
                    clientId,
                    serviceId,
                    provider,
                    status,
                    startDate: startDateStr ? new Date(startDateStr) : null,
                    endDate: endDateStr ? new Date(endDateStr) : null
                })
                .where(eq(projects.id, id));

            return { success: true };
        } catch (error) {
            console.error('Error updating project:', error);
            return fail(500, { error: 'Failed to update project' });
        }
    },

    deleteProject: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);

        if (!id) return fail(400, { missing: true });

        try {
            await db.delete(projects).where(eq(projects.id, id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting project:', error);
            return fail(500, { error: 'Failed to delete project' });
        }
    }
};
;null as any as Actions;