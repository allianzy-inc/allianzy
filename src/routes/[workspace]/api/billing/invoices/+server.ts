import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBillingContext } from '$lib/server/billing-domain/resolve-context';
import * as billingDocsRepo from '$lib/server/billing-domain/billing-documents.repository';
import * as paymentAccountsRepo from '$lib/server/billing-domain/payment-accounts.repository';
import * as providerConfigRepo from '$lib/server/billing-domain/provider-config.repository';
import * as subscriptionRecordsRepo from '$lib/server/billing-domain/subscription-records.repository';
import * as upcomingLinksRepo from '$lib/server/billing-domain/upcoming-invoice-project-links.repository';
import { syncStripeForCompany } from '$lib/server/billing-domain/stripe-sync.service';
import { getStripeForBilling, getBillingCompany } from '$lib/server/billing';
import { db } from '$lib/server/db';
import { projects, services } from '$lib/server/schema';
import { eq, inArray } from 'drizzle-orm';

type ProviderDetailItem = { label: string; value: string };

/** Código de cuenta: Stripe = cus_xxx; otros = 8 caracteres alfanuméricos del uuid (estable). */
function accountCodeForDisplay(
	paymentAccountId: string | null,
	account: { id: string; provider: string; externalId: string | null } | null
): string | undefined {
	if (!paymentAccountId || !account) return undefined;
	if (account.provider === 'stripe' && account.externalId) return account.externalId;
	return paymentAccountId.replace(/-/g, '').slice(0, 8).toUpperCase();
}

/** Respuesta con forma compatible con la UI actual (id = provider_document_id cuando hay Stripe). */
function mapDocumentToInvoiceShape(
	doc: {
		id: string;
		projectId: number | null;
		provider: string;
		providerDocumentId: string | null;
		paymentAccountId: string | null;
		number: string | null;
		amountTotal: number;
		amountDue: number;
		status: string;
		dueDate: Date | null;
		issuedAt: Date | null;
		description: string | null;
		currency: string;
		metadata: Record<string, unknown> | null;
	},
	projectInfo?: { projectName: string; serviceName: string | null },
	providerDetails?: ProviderDetailItem[] | null,
	accountCode?: string | null,
	/** Si viene de la cuenta de pago, prevalece sobre doc.provider (evita docs mal etiquetados). */
	resolvedProvider?: string | null
) {
	const provider = resolvedProvider ?? doc.provider;
	const meta = (doc.metadata ?? {}) as {
		hosted_invoice_url?: string;
		invoice_pdf?: string;
		receipt_url?: string;
		proof_url?: string;
		proof_uploaded_at?: string;
		proof_files?: { id: string; url: string; name: string; uploadedAt: string }[];
		projectIds?: number[];
		paid_at?: string;
	};
	const linkedProjectIds = Array.isArray(meta.projectIds) ? meta.projectIds : (doc.projectId ? [doc.projectId] : []);
	const proofFiles = Array.isArray(meta.proof_files) && meta.proof_files.length > 0
		? meta.proof_files
		: meta.proof_url
			? [{ id: 'legacy', url: meta.proof_url, name: (meta.proof_url as string).split('/').pop() ?? 'Comprobante', uploadedAt: meta.proof_uploaded_at ?? '' }]
			: [];
	return {
		id: doc.providerDocumentId ?? doc.id,
		documentId: doc.id,
		provider,
		account_code: accountCode ?? undefined,
		provider_details: Array.isArray(providerDetails) && providerDetails.length > 0 ? providerDetails : undefined,
		number: doc.number ?? undefined,
		amount_due: doc.amountDue,
		amount_paid: doc.amountTotal - doc.amountDue,
		status: doc.status,
		due_date: doc.dueDate?.toISOString(),
		hosted_invoice_url: meta.hosted_invoice_url,
		invoice_pdf: meta.invoice_pdf,
		receipt_url: meta.receipt_url,
		proof_url: meta.proof_url,
		proof_uploaded_at: meta.proof_uploaded_at,
		proof_files: proofFiles,
		currency: doc.currency,
		created: doc.issuedAt?.toISOString() ?? undefined,
		description: doc.description ?? undefined,
		projectName: projectInfo?.projectName,
		serviceName: projectInfo?.serviceName,
		linked_project_ids: linkedProjectIds,
		paid_at: meta.paid_at ?? undefined
	};
}

