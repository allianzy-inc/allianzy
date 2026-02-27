import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe, getStripeLive } from '$lib/server/billing';
import * as billingDocsRepo from '$lib/server/billing-domain/billing-documents.repository';
import * as paymentAccountsRepo from '$lib/server/billing-domain/payment-accounts.repository';

function isAdmin(event: { locals: { user?: { role?: string } } }) {
	return String(event.locals.user?.role ?? '').toLowerCase() === 'admin';
}

/**
 * POST: añadir un pago manualmente por Payment Intent ID (pi_xxx) o Charge ID (ch_xxx).
 * Útil para pagos de clientes guest (gcus_) que no devuelve la API de Stripe por customer.
 * Body: { companyId, paymentIntentId?: string, chargeId?: string, paymentAccountId: string }
 */
export const POST: RequestHandler = async (event) => {
	if (!isAdmin(event)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	let body: {
		companyId?: number;
		paymentIntentId?: string;
		chargeId?: string;
		paymentAccountId: string;
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
	const paymentAccountId = (body.paymentAccountId ?? '').trim();
	if (!paymentAccountId) {
		return json({ error: 'paymentAccountId required (cuenta Stripe de la empresa)' }, { status: 400 });
	}
	const piId = (body.paymentIntentId ?? '').trim();
	const chId = (body.chargeId ?? '').trim();
	if (!piId && !chId) {
		return json({ error: 'paymentIntentId (pi_...) o chargeId (ch_...) required' }, { status: 400 });
	}
	if (piId && !piId.startsWith('pi_')) {
		return json({ error: 'paymentIntentId must start with pi_' }, { status: 400 });
	}
	if (chId && !chId.startsWith('ch_')) {
		return json({ error: 'chargeId must start with ch_' }, { status: 400 });
	}

	const account = await paymentAccountsRepo.findPaymentAccountById(paymentAccountId);
	if (!account || account.companyId !== companyId || account.provider !== 'stripe') {
		return json({ error: 'paymentAccountId must be a Stripe account of this company' }, { status: 400 });
	}

	const stripeTest = getStripe();
	const stripeLive = getStripeLive();
	const stripes = [stripeTest, stripeLive].filter(Boolean);
	if (stripes.length === 0) {
		return json({ error: 'Stripe not configured (STRIPE_SECRET_KEY or STRIPE_SECRET_KEY_LIVE)' }, { status: 503 });
	}

	let amount = 0;
	let currency = 'usd';
	let status: 'paid' | 'open' | 'void' = 'paid';
	let createdAt: number | null = null;
	let receiptUrl: string | null = null;
	let providerDocId: string;
	let description: string;

	if (piId) {
		let pi: { id: string; amount: number; currency: string; status: string; created: number; description?: string; latest_charge?: { id: string; receipt_url?: string } } | null = null;
		for (const stripe of stripes) {
			try {
				pi = await stripe!.paymentIntents.retrieve(piId, { expand: ['latest_charge'] }) as any;
				break;
			} catch (e: any) {
				if (e?.code === 'resource_missing_no_such_payment_intent' || e?.statusCode === 404) continue;
				throw e;
			}
		}
		if (!pi) {
			return json({ error: 'Payment Intent not found (probá con la clave test o live según donde se creó el pago)' }, { status: 404 });
		}
		providerDocId = pi.id;
		amount = pi.amount ?? 0;
		currency = (pi.currency ?? 'usd').toLowerCase();
		status = pi.status === 'succeeded' ? 'paid' : pi.status === 'canceled' ? 'void' : 'open';
		createdAt = pi.created ?? null;
		description = (pi.description as string) ?? `Pago ${pi.id}`;
		const lc = pi.latest_charge;
		if (lc && typeof lc === 'object' && lc.receipt_url) receiptUrl = lc.receipt_url;
	} else if (chId) {
		let ch: { id: string; amount: number; currency: string; status: string; created: number; description?: string; receipt_url?: string } | null = null;
		for (const stripe of stripes) {
			try {
				ch = await stripe!.charges.retrieve(chId) as any;
				break;
			} catch (e: any) {
				if (e?.code === 'resource_missing_no_such_charge' || e?.statusCode === 404) continue;
				throw e;
			}
		}
		if (!ch) {
			return json({ error: 'Charge not found' }, { status: 404 });
		}
		providerDocId = ch.id;
		amount = ch.amount ?? 0;
		currency = (ch.currency ?? 'usd').toLowerCase();
		status = ch.status === 'succeeded' ? 'paid' : 'void';
		createdAt = ch.created ?? null;
		description = (ch.description as string) ?? `Pago ${ch.id}`;
		receiptUrl = ch.receipt_url ?? null;
	} else {
		return json({ error: 'paymentIntentId or chargeId required' }, { status: 400 });
	}

	const existing = await billingDocsRepo.findBillingDocumentByProviderId(companyId, 'stripe', providerDocId);
	if (existing) {
		return json({ ok: true, alreadyExists: true, documentId: existing.id });
	}

	const issuedAt = createdAt ? new Date(createdAt * 1000) : new Date();
	const paidAtIso = status === 'paid' && issuedAt ? issuedAt.toISOString() : undefined;
	const doc = await billingDocsRepo.createBillingDocument({
		companyId,
		type: 'invoice',
		provider: 'stripe',
		providerDocumentId: providerDocId,
		paymentAccountId,
		number: null,
		currency,
		amountTotal: amount,
		amountDue: status === 'paid' ? 0 : amount,
		status,
		dueDate: issuedAt,
		issuedAt,
		description,
		source: 'manual',
		projectId: null,
		paymentId: null,
		subscriptionRecordId: null,
		metadata: {
			...(receiptUrl && { receipt_url: receiptUrl }),
			...(paidAtIso && { paid_at: paidAtIso })
		}
	});
	return json({ ok: true, documentId: doc?.id });
};
