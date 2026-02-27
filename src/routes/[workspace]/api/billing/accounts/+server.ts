import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { companies } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { getBillingContext } from '$lib/server/billing-domain/resolve-context';
import { isStripeCustomerId } from '$lib/server/billing';
import * as paymentAccountsRepo from '$lib/server/billing-domain/payment-accounts.repository';

/** GET: list of payment accounts for the billing company (DB first; fallback legacy). Incluye provider y label para mostrar Stripe, MercadoPago, etc. */
export const GET: RequestHandler = async (event) => {
	const ctx = await getBillingContext(event);
	if (!ctx) {
		return json({ accounts: [], defaultCustomerId: null, selectedCustomerId: null });
	}
	const defaultCustomerId = ctx.accounts.find((a) => a.isDefault)?.customerId ?? ctx.accounts[0]?.customerId ?? null;
	return json({
		accounts: ctx.accounts.map((a) => ({
			customerId: a.customerId,
			isDefault: a.isDefault,
			provider: a.provider,
			label: a.label,
			paymentAccountId: a.paymentAccountId || undefined
		})),
		defaultCustomerId,
		selectedCustomerId: ctx.selectedCustomerId
	});
};

/** POST: admin only – remove or setDefault by paymentAccountId (cualquier proveedor: Stripe, MercadoPago, PayPal, etc.). */
export const POST: RequestHandler = async (event) => {
	if (String(event.locals.user?.role ?? '').toLowerCase() !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	let body: { companyId?: number; paymentAccountId?: string; action?: 'remove' | 'setDefault' };
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
	const companyId = typeof body.companyId === 'number' ? body.companyId : parseInt(String(body.companyId ?? ''), 10);
	if (isNaN(companyId)) return json({ error: 'companyId required' }, { status: 400 });
	const paymentAccountId = typeof body.paymentAccountId === 'string' ? body.paymentAccountId.trim() : '';
	if (!paymentAccountId) return json({ error: 'paymentAccountId required' }, { status: 400 });
	const action = body.action === 'remove' || body.action === 'setDefault' ? body.action : undefined;
	if (!action) return json({ error: 'action must be remove or setDefault' }, { status: 400 });

	const account = await paymentAccountsRepo.findPaymentAccountById(paymentAccountId);
	if (!account || account.companyId !== companyId) {
		return json({ error: 'Account not found' }, { status: 404 });
	}
	if (account.status !== 'active') {
		return json({ error: 'Account is not active' }, { status: 400 });
	}

	if (action === 'remove') {
		await paymentAccountsRepo.archivePaymentAccount(account.id, companyId);
		return json({ ok: true });
	}
	// setDefault
	await paymentAccountsRepo.setDefaultPaymentAccount(companyId, account.id);
	return json({ ok: true });
};

/** PATCH: admin only – update account label and/or Stripe customer ID. */
export const PATCH: RequestHandler = async (event) => {
	if (String(event.locals.user?.role ?? '').toLowerCase() !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	let body: { companyId?: number; paymentAccountId?: string; label?: string; stripeCustomerId?: string };
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
	const companyId = typeof body.companyId === 'number' ? body.companyId : parseInt(String(body.companyId ?? ''), 10);
	if (isNaN(companyId)) return json({ error: 'companyId required' }, { status: 400 });
	const paymentAccountId = typeof body.paymentAccountId === 'string' ? body.paymentAccountId.trim() : '';
	if (!paymentAccountId) return json({ error: 'paymentAccountId required' }, { status: 400 });

	const account = await paymentAccountsRepo.findPaymentAccountById(paymentAccountId);
	if (!account || account.companyId !== companyId) {
		return json({ error: 'Account not found' }, { status: 404 });
	}
	if (account.status !== 'active') {
		return json({ error: 'Account is not active' }, { status: 400 });
	}

	const updates: { label?: string; externalId?: string | null } = {};
	if (typeof body.label === 'string' && body.label.trim()) updates.label = body.label.trim();
	const isStripe = (account.provider ?? 'stripe') === 'stripe';
	if (isStripe && body.stripeCustomerId != null) {
		const next = String(body.stripeCustomerId).trim();
		if (!isStripeCustomerId(next)) return json({ error: 'stripeCustomerId must be cus_... or gcus_...' }, { status: 400 });
		updates.externalId = next;
	}
	if (Object.keys(updates).length === 0) return json({ error: 'Provide label and/or stripeCustomerId' }, { status: 400 });

	await paymentAccountsRepo.updatePaymentAccount(paymentAccountId, companyId, updates);

	// Sincronizar legacy companies.stripeAccounts si cambió el customerId de Stripe
	if (isStripe && updates.externalId != null) {
		const oldCus = account.externalId ?? null;
		const newCus = updates.externalId;
		if (oldCus !== newCus) {
			const row = await db.query.companies.findFirst({
				where: eq(companies.id, companyId),
				columns: { stripeAccounts: true, stripeCustomerId: true }
			});
			const arr = Array.isArray(row?.stripeAccounts) ? (row!.stripeAccounts as { customerId: string; isDefault: boolean }[]) : [];
			const nextArr = arr.map((a) =>
				a.customerId === oldCus ? { ...a, customerId: newCus } : a
			);
			const nextDefault = row?.stripeCustomerId === oldCus ? newCus : row?.stripeCustomerId;
			await db
				.update(companies)
				.set({
					stripeAccounts: nextArr,
					stripeCustomerId: nextDefault ?? (nextArr.length ? nextArr[0].customerId : null),
					updatedAt: new Date()
				})
				.where(eq(companies.id, companyId));
		}
	}

	return json({ ok: true });
};
