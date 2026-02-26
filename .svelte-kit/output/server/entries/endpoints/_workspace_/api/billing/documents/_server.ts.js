import { json } from "@sveltejs/kit";
import "stripe";
import "../../../../../../chunks/db.js";
import { c as createBillingDocument } from "../../../../../../chunks/billing.service.js";
import { f as findOrCreateManualProviderAccount } from "../../../../../../chunks/payment-accounts.repository.js";
import { f as findProviderConfigByCode } from "../../../../../../chunks/provider-config.repository.js";
function isAdmin(event) {
  return String(event.locals.user?.role ?? "").toLowerCase() === "admin";
}
const POST = async (event) => {
  if (!isAdmin(event)) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  let body;
  try {
    body = await event.request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }
  const companyId = typeof body.companyId === "number" ? body.companyId : parseInt(String(body.companyId), 10);
  if (isNaN(companyId)) {
    return json({ error: "companyId required" }, { status: 400 });
  }
  const provider = String(body.provider ?? "").toLowerCase().replace(/\s+/g, "_");
  if (!provider || provider === "stripe") {
    return json({ error: "provider requerido (cualquier método de pago manual, no Stripe)" }, { status: 400 });
  }
  const amountTotal = Math.round(Number(body.amountTotal) || 0);
  const amountDue = Math.round(Number(body.amountDue) ?? amountTotal);
  if (amountTotal < 0) {
    return json({ error: "amountTotal must be >= 0" }, { status: 400 });
  }
  const currency = (body.currency ?? "usd").toLowerCase();
  const dueDate = body.dueDate ? new Date(body.dueDate) : null;
  const status = body.status ?? "open";
  const providerConfig = await findProviderConfigByCode(provider);
  const label = providerConfig?.label ?? provider;
  const paymentAccountId = await findOrCreateManualProviderAccount(companyId, provider, label);
  const doc = await createBillingDocument({
    companyId,
    type: "invoice",
    provider,
    source: "manual",
    paymentAccountId,
    number: body.number ?? null,
    currency,
    amountTotal,
    amountDue,
    status,
    dueDate,
    description: body.description ?? null,
    issuedAt: /* @__PURE__ */ new Date()
  });
  return json({ ok: true, document: doc });
};
export {
  POST
};
