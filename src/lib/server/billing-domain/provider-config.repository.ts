/**
 * Payment provider config – qué proveedores están habilitados y su orden (solo Stripe es automático).
 */

import { eq, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { paymentProviderConfig } from '$lib/server/schema';

export interface PaymentProviderDetailItem {
	label: string;
	value: string;
}

export interface PaymentProviderConfigRow {
	code: string;
	label: string;
	isAutomatic: boolean;
	displayOrder: number;
	enabled: boolean;
	details: PaymentProviderDetailItem[] | null;
	createdAt: Date | null;
	updatedAt: Date | null;
}

export async function findAllProviderConfigs(enabledOnly = false) {
	const conditions = enabledOnly ? eq(paymentProviderConfig.enabled, true) : undefined;
	return db.query.paymentProviderConfig.findMany({
		where: conditions,
		orderBy: [asc(paymentProviderConfig.displayOrder), asc(paymentProviderConfig.code)],
		columns: {
			code: true,
			label: true,
			isAutomatic: true,
			displayOrder: true,
			enabled: true,
			details: true,
			createdAt: true,
			updatedAt: true
		}
	});
}

export async function updateProviderConfig(
	code: string,
	updates: { label?: string; displayOrder?: number; enabled?: boolean; details?: PaymentProviderDetailItem[] }
) {
	const [row] = await db
		.update(paymentProviderConfig)
		.set({
			...(updates.label != null && { label: updates.label }),
			...(updates.displayOrder != null && { displayOrder: updates.displayOrder }),
			...(updates.enabled != null && { enabled: updates.enabled }),
			...(updates.details !== undefined && { details: Array.isArray(updates.details) ? updates.details : [] }),
			updatedAt: new Date()
		})
		.where(eq(paymentProviderConfig.code, code))
		.returning();
	return row ?? null;
}

export async function findProviderConfigByCode(code: string) {
	return db.query.paymentProviderConfig.findFirst({
		where: eq(paymentProviderConfig.code, code)
	});
}

/** Crear método de pago (nombre libre, código único tipo slug). Solo Stripe es automático. */
export async function createProviderConfig(input: {
	code: string;
	label: string;
	displayOrder?: number;
	details?: PaymentProviderDetailItem[];
}) {
	const [row] = await db
		.insert(paymentProviderConfig)
		.values({
			code: input.code,
			label: input.label,
			isAutomatic: false,
			displayOrder: input.displayOrder ?? 999,
			enabled: true,
			details: Array.isArray(input.details) ? input.details : [],
			updatedAt: new Date()
		})
		.returning();
	return row ?? null;
}

/** Eliminar método de pago. No se puede eliminar Stripe. */
export async function deleteProviderConfig(code: string) {
	if (code === 'stripe') return null;
	const [row] = await db
		.delete(paymentProviderConfig)
		.where(eq(paymentProviderConfig.code, code))
		.returning();
	return row ?? null;
}
