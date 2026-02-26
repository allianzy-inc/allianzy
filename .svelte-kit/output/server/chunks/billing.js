import Stripe from "stripe";
import { b as private_env } from "./shared-server.js";
import { d as db, c as companies } from "./db.js";
import { eq } from "drizzle-orm";
let stripeInstance = null;
function getStripe() {
  const secret = private_env.STRIPE_SECRET_KEY;
  if (!secret?.startsWith("sk_")) {
    return null;
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(secret);
  }
  return stripeInstance;
}
function normalizeStripeAccounts(raw, legacyCustomerId) {
  const arr = Array.isArray(raw) ? raw : [];
  const valid = arr.filter(
    (x) => typeof x === "object" && x !== null && typeof x.customerId === "string"
  );
  const entries = valid.map((x) => ({
    customerId: String(x.customerId).trim(),
    isDefault: Boolean(x.isDefault)
  })).filter((e) => e.customerId.startsWith("cus_"));
  if (entries.length > 0) {
    const hasDefault = entries.some((e) => e.isDefault);
    if (!hasDefault) entries[0].isDefault = true;
    return entries;
  }
  if (legacyCustomerId?.trim().startsWith("cus_")) {
    return [{ customerId: legacyCustomerId.trim(), isDefault: true }];
  }
  return [];
}
async function getBillingCompany(event) {
  const user = event.locals.user;
  if (!user?.id) return null;
  const url = event.url;
  const queryCompanyId = url.searchParams.get("companyId");
  const queryCustomerId = url.searchParams.get("stripeCustomerId")?.trim();
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
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
    columns: { id: true, stripeCustomerId: true, stripeAccounts: true }
  });
  const legacyId = company.stripeCustomerId?.trim() ?? null;
  const accounts = normalizeStripeAccounts(company.stripeAccounts, legacyId);
  if (accounts.length === 0) return null;
  const selected = queryCustomerId && accounts.some((a) => a.customerId === queryCustomerId) ? queryCustomerId : accounts.find((a) => a.isDefault)?.customerId ?? accounts[0].customerId;
  return {
    companyId: company.id,
    stripeCustomerId: selected,
    accounts
  };
}
async function getBillingCompanyId(event) {
  const user = event.locals.user;
  if (!user?.id) return null;
  const url = event.url;
  const queryCompanyId = url.searchParams.get("companyId");
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
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
    columns: { id: true }
  });
  return company?.id ?? null;
}
export {
  getBillingCompany,
  getBillingCompanyId,
  getStripe
};
