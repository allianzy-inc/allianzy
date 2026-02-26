import { Z as store_get, a3 as head, $ as unsubscribe_stores, a6 as bind_props, a0 as attr_class, a5 as stringify, a4 as ensure_array_like } from "../../../../../chunks/index2.js";
import { p as page } from "../../../../../chunks/stores.js";
import { t as translations, c as currentLang } from "../../../../../chunks/i18n.js";
import { I as InvoiceDrawer, s as setOverlaysFromApi, H as History, R as Repeat, f as formatBillingAmount } from "../../../../../chunks/InvoiceDrawer.js";
import { C as Circle_alert } from "../../../../../chunks/circle-alert.js";
import { L as Loader_circle } from "../../../../../chunks/loader-circle.js";
import { C as Credit_card } from "../../../../../chunks/credit-card.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { E as Eye } from "../../../../../chunks/eye.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
import { a as attr } from "../../../../../chunks/attributes.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let workspace, canViewBilling, canManageBilling, uniqueAccounts, filteredInvoices, t;
    let data = $$props["data"];
    let loading = true;
    let linked = false;
    let paymentAccounts = [];
    let allInvoices = [];
    let allSubscriptions = [];
    async function loadBilling() {
      loading = true;
      try {
        const [accountsRes, invRes, subRes, overlaysRes] = await Promise.all([
          fetch(`/${workspace}/api/billing/accounts`, { credentials: "include" }),
          fetch(`/${workspace}/api/billing/invoices`, { credentials: "include" }),
          fetch(`/${workspace}/api/billing/subscriptions`, { credentials: "include" }),
          fetch(`/${workspace}/api/billing/overlays`, { credentials: "include" })
        ]);
        const accData = await accountsRes.json().catch(() => ({ accounts: [] }));
        paymentAccounts = accData.accounts ?? [];
        const invData = await invRes.json().catch(() => ({ linked: false, invoices: [] }));
        const subData = await subRes.json().catch(() => ({ linked: false, subscriptions: [] }));
        const overlaysData = await overlaysRes.json().catch(() => ({ overlays: {} }));
        if (overlaysData.overlays && typeof overlaysData.overlays === "object") {
          setOverlaysFromApi(overlaysData.overlays);
        }
        linked = invData.linked ?? subData.linked ?? false;
        const rawInvoices = invData.invoices ?? [];
        const rawSubs = subData.subscriptions ?? [];
        allInvoices = rawInvoices.map((inv) => ({
          id: inv.id,
          documentId: inv.documentId ?? null,
          provider: inv.provider,
          accountCode: inv.account_code ?? null,
          providerDetails: inv.provider_details ?? void 0,
          status: inv.status ?? "open",
          amount: inv.amount_due ?? inv.amount_paid ?? 0,
          currency: inv.currency ?? "usd",
          createdAt: inv.created ?? (/* @__PURE__ */ new Date()).toISOString(),
          dueAt: inv.due_date,
          description: inv.description ?? inv.number,
          projectName: inv.projectName,
          serviceName: inv.serviceName,
          hostedInvoiceUrl: inv.hosted_invoice_url,
          invoicePdfUrl: inv.invoice_pdf,
          receiptUrl: inv.receipt_url,
          proofUrl: inv.proof_url ?? null,
          proofUploadedAt: inv.proof_uploaded_at ?? null
        }));
        allSubscriptions = rawSubs.map((sub) => ({
          id: sub.id,
          status: sub.status ?? "active",
          planName: sub.price_nickname ?? "Suscripción",
          amount: sub.price_unit_amount ?? 0,
          currency: sub.currency ?? "usd",
          currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString("es-ES") : "—"
        }));
      } finally {
        loading = false;
      }
    }
    let filterStatus = "";
    let filterByAccount = "";
    let searchQuery = "";
    function methodDisplayName(providerCode) {
      if (!providerCode) return "—";
      if (providerCode === "stripe") return "Stripe";
      if (providerCode.startsWith("mercadopago")) return "MercadoPago";
      if (providerCode.startsWith("paypal")) return "PayPal";
      return providerCode.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    let drawerOpen = false;
    let selectedInvoice = null;
    function closeInvoiceDrawer() {
      drawerOpen = false;
      selectedInvoice = null;
    }
    async function handleUploadProof(documentId, file) {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch(`/${workspace}/api/billing/documents/${documentId}/proof`, { method: "POST", credentials: "include", body: formData });
      const data2 = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data2.error ?? "Error al subir");
      await loadBilling();
      if (selectedInvoice?.documentId === documentId) {
        selectedInvoice = allInvoices.find((inv) => inv.documentId === documentId) ?? selectedInvoice;
      }
    }
    function invoiceStatusBadgeClass(status) {
      switch (status) {
        case "paid":
          return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30";
        case "open":
        case "draft":
          return "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30";
        case "void":
          return "bg-muted text-muted-foreground border-border";
        case "uncollectible":
          return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30";
        default:
          return "bg-muted text-muted-foreground border-border";
      }
    }
    function invoiceStatusLabel(status) {
      const map = {
        paid: "Pagado",
        open: "Pendiente",
        draft: "Borrador",
        void: "Anulada",
        uncollectible: "Incobrable"
      };
      return map[status] ?? status;
    }
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace ?? "allianzy";
    canViewBilling = data.canViewBilling ?? false;
    canManageBilling = data.canManageBilling ?? false;
    paymentAccounts.find((a) => a.provider === "stripe")?.customerId ?? null;
    uniqueAccounts = (() => {
      const set = /* @__PURE__ */ new Set();
      for (const inv of allInvoices) {
        if (inv.provider) set.add(`${inv.provider}|${inv.accountCode ?? ""}`);
      }
      return [...set].sort((a, b) => {
        const [pA, cA] = a.split("|");
        const [pB, cB] = b.split("|");
        const nameCmp = methodDisplayName(pA).localeCompare(methodDisplayName(pB));
        if (nameCmp !== 0) return nameCmp;
        return (cA ?? "").localeCompare(cB ?? "");
      });
    })();
    filteredInvoices = (() => {
      let list = [...allInvoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        list = list.filter((i) => (i.description?.toLowerCase().includes(q) ?? false) || (i.projectName?.toLowerCase().includes(q) ?? false) || (i.serviceName?.toLowerCase().includes(q) ?? false));
      }
      return list;
    })();
    t = translations[store_get($$store_subs ??= {}, "$currentLang", currentLang)];
    head("1pqtjr9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t.dashboard?.page?.billing?.title ?? "Facturación")}</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h2 class="text-2xl font-bold tracking-tight">${escape_html(t.dashboard?.page?.billing?.title ?? "Facturación")}</h2> <p class="text-muted-foreground">${escape_html(t.dashboard?.page?.billing?.subtitle ?? "Historial de facturas y suscripciones.")}</p></div></div> `);
    if (!canViewBilling) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 text-center">`);
      Circle_alert($$renderer2, {
        class: "h-12 w-12 mx-auto text-amber-600 dark:text-amber-400 mb-4 opacity-80"
      });
      $$renderer2.push(`<!----> <h3 class="text-lg font-semibold">Acceso denegado</h3> <p class="text-muted-foreground mt-1">No tienes permiso para ver la facturación. Contacta al administrador de la organización.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (loading) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center py-16">`);
        Loader_circle($$renderer2, { class: "h-8 w-8 animate-spin text-muted-foreground" });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="border-b border-border"><nav class="flex gap-6" aria-label="Facturación"><button type="button"${attr_class(`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-2 ${stringify(
          "border-primary text-primary"
        )}`)}>`);
        History($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Historial</button> <button type="button"${attr_class(`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-2 ${stringify("border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground")}`)}>`);
        Repeat($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Suscripciones vigentes</button></nav></div> `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="rounded-md border bg-card"><div class="p-4 border-b border-border flex flex-col sm:flex-row gap-4 flex-wrap"><div class="flex-1 min-w-[200px]"><label for="billing-search" class="sr-only">Buscar por concepto, proyecto o servicio</label> <input id="billing-search" type="search"${attr("value", searchQuery)} placeholder="Buscar por concepto, proyecto o servicio..." class="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/></div> <div class="flex flex-wrap gap-2 items-center"><label for="billing-provider" class="sr-only">Método / cuenta de pago</label> `);
          $$renderer2.select(
            {
              id: "billing-provider",
              value: filterByAccount,
              class: "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            },
            ($$renderer3) => {
              $$renderer3.option({ value: "" }, ($$renderer4) => {
                $$renderer4.push(`Todos los métodos`);
              });
              $$renderer3.push(`<!--[-->`);
              const each_array = ensure_array_like(uniqueAccounts);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let key = each_array[$$index];
                const [provider, accountCode] = key.split("|");
                $$renderer3.option({ value: key }, ($$renderer4) => {
                  $$renderer4.push(`${escape_html(methodDisplayName(provider))}${escape_html(accountCode ? ` — ${accountCode}` : "")}`);
                });
              }
              $$renderer3.push(`<!--]-->`);
            }
          );
          $$renderer2.push(` <label for="billing-status" class="sr-only">Estado</label> `);
          $$renderer2.select(
            {
              id: "billing-status",
              value: filterStatus,
              class: "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            },
            ($$renderer3) => {
              $$renderer3.option({ value: "" }, ($$renderer4) => {
                $$renderer4.push(`Todos los estados`);
              });
              $$renderer3.option({ value: "paid" }, ($$renderer4) => {
                $$renderer4.push(`Pagado`);
              });
              $$renderer3.option({ value: "open" }, ($$renderer4) => {
                $$renderer4.push(`Pendiente`);
              });
              $$renderer3.option({ value: "void" }, ($$renderer4) => {
                $$renderer4.push(`Anulada`);
              });
              $$renderer3.option({ value: "uncollectible" }, ($$renderer4) => {
                $$renderer4.push(`Incobrable`);
              });
            }
          );
          $$renderer2.push(`</div></div> <div class="p-6">`);
          if (filteredInvoices.length === 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="text-center py-12">`);
            Credit_card($$renderer2, {
              class: "h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50"
            });
            $$renderer2.push(`<!----> <h3 class="text-lg font-medium">No hay facturas</h3> <p class="text-muted-foreground mt-1">No hay facturas que coincidan con los filtros o aún no tienes historial.</p></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="hidden md:block relative w-full overflow-auto"><table class="w-full caption-bottom text-sm text-left"><thead class="[&amp;_tr]:border-b"><tr class="border-b transition-colors hover:bg-muted/50"><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Concepto</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Método de pago</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Cuenta de pago</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Proyecto / Servicio</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Monto</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Vencimiento</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th><th class="h-12 px-4 align-middle font-medium text-right">Acciones</th></tr></thead><tbody class="[&amp;_tr:last-child]:border-0"><!--[-->`);
            const each_array_1 = ensure_array_like(filteredInvoices);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let invoice = each_array_1[$$index_1];
              $$renderer2.push(`<tr class="border-b transition-colors hover:bg-muted/50"><td class="p-4 align-middle font-medium">${escape_html(invoice.description ?? invoice.id)}</td><td class="p-4 align-middle text-sm">${escape_html(methodDisplayName(invoice.provider))}</td><td class="p-4 align-middle font-mono text-xs text-muted-foreground"${attr("title", invoice.accountCode ?? "")}>${escape_html(invoice.accountCode ?? "—")}</td><td class="p-4 align-middle"><div class="flex flex-col"><span>${escape_html(invoice.projectName ?? "—")}</span> `);
              if (invoice.serviceName) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<span class="text-xs text-muted-foreground">${escape_html(invoice.serviceName)}</span>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]--></div></td><td class="p-4 align-middle font-mono">${escape_html(formatBillingAmount(invoice.amount, invoice.currency))}</td><td class="p-4 align-middle">`);
              if (invoice.dueAt) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<div class="flex items-center gap-2">`);
                Calendar($$renderer2, { class: "h-3 w-3 text-muted-foreground" });
                $$renderer2.push(`<!----> ${escape_html(new Date(invoice.dueAt).toLocaleDateString("es-ES"))}</div>`);
              } else {
                $$renderer2.push("<!--[!-->");
                $$renderer2.push(`—`);
              }
              $$renderer2.push(`<!--]--></td><td class="p-4 align-middle"><span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stringify(invoiceStatusBadgeClass(invoice.status))}`)}>${escape_html(invoiceStatusLabel(invoice.status))}</span></td><td class="p-4 align-middle text-right"><button type="button" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8" title="Ver detalle">`);
              Eye($$renderer2, { class: "h-4 w-4" });
              $$renderer2.push(`<!----> <span class="sr-only">Ver detalle</span></button></td></tr>`);
            }
            $$renderer2.push(`<!--]--></tbody></table></div> <div class="md:hidden space-y-4"><!--[-->`);
            const each_array_2 = ensure_array_like(filteredInvoices);
            for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
              let invoice = each_array_2[$$index_2];
              $$renderer2.push(`<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4"><div class="flex justify-between items-start gap-4"><div class="space-y-1"><h4 class="font-semibold leading-none tracking-tight">${escape_html(invoice.description ?? invoice.id)}</h4> <p class="text-sm text-muted-foreground">${escape_html(methodDisplayName(invoice.provider))} · ${escape_html(invoice.accountCode ?? "—")}</p> <p class="text-sm text-muted-foreground">${escape_html(invoice.projectName ?? "—")}</p> `);
              if (invoice.serviceName) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<p class="text-xs text-muted-foreground">${escape_html(invoice.serviceName)}</p>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]--></div> <div class="font-mono font-medium whitespace-nowrap">${escape_html(formatBillingAmount(invoice.amount, invoice.currency))}</div></div> <div class="flex items-center justify-between pt-2 border-t border-border"><div class="space-y-2">`);
              if (invoice.dueAt) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<div class="flex items-center gap-2 text-sm text-muted-foreground">`);
                Calendar($$renderer2, { class: "h-3 w-3" });
                $$renderer2.push(`<!----> ${escape_html(new Date(invoice.dueAt).toLocaleDateString("es-ES"))}</div>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]--> <span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stringify(invoiceStatusBadgeClass(invoice.status))}`)}>${escape_html(invoiceStatusLabel(invoice.status))}</span></div> <button type="button" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9" title="Ver detalle">`);
              Eye($$renderer2, { class: "h-4 w-4" });
              $$renderer2.push(`<!----> <span class="sr-only">Ver detalle</span></button></div></div>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          }
          $$renderer2.push(`<!--]--></div></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    InvoiceDrawer($$renderer2, {
      open: drawerOpen,
      invoice: selectedInvoice,
      canManageBilling,
      canEditInternalDetail: false,
      canUploadProof: true,
      onUploadProof: handleUploadProof,
      onClose: closeInvoiceDrawer
    });
    $$renderer2.push(`<!---->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
