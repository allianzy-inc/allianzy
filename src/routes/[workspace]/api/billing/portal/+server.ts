import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe, getBillingCompany, isStripeCustomerId } from '$lib/server/billing';
import { getBillingContext } from '$lib/server/billing-domain/resolve-context';

export const POST: RequestHandler = async (event) => {
	const ctx = await getBillingContext(event);
	let customerId: string | null = ctx?.selectedCustomerId ?? null;
	if (!isStripeCustomerId(customerId)) {
		const billing = await getBillingCompany(event);
		customerId = billing?.stripeCustomerId ?? null;
	}
	if (!isStripeCustomerId(customerId)) {
		return json({ error: 'No billing company or Stripe customer linked' }, { status: 400 });
	}

	const stripe = getStripe();
	if (!stripe) {
		return json({ error: 'Stripe not configured' }, { status: 503 });
	}

	const workspace = event.params.workspace ?? 'allianzy';
	const origin = event.url.origin;
	const returnUrl = `${origin}/${workspace}/dashboard/billing`;

	try {
		const session = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: returnUrl
		});
		return json({ url: session.url });
	} catch (err) {
		console.error('[billing/portal] Stripe error:', err);
		return json({ error: 'Failed to create portal session' }, { status: 500 });
	}
};
