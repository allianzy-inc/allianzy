// @ts-nocheck

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userCompanies, companies, notifications } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { getSignedUrlForFile } from '$lib/server/storage';

export const load = async ({ locals, url, params }: Parameters<LayoutServerLoad>[0]) => {
    console.log(`[DASHBOARD-LAYOUT] User: ${locals.user?.email} (${locals.user?.role}) trying to access ${url.pathname}`);
    
    if (!locals.user) {
        throw redirect(303, `/${params.workspace}/auth/login`);
    }

    // Fetch user's notifications
    const userNotifications = await db.select()
        .from(notifications)
        .where(eq(notifications.userId, parseInt(locals.user.id)))
        .orderBy(desc(notifications.createdAt));

    // Fetch user's companies
    const userCompaniesList = await db.query.userCompanies.findMany({
        where: eq(userCompanies.userId, parseInt(locals.user.id)),
        with: {
            company: true
        }
    });

    const validCompanies = userCompaniesList.filter(uc => uc.company);

    const mappedCompanies = await Promise.all(validCompanies.map(async (uc) => {
        const company = uc.company!;
        const logoUrl = company.logo ? await getSignedUrlForFile(company.logo) : null;
        return {
            id: company.id,
            name: company.name,
            logo: logoUrl
        };
    }));

    // Fallback if no companies found in relation but user has legacy company field
    if (mappedCompanies.length === 0 && locals.user.companyName) {
        // We don't have an ID or Logo easily accessible if it's just a text field in users table
        // But let's check if we can construct a dummy one
        // Actually, hooks.server.ts populates companyName from primaryCompanyLink, so if mappedCompanies is empty, companyName is likely undefined or comes from the text field (wait, hooks only populates from primaryCompanyLink?)
        // Let's re-read hooks.server.ts
        // hooks: event.locals.user.companyName = primaryCompanyLink?.company?.name
        // So if userCompaniesList is empty, primaryCompanyLink is null, so companyName is undefined.
        // UNLESS the user has the legacy 'company' text field. 
        // hooks does NOT read localUser.company.
        
        // However, the `users` table has a `company` text field.
        // Let's fetch the user again to check the legacy field if needed? 
        // No, let's stick to the `userCompanies` relation as the source of truth for the dropdown.
        // If the user has no companies, the dropdown will be empty or hidden.
    }

    return {
        user: locals.user,
        companies: mappedCompanies,
        notifications: userNotifications
    };
};
