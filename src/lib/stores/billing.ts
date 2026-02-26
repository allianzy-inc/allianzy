/**
 * Billing UI store and types (mock data; later map to Stripe).
 * READ-ONLY display: payments happen in Stripe; we show history and subscription status here.
 */

// --- Types (aligned for future Stripe mapping) ---

export type InvoiceStatus = 'paid' | 'open' | 'void' | 'uncollectible';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface BillingInvoice {
	id: string;
	status: InvoiceStatus;
	amount: number;
	currency: string;
	createdAt: string; // ISO
	dueAt?: string;
	/** Fecha de pago (ISO), cuando la factura pasó a estado pagado. */
	paidAt?: string | null;
	description?: string;
	projectName?: string;
	serviceName?: string;
	hostedInvoiceUrl?: string;
	invoicePdfUrl?: string;
	/** Recibo del pago (solo si la factura está pagada). */
	receiptUrl?: string;
	/** ID interno del documento (para subir comprobante, editar en admin). */
	documentId?: string | null;
	/** Proveedor (stripe, mercadopago_ar, etc.). */
	provider?: string;
	/** Código de cuenta de pago: Stripe = cus_..., MercadoPago = 8 caracteres alfanuméricos. */
	accountCode?: string | null;
	/** Datos para realizar el pago (CVU, Alias, Banco, PayPal Email, etc.) en métodos no Stripe. */
	providerDetails?: { label: string; value: string }[];
	/** Comprobante(s) de transferencia subidos por el cliente (métodos no Stripe). */
	proofUrl?: string | null;
	proofUploadedAt?: string | null;
	proofFiles?: { id: string; url: string; name: string; uploadedAt: string }[];
	/** IDs de proyectos vinculados (admin). */
	linked_project_ids?: number[];
	/** Nombres de proyectos vinculados para mostrar en tabla. */
	linked_project_names?: string[];
}

export interface BillingInvoiceOverlayItem {
	id: string;
	label: string;
	amount: number;
}

export interface BillingInvoiceOverlay {
	stripeInvoiceId: string;
	title?: string;
	projectId?: string;
	notes?: string;
	items: BillingInvoiceOverlayItem[];
}

export interface BillingSubscription {
	id: string;
	status: SubscriptionStatus;
	planName: string;
	amount: number;
	currency: string;
	currentPeriodEnd: string; // ISO or formatted
	projectName?: string;
	serviceName?: string;
}

// --- Mock data ---

const MOCK_INVOICES: BillingInvoice[] = [
	{
		id: 'inv_mock_1',
		status: 'paid',
		amount: 29900, // cents
		currency: 'usd',
		createdAt: '2025-01-15T10:00:00Z',
		dueAt: '2025-01-22T23:59:59Z',
		description: 'Suscripción Mensual - Plan Pro',
		projectName: 'Sitio Web Corporativo',
		serviceName: 'Hosting + Mantenimiento',
		hostedInvoiceUrl: 'https://invoice.stripe.com/i/acct_xxx/test_1',
		invoicePdfUrl: 'https://pay.stripe.com/invoice/xxx/pdf'
	},
	{
		id: 'inv_mock_2',
		status: 'open',
		amount: 29900,
		currency: 'usd',
		createdAt: '2025-02-01T10:00:00Z',
		dueAt: '2025-02-15T23:59:59Z',
		description: 'Suscripción Mensual - Plan Pro',
		projectName: 'Sitio Web Corporativo',
		serviceName: 'Hosting + Mantenimiento',
		hostedInvoiceUrl: 'https://invoice.stripe.com/i/acct_xxx/test_2',
		invoicePdfUrl: undefined
	},
	{
		id: 'inv_mock_3',
		status: 'void',
		amount: 15000,
		currency: 'usd',
		createdAt: '2024-12-01T10:00:00Z',
		description: 'Factura anulada',
		projectName: 'Proyecto Antiguo',
		serviceName: 'Consultoría'
	}
];

