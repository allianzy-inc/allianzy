/**
 * Resuelve companyId y cuentas de pago desde la DB (payment_accounts) con fallback a legacy (companies.stripe_accounts).
 * Usado por los endpoints de billing para leer siempre de nuestra DB.
 */

import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { companies } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import * as paymentAccountsRepo from './payment-accounts.repository';

export interface BillingAccount {
	customerId: string; // externalId para Stripe (cus_xxx); mismo formato que legacy para UI
	isDefault: boolean;
	paymentAccountId: string; // uuid en nuestra DB
	provider: string;
	label: string;
}

export interface BillingContext {
	companyId: number;
	/** Cuenta seleccionada (por query stripeCustomerId o default). */
	selectedPaymentAccountId: string | null;
	selectedCustomerId: string | null; // cus_xxx para Stripe, para portal/links
	accounts: BillingAccount[];
	linked: boolean;
}

function normalizeLegacyAccounts(raw: unknown, legacyCustomerId: string | null): { customerId: string; isDefault: boolean }[] {
	const arr = Array.isArray(raw) ? raw : [];
	const valid = arr.filter(
		(x): x is { customerId?: string; isDefault?: boolean } =>
			typeof x === 'object' && x !== null && typeof (x as any).customerId === 'string'
	);
	const entries = valid.map((x) => ({
		customerId: String((x as any).customerId).trim(),
		isDefault: Boolean((x as any).isDefault)
	})).filter((e) => e.customerId.startsWith('cus_'));
	if (entries.length > 0) {
		if (!entries.some((e) => e.isDefault)) entries[0].isDefault = true;
		return entries;
	}
	if (legacyCustomerId?.trim().startsWith('cus_')) {
		return [{ customerId: legacyCustomerId.trim(), isDefault: true }];
	}
	return [];
}

/**
 * Obtiene el contexto de billing: companyId, lista de cuentas (desde payment_accounts o legacy) y cuenta seleccionada.
 */
export async function getBillingContext(event: RequestEvent): Promise<BillingContext | null> {
	const user = event.locals.user;
	if (!user?.id) return null;

	const url = event.url;
	const queryCompanyId = url.searchParams.get('companyId');
	const queryCustomerId = url.searchParams.get('stripeCustomerId')?.trim();
	const queryPaymentAccountId = url.searchParams.get('paymentAccountId')?.trim();
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

	// 1) Intentar desde payment_accounts (nuevo dominio)
	const dbAccounts = await paymentAccountsRepo.findPaymentAccountsByCompanyId(companyId, 'active');
	if (dbAccounts.length > 0) {
		const accounts: BillingAccount[] = dbAccounts.map((a) => ({
			customerId: (a.externalId ?? a.id) as string, // Stripe: cus_xxx; otros: externalId o id
			isDefault: a.isDefault,
			paymentAccountId: a.id,
			provider: a.provider,
			label: a.label
		}));

		let selectedPaymentAccountId: string | null = null;
		let selectedCustomerId: string | null = null;
		if (queryPaymentAccountId && accounts.some((a) => a.paymentAccountId === queryPaymentAccountId)) {
			selectedPaymentAccountId = queryPaymentAccountId;
			selectedCustomerId = accounts.find((a) => a.paymentAccountId === queryPaymentAccountId)?.customerId ?? null;
		} else if (queryCustomerId && accounts.some((a) => a.customerId === queryCustomerId)) {
			selectedCustomerId = queryCustomerId;
			selectedPaymentAccountId = accounts.find((a) => a.customerId === queryCustomerId)?.paymentAccountId ?? null;
		} else {
			const defaultAcc = accounts.find((a) => a.isDefault) ?? accounts[0];
			selectedPaymentAccountId = defaultAcc?.paymentAccountId ?? null;
			selectedCustomerId = defaultAcc?.customerId ?? null;
		}

		return {
			companyId,
			selectedPaymentAccountId,
			selectedCustomerId,
			accounts,
			linked: true
		};
	}

	// 2) Fallback legacy (companies.stripe_accounts / stripe_customer_id)
	const company = await db.query.companies.findFirst({
		where: eq(companies.id, companyId),
		columns: { id: true, stripeCustomerId: true, stripeAccounts: true }
	});
	const legacyId = company?.stripeCustomerId?.trim() ?? null;
	const legacyAccounts = normalizeLegacyAccounts(company?.stripeAccounts, legacyId);
	if (legacyAccounts.length === 0) {
		return { companyId, selectedPaymentAccountId: null, selectedCustomerId: null, accounts: [], linked: false };
	}

	const selectedCustomerId =
		queryCustomerId && legacyAccounts.some((a) => a.customerId === queryCustomerId)
			? queryCustomerId
			: legacyAccounts.find((a) => a.isDefault)?.customerId ?? legacyAccounts[0].customerId;

	return {
		companyId,
		selectedPaymentAccountId: null, // legacy: no tenemos uuid
		selectedCustomerId,
		accounts: legacyAccounts.map((a) => ({
			customerId: a.customerId,
			isDefault: a.isDefault,
			paymentAccountId: '', // legacy
			provider: 'stripe',
			label: 'Stripe'
		})),
		linked: true
	};
}
