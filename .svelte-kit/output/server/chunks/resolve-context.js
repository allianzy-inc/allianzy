import { d as db, c as companies } from "./db.js";
import { eq } from "drizzle-orm";
import { e as findPaymentAccountsByCompanyId } from "./payment-accounts.repository.js";
function normalizeLegacyAccounts(raw, legacyCustomerId) {
  const arr = Array.isArray(raw) ? raw : [];
  const valid = arr.filter(
    (x) => typeof x === "object" && x !== null && typeof x.customerId === "string"
  );
  const entries = valid.map((x) => ({
    customerId: String(x.customerId).trim(),
    isDefault: Boolean(x.isDefault)
  })).filter((e) => e.customerId.startsWith("cus_"));
  if (entries.length > 0) {
    if (!entries.some((e) => e.isDefault)) entries[0].isDefault = true;
    return entries;
  }
  if (legacyCustomerId?.trim().startsWith("cus_")) {
    return [{ customerId: legacyCustomerId.trim(), isDefault: true }];
  }
  return [];
}
async function getBillingContext(event) {
  const user = event.locals.user;
  if (!user?.id) return null;
  const url = event.url;
  const queryCompanyId = url.searchParams.get("companyId");
  const queryCustomerId = url.searchParams.get("stripeCustomerId")?.trim();
  const queryPaymentAccountId = url.searchParams.get("paymentAccountId")?.trim();
  const isAdmin = String(user.role ?? "").toLowerCase() === "admin";
  let companyId = null;
  if (isAdmin && queryCompanyId) {
    const id = parseInt(queryCompanyId, 10);
    if (!isNaN(id)) companyId = id;
  }
  if (companyId == null && user.companyId != null) {
    companyId = typeof user.companyId === "number" ? user.companyId : parseInt(String(user.companyId), 10);
  }
  if (companyId == null || isNaN(companyId)) return null;
  const dbAccounts = await findPaymentAccountsByCompanyId(companyId, "active");
  if (dbAccounts.length > 0) {
    const accounts = dbAccounts.map((a) => ({
      customerId: a.externalId ?? a.id,
      // Stripe: cus_xxx; otros: externalId o id
      isDefault: a.isDefault,
      paymentAccountId: a.id,
      provider: a.provider,
      label: a.label
    }));
    let selectedPaymentAccountId = null;
    let selectedCustomerId2 = null;
    if (queryPaymentAccountId && accounts.some((a) => a.paymentAccountId === queryPaymentAccountId)) {
      selectedPaymentAccountId = queryPaymentAccountId;
      selectedCustomerId2 = accounts.find((a) => a.paymentAccountId === queryPaymentAccountId)?.customerId ?? null;
    } else if (queryCustomerId && accounts.some((a) => a.customerId === queryCustomerId)) {
      selectedCustomerId2 = queryCustomerId;
      selectedPaymentAccountId = accounts.find((a) => a.customerId === queryCustomerId)?.paymentAccountId ?? null;
    } else {
      const defaultAcc = accounts.find((a) => a.isDefault) ?? accounts[0];
      selectedPaymentAccountId = defaultAcc?.paymentAccountId ?? null;
      selectedCustomerId2 = defaultAcc?.customerId ?? null;
    }
    return {
      companyId,
      selectedPaymentAccountId,
      selectedCustomerId: selectedCustomerId2,
      accounts,
      linked: true
    };
  }
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
    columns: { id: true, stripeCustomerId: true, stripeAccounts: true }
  });
  const legacyId = company?.stripeCustomerId?.trim() ?? null;
  const legacyAccounts = normalizeLegacyAccounts(company?.stripeAccounts, legacyId);
  if (legacyAccounts.length === 0) {
    return { companyId, selectedPaymentAccountId: null, selectedCustomerId: null, accounts: [], linked: false };
  }
  const selectedCustomerId = queryCustomerId && legacyAccounts.some((a) => a.customerId === queryCustomerId) ? queryCustomerId : legacyAccounts.find((a) => a.isDefault)?.customerId ?? legacyAccounts[0].customerId;
  return {
    companyId,
    selectedPaymentAccountId: null,
    // legacy: no tenemos uuid
    selectedCustomerId,
    accounts: legacyAccounts.map((a) => ({
      customerId: a.customerId,
      isDefault: a.isDefault,
      paymentAccountId: "",
      // legacy
      provider: "stripe",
      label: "Stripe"
    })),
    linked: true
  };
}
export {
  getBillingContext as g
};
