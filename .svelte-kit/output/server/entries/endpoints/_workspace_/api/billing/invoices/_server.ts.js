import { json } from "@sveltejs/kit";
import { g as getBillingContext } from "../../../../../../chunks/resolve-context.js";
import { findBillingDocumentsByCompanyId } from "../../../../../../chunks/billing-documents.repository.js";
import { a as findPaymentAccountsByIds } from "../../../../../../chunks/payment-accounts.repository.js";
import { f as findProviderConfigByCode } from "../../../../../../chunks/provider-config.repository.js";
import { s as syncStripeForCompany } from "../../../../../../chunks/stripe-sync.service.js";
import { getBillingCompany, getStripe } from "../../../../../../chunks/billing.js";
import { d as db, s as services, p as projects } from "../../../../../../chunks/db.js";
import { eq, inArray } from "drizzle-orm";
function accountCodeForDisplay(paymentAccountId, account) {
  if (!paymentAccountId || !account) return void 0;
  if (account.provider === "stripe" && account.externalId) return account.externalId;
  return paymentAccountId.replace(/-/g, "").slice(0, 8).toUpperCase();
}
function mapDocumentToInvoiceShape(doc, projectInfo, providerDetails, accountCode, resolvedProvider) {
  const provider = resolvedProvider ?? doc.provider;
  const meta = doc.metadata ?? {};
  return {
    id: doc.providerDocumentId ?? doc.id,
    documentId: doc.id,
    provider,
    account_code: accountCode ?? void 0,
    provider_details: Array.isArray(providerDetails) && providerDetails.length > 0 ? providerDetails : void 0,
    number: doc.number ?? void 0,
    amount_due: doc.amountDue,
    amount_paid: doc.amountTotal - doc.amountDue,
    status: doc.status,
    due_date: doc.dueDate?.toISOString(),
    hosted_invoice_url: meta.hosted_invoice_url,
    invoice_pdf: meta.invoice_pdf,
    receipt_url: meta.receipt_url,
    proof_url: meta.proof_url,
    proof_uploaded_at: meta.proof_uploaded_at,
    currency: doc.currency,
    created: doc.issuedAt?.toISOString() ?? void 0,
    description: doc.description ?? void 0,
    projectName: projectInfo?.projectName,
    serviceName: projectInfo?.serviceName
  };
}
async function getProviderDetailsMap(codes) {
  const map = {};
  for (const code of codes) {
    if (!code || code === "stripe") continue;
    const config = await findProviderConfigByCode(code);
    const details = Array.isArray(config?.details) ? config.details : [];
    map[code] = details.filter((d) => d && typeof d.label === "string" && typeof d.value === "string");
  }
  return map;
}
async function getProjectInfoMap(projectIds) {
  if (projectIds.length === 0) return {};
  const rows = await db.select({
    id: projects.id,
    projectName: projects.name,
    serviceName: services.name
  }).from(projects).leftJoin(services, eq(projects.serviceId, services.id)).where(inArray(projects.id, projectIds));
  return Object.fromEntries(rows.map((r) => [r.id, { projectName: r.projectName ?? "", serviceName: r.serviceName ?? null }]));
}
async function getAccountMaps(docs) {
  const ids = [...new Set(docs.map((d) => d.paymentAccountId).filter(Boolean))];
  const codeMap = {};
  const providerMap = {};
  if (ids.length === 0) return { codeMap, providerMap };
  const accounts = await findPaymentAccountsByIds(ids);
  const byId = Object.fromEntries(accounts.map((a) => [a.id, a]));
  for (const id of ids) {
    const acc = byId[id];
    const code = accountCodeForDisplay(id, acc ?? null);
    if (code) codeMap[id] = code;
    if (acc?.provider) providerMap[id] = acc.provider;
  }
  return { codeMap, providerMap };
}
const GET = async (event) => {
  const url = event.url;
  const providerFilter = url.searchParams.get("provider")?.toLowerCase().trim();
  if (providerFilter && providerFilter !== "stripe") {
    const { getBillingCompanyId } = await import("../../../../../../chunks/billing.js");
    const companyId = await getBillingCompanyId(event);
    if (companyId == null) return json({ linked: false, invoices: [] });
    const docs = await findBillingDocumentsByCompanyId(companyId, {
      provider: providerFilter,
      limit: 100
    });
    const projectIds = [...new Set(docs.map((d) => d.projectId).filter(Boolean))];
    const projectMap = await getProjectInfoMap(projectIds);
    const providerCodes = [...new Set(docs.map((d) => d.provider).filter(Boolean))];
    const detailsMap = await getProviderDetailsMap(providerCodes);
    const { codeMap: accountCodeMap, providerMap } = await getAccountMaps(docs);
    const invoices = docs.map((d) => {
      const resolvedProvider = d.paymentAccountId ? providerMap[d.paymentAccountId] : void 0;
      const providerForDetails = resolvedProvider ?? d.provider;
      return mapDocumentToInvoiceShape(
        d,
        d.projectId ? projectMap[d.projectId] : void 0,
        detailsMap[providerForDetails],
        d.paymentAccountId ? accountCodeMap[d.paymentAccountId] : void 0,
        resolvedProvider
      );
    });
    return json({ linked: true, invoices });
  }
  const ctx = await getBillingContext(event);
  if (!ctx) {
    return json({ linked: false, invoices: [] });
  }
  if (ctx.companyId) {
    let docs = await findBillingDocumentsByCompanyId(ctx.companyId, { limit: 100 });
    if (docs.length === 0 && ctx.accounts.some((a) => a.provider === "stripe")) {
      try {
        await syncStripeForCompany(ctx.companyId);
        docs = await findBillingDocumentsByCompanyId(ctx.companyId, { limit: 100 });
      } catch (err) {
        console.error("[billing/invoices] sync error:", err?.message ?? err);
      }
    }
    if (docs.length > 0) {
      const projectIds = [...new Set(docs.map((d) => d.projectId).filter(Boolean))];
      const projectMap = await getProjectInfoMap(projectIds);
      const providerCodes = [...new Set(docs.map((d) => d.provider).filter(Boolean))];
      const detailsMap = await getProviderDetailsMap(providerCodes);
      const { codeMap: accountCodeMap, providerMap } = await getAccountMaps(docs);
      const invoices = docs.map((d) => {
        const resolvedProvider = d.paymentAccountId ? providerMap[d.paymentAccountId] : void 0;
        const providerForDetails = resolvedProvider ?? d.provider;
        return mapDocumentToInvoiceShape(
          d,
          d.projectId ? projectMap[d.projectId] : void 0,
          detailsMap[providerForDetails],
          d.paymentAccountId ? accountCodeMap[d.paymentAccountId] : void 0,
          resolvedProvider
        );
      });
      return json({ linked: true, invoices });
    }
  }
  const billing = await getBillingCompany(event);
  if (!billing) return json({ linked: false, invoices: [] });
  const stripe = getStripe();
  if (!stripe) return json({ linked: true, invoices: [] });
  try {
    const list = await stripe.invoices.list({
      customer: billing.stripeCustomerId,
      limit: 100,
      expand: ["data.charge"]
    });
    const invoices = (list.data ?? []).map((inv) => {
      const charge = inv.charge;
      const receiptUrl = typeof charge === "object" && charge?.receipt_url ? charge.receipt_url : void 0;
      return {
        id: inv.id,
        documentId: null,
        provider: "stripe",
        account_code: billing.stripeCustomerId ?? void 0,
        number: inv.number ?? void 0,
        amount_due: inv.amount_due ?? 0,
        amount_paid: inv.amount_paid ?? 0,
        status: inv.status ?? void 0,
        due_date: inv.due_date ? new Date(inv.due_date * 1e3).toISOString() : void 0,
        hosted_invoice_url: inv.hosted_invoice_url ?? void 0,
        invoice_pdf: inv.invoice_pdf ?? void 0,
        receipt_url: receiptUrl ?? void 0,
        currency: inv.currency ?? "usd",
        created: inv.created ? new Date(inv.created * 1e3).toISOString() : void 0,
        description: inv.description ?? void 0
      };
    });
    return json({ linked: true, invoices });
  } catch (err) {
    console.error("[billing/invoices] Stripe error:", err?.message ?? err);
    return json({ linked: true, invoices: [], error: err?.message ?? "Stripe error" }, { status: 500 });
  }
};
export {
  GET
};
