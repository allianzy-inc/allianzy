import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBillingCompanyId } from '$lib/server/billing';
import { db } from '$lib/server/db';
import { companies } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/** GET: overlays for the billing company (dashboard = user company, admin = ?companyId=). */
export const GET: RequestHandler = async (event) => {
	const companyId = await getBillingCompanyId(event);
	if (companyId == null) {
		return json({ overlays: {} });
	}

	const row = await db.query.companies.findFirst({
		where: eq(companies.id, companyId),
		columns: { invoiceOverlays: true }
	});
	const raw = row?.invoiceOverlays;
	const overlays = typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? raw : {};
	return json({ overlays });
};

/** POST: save overlay for one invoice. Admin only when companyId is provided (admin context). */
export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	if (!user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: {
		companyId?: number;
		stripeInvoiceId?: string;
		overlay?: { title?: string; items?: { id: string; label: string; amount: number }[] };
	};
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const stripeInvoiceId = body.stripeInvoiceId?.trim();
	if (!stripeInvoiceId) {
		return json({ error: 'stripeInvoiceId required' }, { status: 400 });
	}

	const isAdmin = String(user.role ?? '').toLowerCase() === 'admin';
	let companyId: number | null = null;

	if (body.companyId != null) {
		if (!isAdmin) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}
		companyId = typeof body.companyId === 'number' ? body.companyId : parseInt(String(body.companyId), 10);
		if (isNaN(companyId)) companyId = null;
	}
	if (companyId == null) {
		companyId = await getBillingCompanyId(event);
	}
	if (companyId == null) {
		return json({ error: 'Company context required' }, { status: 400 });
	}

	const overlay = body.overlay;
	if (!overlay || !Array.isArray(overlay.items)) {
		return json({ error: 'overlay.items required' }, { status: 400 });
	}

	// Normalize items: ensure amount is number
	const items = overlay.items.map((item) => ({
		id: String(item.id),
		label: String(item.label ?? ''),
		amount: Number(item.amount) || 0
	}));

	const payload = {
		title: overlay.title != null ? String(overlay.title) : undefined,
		items
	};

	const row = await db.query.companies.findFirst({
		where: eq(companies.id, companyId),
		columns: { invoiceOverlays: true }
	});
	const existing = row?.invoiceOverlays;
	const map = typeof existing === 'object' && existing !== null && !Array.isArray(existing) ? { ...existing } : {};
	map[stripeInvoiceId] = payload;

	await db
		.update(companies)
		.set({ invoiceOverlays: map, updatedAt: new Date() })
		.where(eq(companies.id, companyId));

	return json({ ok: true });
};
