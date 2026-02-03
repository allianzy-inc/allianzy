import { db } from '$lib/server/db';
import { projects, services, users } from '$lib/server/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const allProjects = await db.select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            status: projects.status,
            startDate: projects.startDate,
            endDate: projects.endDate,
            serviceName: services.name,
            clientName: sql<string>`TRIM(BOTH ' ' FROM COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`,
            clientCompany: users.company,
            clientEmail: users.email
        })
        .from(projects)
        .leftJoin(services, eq(projects.serviceId, services.id))
        .leftJoin(users, eq(services.clientId, users.id));

        return {
            projects: allProjects
        };
    } catch (error) {
        console.error('Error fetching projects:', error);
        return {
            projects: []
        };
    }
};