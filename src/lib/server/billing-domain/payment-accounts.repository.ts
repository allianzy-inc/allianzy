/**
 * Payment Accounts – DAO.
 * Una empresa puede tener varias cuentas (Stripe, MP, PayPal, etc.).
 */

import { eq, and, desc, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { paymentAccounts } from '$lib/server/schema';
import type { CreatePaymentAccountInput, PaymentAccountStatus } from './types';

export async function findPaymentAccountsByCompanyId(companyId: number, status?: PaymentAccountStatus) {
  const conditions = status ? and(eq(paymentAccounts.companyId, companyId), eq(paymentAccounts.status, status)) : eq(paymentAccounts.companyId, companyId);
  return db.query.paymentAccounts.findMany({
    where: conditions,
    orderBy: [desc(paymentAccounts.isDefault), desc(paymentAccounts.createdAt)],
    columns: {
      id: true,
      companyId: true,
      provider: true,
      label: true,
      externalId: true,
      status: true,
      isDefault: true,
      metadata: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function findPaymentAccountById(id: string) {
  return db.query.paymentAccounts.findFirst({
    where: eq(paymentAccounts.id, id),
    columns: {
      id: true,
      companyId: true,
      provider: true,
      label: true,
      externalId: true,
      status: true,
      isDefault: true,
      metadata: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function findPaymentAccountsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return db.query.paymentAccounts.findMany({
    where: inArray(paymentAccounts.id, ids),
    columns: { id: true, provider: true, externalId: true }
  });
}

export async function findPaymentAccountByCompanyAndExternalId(companyId: number, provider: string, externalId: string) {
  return db.query.paymentAccounts.findFirst({
    where: and(
      eq(paymentAccounts.companyId, companyId),
      eq(paymentAccounts.provider, provider as any),
      eq(paymentAccounts.externalId, externalId)
    )
  });
}

/** Para métodos manuales (MercadoPago, PayPal, etc.): una cuenta por empresa+provider. Devuelve id para billing_documents. */
export async function findOrCreateManualProviderAccount(companyId: number, provider: string, label: string): Promise<string> {
  const externalId = provider;
  const existing = await findPaymentAccountByCompanyAndExternalId(companyId, provider, externalId);
  if (existing) return existing.id;
  const row = await createPaymentAccount({
    companyId,
    provider: provider as any,
    label,
    externalId,
    status: 'active',
    isDefault: false
  });
  if (!row) throw new Error('Failed to create payment account');
  return row.id;
}

export async function createPaymentAccount(input: CreatePaymentAccountInput) {
  const [row] = await db
    .insert(paymentAccounts)
    .values({
      companyId: input.companyId,
      provider: input.provider,
      label: input.label,
      externalId: input.externalId ?? null,
      status: (input.status ?? 'active') as any,
      isDefault: input.isDefault ?? false,
      metadata: input.metadata ?? null,
      updatedAt: new Date()
    })
    .returning({
      id: paymentAccounts.id,
      companyId: paymentAccounts.companyId,
      provider: paymentAccounts.provider,
      label: paymentAccounts.label,
      externalId: paymentAccounts.externalId,
      status: paymentAccounts.status,
      isDefault: paymentAccounts.isDefault,
      metadata: paymentAccounts.metadata,
      createdAt: paymentAccounts.createdAt,
      updatedAt: paymentAccounts.updatedAt
    });
  return row ?? null;
}

export async function updatePaymentAccount(
  id: string,
  companyId: number,
  data: { label?: string; externalId?: string | null }
) {
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.label != null) updates.label = data.label;
  if (data.externalId !== undefined) updates.externalId = data.externalId;
  if (Object.keys(updates).length === 1) return null;
  const [row] = await db
    .update(paymentAccounts)
    .set(updates as any)
    .where(and(eq(paymentAccounts.id, id), eq(paymentAccounts.companyId, companyId)))
    .returning({ id: paymentAccounts.id });
  return row ?? null;
}

export async function setDefaultPaymentAccount(companyId: number, accountId: string) {
  await db
    .update(paymentAccounts)
    .set({ isDefault: false, updatedAt: new Date() })
    .where(eq(paymentAccounts.companyId, companyId));
  await db
    .update(paymentAccounts)
    .set({ isDefault: true, updatedAt: new Date() })
    .where(and(eq(paymentAccounts.id, accountId), eq(paymentAccounts.companyId, companyId)));
}

export async function archivePaymentAccount(id: string, companyId: number) {
  await db
    .update(paymentAccounts)
    .set({ status: 'archived' as any, updatedAt: new Date() })
    .where(and(eq(paymentAccounts.id, id), eq(paymentAccounts.companyId, companyId)));
}

export async function getDefaultPaymentAccountId(companyId: number): Promise<string | null> {
  const row = await db.query.paymentAccounts.findFirst({
    where: and(eq(paymentAccounts.companyId, companyId), eq(paymentAccounts.status, 'active'), eq(paymentAccounts.isDefault, true)),
    columns: { id: true }
  });
  return row?.id ?? null;
}
