/**
 * Subscription Records – DAO.
 * Suscripciones de cualquier provider.
 */

import { eq, and, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { subscriptionRecords } from '$lib/server/schema';

export async function findSubscriptionRecordsByCompanyId(companyId: number, paymentAccountId?: string | null) {
  const where = paymentAccountId
    ? and(eq(subscriptionRecords.companyId, companyId), eq(subscriptionRecords.paymentAccountId, paymentAccountId))
    : eq(subscriptionRecords.companyId, companyId);
  return db.query.subscriptionRecords.findMany({
    where,
    orderBy: [desc(subscriptionRecords.currentPeriodEnd)],
    columns: {
      id: true,
      companyId: true,
      provider: true,
      providerSubscriptionId: true,
      paymentAccountId: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      amount: true,
      currency: true,
      metadata: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function findSubscriptionRecordByProviderId(companyId: number, provider: string, providerSubscriptionId: string) {
  return db.query.subscriptionRecords.findFirst({
    where: and(
      eq(subscriptionRecords.companyId, companyId),
      eq(subscriptionRecords.provider, provider as any),
      eq(subscriptionRecords.providerSubscriptionId, providerSubscriptionId)
    )
  });
}

export async function upsertSubscriptionRecord(input: {
  companyId: number;
  provider: string;
  providerSubscriptionId: string;
  paymentAccountId?: string | null;
  status: string;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown> | null;
}) {
  const existing = await findSubscriptionRecordByProviderId(input.companyId, input.provider, input.providerSubscriptionId);
  if (existing) {
    const [updated] = await db
      .update(subscriptionRecords)
      .set({
        paymentAccountId: input.paymentAccountId ?? null,
        status: input.status as any,
        currentPeriodStart: input.currentPeriodStart ?? null,
        currentPeriodEnd: input.currentPeriodEnd ?? null,
        amount: input.amount,
        currency: input.currency,
        metadata: input.metadata ?? existing.metadata,
        updatedAt: new Date()
      })
      .where(eq(subscriptionRecords.id, existing.id))
      .returning();
    return updated ?? existing;
  }
  const [row] = await db
    .insert(subscriptionRecords)
    .values({
      companyId: input.companyId,
      provider: input.provider as any,
      providerSubscriptionId: input.providerSubscriptionId,
      paymentAccountId: input.paymentAccountId ?? null,
      status: input.status as any,
      currentPeriodStart: input.currentPeriodStart ?? null,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      amount: input.amount,
      currency: input.currency,
      metadata: input.metadata ?? null,
      updatedAt: new Date()
    })
    .returning();
  return row ?? null;
}
