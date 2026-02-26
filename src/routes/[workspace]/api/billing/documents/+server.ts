import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBillingCompanyId } from '$lib/server/billing';
import * as billingService from '$lib/server/billing-domain/billing.service';
import * as paymentAccountsRepo from '$lib/server/billing-domain/payment-accounts.repository';
import * as providerConfigRepo from '$lib/server/billing-domain/provider-config.repository';

function isAdmin(event: { locals: { user?: { role?: string } } }) {
	return String(event.locals.user?.role ?? '').toLowerCase() === 'admin';
}

/** POST: crear documento de facturación manual (solo admin). */
export const POST: RequestHandler = async (event) => {
	if (!isAdmin(event)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	let body: {
		companyId: number;
		provider: string;
		number?: string;
		amountTotal: number;
		amountDue: number;
		currency: string;
		dueDate?: string;
		description?: string;
		status?: string;
	};
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
	const companyId = typeof body.companyId === 'number' ? body.companyId : parseInt(String(body.companyId), 10);
	if (isNaN(companyId)) {
		return json({ error: 'companyId required' }, { status: 400 });
	}
	const provider = String(body.provider ?? '').toLowerCase().replace(/\s+/g, '_');
	if (!provider || provider === 'stripe') {
		return json({ error: 'provider requerido (cualquier método de pago manual, no Stripe)' }, { status: 400 });
	}
	const amountTotal = Math.round(Number(body.amountTotal) || 0);
	const amountDue = Math.round(Number(body.amountDue) ?? amountTotal);
	if (amountTotal < 0) {
		return json({ error: 'amountTotal must be >= 0' }, { status: 400 });
	}
	const currency = (body.currency ?? 'usd').toLowerCase();
	const dueDate = body.dueDate ? new Date(body.dueDate) : null;
	const status = (body.status ?? 'open') as 'draft' | 'open' | 'paid' | 'void' | 'uncollectible' | 'canceled';

	// Asegurar que la empresa tenga una cuenta de pago para este proveedor (para que aparezca en el dashboard del cliente)
	const providerConfig = await providerConfigRepo.findProviderConfigByCode(provider);
	const label = providerConfig?.label ?? provider;
	const paymentAccountId = await paymentAccountsRepo.findOrCreateManualProviderAccount(companyId, provider, label);

	const doc = await billingService.createBillingDocument({
		companyId,
		type: 'invoice',
		provider: provider as any,
		source: 'manual',
		paymentAccountId,
		number: body.number ?? null,
		currency,
		amountTotal,
		amountDue,
		status,
		dueDate,
		description: body.description ?? null,
		issuedAt: new Date()
	});
	return json({ ok: true, document: doc });
};
