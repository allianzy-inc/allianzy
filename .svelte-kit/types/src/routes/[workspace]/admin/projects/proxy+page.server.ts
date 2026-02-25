// @ts-nocheck
import { db } from '$lib/server/db';
import { projects, services, users, cases, requests, requirements, proposals, payments, userCompanies, companies } from '$lib/server/schema';
import { eq, sql, and, or, inArray, desc } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
    try {
        // Fetch Clients
        const clientsRaw = await db.select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            company: users.company,
            email: users.email
        })
        .from(users)
        .where(eq(users.role, 'client'));

        const clientIds = clientsRaw.map((c) => c.id).filter((id): id is number => id != null);
        const companyByUserId = new Map<number, string>();
        const companiesByClientId: Record<number, { id: number; name: string }[]> = {};
        if (clientIds.length > 0) {
            const links = await db
                .select({
                    userId: userCompanies.userId,
                    companyId: companies.id,
                    companyName: companies.name,
                    isPrimary: userCompanies.isPrimary
                })
                .from(userCompanies)
                .innerJoin(companies, eq(userCompanies.companyId, companies.id))
                .where(inArray(userCompanies.userId, clientIds))
                .orderBy(desc(userCompanies.isPrimary));
            for (const row of links) {
                if (row.userId != null && row.companyId != null && row.companyName) {
                    if (!companyByUserId.has(row.userId)) {
                        companyByUserId.set(row.userId, row.companyName);
                    }
                    if (!companiesByClientId[row.userId]) companiesByClientId[row.userId] = [];
                    if (!companiesByClientId[row.userId].some((c) => c.id === row.companyId)) {
                        companiesByClientId[row.userId].push({ id: row.companyId, name: row.companyName });
                    }
                }
            }
        }
        const clients = clientsRaw.map((c) => ({
            ...c,
            companyDisplay: companyByUserId.get(c.id!) ?? c.company ?? 'Sin empresa'
        }));

        // Fetch Services
        // We fetch all services. The UI can filter if needed, but for now just list them.
        const allServices = await db.select({
            id: services.id,
            name: services.name,
            price: services.price
        }).from(services)
        .where(eq(services.status, 'Active'));

        // Fetch Projects — admin ve todos los proyectos (sin filtrar por empresa)
        const serviceUsers = alias(users, 'service_users');
        const allProjectsRaw = await db.select({
            id: projects.id,
            clientId: projects.clientId,
            companyId: projects.companyId,
            name: projects.name,
            description: projects.description,
            status: projects.status,
            startDate: projects.startDate,
            endDate: projects.endDate,
            provider: projects.provider,
            serviceName: services.name,
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

        // Empresa del proyecto (a la que pertenece): preferir project.companyId sobre la primera empresa del cliente
        const projectCompanyIds = [...new Set(allProjectsRaw.map((p) => p.companyId).filter((id): id is number => id != null))];
        const companyNameById = new Map<number, string>();
        if (projectCompanyIds.length > 0) {
            const companyRows = await db.select({ id: companies.id, name: companies.name }).from(companies).where(inArray(companies.id, projectCompanyIds));
            for (const row of companyRows) {
                if (row.id != null && row.name) companyNameById.set(row.id, row.name);
            }
        }
        const projectClientIds = [...new Set(allProjectsRaw.map((p) => p.clientId).filter((id): id is number => id != null))];
        const projectCompanyByUserId = new Map<number, string>();
        if (projectClientIds.length > 0) {
            const projectLinks = await db
                .select({
                    userId: userCompanies.userId,
                    companyName: companies.name,
                    isPrimary: userCompanies.isPrimary
                })
                .from(userCompanies)
                .innerJoin(companies, eq(userCompanies.companyId, companies.id))
                .where(inArray(userCompanies.userId, projectClientIds))
                .orderBy(desc(userCompanies.isPrimary));
            for (const row of projectLinks) {
                if (row.userId != null && row.companyName && !projectCompanyByUserId.has(row.userId)) {
                    projectCompanyByUserId.set(row.userId, row.companyName);
                }
            }
        }
        const allProjects = allProjectsRaw.map((p) => ({
            ...p,
            clientCompanyDisplay: (p.companyId != null ? companyNameById.get(p.companyId) : null) ?? (p.clientId != null ? projectCompanyByUserId.get(p.clientId) : null) ?? p.clientCompany ?? ''
        }));

        return {
            projects: allProjects,
            clients,
            services: allServices,
            companiesByClientId
        };
    } catch (error) {
        console.error('Error fetching projects:', error);
        return {
            projects: [],
            clients: [],
            services: [],
            companiesByClientId: {}
        };
    }
};

export const actions = {
    createProject: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const clientId = formData.get('clientId') ? parseInt(formData.get('clientId') as string) : null;
        const companyIdRaw = formData.get('companyId');
        const companyId = companyIdRaw && String(companyIdRaw).trim() !== '' ? parseInt(String(companyIdRaw)) : null;
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
                companyId: companyId ?? null,
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
        const companyIdRaw = formData.get('companyId');
        const companyId = companyIdRaw !== null && companyIdRaw !== undefined && String(companyIdRaw).trim() !== '' ? parseInt(String(companyIdRaw)) : null;
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
                    companyId: companyId ?? null,
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
            // Delete related records manually first (manual cascade)
            await db.delete(cases).where(eq(cases.projectId, id));
            await db.delete(requests).where(eq(requests.projectId, id));
            await db.delete(requirements).where(eq(requirements.projectId, id));
            await db.delete(proposals).where(eq(proposals.projectId, id));
            await db.delete(payments).where(eq(payments.projectId, id));

            // Finally delete the project
            await db.delete(projects).where(eq(projects.id, id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting project:', error);
            return fail(500, { error: 'Failed to delete project' });
        }
    }
};
;null as any as Actions;