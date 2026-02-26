import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import * as billingDocsRepo from '$lib/server/billing-domain/billing-documents.repository';
import { db } from '$lib/server/db';
import { payments, projectPayments } from '$lib/server/schema';

function isAdmin(event: { locals: { user?: { role?: string } } }) {
	return String(event.locals.user?.role ?? '').toLowerCase() === 'admin';
}

/** PUT: actualizar documento de facturación manual (solo admin; solo no-Stripe). */
export const PUT: RequestHandler = async (event) => {
	if (!isAdmin(event)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const id = event.params.id;
	if (!id) return json({ error: 'id required' }, { status: 400 });
	const doc = await billingDocsRepo.findBillingDocumentById(id);
	if (!doc) return json({ error: 'Document not found' }, { status: 404 });
	if (doc.provider === 'stripe') {
		return json({ error: 'Cannot edit Stripe documents' }, { status: 400 });
	}
	let body: {
		number?: string;
		amountTotal?: number;
		amountDue?: number;
		currency?: string;
		status?: string;
		dueDate?: string;
		description?: string;
	};
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
	const amountTotal = body.amountTotal !== undefined ? Math.round(Number(body.amountTotal)) : undefined;
	const amountDue = body.amountDue !== undefined ? Math.round(Number(body.amountDue)) : undefined;
	const currency = body.currency != null ? String(body.currency).toLowerCase().slice(0, 3) : undefined;
	const updated = await billingDocsRepo.updateBillingDocument(id, {
		number: body.number,
		amountTotal,
		amountDue,
		...(currency !== undefined && { currency }),
		status: body.status as any,
		dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
		description: body.description
	});
	return json({ ok: true, document: updated });
};

/** PATCH: vincular factura/pago a proyectos (solo admin). Body: { companyId: number, projectIds: number[] }. Si el documento tiene paymentId, sincroniza project_payments para que el pago aparezca en los proyectos. */
export const PATCH: RequestHandler = async (event) => {
	if (!isAdmin(event)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const id = event.params.id;
	if (!id) return json({ error: 'id required' }, { status: 400 });
	const doc = await billingDocsRepo.findBillingDocumentById(id);
	if (!doc) return json({ error: 'Document not found' }, { status: 404 });
	let body: { companyId?: number; projectIds?: number[] };
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
	const companyId = body.companyId != null ? Number(body.companyId) : undefined;
	if (companyId == null || doc.companyId !== companyId) {
		return json({ error: 'Document does not belong to this company' }, { status: 403 });
	}
	const projectIds = Array.isArray(body.projectIds)
		? body.projectIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
		: [];
	const existing = (doc.metadata as Record<string, unknown>) ?? {};
	const metadata = { ...existing, projectIds };
	await billingDocsRepo.updateBillingDocument(id, { metadata });

	let paymentId = doc.paymentId;

	// Si el documento no tiene pago asociado pero se vinculó a proyectos, crear un pago para que aparezca en Pagos del proyecto
	if (paymentId == null && projectIds.length > 0) {
		const amountMajor = doc.amountTotal / 100; // amountTotal en centavos
		const currency = (doc.currency ?? 'USD').toUpperCase();
		const amountText = `${amountMajor.toFixed(2)} ${currency}`;
		const [newPayment] = await db
			.insert(payments)
			.values({
				title: doc.number ?? doc.description ?? 'Pago desde facturación',
				amount: amountText,
				status: doc.status === 'paid' ? 'paid' : 'pending',
				dueDate: doc.dueDate ?? null,
				amountOriginal: String(amountMajor),
				currencyOriginal: currency,
				amountPaid: String(amountMajor),
				currencyPaid: currency,
				amountUsd: currency === 'USD' ? String(amountMajor) : null
			})
			.returning({ id: payments.id });
		paymentId = newPayment?.id ?? null;
		if (paymentId != null) {
			await billingDocsRepo.updateBillingDocument(id, { paymentId });
		}
	}

	// Sincronizar project_payments para que el pago se vea en la pestaña Pagos de cada proyecto
	if (paymentId != null) {
		await db.delete(projectPayments).where(eq(projectPayments.paymentId, paymentId));
		for (const projectId of projectIds) {
			await db.insert(projectPayments).values({ projectId, paymentId });
		}
	}

	const updated = await billingDocsRepo.findBillingDocumentById(id);
	return json({ ok: true, document: updated });
};

/** DELETE: eliminar documento de facturación manual (solo admin; solo no-Stripe). */
export const DELETE: RequestHandler = async (event) => {
	if (!isAdmin(event)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const id = event.params.id;
	if (!id) return json({ error: 'id required' }, { status: 400 });
	const doc = await billingDocsRepo.findBillingDocumentById(id);
	if (!doc) return json({ error: 'Document not found' }, { status: 404 });
	if (doc.provider === 'stripe') {
		return json({ error: 'Cannot delete Stripe documents' }, { status: 400 });
	}
	await billingDocsRepo.deleteBillingDocument(id);
	return json({ ok: true });
};
