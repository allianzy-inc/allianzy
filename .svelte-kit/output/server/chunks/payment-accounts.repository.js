import { and, eq, desc, inArray } from "drizzle-orm";
import { d as db, k as paymentAccounts } from "./db.js";
async function findPaymentAccountsByCompanyId(companyId, status) {
  const conditions = and(eq(paymentAccounts.companyId, companyId), eq(paymentAccounts.status, status));
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
async function findPaymentAccountsByIds(ids) {
  if (ids.length === 0) return [];
  return db.query.paymentAccounts.findMany({
    where: inArray(paymentAccounts.id, ids),
    columns: { id: true, provider: true, externalId: true }
  });
}
async function findPaymentAccountByCompanyAndExternalId(companyId, provider, externalId) {
  return db.query.paymentAccounts.findFirst({
    where: and(
      eq(paymentAccounts.companyId, companyId),
      eq(paymentAccounts.provider, provider),
      eq(paymentAccounts.externalId, externalId)
    )
  });
}
async function findOrCreateManualProviderAccount(companyId, provider, label) {
  const externalId = provider;
  const existing = await findPaymentAccountByCompanyAndExternalId(companyId, provider, externalId);
  if (existing) return existing.id;
  const row = await createPaymentAccount({
    companyId,
    provider,
    label,
    externalId,
    status: "active",
    isDefault: false
  });
  if (!row) throw new Error("Failed to create payment account");
  return row.id;
}
async function createPaymentAccount(input) {
  const [row] = await db.insert(paymentAccounts).values({
    companyId: input.companyId,
    provider: input.provider,
    label: input.label,
    externalId: input.externalId ?? null,
    status: input.status ?? "active",
    isDefault: input.isDefault ?? false,
    metadata: input.metadata ?? null,
    updatedAt: /* @__PURE__ */ new Date()
  }).returning({
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
async function setDefaultPaymentAccount(companyId, accountId) {
  await db.update(paymentAccounts).set({ isDefault: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq(paymentAccounts.companyId, companyId));
  await db.update(paymentAccounts).set({ isDefault: true, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(paymentAccounts.id, accountId), eq(paymentAccounts.companyId, companyId)));
}
async function archivePaymentAccount(id, companyId) {
  await db.update(paymentAccounts).set({ status: "archived", updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(paymentAccounts.id, id), eq(paymentAccounts.companyId, companyId)));
}
export {
  findPaymentAccountsByIds as a,
  findPaymentAccountByCompanyAndExternalId as b,
  createPaymentAccount as c,
  archivePaymentAccount as d,
  findPaymentAccountsByCompanyId as e,
  findOrCreateManualProviderAccount as f,
  setDefaultPaymentAccount as s
};
