import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { companies } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { StripeAccountEntry } from '$lib/server/billing';
import * as paymentAccountsRepo from '$lib/server/billing-domain/payment-accounts.repository';

/** Admin only: add / remove / set default Stripe account for a company. */
export const POST: RequestHandler = async (event) => {
	if (String(event.locals.user?.role ?? '').toLowerCase() !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	let body: {
		companyId?: number;
		stripeCustomerId?: string;
		setAsDefault?: boolean;
		action?: 'add' | 'remove' | 'setDefault';
	};
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const companyId = typeof body.companyId === 'number' ? body.companyId : parseInt(String(body.companyId ?? ''), 10);
	if (isNaN(companyId)) {
		return json({ error: 'companyId required' }, { status: 400 });
	}

	const raw = body.stripeCustomerId != null ? String(body.stripeCustomerId).trim() : '';
	const action = body.action ?? (raw ? 'add' : undefined);

	const row = await db.query.companies.findFirst({
		where: eq(companies.id, companyId),
		columns: { stripeAccounts: true, stripeCustomerId: true }
	});
	const legacy = row?.stripeCustomerId?.trim() ?? null;
	let accounts: StripeAccountEntry[] = Array.isArray(row?.stripeAccounts)
		? (row.stripeAccounts as any[]).filter(
				(x): x is { customerId: string; isDefault: boolean } =>
					typeof x === 'object' && x !== null && typeof (x as any).customerId === 'string'
		  )
		: [];
	if (accounts.length === 0 && legacy?.startsWith('cus_')) {
		accounts = [{ customerId: legacy, isDefault: true }];
	}
	accounts = accounts.map((x) => ({
		customerId: String((x as any).customerId).trim(),
		isDefault: Boolean((x as any).isDefault)
	})).filter((a) => a.customerId.startsWith('cus_'));

	if (action === 'remove') {
		if (!raw) return json({ error: 'stripeCustomerId required to remove' }, { status: 400 });
		accounts = accounts.filter((a) => a.customerId !== raw);
		if (accounts.length > 0 && !accounts.some((a) => a.isDefault)) accounts[0].isDefault = true;
	} else if (action === 'setDefault') {
		if (!raw) return json({ error: 'stripeCustomerId required' }, { status: 400 });
		if (!raw.startsWith('cus_')) return json({ error: 'stripeCustomerId must be cus_...' }, { status: 400 });
		const idx = accounts.findIndex((a) => a.customerId === raw);
		if (idx === -1) return json({ error: 'Account not found in list' }, { status: 400 });
		accounts.forEach((a) => (a.isDefault = a.customerId === raw));
	} else if (action === 'add' || (!action && raw)) {
		if (!raw.startsWith('cus_')) return json({ error: 'stripeCustomerId must be a Stripe customer ID (cus_...)' }, { status: 400 });
		const existing = accounts.findIndex((a) => a.customerId === raw);
		if (existing >= 0) {
			if (body.setAsDefault) accounts.forEach((a) => (a.isDefault = a.customerId === raw));
		} else {
			const isDefault = body.setAsDefault ?? accounts.length === 0;
			if (isDefault) accounts.forEach((a) => (a.isDefault = false));
			accounts.push({ customerId: raw, isDefault });
		}
	} else {
		return json({ error: 'stripeCustomerId or action required' }, { status: 400 });
	}

	const payload = accounts.length > 0 ? accounts : [];
	const defaultId = accounts.find((a) => a.isDefault)?.customerId ?? null;
	await db
		.update(companies)
		.set({
			stripeAccounts: payload,
			stripeCustomerId: defaultId ?? (payload.length ? payload[0].customerId : null),
			updatedAt: new Date()
		})
		.where(eq(companies.id, companyId));

	// Sincronizar payment_accounts (dominio nuevo) sin borrar datos en companies
	if (action === 'add' && raw) {
		const existing = await paymentAccountsRepo.findPaymentAccountByCompanyAndExternalId(companyId, 'stripe', raw);
		if (!existing) {
			await paymentAccountsRepo.createPaymentAccount({
				companyId,
				provider: 'stripe',
				label: payload.length > 1 ? `Stripe ${payload.findIndex((a) => a.customerId === raw) + 1}` : 'Stripe principal',
				externalId: raw,
				status: 'active',
				isDefault: payload.find((a) => a.customerId === raw)?.isDefault ?? false
			});
		} else if (body.setAsDefault) {
			await paymentAccountsRepo.setDefaultPaymentAccount(companyId, existing.id);
		}
	} else if (action === 'remove' && raw) {
		const acc = await paymentAccountsRepo.findPaymentAccountByCompanyAndExternalId(companyId, 'stripe', raw);
		if (acc) await paymentAccountsRepo.archivePaymentAccount(acc.id, companyId);
	} else if (action === 'setDefault' && raw) {
		const acc = await paymentAccountsRepo.findPaymentAccountByCompanyAndExternalId(companyId, 'stripe', raw);
		if (acc) await paymentAccountsRepo.setDefaultPaymentAccount(companyId, acc.id);
	}

	return json({ ok: true, accounts: payload });
};
