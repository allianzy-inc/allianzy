/**
 * Billing Domain – servicios de negocio.
 * Crear documento, registrar pago, conciliación (actualizar amount_due).
 */

import type { BillingDocumentStatus } from './types';
import * as billingDocsRepo from './billing-documents.repository';
import * as paymentTxRepo from './payment-transactions.repository';
import type { CreateBillingDocumentInput, CreatePaymentTransactionInput } from './types';

/** Crea un documento de cobro (manual o desde proyecto). */
export async function createBillingDocument(input: CreateBillingDocumentInput) {
  return billingDocsRepo.createBillingDocument(input);
}

/** Registra un pago (transacción) y actualiza amount_due del documento. Idempotente por provider_payment_id si se desea. */
export async function recordPayment(input: CreatePaymentTransactionInput & { billingDocumentId: string }) {
  const tx = await paymentTxRepo.createPaymentTransaction({
    ...input,
    billingDocumentId: input.billingDocumentId
  });
  if (!tx) return null;
  await reconcileDocumentAmountDue(input.billingDocumentId);
  return tx;
}

/** Recalcula amount_due del documento a partir de la suma de transacciones succeeded y actualiza status si aplica. */
export async function reconcileDocumentAmountDue(billingDocumentId: string): Promise<void> {
  const doc = await billingDocsRepo.findBillingDocumentById(billingDocumentId);
  if (!doc) return;
  const paidTotal = await paymentTxRepo.sumSucceededTransactionsByDocumentId(billingDocumentId);
  const amountDue = Math.max(0, doc.amountTotal - paidTotal);
  const newStatus: BillingDocumentStatus = amountDue <= 0 ? 'paid' : (doc.status === 'paid' ? 'open' : doc.status);
  await billingDocsRepo.updateBillingDocumentAmountDue(billingDocumentId, amountDue, newStatus);
}

/** Marca un documento como pagado manualmente (crea una transacción manual y reconcilia). */
export async function recordManualPayment(
  billingDocumentId: string,
  input: { companyId: number; amount: number; currency: string; paidAt?: Date | null }
) {
  const tx = await paymentTxRepo.createPaymentTransaction({
    companyId: input.companyId,
    billingDocumentId,
    provider: 'manual',
    amount: input.amount,
    currency: input.currency,
    status: 'succeeded',
    paidAt: input.paidAt ?? new Date()
  });
  if (tx) await reconcileDocumentAmountDue(billingDocumentId);
  return tx;
}
