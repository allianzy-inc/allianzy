/**
 * Server-only Stripe billing helpers.
 * Stripe is NEVER called from the frontend; only from these APIs.
 */

import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { companies } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
	const secret = env.STRIPE_SECRET_KEY;
	if (!secret?.startsWith('sk_')) {
		return null;
	}
	if (!stripeInstance) {
		stripeInstance = new Stripe(secret);
	}
	return stripeInstance;
}

/** Stripe customer IDs: cus_ (regular) or gcus_ (guest). */
export function isStripeCustomerId(id: string | null | undefined): boolean {
	const s = id?.trim() ?? '';
	return s.startsWith('cus_') || s.startsWith('gcus_');
}

export interface StripeAccountEntry {
	customerId: string;
	isDefault: boolean;
}

export interface BillingCompany {
	companyId: number;
	stripeCustomerId: string;
	accounts: StripeAccountEntry[];
}

function normalizeStripeAccounts(
	raw: unknown,
	legacyCustomerId: string | null
): StripeAccountEntry[] {
	const arr = Array.isArray(raw) ? raw : [];
	const valid = arr.filter(
		(x): x is { customerId?: string; isDefault?: boolean } =>
			typeof x === 'object' && x !== null && typeof (x as any).customerId === 'string'
	);
	const entries: StripeAccountEntry[] = valid.map((x) => ({
		customerId: String((x as any).customerId).trim(),
		isDefault: Boolean((x as any).isDefault)
	})).filter((e) => isStripeCustomerId(e.customerId));
	if (entries.length > 0) {
		const hasDefault = entries.some((e) => e.isDefault);
		if (!hasDefault) entries[0].isDefault = true;
		return entries;
	}
	if (isStripeCustomerId(legacyCustomerId)) {
		return [{ customerId: legacyCustomerId.trim(), isDefault: true }];
	}
	return [];
}

/**
 * Resolves the company and selected Stripe account for billing.
 * Uses ?stripeCustomerId= to choose which account; else uses default.
 * Returns accounts list for UI combobox.
 */
export async function getBillingCompany(event: RequestEvent): Promise<BillingCompany | null> {
	const user = event.locals.user;
	if (!user?.id) return null;

	const url = event.url;
	const queryCompanyId = url.searchParams.get('companyId');
	const queryCustomerId = url.searchParams.get('stripeCustomerId')?.trim();
	const isAdmin = String(user.role ?? '').toLowerCase() === 'admin';

	let companyId: number | null = null;
	if (isAdmin && queryCompanyId) {
		const id = parseInt(queryCompanyId, 10);
		if (!isNaN(id)) companyId = id;
	}
	if (companyId == null && user.companyId != null) {
		companyId = typeof user.companyId === 'number' ? user.companyId : parseInt(String(user.companyId), 10);
	}
	if (companyId == null || isNaN(companyId)) return null;

	const company = await db.query.companies.findFirst({
		where: eq(companies.id, companyId),
		columns: { id: true, stripeCustomerId: true, stripeAccounts: true }
	});
	const legacyId = company.stripeCustomerId?.trim() ?? null;
	const accounts = normalizeStripeAccounts(company.stripeAccounts, legacyId);
	if (accounts.length === 0) return null;

	const selected =
		queryCustomerId && accounts.some((a) => a.customerId === queryCustomerId)
			? queryCustomerId
			: accounts.find((a) => a.isDefault)?.customerId ?? accounts[0].customerId;

	return {
		companyId: company.id,
		stripeCustomerId: selected,
		accounts
	};
}

/**
 * Resolves the company ID for billing context (overlays, etc.).
 * Same as getBillingCompany but does not require stripe_customer_id.
 * Returns null if not allowed.
 */
export async function getBillingCompanyId(event: RequestEvent): Promise<number | null> {
	const user = event.locals.user;
	if (!user?.id) return null;

	const url = event.url;
	const queryCompanyId = url.searchParams.get('companyId');
	const isAdmin = String(user.role ?? '').toLowerCase() === 'admin';

	let companyId: number | null = null;
	if (isAdmin && queryCompanyId) {
		const id = parseInt(queryCompanyId, 10);
		if (!isNaN(id)) companyId = id;
	}
	if (companyId == null && user.companyId != null) {
		companyId = typeof user.companyId === 'number' ? user.companyId : parseInt(String(user.companyId), 10);
	}
	if (companyId == null || isNaN(companyId)) return null;

	const company = await db.query.companies.findFirst({
		where: eq(companies.id, companyId),
		columns: { id: true }
	});
	return company?.id ?? null;
}