/** Resuelve nombres de proyectos para una lista de IDs (projectMap de getProjectInfoMap). */
function linkedProjectNames(linkedIds: number[], projectMap: Record<number, { projectName: string; serviceName: string | null }>): string[] {
	return linkedIds.map((pid) => projectMap[pid]?.projectName ?? `Proyecto ${pid}`);
}

async function getProviderDetailsMap(codes: string[]): Promise<Record<string, ProviderDetailItem[]>> {
	const map: Record<string, ProviderDetailItem[]> = {};
	for (const code of codes) {
		if (!code || code === 'stripe') continue;
		const config = await providerConfigRepo.findProviderConfigByCode(code);
		const details = Array.isArray(config?.details) ? config.details : [];
		map[code] = details.filter((d) => d && typeof d.label === 'string' && typeof d.value === 'string');
	}
	return map;
}

async function getProjectInfoMap(projectIds: number[]) {
	if (projectIds.length === 0) return {} as Record<number, { projectName: string; serviceName: string | null }>;
	const rows = await db
		.select({
			id: projects.id,
			projectName: projects.name,
			serviceName: services.name
		})
		.from(projects)
		.leftJoin(services, eq(projects.serviceId, services.id))
		.where(inArray(projects.id, projectIds));
	return Object.fromEntries(rows.map((r) => [r.id, { projectName: r.projectName ?? '', serviceName: r.serviceName ?? null }]));
}

/** Devuelve código de cuenta y proveedor real por paymentAccountId (el de la cuenta manda sobre doc.provider). */
async function getAccountMaps(docs: { paymentAccountId: string | null }[]): Promise<{
	codeMap: Record<string, string>;
	providerMap: Record<string, string>;
}> {
	const ids = [...new Set(docs.map((d) => d.paymentAccountId).filter(Boolean))] as string[];
	const codeMap: Record<string, string> = {};
	const providerMap: Record<string, string> = {};
	if (ids.length === 0) return { codeMap, providerMap };
	const accounts = await paymentAccountsRepo.findPaymentAccountsByIds(ids);
	const byId = Object.fromEntries(accounts.map((a) => [a.id, a]));
	for (const id of ids) {
		const acc = byId[id];
		const code = accountCodeForDisplay(id, acc ?? null);
		if (code) codeMap[id] = code;
		if (acc?.provider) providerMap[id] = acc.provider;
	}
	return { codeMap, providerMap };
}

/** Forma mínima de una fila de historial (factura o pago único). */
type InvoiceRow = {
	id: string;
	documentId?: string | null;
	provider: string;
	account_code?: string;
	amount_due?: number;
	amount_paid?: number;
	status?: string;
	created?: string;
	due_date?: string;
	paid_at?: string;
	[key: string]: unknown;
};

/** Obtiene cargos de Stripe que no son parte de una factura (pagos únicos) para un cliente, en forma de filas de historial. */
async function getStandaloneChargeRows(
	stripe: import('stripe').Stripe,
	customerId: string
): Promise<InvoiceRow[]> {
	const rows: InvoiceRow[] = [];
	try {
		const charges = await stripe.charges.list({ customer: customerId, limit: 100 });
		for (const ch of charges.data ?? []) {
			if (ch.status !== 'succeeded') continue;
			if (ch.invoice) continue;
			rows.push({
				id: ch.id,
				documentId: null,
				provider: 'stripe',
				account_code: customerId,
				number: undefined,
				amount_due: 0,
				amount_paid: ch.amount ?? 0,
				status: 'paid',
				due_date: undefined,
				paid_at: ch.created ? new Date(ch.created * 1000).toISOString() : undefined,
				hosted_invoice_url: undefined,
				invoice_pdf: undefined,
				receipt_url: (ch as { receipt_url?: string }).receipt_url ?? undefined,
				currency: (ch.currency ?? 'usd').toLowerCase(),
				created: ch.created ? new Date(ch.created * 1000).toISOString() : undefined,
				description: (ch.description as string) ?? 'Pago único'
			});
		}
	} catch (e) {
		console.error('[billing/invoices] standalone charges error:', (e as Error)?.message);
	}
	return rows;
}

