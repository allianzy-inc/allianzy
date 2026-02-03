// @ts-nocheck
import { db } from '$lib/server/db';
import { services, workspaces } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
    console.log(`[DASHBOARD-PAGE] Loading for user: ${locals.user?.email}`);
    if (!env.DATABASE_URL || !locals.user) {
        return {
            services: []
        };
    }

    try {
        // Fetching services for the logged-in user in the current workspace
        const userServices = await db.select({
            name: services.name,
            status: services.status,
            renewal: services.renewalDate,
            price: services.price
        })
        .from(services)
        .innerJoin(workspaces, eq(services.workspaceId, workspaces.id))
        .where(
            and(
                eq(workspaces.slug, locals.allowedWorkspace),
                eq(services.clientId, parseInt(locals.user.id))
            )
        );
        
        return {
            services: userServices.map(s => ({
                name: s.name,
                status: s.status,
                renewal: s.renewal ? new Date(s.renewal).toLocaleDateString() : '-',
                price: s.price ? `$${s.price}` : '-'
            }))
        };
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return {
            services: []
        };
    }
};
