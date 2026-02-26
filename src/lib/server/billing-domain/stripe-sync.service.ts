/**
 * Stripe Billing Sync – lectura desde Stripe, escritura en nuestra DB.
 * Idempotente por provider_document_id / provider_subscription_id.
 * Rate-limit friendly: paginar y backoff simple.
 */

import Stripe from 'stripe';
import { getStripe } from '$lib/server/billing';
import * as paymentAccountsRepo from './payment-accounts.repository';
import * as billingDocsRepo from './billing-documents.repository';
import * as subscriptionRecordsRepo from './subscription-records.repository';
import type { BillingDocumentStatus } from './types';

const STRIPE_STATUS_TO_DOC: Record<string, BillingDocumentStatus> = {
	draft: 'draft',
	open: 'open',
	paid: 'paid',
	void: 'void',
	uncollectible: 'uncollectible',
	uncollectable: 'uncollectible'
};

/** Sincroniza facturas y suscripciones de Stripe para una empresa (todas sus cuentas stripe activas). */
export async function syncStripeForCompany(companyId: number): Promise<{ invoicesSynced: number; subscriptionsSynced: number; errors: string[] }> {
	const stripe = getStripe();
	if (!stripe) {
		return { invoicesSynced: 0, subscriptionsSynced: 0, errors: ['Stripe not configured'] };
	}

	const accounts = await paymentAccountsRepo.findPaymentAccountsByCompanyId(companyId, 'active');
	const stripeAccounts = accounts.filter((a) => a.provider === 'stripe' && a.externalId);
	let invoicesSynced = 0;
	let subscriptionsSynced = 0;
	const errors: string[] = [];

	for (const acc of stripeAccounts) {
		const externalId = acc.externalId!;
		try {
			const invCount = await syncInvoicesForCustomer(companyId, acc.id, externalId, stripe);
			invoicesSynced += invCount;
		} catch (e: any) {
			errors.push(`Invoices for ${externalId}: ${e?.message ?? e}`);
		}
		try {
			const subCount = await syncSubscriptionsForCustomer(companyId, acc.id, externalId, stripe);
			subscriptionsSynced += subCount;
		} catch (e: any) {
			errors.push(`Subscriptions for ${externalId}: ${e?.message ?? e}`);
		}
	}

	return { invoicesSynced, subscriptionsSynced, errors };
}

/** Sincroniza facturas de un customer Stripe. Paginación limit 100. */
async function syncInvoicesForCustomer(
	companyId: number,
	paymentAccountId: string,
	customerId: string,
	stripe: Stripe
): Promise<number> {
	let count = 0;
	let hasMore = true;
	let startingAfter: string | undefined;

	while (hasMore) {
		const list = await stripe.invoices.list({
			customer: customerId,
			limit: 100,
			...(startingAfter ? { starting_after: startingAfter } : {}),
			expand: ['data.charge']
		});

		for (const inv of list.data) {
			const status = STRIPE_STATUS_TO_DOC[inv.status ?? ''] ?? 'draft';
			const receiptUrl = typeof inv.charge === 'object' && inv.charge?.receipt_url ? inv.charge.receipt_url : undefined;
			await billingDocsRepo.upsertBillingDocument({
				companyId,
				type: 'invoice',
				provider: 'stripe',
				providerDocumentId: inv.id,
				paymentAccountId,
				number: inv.number ?? undefined,
				currency: (inv.currency ?? 'usd').toLowerCase(),
				amountTotal: inv.amount_due ?? inv.amount_paid ?? 0,
				amountDue: inv.amount_due ?? 0,
				status,
				dueDate: inv.due_date ? new Date(inv.due_date * 1000) : null,
				issuedAt: inv.created ? new Date(inv.created * 1000) : null,
				description: inv.description ?? inv.number ?? undefined,
				source: 'subscription',
				projectId: null,
				subscriptionRecordId: null,
				metadata: {
					hosted_invoice_url: inv.hosted_invoice_url,
					invoice_pdf: inv.invoice_pdf,
					receipt_url: receiptUrl
				}
			});
			count++;
		}

		hasMore = list.has_more && list.data.length > 0;
		if (hasMore && list.data.length) startingAfter = list.data[list.data.length - 1].id;
		else hasMore = false;
	}

	return count;
}

/** Sincroniza suscripciones de un customer Stripe. */
async function syncSubscriptionsForCustomer(
	companyId: number,
	paymentAccountId: string,
	customerId: string,
	stripe: Stripe
): Promise<number> {
	let count = 0;
	let hasMore = true;
	let startingAfter: string | undefined;

	while (hasMore) {
		const list = await stripe.subscriptions.list({
			customer: customerId,
			limit: 100,
			...(startingAfter ? { starting_after: startingAfter } : {}),
			expand: ['data.items.data.price']
		});

		for (const sub of list.data) {
			const item = sub.items?.data?.[0];
			const price = item?.price;
			const amount = price?.unit_amount ?? 0;
			const currency = (price?.currency ?? sub.currency ?? 'usd').toLowerCase();
			await subscriptionRecordsRepo.upsertSubscriptionRecord({
				companyId,
				provider: 'stripe',
				providerSubscriptionId: sub.id,
				paymentAccountId,
				status: (sub.status ?? 'active') as any,
				currentPeriodStart: sub.current_period_start ? new Date(sub.current_period_start * 1000) : null,
				currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
				amount,
				currency,
				metadata: { price_nickname: (price as any)?.nickname }
			});
			count++;
		}

		hasMore = list.has_more && list.data.length > 0;
		if (hasMore && list.data.length) startingAfter = list.data[list.data.length - 1].id;
		else hasMore = false;
	}

	return count;
}