/** Ordena por fecha relevante: due_date (próximas) o created (pasadas), desc. */
function sortInvoicesByCreated(invoices: InvoiceRow[]): void {
	invoices.sort((a, b) => {
		const ta = a.due_date ?? a.created ?? '';
		const tb = b.due_date ?? b.created ?? '';
		return tb.localeCompare(ta);
	});
}

/** Devuelve la fecha en formato YYYY-MM-DD para comparar "mismo día". */
function toDateOnly(isoOrUndefined: string | undefined): string {
	if (!isoOrUndefined) return '';
	const d = isoOrUndefined.slice(0, 10);
	return d.length === 10 ? d : '';
}

/** Total pagado + pendiente de una fila (minor units). */
function rowTotal(row: InvoiceRow): number {
	const due = Number(row.amount_due ?? 0);
	const paid = Number(row.amount_paid ?? 0);
	return due + paid;
}

/** True si el charge (standalone) representa el mismo pago que una fila ya existente (factura). */
function isSamePayment(chargeRow: InvoiceRow, existingRow: InvoiceRow): boolean {
	const accountMatch =
		(chargeRow.account_code ?? '') === (existingRow.account_code ?? '');
	const amountCharge = Number(chargeRow.amount_paid ?? 0) + Number(chargeRow.amount_due ?? 0);
	const amountExisting = rowTotal(existingRow);
	const amountMatch = amountCharge === amountExisting;
	const dateCharge = toDateOnly(chargeRow.created ?? chargeRow.paid_at);
	const dateExisting = toDateOnly(existingRow.paid_at ?? existingRow.created);
	const dateMatch = dateCharge && dateExisting && dateCharge === dateExisting;
	return accountMatch && amountMatch && dateMatch;
}

/** No añadir un standalone charge si ya hay una fila en la lista que sea el mismo pago. */
function shouldAddStandaloneCharge(chargeRow: InvoiceRow, existingList: InvoiceRow[]): boolean {
	return !existingList.some((existing) => isSamePayment(chargeRow, existing));
}

/** Próximas facturas de Stripe por suscripción (preview). Incluye status 'upcoming' para la UI. */
async function getUpcomingInvoiceRows(
	stripe: import('stripe').Stripe,
	subscriptionRecords: { provider: string; providerSubscriptionId: string | null; paymentAccountId: string | null }[],
	accountCodeByPaymentId: Record<string, string>
): Promise<InvoiceRow[]> {
	const rows: InvoiceRow[] = [];
	const stripeSubs = subscriptionRecords.filter(
		(s) => (s.provider ?? 'stripe') === 'stripe' && s.providerSubscriptionId
	);
	for (const sub of stripeSubs) {
		try {
			const inv = await stripe.invoices.retrieve('upcoming', {
				subscription: sub.providerSubscriptionId!
			});
			const accountCode = sub.paymentAccountId ? accountCodeByPaymentId[sub.paymentAccountId] : undefined;
			rows.push({
				id: `upcoming_${sub.providerSubscriptionId}`,
				documentId: null,
				provider: 'stripe',
				account_code: accountCode,
				number: undefined,
				amount_due: inv.amount_due ?? 0,
				amount_paid: 0,
				status: 'upcoming',
				due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : undefined,
				paid_at: undefined,
				currency: (inv.currency ?? 'usd').toLowerCase(),
				created: inv.created ? new Date(inv.created * 1000).toISOString() : undefined,
				description: inv.description ?? 'Próxima factura'
			});
		} catch (e) {
			// Sin próxima (suscripción cancelada, etc.)
			console.debug('[billing/invoices] upcoming for sub', sub.providerSubscriptionId, (e as Error)?.message);
		}
	}
	return rows;
}

