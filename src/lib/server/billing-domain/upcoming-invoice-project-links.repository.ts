/**
 * Vínculos de facturas próximas (aún no emitidas) a proyectos.
 * Al sincronizar Stripe y crear el documento real, se aplican estos vínculos y se elimina la fila.
 */

import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { upcomingInvoiceProjectLinks } from '$lib/server/schema';

export async function findUpcomingLinksByCompanyId(companyId: number): Promise<
	{ subscriptionId: string; provider: string; projectIds: number[]; amountCents: number | null; dueDate: Date | null; currency: string | null }[]
> {
	const rows = await db
		.select({
			subscriptionId: upcomingInvoiceProjectLinks.subscriptionId,
			provider: upcomingInvoiceProjectLinks.provider,
			projectIds: upcomingInvoiceProjectLinks.projectIds,
			amountCents: upcomingInvoiceProjectLinks.amountCents,
			dueDate: upcomingInvoiceProjectLinks.dueDate,
			currency: upcomingInvoiceProjectLinks.currency
		})
		.from(upcomingInvoiceProjectLinks)
		.where(eq(upcomingInvoiceProjectLinks.companyId, companyId));
	return rows.map((r) => ({
		subscriptionId: r.subscriptionId,
		provider: r.provider,
		projectIds: Array.isArray(r.projectIds) ? r.projectIds : [],
		amountCents: r.amountCents ?? null,
		dueDate: r.dueDate ?? null,
		currency: r.currency ?? null
	}));
}

export async function findUpcomingLinksByProjectId(projectId: number): Promise<
	{ id: string; companyId: number; provider: string; subscriptionId: string; projectIds: number[]; amountCents: number | null; dueDate: Date | null; currency: string | null }[]
> {
	const rows = await db.select().from(upcomingInvoiceProjectLinks);
	return rows.filter((r) => Array.isArray(r.projectIds) && r.projectIds.includes(projectId));
}

export async function findUpcomingLinkBySubscription(
	companyId: number,
	provider: string,
	subscriptionId: string
) {
	const rows = await db
		.select()
		.from(upcomingInvoiceProjectLinks)
		.where(
			and(
				eq(upcomingInvoiceProjectLinks.companyId, companyId),
				eq(upcomingInvoiceProjectLinks.provider, provider),
				eq(upcomingInvoiceProjectLinks.subscriptionId, subscriptionId)
			)
		)
		.limit(1);
	return rows[0] ?? null;
}

export async function upsertUpcomingLink(input: {
	companyId: number;
	provider: string;
	subscriptionId: string;
	projectIds: number[];
	amountCents?: number | null;
	dueDate?: Date | null;
	currency?: string | null;
}) {
	const existing = await findUpcomingLinkBySubscription(input.companyId, input.provider, input.subscriptionId);
	const projectIds = input.projectIds.filter((id) => Number.isInteger(id) && id > 0);
	const payload = {
		companyId: input.companyId,
		provider: input.provider,
		subscriptionId: input.subscriptionId,
		projectIds,
		amountCents: input.amountCents ?? null,
		dueDate: input.dueDate ?? null,
		currency: input.currency ?? null,
		updatedAt: new Date()
	};
	if (existing) {
		await db
			.update(upcomingInvoiceProjectLinks)
			.set(payload)
			.where(eq(upcomingInvoiceProjectLinks.id, existing.id));
		return existing.id;
	}
	const [row] = await db.insert(upcomingInvoiceProjectLinks).values(payload).returning({ id: upcomingInvoiceProjectLinks.id });
	return row?.id ?? null;
}

export async function deleteUpcomingLink(id: string) {
	await db.delete(upcomingInvoiceProjectLinks).where(eq(upcomingInvoiceProjectLinks.id, id));
}

export async function deleteUpcomingLinkBySubscription(companyId: number, provider: string, subscriptionId: string) {
	const row = await findUpcomingLinkBySubscription(companyId, provider, subscriptionId);
	if (row) await deleteUpcomingLink(row.id);
}
