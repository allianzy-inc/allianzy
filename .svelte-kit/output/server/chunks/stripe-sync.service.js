import "stripe";
import { getStripe } from "./billing.js";
import { e as findPaymentAccountsByCompanyId } from "./payment-accounts.repository.js";
import { upsertBillingDocument } from "./billing-documents.repository.js";
import { and, eq, desc } from "drizzle-orm";
import { b as subscriptionRecords, d as db } from "./db.js";
async function findSubscriptionRecordsByCompanyId(companyId, paymentAccountId) {
  const where = paymentAccountId ? and(eq(subscriptionRecords.companyId, companyId), eq(subscriptionRecords.paymentAccountId, paymentAccountId)) : eq(subscriptionRecords.companyId, companyId);
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
async function findSubscriptionRecordByProviderId(companyId, provider, providerSubscriptionId) {
  return db.query.subscriptionRecords.findFirst({
    where: and(
      eq(subscriptionRecords.companyId, companyId),
      eq(subscriptionRecords.provider, provider),
      eq(subscriptionRecords.providerSubscriptionId, providerSubscriptionId)
    )
  });
}
async function upsertSubscriptionRecord(input) {
  const existing = await findSubscriptionRecordByProviderId(input.companyId, input.provider, input.providerSubscriptionId);
  if (existing) {
    const [updated] = await db.update(subscriptionRecords).set({
      paymentAccountId: input.paymentAccountId ?? null,
      status: input.status,
      currentPeriodStart: input.currentPeriodStart ?? null,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      amount: input.amount,
      currency: input.currency,
      metadata: input.metadata ?? existing.metadata,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(subscriptionRecords.id, existing.id)).returning();
    return updated ?? existing;
  }
  const [row] = await db.insert(subscriptionRecords).values({
    companyId: input.companyId,
    provider: input.provider,
    providerSubscriptionId: input.providerSubscriptionId,
    paymentAccountId: input.paymentAccountId ?? null,
    status: input.status,
    currentPeriodStart: input.currentPeriodStart ?? null,
    currentPeriodEnd: input.currentPeriodEnd ?? null,
    amount: input.amount,
    currency: input.currency,
    metadata: input.metadata ?? null,
    updatedAt: /* @__PURE__ */ new Date()
  }).returning();
  return row ?? null;
}
const STRIPE_STATUS_TO_DOC = {
  draft: "draft",
  open: "open",
  paid: "paid",
  void: "void",
  uncollectible: "uncollectible",
  uncollectable: "uncollectible"
};
async function syncStripeForCompany(companyId) {
  const stripe = getStripe();
  if (!stripe) {
    return { invoicesSynced: 0, subscriptionsSynced: 0, errors: ["Stripe not configured"] };
  }
  const accounts = await findPaymentAccountsByCompanyId(companyId, "active");
  const stripeAccounts = accounts.filter((a) => a.provider === "stripe" && a.externalId);
  let invoicesSynced = 0;
  let subscriptionsSynced = 0;
  const errors = [];
  for (const acc of stripeAccounts) {
    const externalId = acc.externalId;
    try {
      const invCount = await syncInvoicesForCustomer(companyId, acc.id, externalId, stripe);
      invoicesSynced += invCount;
    } catch (e) {
      errors.push(`Invoices for ${externalId}: ${e?.message ?? e}`);
    }
    try {
      const subCount = await syncSubscriptionsForCustomer(companyId, acc.id, externalId, stripe);
      subscriptionsSynced += subCount;
    } catch (e) {
      errors.push(`Subscriptions for ${externalId}: ${e?.message ?? e}`);
    }
  }
  return { invoicesSynced, subscriptionsSynced, errors };
}
async function syncInvoicesForCustomer(companyId, paymentAccountId, customerId, stripe) {
  let count = 0;
  let hasMore = true;
  let startingAfter;
  while (hasMore) {
    const list = await stripe.invoices.list({
      customer: customerId,
      limit: 100,
      ...startingAfter ? { starting_after: startingAfter } : {},
      expand: ["data.charge"]
    });
    for (const inv of list.data) {
      const status = STRIPE_STATUS_TO_DOC[inv.status ?? ""] ?? "draft";
      const receiptUrl = typeof inv.charge === "object" && inv.charge?.receipt_url ? inv.charge.receipt_url : void 0;
      await upsertBillingDocument({
        companyId,
        type: "invoice",
        provider: "stripe",
        providerDocumentId: inv.id,
        paymentAccountId,
        number: inv.number ?? void 0,
        currency: (inv.currency ?? "usd").toLowerCase(),
        amountTotal: inv.amount_due ?? inv.amount_paid ?? 0,
        amountDue: inv.amount_due ?? 0,
        status,
        dueDate: inv.due_date ? new Date(inv.due_date * 1e3) : null,
        issuedAt: inv.created ? new Date(inv.created * 1e3) : null,
        description: inv.description ?? inv.number ?? void 0,
        source: "subscription",
        projectId: null,
        subscriptionRecordId: null,
        metadata: {
          hosted_invoice_url: inv.hosted_invoice_url,
          invoice_pdf: inv.invoice_pdf,
          receipt_url: receiptUrl
        }
      });
      count++;
    }
    hasMore = list.has_more && list.data.length > 0;
    if (hasMore && list.data.length) startingAfter = list.data[list.data.length - 1].id;
    else hasMore = false;
  }
  return count;
}
async function syncSubscriptionsForCustomer(companyId, paymentAccountId, customerId, stripe) {
  let count = 0;
  let hasMore = true;
  let startingAfter;
  while (hasMore) {
    const list = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100,
      ...startingAfter ? { starting_after: startingAfter } : {},
      expand: ["data.items.data.price"]
    });
    for (const sub of list.data) {
      const item = sub.items?.data?.[0];
      const price = item?.price;
      const amount = price?.unit_amount ?? 0;
      const currency = (price?.currency ?? sub.currency ?? "usd").toLowerCase();
      await upsertSubscriptionRecord({
        companyId,
        provider: "stripe",
        providerSubscriptionId: sub.id,
        paymentAccountId,
        status: sub.status ?? "active",
        currentPeriodStart: sub.current_period_start ? new Date(sub.current_period_start * 1e3) : null,
        currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1e3) : null,
        amount,
        currency,
        metadata: { price_nickname: price?.nickname }
      });
      count++;
    }
    hasMore = list.has_more && list.data.length > 0;
    if (hasMore && list.data.length) startingAfter = list.data[list.data.length - 1].id;
    else hasMore = false;
  }
  return count;
}
export {
  findSubscriptionRecordsByCompanyId as f,
  syncStripeForCompany as s
};
