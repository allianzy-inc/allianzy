
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { companies, userCompanies } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/');
    }

    const companyId = locals.user.companyId;
    let companyData = null;
    let companyUsers: Array<{
        id: number | undefined;
        firstName: string | null | undefined;
        lastName: string | null | undefined;
        email: string | undefined;
        role: string | null;
        avatarUrl: string | null | undefined;
    }> = [];

    if (companyId) {
        // Fetch company details
        companyData = await db.query.companies.findFirst({
            where: eq(companies.id, companyId)
        });

        // Fetch users in this company
        const userLinks = await db.query.userCompanies.findMany({
            where: eq(userCompanies.companyId, companyId),
            with: {
                user: true
            }
        });

        companyUsers = userLinks.map(link => ({
            id: link.user?.id,
            firstName: link.user?.firstName,
            lastName: link.user?.lastName,
            email: link.user?.email,
            role: link.role,
            avatarUrl: link.user?.avatarUrl
        }));
    }

    return {
        company: companyData,
        companyUsers: companyUsers
    };
};
