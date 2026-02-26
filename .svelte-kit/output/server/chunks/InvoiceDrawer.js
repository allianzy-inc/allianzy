import { a1 as sanitize_props, a2 as spread_props, _ as slot, Z as store_get, a0 as attr_class, a5 as stringify, a4 as ensure_array_like, $ as unsubscribe_stores, a6 as bind_props } from "./index2.js";
import { I as Icon } from "./Icon.js";
import { w as writable } from "./index.js";
import { X } from "./x.js";
import { E as External_link, D as Download } from "./external-link.js";
import { C as Credit_card } from "./credit-card.js";
import { T as Trash_2 } from "./trash-2.js";
import { P as Plus } from "./plus.js";
import { w as fallback } from "./context.js";
import { e as escape_html } from "./escaping.js";
import { a as attr } from "./attributes.js";
function Check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  Icon($$renderer, spread_props([
    { name: "check" },
    $$sanitized_props,
    {
      /**
       * @component @name Check
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check
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
function Copy($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      {
        "width": "14",
        "height": "14",
        "x": "8",
        "y": "8",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "path",
      {
        "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "copy" },
    $$sanitized_props,
    {
      /**
       * @component @name Copy
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjgiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/copy
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
function File_check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      }
    ],
    ["path", { "d": "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { "d": "m9 15 2 2 4-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "file-check" },
    $$sanitized_props,
    {
      /**
       * @component @name FileCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjdaIiAvPgogIDxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0IiAvPgogIDxwYXRoIGQ9Im05IDE1IDIgMiA0LTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/file-check
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
function History($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
    ],
    ["path", { "d": "M3 3v5h5" }],
    ["path", { "d": "M12 7v5l4 2" }]
  ];
  Icon($$renderer, spread_props([
    { name: "history" },
    $$sanitized_props,
    {
      /**
       * @component @name History
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgogIDxwYXRoIGQ9Ik0xMiA3djVsNCAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/history
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
function Receipt($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"
      }
    ],
    ["path", { "d": "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }],
    ["path", { "d": "M12 17.5v-11" }]
  ];
  Icon($$renderer, spread_props([
    { name: "receipt" },
    $$sanitized_props,
    {
      /**
       * @component @name Receipt
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAydjIwbDItMSAyIDEgMi0xIDIgMSAyLTEgMiAxIDItMSAyIDFWMmwtMiAxLTItMS0yIDEtMi0xLTIgMS0yLTEtMiAxWiIgLz4KICA8cGF0aCBkPSJNMTYgOGgtNmEyIDIgMCAxIDAgMCA0aDRhMiAyIDAgMSAxIDAgNEg4IiAvPgogIDxwYXRoIGQ9Ik0xMiAxNy41di0xMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/receipt
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
function Repeat($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "m17 2 4 4-4 4" }],
    ["path", { "d": "M3 11v-1a4 4 0 0 1 4-4h14" }],
    ["path", { "d": "m7 22-4-4 4-4" }],
    ["path", { "d": "M21 13v1a4 4 0 0 1-4 4H3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "repeat" },
    $$sanitized_props,
    {
      /**
       * @component @name Repeat
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTcgMiA0IDQtNCA0IiAvPgogIDxwYXRoIGQ9Ik0zIDExdi0xYTQgNCAwIDAgMSA0LTRoMTQiIC8+CiAgPHBhdGggZD0ibTcgMjItNC00IDQtNCIgLz4KICA8cGF0aCBkPSJNMjEgMTN2MWE0IDQgMCAwIDEtNCA0SDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/repeat
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
const billingOverlays = writable({
  inv_mock_1: {
    stripeInvoiceId: "inv_mock_1",
    title: "Suscripción Mensual - Plan Pro",
    items: [
      { id: "li_1", label: "Hosting + Mantenimiento", amount: 29900 },
      { id: "li_2", label: "Soporte técnico", amount: 0 }
    ]
  },
  inv_mock_2: {
    stripeInvoiceId: "inv_mock_2",
    title: "Suscripción Mensual - Plan Pro",
    items: [{ id: "li_1", label: "Hosting + Mantenimiento", amount: 29900 }]
  }
});
function formatCents(cents, currency) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(cents / 100);
}
function formatBillingAmount(cents, currency) {
  return formatCents(cents, currency);
}
function setOverlaysFromApi(overlays) {
  const map = {};
  for (const [id, val] of Object.entries(overlays)) {
    if (val && Array.isArray(val.items)) {
      map[id] = { stripeInvoiceId: id, title: val.title, items: val.items };
    }
  }
  billingOverlays.set(map);
}
function InvoiceDrawer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let overlay, title, items, showProofSection, showPaymentDetailsSection;
    let open = fallback($$props["open"], false);
    let invoice = fallback($$props["invoice"], null);
    let canManageBilling = fallback($$props["canManageBilling"], false);
    let canEditInternalDetail = fallback($$props["canEditInternalDetail"], false);
    let onSaveOverlay = fallback($$props["onSaveOverlay"], void 0);
    let canUploadProof = fallback($$props["canUploadProof"], false);
    let onUploadProof = fallback($$props["onUploadProof"], void 0);
    let onClose = $$props["onClose"];
    let editMode = false;
    let saving = false;
    let lastInvoiceId = "";
    let editTitle = "";
    let editItems = [];
    let newItemLabel = "";
    let newItemAmount = "";
    function invoiceStatusBadgeClass(status) {
      switch (status) {
        case "paid":
          return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30";
        case "open":
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
        void: "Anulada",
        uncollectible: "Incobrable"
      };
      return map[status] ?? status;
    }
    let copiedKey = null;
    overlay = invoice ? store_get($$store_subs ??= {}, "$billingOverlays", billingOverlays)[invoice.id] : void 0;
    title = overlay?.title ?? invoice?.description ?? "Factura";
    items = overlay?.items ?? [];
    if (invoice && invoice.id !== lastInvoiceId) {
      lastInvoiceId = invoice.id;
      editMode = false;
    }
    showProofSection = canUploadProof && invoice?.documentId && invoice?.provider && invoice.provider !== "stripe";
    showPaymentDetailsSection = invoice?.provider && invoice.provider !== "stripe" && Array.isArray(invoice.providerDetails) && invoice.providerDetails.length > 0;
    if (open && invoice) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex justify-end" role="presentation"><button type="button" class="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-default" aria-label="Cerrar panel"></button> <div class="relative w-full max-w-lg bg-card border-l shadow-2xl flex flex-col max-h-full overflow-hidden" role="dialog" aria-label="Detalle de factura"><div class="px-6 py-4 border-b flex items-center justify-between shrink-0"><h2 class="text-lg font-semibold truncate pr-2">Detalle de factura</h2> <button type="button" class="p-2 hover:bg-muted rounded-full" aria-label="Cerrar">`);
      X($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></button></div> <div class="flex-1 overflow-y-auto p-6 space-y-6"><div><p class="text-sm text-muted-foreground">Concepto</p> <p class="font-medium">${escape_html(title)}</p></div> <div class="grid grid-cols-2 gap-4"><div><p class="text-sm text-muted-foreground">Creada</p> <p class="text-sm">${escape_html(new Date(invoice.createdAt).toLocaleDateString("es-ES", { dateStyle: "medium" }))}</p></div> `);
      if (invoice.dueAt) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div><p class="text-sm text-muted-foreground">Vencimiento</p> <p class="text-sm">${escape_html(new Date(invoice.dueAt).toLocaleDateString("es-ES", { dateStyle: "medium" }))}</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div><p class="text-sm text-muted-foreground mb-1">Estado</p> <span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${stringify(invoiceStatusBadgeClass(invoice.status))}`)}>${escape_html(invoiceStatusLabel(invoice.status))}</span></div> <div class="rounded-lg border bg-muted/30 p-4"><p class="text-sm text-muted-foreground">Total</p> <p class="text-xl font-semibold">${escape_html(formatBillingAmount(invoice.amount, invoice.currency))}</p> `);
      if (invoice.projectName || invoice.serviceName) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-muted-foreground mt-1">${escape_html(invoice.projectName ?? "")}${escape_html(invoice.projectName && invoice.serviceName ? " · " : "")}${escape_html(invoice.serviceName ?? "")}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (showPaymentDetailsSection) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="rounded-lg border bg-muted/30 p-4 space-y-3"><p class="text-sm font-medium">Datos para realizar el pago</p> <p class="text-sm text-muted-foreground">Realizá la transferencia o el pago con los siguientes datos. Podés copiar cada valor con el botón.</p> <div class="space-y-2"><!--[-->`);
        const each_array = ensure_array_like(invoice?.providerDetails ?? []);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let item = each_array[i];
          const key = `${item.label}-${i}`;
          $$renderer2.push(`<div class="flex items-center gap-2 rounded-md border bg-background/80 px-3 py-2"><div class="flex-1 min-w-0"><p class="text-xs text-muted-foreground">${escape_html(item.label)}</p> <p class="text-sm font-mono truncate"${attr("title", item.value)}>${escape_html(item.value)}</p></div> <button type="button" class="shrink-0 p-2 rounded-md border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Copiar">`);
          if (copiedKey === key) {
            $$renderer2.push("<!--[-->");
            Check($$renderer2, { class: "w-4 h-4 text-green-600 dark:text-green-400" });
          } else {
            $$renderer2.push("<!--[!-->");
            Copy($$renderer2, { class: "w-4 h-4" });
          }
          $$renderer2.push(`<!--]--></button></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (showProofSection) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="rounded-lg border bg-muted/30 p-4 space-y-2"><p class="text-sm font-medium flex items-center gap-2">`);
        File_check($$renderer2, { class: "w-4 h-4 text-muted-foreground" });
        $$renderer2.push(`<!----> Comprobante de transferencia</p> `);
        if (invoice.proofUrl) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-sm text-muted-foreground">Comprobante subido.</p> <a${attr("href", invoice.proofUrl)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm text-primary hover:underline">`);
          External_link($$renderer2, { class: "w-3 h-3" });
          $$renderer2.push(`<!----> Ver comprobante</a>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<p class="text-sm text-muted-foreground">Podés subir el comprobante de la transferencia para acreditar el pago.</p> <input type="file" accept="image/*,.pdf" class="text-sm file:mr-2 file:rounded file:border file:px-3 file:py-1.5 file:text-sm file:font-medium"/> `);
          {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex flex-wrap gap-2">`);
      if (canManageBilling && invoice.hostedInvoiceUrl) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attr("href", invoice.hostedInvoiceUrl)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">`);
        External_link($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Ver en Stripe</a>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (invoice.invoicePdfUrl) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attr("href", invoice.invoicePdfUrl)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">`);
        Download($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Descargar factura</a>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (invoice.receiptUrl) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attr("href", invoice.receiptUrl)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">`);
        Receipt($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Descargar recibo</a>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (canManageBilling && invoice.status === "open" && invoice.hostedInvoiceUrl) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attr("href", invoice.hostedInvoiceUrl)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90">`);
        Credit_card($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Pagar en Stripe</a>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="border-t pt-4"><div class="flex items-center justify-between mb-3"><h3 class="font-medium">Detalle interno</h3> `);
      if (canEditInternalDetail && !editMode) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button type="button" class="text-sm text-primary hover:underline">Editar</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (canEditInternalDetail && editMode) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex gap-2"><button type="button" class="text-sm px-2 py-1 rounded border hover:bg-muted">Cancelar</button> <button type="button"${attr("disabled", saving, true)} class="text-sm px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-1">`);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> Guardar</button></div> `);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (canEditInternalDetail && editMode) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-3"><div><label for="overlay-title" class="text-xs text-muted-foreground">Título</label> <input id="overlay-title" type="text"${attr("value", editTitle)} class="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/></div> <!--[-->`);
        const each_array_1 = ensure_array_like(editItems);
        for (let idx = 0, $$length = each_array_1.length; idx < $$length; idx++) {
          let item = each_array_1[idx];
          $$renderer2.push(`<div class="flex gap-2 items-center"><input type="text"${attr("value", item.label)} class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" placeholder="Concepto"/> <input type="number" step="0.01" min="0"${attr("value", item.amount)} class="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="0" title="Monto en USD"/> <button type="button" class="p-2 text-destructive hover:bg-destructive/10 rounded" aria-label="Eliminar línea">`);
          Trash_2($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----></button></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="flex gap-2"><input type="text"${attr("value", newItemLabel)} placeholder="Nueva línea" class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"/> <input type="number" step="0.01" min="0"${attr("value", newItemAmount)} placeholder="USD" class="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm" title="Monto en USD"/> <button type="button" class="p-2 rounded-md border border-input hover:bg-muted inline-flex items-center" aria-label="Añadir línea">`);
        Plus($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<ul class="space-y-2"><!--[-->`);
        const each_array_2 = ensure_array_like(items);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let item = each_array_2[$$index_2];
          $$renderer2.push(`<li class="flex justify-between text-sm"><span>${escape_html(item.label)}</span> <span class="font-mono">${escape_html(formatBillingAmount(item.amount, invoice.currency))}</span></li>`);
        }
        $$renderer2.push(`<!--]--></ul> `);
        if (items.length === 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-sm text-muted-foreground">Sin líneas de detalle.</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      open,
      invoice,
      canManageBilling,
      canEditInternalDetail,
      onSaveOverlay,
      canUploadProof,
      onUploadProof,
      onClose
    });
  });
}
export {
  History as H,
  InvoiceDrawer as I,
  Repeat as R,
  formatBillingAmount as f,
  setOverlaysFromApi as s
};
