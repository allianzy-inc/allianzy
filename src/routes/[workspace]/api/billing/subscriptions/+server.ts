import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBillingContext } from '$lib/server/billing-domain/resolve-context';
import * as subscriptionRecordsRepo from '$lib/server/billing-domain/subscription-records.repository';
import { syncStripeForCompany } from '$lib/server/billing-domain/stripe-sync.service';
import { getStripe, getBillingCompany } from '$lib/server/billing';

/** Forma compatible con la UI actual. */
function mapSubscriptionToShape(sub: {
	id: string;
	providerSubscriptionId: string | null;
	status: string;
	currentPeriodEnd: Date | null;
	amount: number;
	currency: string;
	metadata: Record<string, unknown> | null;
}) {
	const meta = (sub.metadata ?? {}) as { price_nickname?: string };
	return {
		id: sub.providerSubscriptionId ?? sub.id,
		status: sub.status,
		current_period_end: sub.currentPeriodEnd?.toISOString(),
		cancel_at_period_end: false,
		price_nickname: meta.price_nickname,
		price_unit_amount: sub.amount,
		currency: sub.currency
	};
}

export const GET: RequestHandler = async (event) => {
	const ctx = await getBillingContext(event);
	if (!ctx || !ctx.linked) {
		return json({ linked: false, subscriptions: [] });
	}

	// 1) Dominio nuevo: leer de DB y sync on-demand si vacío
	if (ctx.selectedPaymentAccountId) {
		let subs = await subscriptionRecordsRepo.findSubscriptionRecordsByCompanyId(
			ctx.companyId,
			ctx.selectedPaymentAccountId
		);
		if (subs.length === 0 && ctx.accounts.some((a) => a.provider === 'stripe')) {
			try {
				await syncStripeForCompany(ctx.companyId);
				subs = await subscriptionRecordsRepo.findSubscriptionRecordsByCompanyId(
					ctx.companyId,
					ctx.selectedPaymentAccountId
				);
			} catch (err: any) {
				console.error('[billing/subscriptions] sync error:', err?.message ?? err);
			}
		}
		const subscriptions = subs.map((s) => mapSubscriptionToShape(s));
		return json({ linked: true, subscriptions });
	}

	// 2) Legacy: Stripe directo
	const billing = await getBillingCompany(event);
	if (!billing) return json({ linked: false, subscriptions: [] });
	const stripe = getStripe();
	if (!stripe) return json({ linked: true, subscriptions: [] });
	try {
		const list = await stripe.subscriptions.list({
			customer: billing.stripeCustomerId,
			status: 'all',
			limit: 100,
			expand: ['data.items.data.price']
		});
		const subscriptions = (list.data ?? []).map((sub) => {
			const price = sub.items?.data?.[0]?.price as { nickname?: string; unit_amount?: number; currency?: string } | undefined;
			return {
				id: sub.id,
				status: sub.status ?? undefined,
				current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : undefined,
				cancel_at_period_end: sub.cancel_at_period_end ?? false,
				price_nickname: price?.nickname ?? undefined,
				price_unit_amount: price?.unit_amount ?? 0,
				currency: price?.currency ?? sub.currency ?? 'usd'
			};
		});
		return json({ linked: true, subscriptions });
	} catch (err: any) {
		console.error('[billing/subscriptions] Stripe error:', err?.message ?? err);
		return json({ linked: true, subscriptions: [], error: err?.message ?? 'Stripe error' }, { status: 500 });
	}
};
