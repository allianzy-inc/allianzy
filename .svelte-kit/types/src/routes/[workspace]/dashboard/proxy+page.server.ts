// @ts-nocheck
import { db } from '$lib/server/db';
import { services } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
    if (!env.DATABASE_URL) {
        return {
            services: []
        };
    }

    try {
        // TODO: Get real user ID from session context
        // const userId = locals.user?.id;
        
        // Fetching services (mock query for now until we have user context)
        // In production: .where(eq(services.clientId, userId))
        const allServices = await db.select().from(services);
        
        return {
            services: allServices.map(s => ({
                name: s.name,
                status: s.status,
                renewal: s.renewalDate || '-',
                price: s.price || '-'
            }))
        };
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return {
            services: []
        };
    }
};
