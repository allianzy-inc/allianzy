/**
 * Billing Documents – DAO.
 * Documentos de cobro (invoice, receipt, credit_note). Fuente de verdad en DB.
 */

import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { billingDocuments } from '$lib/server/schema';
import type { CreateBillingDocumentInput, BillingDocumentStatus } from './types';

export async function findBillingDocumentsByCompanyId(
  companyId: number,
  options?: { paymentAccountId?: string | null; provider?: string | null; status?: BillingDocumentStatus; limit?: number; offset?: number }
) {
  const conditions = [eq(billingDocuments.companyId, companyId)];
  if (options?.paymentAccountId) conditions.push(eq(billingDocuments.paymentAccountId, options.paymentAccountId));
  if (options?.provider) conditions.push(eq(billingDocuments.provider, options.provider as any));
  if (options?.status) conditions.push(eq(billingDocuments.status, options.status));
  const where = conditions.length === 1 ? conditions[0] : and(...conditions);
  return db.query.billingDocuments.findMany({
    where,
    orderBy: [desc(billingDocuments.issuedAt ?? billingDocuments.createdAt)],
    limit: options?.limit ?? 100,
    offset: options?.offset ?? 0,
    columns: {
      id: true,
      companyId: true,
      type: true,
      provider: true,
      providerDocumentId: true,
      paymentAccountId: true,
      number: true,
      currency: true,
      amountTotal: true,
      amountDue: true,
      status: true,
      dueDate: true,
      issuedAt: true,
      description: true,
      source: true,
      projectId: true,
      paymentId: true,
      subscriptionRecordId: true,
      metadata: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function findBillingDocumentByProviderId(companyId: number, provider: string, providerDocumentId: string) {
  return db.query.billingDocuments.findFirst({
    where: and(
      eq(billingDocuments.companyId, companyId),
      eq(billingDocuments.provider, provider as any),
      eq(billingDocuments.providerDocumentId, providerDocumentId)
    )
  });
}

export async function findBillingDocumentByPaymentId(paymentId: number) {
  return db.query.billingDocuments.findFirst({
    where: eq(billingDocuments.paymentId, paymentId)
  });
}

export async function findBillingDocumentById(id: string) {
  return db.query.billingDocuments.findFirst({
    where: eq(billingDocuments.id, id),
    with: { lineItems: true }
  });
}

export async function createBillingDocument(input: CreateBillingDocumentInput) {
  const [row] = await db
    .insert(billingDocuments)
    .values({
      companyId: input.companyId,
      type: input.type as any,
      provider: input.provider as any,
      providerDocumentId: input.providerDocumentId ?? null,
      paymentAccountId: input.paymentAccountId ?? null,
      number: input.number ?? null,
      currency: input.currency,
      amountTotal: input.amountTotal,
      amountDue: input.amountDue,
      status: input.status as any,
      dueDate: input.dueDate ?? null,
      issuedAt: input.issuedAt ?? null,
      description: input.description ?? null,
      source: input.source as any,
      projectId: input.projectId ?? null,
      paymentId: input.paymentId ?? null,
      subscriptionRecordId: input.subscriptionRecordId ?? null,
      metadata: input.metadata ?? null,
      updatedAt: new Date()
    })
    .returning();
  return row ?? null;
}

/** Idempotente upsert por provider_document_id (para sync Stripe, etc.). */
export async function upsertBillingDocument(input: CreateBillingDocumentInput & { providerDocumentId: string }) {
  const existing = await findBillingDocumentByProviderId(input.companyId, input.provider, input.providerDocumentId);
  if (existing) {
    const existingMeta = (existing.metadata ?? {}) as Record<string, unknown>;
    const inputMeta = (input.metadata ?? {}) as Record<string, unknown>;
    const mergedMetadata = { ...existingMeta, ...inputMeta };
    const [updated] = await db
      .update(billingDocuments)
      .set({
        amountTotal: input.amountTotal,
        amountDue: input.amountDue,
        status: input.status as any,
        dueDate: input.dueDate ?? null,
        issuedAt: input.issuedAt ?? null,
        description: input.description ?? existing.description,
        number: input.number ?? existing.number,
        metadata: mergedMetadata,
        updatedAt: new Date()
      })
      .where(eq(billingDocuments.id, existing.id))
      .returning();
    return updated ?? existing;
  }
  return createBillingDocument(input);
}

export async function updateBillingDocumentAmountDue(id: string, amountDue: number, status?: BillingDocumentStatus) {
  const set: Record<string, unknown> = { amountDue, updatedAt: new Date() };
  if (status != null) set.status = status;
  const [row] = await db.update(billingDocuments).set(set as any).where(eq(billingDocuments.id, id)).returning();
  return row ?? null;
}

/** Update document (manual editing or link payment). */
export async function updateBillingDocument(
  id: string,
  updates: {
    number?: string | null;
    currency?: string | null;
    amountTotal?: number;
    amountDue?: number;
    status?: BillingDocumentStatus;
    dueDate?: Date | null;
    description?: string | null;
    metadata?: Record<string, unknown> | null;
    paymentId?: number | null;
  }
) {
  const [row] = await db
    .update(billingDocuments)
    .set({
      ...(updates.number !== undefined && { number: updates.number }),
      ...(updates.currency !== undefined && { currency: updates.currency }),
      ...(updates.amountTotal !== undefined && { amountTotal: updates.amountTotal }),
      ...(updates.amountDue !== undefined && { amountDue: updates.amountDue }),
      ...(updates.status !== undefined && { status: updates.status as any }),
      ...(updates.dueDate !== undefined && { dueDate: updates.dueDate }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.metadata !== undefined && { metadata: updates.metadata }),
      ...(updates.paymentId !== undefined && { paymentId: updates.paymentId }),
      updatedAt: new Date()
    })
    .where(eq(billingDocuments.id, id))
    .returning();
  return row ?? null;
}

/** Void or delete manual document (only for non-Stripe / manual source). */
export async function deleteBillingDocument(id: string) {
  const [row] = await db.delete(billingDocuments).where(eq(billingDocuments.id, id)).returning({ id: billingDocuments.id });
  return row ?? null;
}
