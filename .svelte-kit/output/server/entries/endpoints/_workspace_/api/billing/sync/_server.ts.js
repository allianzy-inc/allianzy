import { json } from "@sveltejs/kit";
import { getBillingCompanyId } from "../../../../../../chunks/billing.js";
import { g as getBillingContext } from "../../../../../../chunks/resolve-context.js";
import { s as syncStripeForCompany } from "../../../../../../chunks/stripe-sync.service.js";
const SYNC_COOLDOWN_MS = 2 * 60 * 1e3;
const lastSyncByCompany = {};
const POST = async (event) => {
  const ctx = await getBillingContext(event);
  const companyId = ctx?.companyId ?? await getBillingCompanyId(event);
  if (companyId == null) {
    return json({ error: "Unauthorized or company required" }, { status: 400 });
  }
  const now = Date.now();
  if (lastSyncByCompany[companyId] && now - lastSyncByCompany[companyId] < SYNC_COOLDOWN_MS) {
    return json({ ok: true, cached: true, message: "Sync skipped (cooldown)" });
  }
  try {
    const result = await syncStripeForCompany(companyId);
    lastSyncByCompany[companyId] = now;
    return json({
      ok: true,
      invoicesSynced: result.invoicesSynced,
      subscriptionsSynced: result.subscriptionsSynced,
      errors: result.errors
    });
  } catch (err) {
    console.error("[billing/sync] error:", err?.message ?? err);
    return json({ error: err?.message ?? "Sync failed" }, { status: 500 });
  }
};
export {
  POST
};
