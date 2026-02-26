/**
 * Payment Transactions – DAO.
 * Pagos/transferencias; soporta parciales y conciliación.
 */

import { eq, and, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { paymentTransactions } from '$lib/server/schema';
import type { CreatePaymentTransactionInput } from './types';

export async function findPaymentTransactionsByDocumentId(billingDocumentId: string) {
  return db.query.paymentTransactions.findMany({
    where: eq(paymentTransactions.billingDocumentId, billingDocumentId),
    orderBy: [desc(paymentTransactions.paidAt ?? paymentTransactions.createdAt)],
    columns: {
      id: true,
      companyId: true,
      billingDocumentId: true,
      provider: true,
      paymentAccountId: true,
      providerPaymentId: true,
      amount: true,
      currency: true,
      status: true,
      paidAt: true,
      raw: true,
      createdAt: true
    }
  });
}

export async function findPaymentTransactionsByCompanyId(companyId: number, limit = 100) {
  return db.query.paymentTransactions.findMany({
    where: eq(paymentTransactions.companyId, companyId),
    orderBy: [desc(paymentTransactions.createdAt)],
    limit,
    columns: {
      id: true,
      companyId: true,
      billingDocumentId: true,
      provider: true,
      paymentAccountId: true,
      providerPaymentId: true,
      amount: true,
      currency: true,
      status: true,
      paidAt: true,
      createdAt: true
    }
  });
}

export async function createPaymentTransaction(input: CreatePaymentTransactionInput) {
  const [row] = await db
    .insert(paymentTransactions)
    .values({
      companyId: input.companyId,
      billingDocumentId: input.billingDocumentId ?? null,
      provider: input.provider as any,
      paymentAccountId: input.paymentAccountId ?? null,
      providerPaymentId: input.providerPaymentId ?? null,
      amount: input.amount,
      currency: input.currency,
      status: input.status as any,
      paidAt: input.paidAt ?? null,
      raw: input.raw ?? null
    })
    .returning();
  return row ?? null;
}

export async function sumSucceededTransactionsByDocumentId(billingDocumentId: string): Promise<number> {
  const rows = await db
    .select({ total: paymentTransactions.amount })
    .from(paymentTransactions)
    .where(and(eq(paymentTransactions.billingDocumentId, billingDocumentId), eq(paymentTransactions.status, 'succeeded')));
  return rows.reduce((sum, r) => sum + Number(r.total), 0);
}
