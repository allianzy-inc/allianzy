import { json } from "@sveltejs/kit";
import { d as db, c as companies } from "../../../../../../chunks/db.js";
import { eq } from "drizzle-orm";
import { b as findPaymentAccountByCompanyAndExternalId, c as createPaymentAccount, s as setDefaultPaymentAccount, d as archivePaymentAccount } from "../../../../../../chunks/payment-accounts.repository.js";
const POST = async (event) => {
  if (String(event.locals.user?.role ?? "").toLowerCase() !== "admin") {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  let body;
  try {
    body = await event.request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }
  const companyId = typeof body.companyId === "number" ? body.companyId : parseInt(String(body.companyId ?? ""), 10);
  if (isNaN(companyId)) {
    return json({ error: "companyId required" }, { status: 400 });
  }
  const raw = body.stripeCustomerId != null ? String(body.stripeCustomerId).trim() : "";
  const action = body.action ?? (raw ? "add" : void 0);
  const row = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
    columns: { stripeAccounts: true, stripeCustomerId: true }
  });
  const legacy = row?.stripeCustomerId?.trim() ?? null;
  let accounts = Array.isArray(row?.stripeAccounts) ? row.stripeAccounts.filter(
    (x) => typeof x === "object" && x !== null && typeof x.customerId === "string"
  ) : [];
  if (accounts.length === 0 && legacy?.startsWith("cus_")) {
    accounts = [{ customerId: legacy, isDefault: true }];
  }
  accounts = accounts.map((x) => ({
    customerId: String(x.customerId).trim(),
    isDefault: Boolean(x.isDefault)
  })).filter((a) => a.customerId.startsWith("cus_"));
  if (action === "remove") {
    if (!raw) return json({ error: "stripeCustomerId required to remove" }, { status: 400 });
    accounts = accounts.filter((a) => a.customerId !== raw);
    if (accounts.length > 0 && !accounts.some((a) => a.isDefault)) accounts[0].isDefault = true;
  } else if (action === "setDefault") {
    if (!raw) return json({ error: "stripeCustomerId required" }, { status: 400 });
    if (!raw.startsWith("cus_")) return json({ error: "stripeCustomerId must be cus_..." }, { status: 400 });
    const idx = accounts.findIndex((a) => a.customerId === raw);
    if (idx === -1) return json({ error: "Account not found in list" }, { status: 400 });
    accounts.forEach((a) => a.isDefault = a.customerId === raw);
  } else if (action === "add" || !action && raw) {
    if (!raw.startsWith("cus_")) return json({ error: "stripeCustomerId must be a Stripe customer ID (cus_...)" }, { status: 400 });
    const existing = accounts.findIndex((a) => a.customerId === raw);
    if (existing >= 0) {
      if (body.setAsDefault) accounts.forEach((a) => a.isDefault = a.customerId === raw);
    } else {
      const isDefault = body.setAsDefault ?? accounts.length === 0;
      if (isDefault) accounts.forEach((a) => a.isDefault = false);
      accounts.push({ customerId: raw, isDefault });
    }
  } else {
    return json({ error: "stripeCustomerId or action required" }, { status: 400 });
  }
  const payload = accounts.length > 0 ? accounts : [];
  const defaultId = accounts.find((a) => a.isDefault)?.customerId ?? null;
  await db.update(companies).set({
    stripeAccounts: payload,
    stripeCustomerId: defaultId ?? (payload.length ? payload[0].customerId : null),
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(companies.id, companyId));
  if (action === "add" && raw) {
    const existing = await findPaymentAccountByCompanyAndExternalId(companyId, "stripe", raw);
    if (!existing) {
      await createPaymentAccount({
        companyId,
        provider: "stripe",
        label: payload.length > 1 ? `Stripe ${payload.findIndex((a) => a.customerId === raw) + 1}` : "Stripe principal",
        externalId: raw,
        status: "active",
        isDefault: payload.find((a) => a.customerId === raw)?.isDefault ?? false
      });
    } else if (body.setAsDefault) {
      await setDefaultPaymentAccount(companyId, existing.id);
    }
  } else if (action === "remove" && raw) {
    const acc = await findPaymentAccountByCompanyAndExternalId(companyId, "stripe", raw);
    if (acc) await archivePaymentAccount(acc.id, companyId);
  } else if (action === "setDefault" && raw) {
    const acc = await findPaymentAccountByCompanyAndExternalId(companyId, "stripe", raw);
    if (acc) await setDefaultPaymentAccount(companyId, acc.id);
  }
  return json({ ok: true, accounts: payload });
};
export {
  POST
};
