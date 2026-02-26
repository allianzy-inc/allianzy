import { Z as store_get, $ as unsubscribe_stores } from "../../../../../chunks/index2.js";
import { p as page } from "../../../../../chunks/stores.js";
import { C as Credit_card } from "../../../../../chunks/credit-card.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { L as Loader_circle } from "../../../../../chunks/loader-circle.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$page", page).params.workspace;
    $$renderer2.push(`<div class="space-y-6"><h2 class="text-3xl font-bold tracking-tight">Configuraciones</h2> <div class="grid gap-6"><div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6"><h3 class="text-lg font-semibold mb-4">Preferencias Generales</h3> <div class="space-y-4"><div class="flex items-center justify-between"><div class="space-y-0.5"><label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Notificaciones por Email</label> <p class="text-sm text-muted-foreground">Recibir actualizaciones sobre tus proyectos.</p></div> <input type="checkbox" checked class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/></div></div></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6"><div class="flex items-center gap-2 mb-4">`);
    Credit_card($$renderer2, { class: "h-5 w-5 text-muted-foreground" });
    $$renderer2.push(`<!----> <h3 class="text-lg font-semibold">Proveedores de pago</h3></div> <p class="text-sm text-muted-foreground mb-4">Solo <strong>Stripe</strong> viene precargado y se sincroniza automáticamente. Agregá los métodos que necesites (ej. MercadoPago Argentina, MercadoPago Uruguay, PayPal USA, PayPal UK, transferencia bancaria). El resto son de carga manual en la facturación por empresa.</p> <div class="flex justify-end mb-4"><button type="button" class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">`);
    Plus($$renderer2, { class: "h-4 w-4" });
    $$renderer2.push(`<!----> Agregar método de pago</button></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-8">`);
      Loader_circle($$renderer2, { class: "h-6 w-6 animate-spin text-muted-foreground" });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
