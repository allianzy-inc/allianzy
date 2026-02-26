import { eq, and, desc } from "drizzle-orm";
import { d as db, m as billingDocuments } from "./db.js";
async function findBillingDocumentsByCompanyId(companyId, options) {
  const conditions = [eq(billingDocuments.companyId, companyId)];
  if (options?.paymentAccountId) conditions.push(eq(billingDocuments.paymentAccountId, options.paymentAccountId));
  if (options?.provider) conditions.push(eq(billingDocuments.provider, options.provider));
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
async function findBillingDocumentByProviderId(companyId, provider, providerDocumentId) {
  return db.query.billingDocuments.findFirst({
    where: and(
      eq(billingDocuments.companyId, companyId),
      eq(billingDocuments.provider, provider),
      eq(billingDocuments.providerDocumentId, providerDocumentId)
    )
  });
}
async function findBillingDocumentByPaymentId(paymentId) {
  return db.query.billingDocuments.findFirst({
    where: eq(billingDocuments.paymentId, paymentId)
  });
}
async function findBillingDocumentById(id) {
  return db.query.billingDocuments.findFirst({
    where: eq(billingDocuments.id, id),
    with: { lineItems: true }
  });
}
async function createBillingDocument(input) {
  const [row] = await db.insert(billingDocuments).values({
    companyId: input.companyId,
    type: input.type,
    provider: input.provider,
    providerDocumentId: input.providerDocumentId ?? null,
    paymentAccountId: input.paymentAccountId ?? null,
    number: input.number ?? null,
    currency: input.currency,
    amountTotal: input.amountTotal,
    amountDue: input.amountDue,
    status: input.status,
    dueDate: input.dueDate ?? null,
    issuedAt: input.issuedAt ?? null,
    description: input.description ?? null,
    source: input.source,
    projectId: input.projectId ?? null,
    paymentId: input.paymentId ?? null,
    subscriptionRecordId: input.subscriptionRecordId ?? null,
    metadata: input.metadata ?? null,
    updatedAt: /* @__PURE__ */ new Date()
  }).returning();
  return row ?? null;
}
async function upsertBillingDocument(input) {
  const existing = await findBillingDocumentByProviderId(input.companyId, input.provider, input.providerDocumentId);
  if (existing) {
    const [updated] = await db.update(billingDocuments).set({
      amountTotal: input.amountTotal,
      amountDue: input.amountDue,
      status: input.status,
      dueDate: input.dueDate ?? null,
      issuedAt: input.issuedAt ?? null,
      description: input.description ?? existing.description,
      number: input.number ?? existing.number,
      metadata: input.metadata ?? existing.metadata,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(billingDocuments.id, existing.id)).returning();
    return updated ?? existing;
  }
  return createBillingDocument(input);
}
async function updateBillingDocumentAmountDue(id, amountDue, status) {
  const set = { amountDue, updatedAt: /* @__PURE__ */ new Date() };
  if (status != null) set.status = status;
  const [row] = await db.update(billingDocuments).set(set).where(eq(billingDocuments.id, id)).returning();
  return row ?? null;
}
async function updateBillingDocument(id, updates) {
  const [row] = await db.update(billingDocuments).set({
    ...updates.number !== void 0 && { number: updates.number },
    ...updates.amountTotal !== void 0 && { amountTotal: updates.amountTotal },
    ...updates.amountDue !== void 0 && { amountDue: updates.amountDue },
    ...updates.status !== void 0 && { status: updates.status },
    ...updates.dueDate !== void 0 && { dueDate: updates.dueDate },
    ...updates.description !== void 0 && { description: updates.description },
    ...updates.metadata !== void 0 && { metadata: updates.metadata },
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(billingDocuments.id, id)).returning();
  return row ?? null;
}
async function deleteBillingDocument(id) {
  const [row] = await db.delete(billingDocuments).where(eq(billingDocuments.id, id)).returning({ id: billingDocuments.id });
  return row ?? null;
}
export {
  createBillingDocument,
  deleteBillingDocument,
  findBillingDocumentById,
  findBillingDocumentByPaymentId,
  findBillingDocumentByProviderId,
  findBillingDocumentsByCompanyId,
  updateBillingDocument,
  updateBillingDocumentAmountDue,
  upsertBillingDocument
};