const MOCK_SUBSCRIPTIONS: BillingSubscription[] = [
	{
		id: 'sub_mock_1',
		status: 'active',
		planName: 'Plan Pro',
		amount: 29900,
		currency: 'usd',
		currentPeriodEnd: '2025-03-01',
		projectName: 'Sitio Web Corporativo',
		serviceName: 'Hosting + Mantenimiento'
	},
	{
		id: 'sub_mock_2',
		status: 'trialing',
		planName: 'Plan Starter',
		amount: 9900,
		currency: 'usd',
		currentPeriodEnd: '2025-02-28',
		projectName: 'App Móvil',
		serviceName: 'API Backend'
	}
];

// --- Svelte stores (in-memory; simulate persistence) ---

import { writable } from 'svelte/store';

export const billingInvoices = writable<BillingInvoice[]>([...MOCK_INVOICES]);
export const billingSubscriptions = writable<BillingSubscription[]>([...MOCK_SUBSCRIPTIONS]);

type OverlayMap = Record<string, BillingInvoiceOverlay>;
export const billingOverlays = writable<OverlayMap>({
	inv_mock_1: {
		stripeInvoiceId: 'inv_mock_1',
		title: 'Suscripción Mensual - Plan Pro',
		items: [
			{ id: 'li_1', label: 'Hosting + Mantenimiento', amount: 29900 },
			{ id: 'li_2', label: 'Soporte técnico', amount: 0 }
		]
	},
	inv_mock_2: {
		stripeInvoiceId: 'inv_mock_2',
		title: 'Suscripción Mensual - Plan Pro',
		items: [{ id: 'li_1', label: 'Hosting + Mantenimiento', amount: 29900 }]
	}
});

export const stripeCustomerId = writable<string | null>(null);

// --- Helpers ---

function formatCents(cents: number, currency: string): string {
	return new Intl.NumberFormat('es-ES', {
		style: 'currency',
		currency: currency.toUpperCase()
	}).format(cents / 100);
}

export function formatBillingAmount(cents: number, currency: string): string {
	return formatCents(cents, currency);
}

let overlayItemIdCounter = 1;
function nextOverlayItemId(): string {
	return `li_${Date.now()}_${overlayItemIdCounter++}`;
}

// --- CRUD for overlay items (mock persistence) ---

export function setOverlay(invoiceId: string, overlay: BillingInvoiceOverlay): void {
	billingOverlays.update((m) => ({ ...m, [invoiceId]: overlay }));
}

/** Replace overlays with data from API (e.g. after loading billing page). */
export function setOverlaysFromApi(overlays: Record<string, { title?: string; items: BillingInvoiceOverlayItem[] }>): void {
	const map: OverlayMap = {};
	for (const [id, val] of Object.entries(overlays)) {
		if (val && Array.isArray(val.items)) {
			map[id] = { stripeInvoiceId: id, title: val.title, items: val.items };
		}
	}
	billingOverlays.set(map);
}

export function addOverlayItem(invoiceId: string, item: Omit<BillingInvoiceOverlayItem, 'id'>): void {
	const id = nextOverlayItemId();
	billingOverlays.update((m) => {
		const existing = m[invoiceId] ?? { stripeInvoiceId: invoiceId, items: [] };
		return {
			...m,
			[invoiceId]: { ...existing, items: [...existing.items, { ...item, id }] }
		};
	});
}

export function updateOverlayItem(
	invoiceId: string,
	itemId: string,
	updates: Partial<Omit<BillingInvoiceOverlayItem, 'id'>>
): void {
	billingOverlays.update((m) => {
		const existing = m[invoiceId];
		if (!existing) return m;
		const items = existing.items.map((i) =>
			i.id === itemId ? { ...i, ...updates } : i
		);
		return { ...m, [invoiceId]: { ...existing, items } };
	});
}

export function removeOverlayItem(invoiceId: string, itemId: string): void {
	billingOverlays.update((m) => {
		const existing = m[invoiceId];
		if (!existing) return m;
		const items = existing.items.filter((i) => i.id !== itemId);
		return { ...m, [invoiceId]: { ...existing, items } };
	});
}

export function setOverlayTitle(invoiceId: string, title: string): void {
	billingOverlays.update((m) => {
		const existing = m[invoiceId];
		if (!existing) return m;
		return { ...m, [invoiceId]: { ...existing, title } };
	});
}

export function setStripeCustomerId(customerId: string | null): void {
	stripeCustomerId.set(customerId);
}
