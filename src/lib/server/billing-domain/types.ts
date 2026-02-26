/**
 * Billing Domain – tipos (provider-agnostic).
 * Todos los montos en minor units (centavos).
 */

export type BillingProvider = 'stripe' | 'mercadopago' | 'paypal' | 'payoneer' | 'bank' | 'manual';
export type PaymentAccountStatus = 'active' | 'archived';
export type BillingDocumentType = 'invoice' | 'receipt' | 'credit_note';
export type BillingDocumentStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible' | 'canceled';
export type BillingDocumentSource = 'project' | 'subscription' | 'manual' | 'import';
export type PaymentTransactionStatus = 'pending' | 'succeeded' | 'failed' | 'refunded' | 'canceled';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';

export interface PaymentAccount {
  id: string;
  companyId: number;
  provider: BillingProvider;
  label: string;
  externalId: string | null;
  status: PaymentAccountStatus;
  isDefault: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingDocument {
  id: string;
  companyId: number;
  type: BillingDocumentType;
  provider: BillingProvider;
  providerDocumentId: string | null;
  paymentAccountId: string | null;
  number: string | null;
  currency: string;
  amountTotal: number;
  amountDue: number;
  status: BillingDocumentStatus;
  dueDate: Date | null;
  issuedAt: Date | null;
  description: string | null;
  source: BillingDocumentSource;
  projectId: number | null;
  subscriptionRecordId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingLineItem {
  id: string;
  billingDocumentId: string;
  name: string;
  description: string | null;
  quantity: string;
  unitAmount: number;
  amount: number;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface PaymentTransaction {
  id: string;
  companyId: number;
  billingDocumentId: string | null;
  provider: BillingProvider;
  paymentAccountId: string | null;
  providerPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentTransactionStatus;
  paidAt: Date | null;
  raw: Record<string, unknown> | null;
  createdAt: Date;
}

export interface SubscriptionRecord {
  id: string;
  companyId: number;
  provider: BillingProvider;
  providerSubscriptionId: string | null;
  paymentAccountId: string | null;
  status: SubscriptionStatus;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  amount: number;
  currency: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

/** DTOs para creación/actualización */
export interface CreatePaymentAccountInput {
  companyId: number;
  provider: BillingProvider;
  label: string;
  externalId?: string | null;
  status?: PaymentAccountStatus;
  isDefault?: boolean;
  metadata?: Record<string, unknown> | null;
}

export interface CreateBillingDocumentInput {
  companyId: number;
  type: BillingDocumentType;
  provider: BillingProvider;
  providerDocumentId?: string | null;
  paymentAccountId?: string | null;
  number?: string | null;
  currency: string;
  amountTotal: number;
  amountDue: number;
  status: BillingDocumentStatus;
  dueDate?: Date | null;
  issuedAt?: Date | null;
  description?: string | null;
  source: BillingDocumentSource;
  projectId?: number | null;
  paymentId?: number | null;
  subscriptionRecordId?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface CreatePaymentTransactionInput {
  companyId: number;
  billingDocumentId?: string | null;
  provider: BillingProvider;
  paymentAccountId?: string | null;
  providerPaymentId?: string | null;
  amount: number;
  currency: string;
  status: PaymentTransactionStatus;
  paidAt?: Date | null;
  raw?: Record<string, unknown> | null;
}

export interface UpsertBillingDocumentInput extends CreateBillingDocumentInput {
  /** Si se proporciona, idempotente por provider_document_id. */
  providerDocumentId?: string | null;
}
