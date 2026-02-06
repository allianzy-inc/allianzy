// @ts-nocheck
import { db } from '$lib/server/db';
import { payments, projects, services } from '$lib/server/schema';
import { getSignedUrlForFile } from '$lib/server/storage';
import { eq, or, desc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
    const userId = Number(locals.user?.id);

    if (!userId || isNaN(userId)) {
        return { payments: [] };
    }

    const rawPayments = await db.select({
        id: payments.id,
        title: payments.title,
        amount: payments.amount,
        status: payments.status,
        dueDate: payments.dueDate,
        paidAt: payments.paidAt,
        documentUrl: payments.documentUrl,
        projectName: projects.name,
        serviceName: services.name
    })
    .from(payments)
    .innerJoin(projects, eq(payments.projectId, projects.id))
    .leftJoin(services, eq(projects.serviceId, services.id))
    .where(or(
        eq(projects.clientId, userId),
        eq(services.clientId, userId)
    ))
    .orderBy(desc(payments.dueDate));

    const userPayments = await Promise.all(rawPayments.map(async (p) => ({
        ...p,
        documentUrl: await getSignedUrlForFile(p.documentUrl, params.workspace)
    })));

    return {
        payments: userPayments
    };
};

export const actions = {
    manageStripe: async ({ locals }: import('./$types').RequestEvent) => {
        // TODO: Implement Stripe Customer Portal session creation
        // This requires:
        // 1. Stripe Secret Key in environment variables
        // 2. Mapping user to Stripe Customer ID (usually stored in DB)
        // 3. Call to stripe.billingPortal.sessions.create
        
        console.log(`[STRIPE] User ${locals.user?.email} requested Stripe portal access`);
        
        // For now, since we don't have the integration fully set up,
        // we'll redirect to a generic page or the Stripe login if known,
        // or just placeholder behavior.
        // If you have a general billing link, replace it here.
        throw redirect(303, 'https://billing.stripe.com/p/login/test_12345'); 
    }
};
;null as any as Actions;