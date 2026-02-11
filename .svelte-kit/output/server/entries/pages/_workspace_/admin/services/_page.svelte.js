import { a4 as ensure_array_like, a0 as attr_class, a6 as bind_props } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { C as Chevron_down } from "../../../../../chunks/chevron-down.js";
import { C as Chevron_right } from "../../../../../chunks/chevron-right.js";
import { P as Pencil } from "../../../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../../../chunks/trash-2.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let expandedServices = {};
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h2 class="text-3xl font-bold tracking-tight">Servicios y Subservicios</h2> <p class="text-muted-foreground">Gestiona el catálogo de servicios ofrecidos.</p></div> <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2 font-medium">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Nuevo Servicio</button></div> `);
    if (data.services.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10"><p class="text-muted-foreground">No hay servicios configurados.</p> <button class="mt-4 text-primary font-medium hover:underline">Crear el primer servicio</button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(data.services);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let service = each_array[$$index_1];
        $$renderer2.push(`<div class="border rounded-xl bg-card overflow-hidden"><div class="p-4 flex items-center justify-between bg-muted/30"><div class="flex items-center gap-4 flex-1"><button class="p-1 hover:bg-muted rounded-md transition-colors">`);
        if (expandedServices[service.id]) {
          $$renderer2.push("<!--[-->");
          Chevron_down($$renderer2, { class: "w-5 h-5 text-muted-foreground" });
        } else {
          $$renderer2.push("<!--[!-->");
          Chevron_right($$renderer2, { class: "w-5 h-5 text-muted-foreground" });
        }
        $$renderer2.push(`<!--]--></button> <div><h3 class="font-semibold text-lg">${escape_html(service.name)}</h3> <div class="flex items-center gap-3 text-sm text-muted-foreground"><span>${escape_html(service.price || "Precio no definido")}</span> <span class="w-1 h-1 rounded-full bg-muted-foreground/30"></span> <span class="flex items-center gap-1"><span${attr_class(`w-2 h-2 rounded-full ${service.status === "Active" ? "bg-green-500" : "bg-yellow-500"}`)}></span> ${escape_html(service.status)}</span></div></div></div> <div class="flex items-center gap-2"><button class="text-sm px-3 py-1.5 bg-background border rounded-md hover:bg-accent transition-colors flex items-center gap-2">`);
        Plus($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> Subservicio</button> <div class="h-4 w-px bg-border mx-1"></div> <button class="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md" title="Editar">`);
        Pencil($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button> <button class="p-2 text-red-500 hover:bg-red-50 rounded-md dark:hover:bg-red-900/20" title="Eliminar">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></div></div> `);
        if (expandedServices[service.id]) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="border-t bg-muted/10">`);
          if (service.subservices.length === 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="p-4 pl-14 text-sm text-muted-foreground italic">No hay subservicios. Añade uno para detallar este servicio.</div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="divide-y"><!--[-->`);
            const each_array_1 = ensure_array_like(service.subservices);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let sub = each_array_1[$$index];
              $$renderer2.push(`<div class="p-3 pl-14 flex items-center justify-between hover:bg-muted/20 transition-colors group"><div><p class="font-medium text-sm">${escape_html(sub.name)}</p> `);
              if (sub.description) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<p class="text-xs text-muted-foreground">${escape_html(sub.description)}</p>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity"><span class="text-xs text-muted-foreground">${escape_html(sub.price || "-")}</span> <div class="flex items-center gap-1"><button class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md">`);
              Pencil($$renderer2, { class: "w-3.5 h-3.5" });
              $$renderer2.push(`<!----></button> <button class="p-1.5 text-red-500 hover:bg-red-50 rounded-md dark:hover:bg-red-900/20">`);
              Trash_2($$renderer2, { class: "w-3.5 h-3.5" });
              $$renderer2.push(`<!----></button></div></div></div>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