export const GET: RequestHandler = async (event) => {
	const url = event.url;
	const providerFilter = url.searchParams.get('provider')?.toLowerCase().trim();

	// 0) Filtro por proveedor (cualquier código distinto de stripe): listar documentos de ese proveedor
	if (providerFilter && providerFilter !== 'stripe') {
		const { getBillingCompanyId } = await import('$lib/server/billing');
		const companyId = await getBillingCompanyId(event);
		if (companyId == null) return json({ linked: false, invoices: [] });
		const docs = await billingDocsRepo.findBillingDocumentsByCompanyId(companyId, {
			provider: providerFilter,
			limit: 100
		});
		const allProjectIds = [...new Set(docs.flatMap((d) => {
			const ids = [d.projectId].filter(Boolean) as number[];
			const meta = (d.metadata as { projectIds?: number[] }) ?? {};
			if (Array.isArray(meta.projectIds)) ids.push(...meta.projectIds);
			return ids;
		}))] as number[];
		const projectMap = await getProjectInfoMap(allProjectIds);
		const providerCodes = [...new Set(docs.map((d) => d.provider).filter(Boolean))];
		const detailsMap = await getProviderDetailsMap(providerCodes);
		const { codeMap: accountCodeMap, providerMap } = await getAccountMaps(docs);
		const invoices = docs.map((d) => {
			const resolvedProvider = d.paymentAccountId ? providerMap[d.paymentAccountId] : undefined;
			const providerForDetails = resolvedProvider ?? d.provider;
			const meta = (d.metadata as { projectIds?: number[] }) ?? {};
			const linkedIds = Array.isArray(meta.projectIds) ? meta.projectIds : (d.projectId ? [d.projectId] : []);
			const projectInfo = linkedIds.length > 0 ? projectMap[linkedIds[0]] : (d.projectId ? projectMap[d.projectId] : undefined);
			const shape = mapDocumentToInvoiceShape(
				d,
				projectInfo,
				detailsMap[providerForDetails],
				d.paymentAccountId ? accountCodeMap[d.paymentAccountId] : undefined,
				resolvedProvider
			);
			(shape as { linked_project_names?: string[] }).linked_project_names = linkedProjectNames(linkedIds, projectMap);
			return shape;
		});
		return json({ linked: true, invoices });
	}

	const ctx = await getBillingContext(event);
	if (!ctx) {
		return json({ linked: false, invoices: [] });
	}

	// 1) Devolver todos los documentos de la empresa (Stripe + MercadoPago, etc.) cuando hay companyId
	if (ctx.companyId) {
		let docs = await billingDocsRepo.findBillingDocumentsByCompanyId(ctx.companyId, { limit: 100 });
		const hasStripeAccounts = ctx.accounts.some((a) => (a.provider ?? 'stripe') === 'stripe');
		// Sync Stripe si hay cuenta Stripe y (no hay docs o queremos refrescar todas las cuentas, p. ej. gcus_ recién añadida)
		if (hasStripeAccounts && docs.length === 0) {
			try {
				await syncStripeForCompany(ctx.companyId);
				docs = await billingDocsRepo.findBillingDocumentsByCompanyId(ctx.companyId, { limit: 100 });
			} catch (err: any) {
				console.error('[billing/invoices] sync error:', err?.message ?? err);
			}
		}
		// Construir historial siempre que haya cuentas Stripe (aunque docs esté vacío: pagos sin factura / guest)
		if (hasStripeAccounts || docs.length > 0) {
			const allProjectIds = [...new Set(docs.flatMap((d) => {
				const ids = [d.projectId].filter(Boolean) as number[];
				const meta = (d.metadata as { projectIds?: number[] }) ?? {};
				if (Array.isArray(meta.projectIds)) ids.push(...meta.projectIds);
				return ids;
			}))] as number[];
			const projectMap = await getProjectInfoMap(allProjectIds);
			const providerCodes = [...new Set(docs.map((d) => d.provider).filter(Boolean))];
			const detailsMap = await getProviderDetailsMap(providerCodes);
			const { codeMap: accountCodeMap, providerMap } = await getAccountMaps(docs);
			const fromDocs: InvoiceRow[] = docs.map((d) => {
				const resolvedProvider = d.paymentAccountId ? providerMap[d.paymentAccountId] : undefined;
				const providerForDetails = resolvedProvider ?? d.provider;
				const meta = (d.metadata as { projectIds?: number[] }) ?? {};
				const linkedIds = Array.isArray(meta.projectIds) ? meta.projectIds : (d.projectId ? [d.projectId] : []);
				const projectInfo = linkedIds.length > 0 ? projectMap[linkedIds[0]] : (d.projectId ? projectMap[d.projectId] : undefined);
				const shape = mapDocumentToInvoiceShape(
					d,
					projectInfo,
					detailsMap[providerForDetails],
					d.paymentAccountId ? accountCodeMap[d.paymentAccountId] : undefined,
					resolvedProvider
				);
				(shape as { linked_project_names?: string[] }).linked_project_names = linkedProjectNames(linkedIds, projectMap);
				return shape as InvoiceRow;
			});
			const seenIds = new Set<string>();
			const invoices: InvoiceRow[] = fromDocs.filter((row) => {
				const key = row.id ?? (row as { documentId?: string }).documentId ?? '';
				if (seenIds.has(key)) return false;
				seenIds.add(key);
				return true;
			});
			const stripe = getStripeForBilling();
			if (stripe) {
				for (const acc of ctx.accounts) {
					if ((acc.provider ?? 'stripe') !== 'stripe' || !acc.customerId) continue;
					try {
						const standalone = await getStandaloneChargeRows(stripe, acc.customerId);
						for (const row of standalone) {
							if (!seenIds.has(row.id) && shouldAddStandaloneCharge(row, invoices)) {
								seenIds.add(row.id);
								invoices.push(row);
							}
						}
					} catch (e: any) {
						console.error('[billing/invoices] standalone charges for', acc.customerId, e?.message ?? e);
					}
				}
				try {
					const subs = await subscriptionRecordsRepo.findSubscriptionRecordsByCompanyId(ctx.companyId!);
					const accountCodeByPaymentId: Record<string, string> = Object.fromEntries(
						ctx.accounts
							.filter((a) => (a.provider ?? 'stripe') === 'stripe' && a.customerId)
							.map((a) => [a.paymentAccountId, a.customerId!])
					);
					const upcoming = await getUpcomingInvoiceRows(stripe, subs, accountCodeByPaymentId);
					for (const row of upcoming) {
						if (!seenIds.has(row.id)) {
							seenIds.add(row.id);
							invoices.push(row);
						}
					}
					const upcomingLinks = await upcomingLinksRepo.findUpcomingLinksByCompanyId(ctx.companyId!);
					if (upcomingLinks.length > 0) {
						const upcomingProjectIds = [...new Set(upcomingLinks.flatMap((l) => l.projectIds))];
						const upcomingProjectMap = await getProjectInfoMap(upcomingProjectIds);
						const linkBySubId = Object.fromEntries(upcomingLinks.map((l) => [l.subscriptionId, l]));
						for (const row of invoices) {
							if (row.id?.startsWith?.('upcoming_')) {
								const subId = row.id.slice(9);
								const link = linkBySubId[subId];
								if (link) {
									(row as InvoiceRow & { linked_project_ids?: number[]; linked_project_names?: string[] }).linked_project_ids = link.projectIds;
									(row as InvoiceRow & { linked_project_ids?: number[]; linked_project_names?: string[] }).linked_project_names = link.projectIds.map(
										(pid) => upcomingProjectMap[pid]?.projectName ?? `Proyecto ${pid}`
									);
								}
							}
						}
					}
				} catch (e) {
					console.error('[billing/invoices] upcoming error:', (e as Error)?.message);
				}
				sortInvoicesByCreated(invoices);
			}
			return json({ linked: true, invoices });
		}
	}

	// 2) Legacy: sin payment_accounts en DB, llamar Stripe directo
	const billing = await getBillingCompany(event);
	if (!billing) return json({ linked: false, invoices: [] });
	const stripe = getStripeForBilling();
	if (!stripe) return json({ linked: true, invoices: [] });
	try {
		const list = await stripe.invoices.list({
			customer: billing.stripeCustomerId,
			limit: 100,
			expand: ['data.charge']
		});
		const invoices: InvoiceRow[] = (list.data ?? []).map((inv) => {
			const charge = inv.charge as { receipt_url?: string | null } | string | null;
			const receiptUrl = typeof charge === 'object' && charge?.receipt_url ? charge.receipt_url : undefined;
			const statusTransitions = inv.status_transitions as { paid_at?: number } | undefined;
			return {
				id: inv.id,
				documentId: null,
				provider: 'stripe',
				account_code: billing.stripeCustomerId ?? undefined,
				number: inv.number ?? undefined,
				amount_due: inv.amount_due ?? 0,
				amount_paid: inv.amount_paid ?? 0,
				status: inv.status ?? undefined,
				due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : undefined,
				paid_at: statusTransitions?.paid_at ? new Date(statusTransitions.paid_at * 1000).toISOString() : undefined,
				hosted_invoice_url: inv.hosted_invoice_url ?? undefined,
				invoice_pdf: inv.invoice_pdf ?? undefined,
				receipt_url: receiptUrl ?? undefined,
				currency: inv.currency ?? 'usd',
				created: inv.created ? new Date(inv.created * 1000).toISOString() : undefined,
				description: inv.description ?? undefined
			};
		});
		const standalone = await getStandaloneChargeRows(stripe, billing.stripeCustomerId ?? '');
		const seenIds = new Set(invoices.map((r) => r.id));
		for (const row of standalone) {
			if (!seenIds.has(row.id) && shouldAddStandaloneCharge(row, invoices)) {
				seenIds.add(row.id);
				invoices.push(row);
			}
		}
		// Próximas facturas (legacy: una cuenta Stripe)
		try {
			const subList = await stripe.subscriptions.list({
				customer: billing.stripeCustomerId!,
				status: 'active',
				limit: 100
			});
			for (const sub of subList.data ?? []) {
				try {
					const inv = await stripe.invoices.retrieve('upcoming', {
						subscription: sub.id
					});
					const row: InvoiceRow = {
						id: `upcoming_${sub.id}`,
						documentId: null,
						provider: 'stripe',
						account_code: billing.stripeCustomerId ?? undefined,
						amount_due: inv.amount_due ?? 0,
						amount_paid: 0,
						status: 'upcoming',
						due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : undefined,
						currency: (inv.currency ?? 'usd').toLowerCase(),
						created: inv.created ? new Date(inv.created * 1000).toISOString() : undefined,
						description: inv.description ?? 'Próxima factura'
					};
					if (!seenIds.has(row.id)) {
						seenIds.add(row.id);
						invoices.push(row);
					}
				} catch (_) {
					// sin próxima para esta suscripción
				}
			}
		} catch (_) {
			// ignorar error próximas en legacy
		}
		sortInvoicesByCreated(invoices);
		return json({ linked: true, invoices });
	} catch (err: any) {
		console.error('[billing/invoices] Stripe error:', err?.message ?? err);
		return json({ linked: true, invoices: [], error: err?.message ?? 'Stripe error' }, { status: 500 });
	}
};
