import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBillingCompanyId } from '$lib/server/billing';
import { getBillingContext } from '$lib/server/billing-domain/resolve-context';
import { syncStripeForCompany } from '$lib/server/billing-domain/stripe-sync.service';

const SYNC_COOLDOWN_MS = 2 * 60 * 1000; // 2 min por company
const lastSyncByCompany: Record<number, number> = {};

/** POST: sync on-demand Stripe → DB para la empresa. Rate-limit ligero por company. */
export const POST: RequestHandler = async (event) => {
	const ctx = await getBillingContext(event);
	const companyId = ctx?.companyId ?? (await getBillingCompanyId(event));
	if (companyId == null) {
		return json({ error: 'Unauthorized or company required' }, { status: 400 });
	}

	const now = Date.now();
	if (lastSyncByCompany[companyId] && now - lastSyncByCompany[companyId] < SYNC_COOLDOWN_MS) {
		return json({ ok: true, cached: true, message: 'Sync skipped (cooldown)' });
	}

	try {
		const result = await syncStripeForCompany(companyId);
		lastSyncByCompany[companyId] = now;
		return json({
			ok: true,
			invoicesSynced: result.invoicesSynced,
			subscriptionsSynced: result.subscriptionsSynced,
			errors: result.errors
		});
	} catch (err: any) {
		console.error('[billing/sync] error:', err?.message ?? err);
		return json({ error: err?.message ?? 'Sync failed' }, { status: 500 });
	}
};
