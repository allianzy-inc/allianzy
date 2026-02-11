import { Z as store_get, a4 as ensure_array_like, a0 as attr_class, a5 as stringify, $ as unsubscribe_stores, a6 as bind_props } from "../../../../../chunks/index2.js";
import { t as translations, c as currentLang } from "../../../../../chunks/i18n.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { D as DocumentPreviewModal } from "../../../../../chunks/DocumentPreviewModal.js";
import { C as Credit_card } from "../../../../../chunks/credit-card.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { E as Eye } from "../../../../../chunks/eye.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let t, payments;
    let data = $$props["data"];
    let isPreviewModalOpen = false;
    let previewFile = { title: "", url: null };
    function closePreview() {
      isPreviewModalOpen = false;
      previewFile = { title: "", url: null };
    }
    function getStatusColor(status) {
      switch (status) {
        case "paid":
          return "bg-green-100 text-green-700 border-green-200";
        case "overdue":
          return "bg-red-100 text-red-700 border-red-200";
        default:
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
      }
    }
    function getStatusLabel(status) {
      const map = {
        "paid": "Pagado",
        "pending": "Pendiente",
        "overdue": "Vencido"
      };
      return map[status] || status;
    }
    t = translations[store_get($$store_subs ??= {}, "$currentLang", currentLang)];
    payments = data.payments;
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h2 class="text-2xl font-bold tracking-tight">${escape_html(t.dashboard.page.billing.title)}</h2> <p class="text-muted-foreground">${escape_html(t.dashboard.page.billing.subtitle)}</p></div></div> <div class="rounded-md border bg-card"><div class="p-6">`);
    if (payments.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-12">`);
      Credit_card($$renderer2, {
        class: "h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50"
      });
      $$renderer2.push(`<!----> <h3 class="text-lg font-medium">No hay pagos registrados</h3> <p class="text-muted-foreground mt-1">Aún no tienes historial de pagos o facturas pendientes.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="hidden md:block relative w-full overflow-auto"><table class="w-full caption-bottom text-sm text-left"><thead class="[&amp;_tr]:border-b"><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Concepto</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Proyecto / Servicio</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Monto</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Vencimiento</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Acciones</th></tr></thead><tbody class="[&amp;_tr:last-child]:border-0"><!--[-->`);
      const each_array = ensure_array_like(payments);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let payment = each_array[$$index];
        $$renderer2.push(`<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"><td class="p-4 align-middle font-medium">${escape_html(payment.title)}</td><td class="p-4 align-middle"><div class="flex flex-col"><span>${escape_html(payment.projectName)}</span> `);
        if (payment.serviceName) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-xs text-muted-foreground">${escape_html(payment.serviceName)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></td><td class="p-4 align-middle font-mono">${escape_html(payment.amount)}</td><td class="p-4 align-middle">`);
        if (payment.dueDate) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex items-center gap-2">`);
          Calendar($$renderer2, { class: "h-3 w-3 text-muted-foreground" });
          $$renderer2.push(`<!----> ${escape_html(new Date(payment.dueDate).toLocaleDateString())}</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`-`);
        }
        $$renderer2.push(`<!--]--></td><td class="p-4 align-middle"><span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${stringify(getStatusColor(payment.status || "pending"))}`)}>${escape_html(getStatusLabel(payment.status || "pending"))}</span></td><td class="p-4 align-middle text-right">`);
        if (payment.documentUrl) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8" title="Ver comprobante">`);
          Eye($$renderer2, { class: "h-4 w-4" });
          $$renderer2.push(`<!----> <span class="sr-only">Ver comprobante</span></button>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div> <div class="md:hidden space-y-4"><!--[-->`);
      const each_array_1 = ensure_array_like(payments);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let payment = each_array_1[$$index_1];
        $$renderer2.push(`<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4"><div class="flex justify-between items-start gap-4"><div class="space-y-1"><h4 class="font-semibold leading-none tracking-tight">${escape_html(payment.title)}</h4> <p class="text-sm text-muted-foreground">${escape_html(payment.projectName)}</p> `);
        if (payment.serviceName) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-xs text-muted-foreground">${escape_html(payment.serviceName)}</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="font-mono font-medium whitespace-nowrap">${escape_html(payment.amount)}</div></div> <div class="flex items-center justify-between pt-2 border-t"><div class="space-y-2">`);
        if (payment.dueDate) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex items-center gap-2 text-sm text-muted-foreground">`);
          Calendar($$renderer2, { class: "h-3 w-3" });
          $$renderer2.push(`<!----> ${escape_html(new Date(payment.dueDate).toLocaleDateString())}</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${stringify(getStatusColor(payment.status || "pending"))}`)}>${escape_html(getStatusLabel(payment.status || "pending"))}</span></div> `);
        if (payment.documentUrl) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9" title="Ver comprobante">`);
          Eye($$renderer2, { class: "h-4 w-4" });
          $$renderer2.push(`<!----> <span class="sr-only">Ver comprobante</span></button>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    DocumentPreviewModal($$renderer2, {
      isOpen: isPreviewModalOpen,
      title: previewFile.title,
      fileUrl: previewFile.url,
      onClose: closePreview
    });
    $$renderer2.push(`<!----></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
