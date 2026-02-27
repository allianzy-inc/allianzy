import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import * as billingDocsRepo from '$lib/server/billing-domain/billing-documents.repository';
import * as upcomingLinksRepo from '$lib/server/billing-domain/upcoming-invoice-project-links.repository';
import { db } from '$lib/server/db';
import { payments, projectPayments } from '$lib/server/schema';

function isAdmin(event: { locals: { user?: { role?: string } } }) {
	return String(event.locals.user?.role ?? '').toLowerCase() === 'admin';
}

/**
 * POST: vincular factura/pago a proyectos (solo admin).
 * Acepta documentId O provider + providerDocumentId, O providerDocumentId que empiece con "upcoming_"
 * (factura próxima): en ese caso se guarda en upcoming_invoice_project_links y se aplicará al documento al sincronizar.
 * Body: { companyId, projectIds, documentId?, provider?, providerDocumentId?, amountCents?, dueDate?, currency? }
 */
export const POST: RequestHandler = async (event) => {
	if (!isAdmin(event)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	let body: {
		companyId?: number;
		projectIds?: number[];
		documentId?: string;
		provider?: string;
		providerDocumentId?: string;
		amountCents?: number;
		dueDate?: string;
		currency?: string;
	};
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
	const companyId = body.companyId != null ? Number(body.companyId) : undefined;
	if (companyId == null || !Number.isInteger(companyId) || companyId < 1) {
		return json({ error: 'companyId required' }, { status: 400 });
	}
	const projectIds = Array.isArray(body.projectIds)
		? body.projectIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
		: [];

	const providerDocId = body.providerDocumentId != null ? String(body.providerDocumentId).trim() : null;
	const isUpcoming = providerDocId != null && providerDocId.startsWith('upcoming_');
	if (isUpcoming && body.provider != null) {
		const subscriptionId = providerDocId.slice('upcoming_'.length);
		if (!subscriptionId) {
			return json({ error: 'providerDocumentId inválido para factura próxima' }, { status: 400 });
		}
		const dueDate = body.dueDate ? new Date(body.dueDate) : null;
		await upcomingLinksRepo.upsertUpcomingLink({
			companyId,
			provider: String(body.provider).trim(),
			subscriptionId,
			projectIds,
			amountCents: body.amountCents ?? null,
			dueDate: isNaN(dueDate?.getTime() ?? NaN) ? null : dueDate,
			currency: body.currency ?? null
		});
		return json({ ok: true, upcoming: true });
	}

	let doc =
		body.documentId != null
			? await billingDocsRepo.findBillingDocumentById(body.documentId)
			: null;
	if (!doc && body.provider != null && providerDocId != null) {
		doc = await billingDocsRepo.findBillingDocumentByProviderId(
			companyId,
			String(body.provider).trim(),
			providerDocId
		);
	}
	if (!doc) {
		return json(
			{
				error:
					'Documento no encontrado. Si el pago es de Stripe, ejecutá "Sincronizar facturación" en esta página para crear el documento y volvé a intentar.'
			},
			{ status: 404 }
		);
	}
	if (doc.companyId !== companyId) {
		return json({ error: 'Document does not belong to this company' }, { status: 403 });
	}

	const id = doc.id;
	const existing = (doc.metadata as Record<string, unknown>) ?? {};
	const metadata = { ...existing, projectIds };
	await billingDocsRepo.updateBillingDocument(id, { metadata });

	let paymentId = doc.paymentId;

	if (paymentId == null && projectIds.length > 0) {
		const amountMajor = doc.amountTotal / 100;
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

	if (paymentId != null) {
		await db.delete(projectPayments).where(eq(projectPayments.paymentId, paymentId));
		for (const projectId of projectIds) {
			await db.insert(projectPayments).values({ projectId, paymentId });
		}
	}

	const updated = await billingDocsRepo.findBillingDocumentById(id);
	return json({ ok: true, document: updated });
};
