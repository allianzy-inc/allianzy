// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { companies } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
	const companyId = parseInt(params.companyId, 10);
	if (Number.isNaN(companyId)) {
		throw redirect(303, `/${params.workspace}/admin/companies`);
	}

	const rows = await db
		.select({ id: companies.id, name: companies.name, stripeCustomerId: companies.stripeCustomerId })
		.from(companies)
		.where(eq(companies.id, companyId))
		.limit(1);
	const company = rows[0] ?? null;

	if (!company) {
		throw redirect(303, `/${params.workspace}/admin/companies`);
	}

	return {
		companyId: company.id,
		companyName: company.name,
		stripeCustomerId: company.stripeCustomerId ?? null,
		canViewBilling: true,
		canManageBilling: true
	};
};
