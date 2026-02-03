// @ts-nocheck
import { db } from '$lib/server/db';
import { services, subservices, workspaces } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
    // 1. Get Workspace ID
    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, params.workspace)
    });

    if (!workspace) {
        return {
            services: []
        };
    }

    // 2. Get Services
    const allServices = await db.select()
        .from(services)
        .where(eq(services.workspaceId, workspace.id));

    // 3. Get Subservices
    // We can fetch all and map them, or fetch per service. Fetching all is efficient for small datasets.
    // However, Drizzle's query builder with `with` is nicer if relations are set up, but let's stick to simple select for now.
    
    // We'll fetch subservices for the retrieved services
    const serviceIds = allServices.map(s => s.id);
    let allSubservices: any[] = [];
    
    if (serviceIds.length > 0) {
        // Drizzle doesn't support "inArray" easily without import, let's just fetch all linked to services
        // Or simpler: fetch all subservices and filter in JS if the dataset is small.
        // Better: Fetch all subservices where serviceId is in the list.
        // For now, let's fetch all subservices and client-side filter or map them in server load.
        
        // Actually, let's use a join or just fetch all subservices if we assume admin sees everything in workspace context.
        // But subservices don't have workspaceId, they link to services.
        // So we strictly need to fetch subservices belonging to the services we found.
        
        // Using `db.query` is easier for relations if defined in schema relations, but they are not defined in the snippet I saw.
        // So I'll just iterate or use raw SQL? No, let's use `inArray` if I import it.
        
        // Let's just fetch all subservices for now and filter in memory, assuming not too many.
        // Or better, let's just select * from subservices where service_id IN ...
        // Since I didn't import inArray, I will just select all and filter.
        
        const rawSubservices = await db.select().from(subservices);
        allSubservices = rawSubservices.filter(sub => serviceIds.includes(sub.serviceId || -1));
    }

    // Combine them
    const servicesWithSubs = allServices.map(service => ({
        ...service,
        subservices: allSubservices.filter(sub => sub.serviceId === service.id)
    }));

    return {
        services: servicesWithSubs
    };
};

export const actions = {
    createService: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = formData.get('price') as string;
        const status = formData.get('status') as string || 'Active';

        if (!name) return fail(400, { missing: true });

        const workspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.slug, params.workspace)
        });

        if (!workspace) return fail(404, { error: 'Workspace not found' });

        await db.insert(services).values({
            name,
            description,
            price,
            status,
            workspaceId: workspace.id
        });

        return { success: true };
    },

    updateService: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = formData.get('price') as string;
        const status = formData.get('status') as string;

        if (!id || !name) return fail(400, { missing: true });

        await db.update(services)
            .set({ name, description, price, status })
            .where(eq(services.id, id));

        return { success: true };
    },

    deleteService: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);

        if (!id) return fail(400, { missing: true });

        await db.delete(services).where(eq(services.id, id));

        return { success: true };
    },

    createSubservice: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const serviceId = parseInt(formData.get('serviceId') as string);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = formData.get('price') as string;
        const status = formData.get('status') as string || 'Active';

        if (!serviceId || !name) return fail(400, { missing: true });

        await db.insert(subservices).values({
            serviceId,
            name,
            description,
            price,
            status
        });

        return { success: true };
    },

    updateSubservice: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = formData.get('price') as string;
        const status = formData.get('status') as string;

        if (!id || !name) return fail(400, { missing: true });

        await db.update(subservices)
            .set({ name, description, price, status })
            .where(eq(subservices.id, id));

        return { success: true };
    },

    deleteSubservice: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);

        if (!id) return fail(400, { missing: true });

        await db.delete(subservices).where(eq(subservices.id, id));

        return { success: true };
    }
};
;null as any as Actions;