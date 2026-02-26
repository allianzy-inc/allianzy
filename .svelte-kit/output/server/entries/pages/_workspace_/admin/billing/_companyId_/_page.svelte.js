import { a1 as sanitize_props, a2 as spread_props, _ as slot, a4 as ensure_array_like, a6 as bind_props, Z as store_get, a3 as head, $ as unsubscribe_stores, a0 as attr_class, a5 as stringify } from "../../../../../../chunks/index2.js";
import { p as page } from "../../../../../../chunks/stores.js";
import { I as InvoiceDrawer, s as setOverlaysFromApi, H as History, R as Repeat, f as formatBillingAmount } from "../../../../../../chunks/InvoiceDrawer.js";
import { w as fallback } from "../../../../../../chunks/context.js";
import { a as attr } from "../../../../../../chunks/attributes.js";
import { X } from "../../../../../../chunks/x.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { T as Trash_2 } from "../../../../../../chunks/trash-2.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { L as Loader_circle } from "../../../../../../chunks/loader-circle.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { C as Credit_card } from "../../../../../../chunks/credit-card.js";
import { C as Calendar } from "../../../../../../chunks/calendar.js";
import { E as Eye } from "../../../../../../chunks/eye.js";
import { P as Pencil } from "../../../../../../chunks/pencil.js";
function Link_2($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M9 17H7A5 5 0 0 1 7 7h2" }],
    ["path", { "d": "M15 7h2a5 5 0 1 1 0 10h-2" }],
    ["line", { "x1": "8", "x2": "16", "y1": "12", "y2": "12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "link-2" },
    $$sanitized_props,
    {
      /**
       * @component @name Link2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAxN0g3QTUgNSAwIDAgMSA3IDdoMiIgLz4KICA8cGF0aCBkPSJNMTUgN2gyYTUgNSAwIDEgMSAwIDEwaC0yIiAvPgogIDxsaW5lIHgxPSI4IiB4Mj0iMTYiIHkxPSIxMiIgeTI9IjEyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/link-2
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Settings_2($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M20 7h-9" }],
    ["path", { "d": "M14 17H5" }],
    ["circle", { "cx": "17", "cy": "17", "r": "3" }],
    ["circle", { "cx": "7", "cy": "7", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "settings-2" },
    $$sanitized_props,
    {
      /**
       * @component @name Settings2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgN2gtOSIgLz4KICA8cGF0aCBkPSJNMTQgMTdINSIgLz4KICA8Y2lyY2xlIGN4PSIxNyIgY3k9IjE3IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjciIGN5PSI3IiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/settings-2
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Star($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "polygon",
      {
        "points": "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "star" },
    $$sanitized_props,
    {
      /**
       * @component @name Star
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWdvbiBwb2ludHM9IjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/star
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function LinkStripeModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let open = fallback($$props["open"], false);
    let onClose = $$props["onClose"];
    let onSubmit = fallback($$props["onSubmit"], null);
    let initialValue = fallback($$props["initialValue"], "");
    let onDelete = fallback($$props["onDelete"], null);
    let accounts = fallback($$props["accounts"], () => [], true);
    let onRemove = fallback($$props["onRemove"], null);
    let onSetDefault = fallback($$props["onSetDefault"], null);
    let inputValue = "";
    let setAsDefaultNew = false;
    let deleting = false;
    if (open) inputValue = initialValue ?? "";
    if (open) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation"><button type="button" class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default" aria-label="Cerrar modal"></button> <div class="relative rounded-lg border bg-card shadow-xl max-w-md w-full p-6" role="dialog" aria-labelledby="link-stripe-title" aria-modal="true"><div class="flex items-center justify-between mb-4"><h2 id="link-stripe-title" class="text-lg font-semibold">${escape_html(initialValue ? "Editar conexión Stripe" : "Vincular cliente con Stripe")}</h2> <button type="button" class="p-2 hover:bg-muted rounded-full" aria-label="Cerrar">`);
      X($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></button></div> <p class="text-sm text-muted-foreground mb-4">Ingresa el ID de cliente de Stripe (por ejemplo <code class="bg-muted px-1 rounded">cus_xxxxx</code>). 
				Puedes vincular varias cuentas y elegir una como predeterminada.</p> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (accounts.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mb-4 space-y-2"><p class="text-sm font-medium">Cuentas vinculadas</p> <ul class="space-y-2"><!--[-->`);
        const each_array = ensure_array_like(accounts);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let acc = each_array[$$index];
          $$renderer2.push(`<li class="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"><code class="font-mono text-xs truncate flex-1">${escape_html(acc.customerId)}</code> `);
          if (acc.isDefault) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="text-xs text-muted-foreground shrink-0">Predeterminada</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (onSetDefault) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<button type="button"${attr("disabled", deleting, true)} class="shrink-0 inline-flex items-center gap-1 text-xs text-primary hover:underline" title="Establecer como predeterminada">`);
              Star($$renderer2, { class: "w-3.5 h-3.5" });
              $$renderer2.push(`<!----> Predeterminada</button>`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--> `);
          if (onRemove) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<button type="button"${attr("disabled", deleting, true)} class="shrink-0 p-1.5 text-destructive hover:bg-destructive/10 rounded" aria-label="Eliminar cuenta">`);
            Trash_2($$renderer2, { class: "w-4 h-4" });
            $$renderer2.push(`<!----></button>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></li>`);
        }
        $$renderer2.push(`<!--]--></ul></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <form class="space-y-4"><div><label for="stripe-customer-id" class="block text-sm font-medium mb-1">${escape_html(accounts.length > 0 ? "Añadir otra cuenta" : "Stripe Customer ID")}</label> <input id="stripe-customer-id" type="text"${attr("value", inputValue)} placeholder="cus_..." class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/></div> `);
      if (accounts.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<label class="flex items-center gap-2 text-sm"><input type="checkbox"${attr("checked", setAsDefaultNew, true)} class="rounded border-input"/> Usar como predeterminada</label>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex flex-col gap-3"><div class="flex justify-end gap-2">`);
      if (accounts.length === 0 && initialValue && onDelete) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button type="button"${attr("disabled", deleting, true)} class="mr-auto text-sm font-medium text-destructive hover:underline disabled:opacity-50 inline-flex items-center gap-1.5">`);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Eliminar conexión</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <button type="button" class="px-4 py-2 text-sm font-medium rounded-md border hover:bg-muted"${attr("disabled", deleting, true)}>Cancelar</button> <button type="submit" class="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"${attr("disabled", deleting, true)}>${escape_html(accounts.length > 0 ? "Añadir cuenta" : initialValue ? "Guardar" : "Vincular")}</button></div></div></form></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, {
      open,
      onClose,
      onSubmit,
      initialValue,
      onDelete,
      accounts,
      onRemove,
      onSetDefault
    });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let workspace, companyName, companyId, companiesUrl, canManageBilling, filteredInvoices, isManualProviderView, selectedProviderLabel;
    let data = $$props["data"];
    let currentStripeCustomerId = data.stripeCustomerId ?? null;
    let stripeAccounts = [];
    let selectedStripeCustomerId = null;
    let billingProviders = [];
    let selectedBillingProvider = "stripe";
    let loading = true;
    let linked = false;
    let allInvoices = [];
    let allSubscriptions = [];
    let billingError = null;
    function accountQuery() {
      const c = selectedStripeCustomerId;
      return c ? `&stripeCustomerId=${encodeURIComponent(c)}` : "";
    }
    async function loadBilling() {
      loading = true;
      billingError = null;
      try {
        if (billingProviders.length === 0) {
          const provRes = await fetch(`/${workspace}/api/billing/providers`, { credentials: "include" });
          const provData = await provRes.json().catch(() => ({ providers: [] }));
          billingProviders = provData.providers ?? [];
        }
        const isManualProvider = selectedBillingProvider && selectedBillingProvider !== "stripe";
        if (isManualProvider) ;
        else {
          const [accountsRes, invRes, subRes, overlaysRes] = await Promise.all([
            fetch(`/${workspace}/api/billing/accounts?companyId=${companyId}${accountQuery()}`, { credentials: "include" }),
            fetch(`/${workspace}/api/billing/invoices?companyId=${companyId}${accountQuery()}`, { credentials: "include" }),
            fetch(`/${workspace}/api/billing/subscriptions?companyId=${companyId}${accountQuery()}`, { credentials: "include" }),
            fetch(`/${workspace}/api/billing/overlays?companyId=${companyId}`, { credentials: "include" })
          ]);
          const accData = await accountsRes.json().catch(() => ({ accounts: [] }));
          stripeAccounts = accData.accounts ?? [];
          if (stripeAccounts.length > 0 && !selectedStripeCustomerId) {
            selectedStripeCustomerId = accData.selectedCustomerId ?? accData.defaultCustomerId ?? stripeAccounts[0].customerId;
          }
          const invData = await invRes.json().catch(() => ({ linked: false, invoices: [] }));
          const subData = await subRes.json().catch(() => ({ linked: false, subscriptions: [] }));
          const overlaysData = await overlaysRes.json().catch(() => ({ overlays: {} }));
          if (overlaysData.overlays && typeof overlaysData.overlays === "object") {
            setOverlaysFromApi(overlaysData.overlays);
          }
          linked = invData.linked ?? subData.linked ?? false;
          billingError = invData.error ?? subData.error ?? null;
          const rawInvoices = invData.invoices ?? [];
          const rawSubs = subData.subscriptions ?? [];
          allInvoices = rawInvoices.map((inv) => ({
            id: inv.id,
            documentId: inv.documentId ?? null,
            provider: inv.provider ?? "stripe",
            providerDetails: inv.provider_details ?? void 0,
            status: inv.status ?? "open",
            amount: inv.amount_due ?? inv.amount_paid ?? 0,
            amountDueCents: inv.amount_due ?? 0,
            amountPaidCents: inv.amount_paid ?? 0,
            currency: inv.currency ?? "usd",
            createdAt: inv.created ?? (/* @__PURE__ */ new Date()).toISOString(),
            dueAt: inv.due_date,
            description: inv.description ?? inv.number,
            projectName: inv.projectName,
            serviceName: inv.serviceName,
            hostedInvoiceUrl: inv.hosted_invoice_url,
            invoicePdfUrl: inv.invoice_pdf,
            receiptUrl: inv.receipt_url
          }));
          allSubscriptions = rawSubs.map((sub) => ({
            id: sub.id,
            status: sub.status ?? "active",
            planName: sub.price_nickname ?? "Suscripción",
            amount: sub.price_unit_amount ?? 0,
            currency: sub.currency ?? "usd",
            currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString("es-ES") : "—"
          }));
        }
      } finally {
        loading = false;
      }
    }
    let filterStatus = "";
    let searchQuery = "";
    let drawerOpen = false;
    let selectedInvoice = null;
    let linkStripeModalOpen = false;
    let deleteConfirmId = null;
    let deleteLoading = false;
    function closeInvoiceDrawer() {
      drawerOpen = false;
      selectedInvoice = null;
    }
    async function handleSaveOverlay(stripeInvoiceId, overlay) {
      const res = await fetch(`/${workspace}/api/billing/overlays`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyId,
          stripeInvoiceId,
          overlay: { title: overlay.title, items: overlay.items }
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? res.statusText ?? "Error al guardar");
      }
    }
    function closeLinkStripeModal() {
      linkStripeModalOpen = false;
    }
    async function handleLinkSubmit(stripeCustomerId, setAsDefault = false) {
      const res = await fetch(`/${workspace}/api/billing/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ companyId, stripeCustomerId, setAsDefault, action: "add" })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al vincular");
      }
      const data2 = await res.json().catch(() => ({}));
      if (data2.accounts?.length) {
        stripeAccounts = data2.accounts;
        currentStripeCustomerId = data2.accounts.find((a) => a.isDefault)?.customerId ?? data2.accounts[0]?.customerId ?? null;
        if (!selectedStripeCustomerId) selectedStripeCustomerId = currentStripeCustomerId;
      }
      await loadBilling();
    }
    async function handleRemoveAccount(customerId) {
      const res = await fetch(`/${workspace}/api/billing/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ companyId, stripeCustomerId: customerId, action: "remove" })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al eliminar");
      }
      const data2 = await res.json().catch(() => ({}));
      if (data2.accounts) stripeAccounts = data2.accounts;
      currentStripeCustomerId = stripeAccounts.find((a) => a.isDefault)?.customerId ?? stripeAccounts[0]?.customerId ?? null;
      if (selectedStripeCustomerId === customerId) selectedStripeCustomerId = currentStripeCustomerId;
      await loadBilling();
    }
    async function handleSetDefaultAccount(customerId) {
      const res = await fetch(`/${workspace}/api/billing/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyId,
          stripeCustomerId: customerId,
          action: "setDefault"
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al cambiar predeterminada");
      }
      const data2 = await res.json().catch(() => ({}));
      if (data2.accounts) stripeAccounts = data2.accounts;
      currentStripeCustomerId = customerId;
      await loadBilling();
    }
    async function handleDeleteConnection() {
      if (selectedStripeCustomerId) {
        await handleRemoveAccount(selectedStripeCustomerId);
      } else {
        const res = await fetch(`/${workspace}/api/billing/link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ companyId, stripeCustomerId: "", action: "remove" })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Error al eliminar");
        }
        currentStripeCustomerId = null;
        selectedStripeCustomerId = null;
        stripeAccounts = [];
        await loadBilling();
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
    function canEditDeleteInvoice(inv) {
      return inv.documentId && inv.provider && inv.provider !== "stripe";
    }
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    companyName = data.companyName ?? "Empresa";
    companyId = data.companyId;
    companiesUrl = `/${workspace}/admin/companies`;
    data.canViewBilling ?? true;
    canManageBilling = data.canManageBilling ?? true;
    filteredInvoices = (() => {
      let list = [...allInvoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        list = list.filter((i) => (i.description?.toLowerCase().includes(q) ?? false) || (i.projectName?.toLowerCase().includes(q) ?? false) || (i.serviceName?.toLowerCase().includes(q) ?? false));
      }
      return list;
    })();
    isManualProviderView = selectedBillingProvider !== "stripe";
    selectedProviderLabel = billingProviders.find((p) => p.code === selectedBillingProvider)?.label ?? selectedBillingProvider;
    head("w07soh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Facturación - ${escape_html(companyName)}</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col gap-4"><a${attr("href", companiesUrl)} class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">`);
    Arrow_left($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Volver a empresas</a> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h2 class="text-2xl font-bold tracking-tight">Facturación - ${escape_html(companyName)}</h2> <p class="text-muted-foreground">Historial de facturas y suscripciones de esta empresa.</p></div> `);
    if (billingProviders.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-2"><label for="billing-provider" class="text-sm text-muted-foreground whitespace-nowrap">Ver facturación:</label> `);
      $$renderer2.select(
        {
          id: "billing-provider",
          value: selectedBillingProvider,
          class: "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        },
        ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(billingProviders);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let p = each_array[$$index];
            $$renderer3.option({ value: p.code }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(p.label)}${escape_html(p.isAutomatic ? " (automático)" : "")}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(`</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (loading) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-16">`);
      Loader_circle($$renderer2, { class: "h-8 w-8 animate-spin text-muted-foreground" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (!linked && selectedBillingProvider === "stripe") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="rounded-lg border bg-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div class="flex items-start gap-3">`);
        Link_2($$renderer2, { class: "h-5 w-5 text-muted-foreground shrink-0 mt-0.5" });
        $$renderer2.push(`<!----> <div><h3 class="font-medium">Facturación no vinculada</h3> <p class="text-sm text-muted-foreground mt-0.5">La facturación con Stripe aún no está vinculada a esta organización. Vincula un cliente de Stripe para ver facturas y suscripciones.</p></div></div> `);
        if (canManageBilling) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button type="button" class="shrink-0 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">`);
          Settings_2($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----> Vincular cliente</button>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (canManageBilling && isManualProviderView) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="rounded-lg border bg-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h3 class="font-medium">Facturación ${escape_html(selectedProviderLabel)}</h3> <p class="text-sm text-muted-foreground mt-0.5">Documentos de facturación cargados manualmente para esta empresa.</p></div> <button type="button" class="shrink-0 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">`);
          Plus($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----> Crear facturación</button></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (canManageBilling && selectedBillingProvider === "stripe") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="rounded-lg border bg-card p-4 space-y-4"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div class="flex items-start gap-3">`);
          Link_2($$renderer2, { class: "h-5 w-5 text-muted-foreground shrink-0 mt-0.5" });
          $$renderer2.push(`<!----> <div><h3 class="font-medium">Conexión Stripe</h3> <p class="text-sm text-muted-foreground mt-0.5">Cuentas de pago vinculadas a esta empresa. Cambia la cuenta para ver su historial y suscripciones.</p></div></div> <button type="button" class="shrink-0 inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">`);
          Settings_2($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----> ${escape_html(stripeAccounts.length > 0 ? "Gestionar cuentas" : "Vincular cliente")}</button></div> `);
          if (stripeAccounts.length > 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="flex flex-wrap items-center gap-2"><label for="admin-billing-account" class="text-sm text-muted-foreground">Ver cuenta:</label> `);
            $$renderer2.select(
              {
                id: "admin-billing-account",
                value: selectedStripeCustomerId,
                class: "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              },
              ($$renderer3) => {
                $$renderer3.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(stripeAccounts);
                for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                  let acc = each_array_1[$$index_1];
                  $$renderer3.option({ value: acc.customerId }, ($$renderer4) => {
                    $$renderer4.push(`${escape_html(acc.customerId)}${escape_html(acc.isDefault ? " (predeterminada)" : "")}`);
                  });
                }
                $$renderer3.push(`<!--]-->`);
              }
            );
            $$renderer2.push(`</div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (billingError) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">Error al cargar datos de Stripe: ${escape_html(billingError)}. Comprueba que STRIPE_SECRET_KEY sea correcta y corresponda al mismo modo (test/live) que el cliente.</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="border-b border-border"><nav class="flex gap-6" aria-label="Facturación"><button type="button"${attr_class(`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-2 ${stringify(
          "border-primary text-primary"
        )}`)}>`);
        History($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Historial</button> `);
        if (!isManualProviderView) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button type="button"${attr_class(`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-2 ${stringify("border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground")}`)}>`);
          Repeat($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----> Suscripciones vigentes</button>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></nav></div> `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="rounded-md border bg-card"><div class="p-4 border-b border-border flex flex-col sm:flex-row gap-4"><div class="flex-1"><label for="admin-billing-search" class="sr-only">Buscar por concepto, proyecto o servicio</label> <input id="admin-billing-search" type="search"${attr("value", searchQuery)} placeholder="Buscar por concepto, proyecto o servicio..." class="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/></div> <div><label for="admin-billing-status" class="sr-only">Estado</label> `);
          $$renderer2.select(
            {
              id: "admin-billing-status",
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
            $$renderer2.push(`<!----> <h3 class="text-lg font-medium">No hay facturas</h3> <p class="text-muted-foreground mt-1">No hay facturas que coincidan con los filtros o aún no hay historial para esta empresa.</p></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="hidden md:block relative w-full overflow-auto"><table class="w-full caption-bottom text-sm text-left"><thead class="[&amp;_tr]:border-b"><tr class="border-b transition-colors hover:bg-muted/50"><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Concepto</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Proyecto / Servicio</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Monto</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Vencimiento</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th><th class="h-12 px-4 align-middle font-medium text-right">Acciones</th></tr></thead><tbody class="[&amp;_tr:last-child]:border-0"><!--[-->`);
            const each_array_2 = ensure_array_like(filteredInvoices);
            for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
              let invoice = each_array_2[$$index_2];
              $$renderer2.push(`<tr class="border-b transition-colors hover:bg-muted/50"><td class="p-4 align-middle font-medium">${escape_html(invoice.description ?? invoice.id)}</td><td class="p-4 align-middle"><div class="flex flex-col"><span>${escape_html(invoice.projectName ?? "—")}</span> `);
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
              $$renderer2.push(`<!--]--></td><td class="p-4 align-middle"><span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stringify(invoiceStatusBadgeClass(invoice.status))}`)}>${escape_html(invoiceStatusLabel(invoice.status))}</span></td><td class="p-4 align-middle text-right"><div class="flex items-center justify-end gap-1"><button type="button" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8" title="Ver detalle">`);
              Eye($$renderer2, { class: "h-4 w-4" });
              $$renderer2.push(`<!----> <span class="sr-only">Ver detalle</span></button> `);
              if (canEditDeleteInvoice(invoice)) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<button type="button" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8" title="Editar">`);
                Pencil($$renderer2, { class: "h-4 w-4" });
                $$renderer2.push(`<!----> <span class="sr-only">Editar</span></button> `);
                if (deleteConfirmId === invoice.documentId) {
                  $$renderer2.push("<!--[-->");
                  $$renderer2.push(`<button type="button"${attr("disabled", deleteLoading, true)} class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-destructive bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground h-8 w-8 disabled:opacity-50" title="Confirmar eliminar">`);
                  {
                    $$renderer2.push("<!--[!-->");
                    Trash_2($$renderer2, { class: "h-4 w-4" });
                  }
                  $$renderer2.push(`<!--]--> <span class="sr-only">Eliminar</span></button> <button type="button" class="text-xs text-muted-foreground hover:text-foreground">Cancelar</button>`);
                } else {
                  $$renderer2.push("<!--[!-->");
                  $$renderer2.push(`<button type="button" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-destructive/20 text-destructive h-8 w-8" title="Eliminar">`);
                  Trash_2($$renderer2, { class: "h-4 w-4" });
                  $$renderer2.push(`<!----> <span class="sr-only">Eliminar</span></button>`);
                }
                $$renderer2.push(`<!--]-->`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]--></div></td></tr>`);
            }
            $$renderer2.push(`<!--]--></tbody></table></div> <div class="md:hidden space-y-4"><!--[-->`);
            const each_array_3 = ensure_array_like(filteredInvoices);
            for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
              let invoice = each_array_3[$$index_3];
              $$renderer2.push(`<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4"><div class="flex justify-between items-start gap-4"><div class="space-y-1"><h4 class="font-semibold leading-none tracking-tight">${escape_html(invoice.description ?? invoice.id)}</h4> <p class="text-sm text-muted-foreground">${escape_html(invoice.projectName ?? "—")}</p> `);
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
      canEditInternalDetail: true,
      onSaveOverlay: handleSaveOverlay,
      onClose: closeInvoiceDrawer
    });
    $$renderer2.push(`<!----> `);
    LinkStripeModal($$renderer2, {
      open: linkStripeModalOpen,
      onClose: closeLinkStripeModal,
      onSubmit: handleLinkSubmit,
      onDelete: handleDeleteConnection,
      initialValue: "",
      accounts: stripeAccounts,
      onRemove: handleRemoveAccount,
      onSetDefault: handleSetDefaultAccount
    });
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
