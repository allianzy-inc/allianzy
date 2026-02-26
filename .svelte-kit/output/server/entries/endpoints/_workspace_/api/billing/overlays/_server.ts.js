import { json } from "@sveltejs/kit";
import { getBillingCompanyId } from "../../../../../../chunks/billing.js";
import { d as db, c as companies } from "../../../../../../chunks/db.js";
import { eq } from "drizzle-orm";
const GET = async (event) => {
  const companyId = await getBillingCompanyId(event);
  if (companyId == null) {
    return json({ overlays: {} });
  }
  const row = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
    columns: { invoiceOverlays: true }
  });
  const raw = row?.invoiceOverlays;
  const overlays = typeof raw === "object" && raw !== null && !Array.isArray(raw) ? raw : {};
  return json({ overlays });
};
const POST = async (event) => {
  const user = event.locals.user;
  if (!user?.id) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await event.request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }
  const stripeInvoiceId = body.stripeInvoiceId?.trim();
  if (!stripeInvoiceId) {
    return json({ error: "stripeInvoiceId required" }, { status: 400 });
  }
  const isAdmin = String(user.role ?? "").toLowerCase() === "admin";
  let companyId = null;
  if (body.companyId != null) {
    if (!isAdmin) {
      return json({ error: "Forbidden" }, { status: 403 });
    }
    companyId = typeof body.companyId === "number" ? body.companyId : parseInt(String(body.companyId), 10);
    if (isNaN(companyId)) companyId = null;
  }
  if (companyId == null) {
    companyId = await getBillingCompanyId(event);
  }
  if (companyId == null) {
    return json({ error: "Company context required" }, { status: 400 });
  }
  const overlay = body.overlay;
  if (!overlay || !Array.isArray(overlay.items)) {
    return json({ error: "overlay.items required" }, { status: 400 });
  }
  const items = overlay.items.map((item) => ({
    id: String(item.id),
    label: String(item.label ?? ""),
    amount: Number(item.amount) || 0
  }));
  const payload = {
    title: overlay.title != null ? String(overlay.title) : void 0,
    items
  };
  const row = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
    columns: { invoiceOverlays: true }
  });
  const existing = row?.invoiceOverlays;
  const map = typeof existing === "object" && existing !== null && !Array.isArray(existing) ? { ...existing } : {};
  map[stripeInvoiceId] = payload;
  await db.update(companies).set({ invoiceOverlays: map, updatedAt: /* @__PURE__ */ new Date() }).where(eq(companies.id, companyId));
  return json({ ok: true });
};
export {
  GET,
  POST
};
