import { a1 as sanitize_props, a2 as spread_props, _ as slot, a5 as stringify, Z as store_get, a0 as attr_class, a4 as ensure_array_like, $ as unsubscribe_stores, a6 as bind_props } from "../../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import { a as attr } from "../../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/state.svelte.js";
import { p as page } from "../../../../../../chunks/stores.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { U as User } from "../../../../../../chunks/user.js";
import { M as Map_pin } from "../../../../../../chunks/map-pin.js";
import { T as Trash_2 } from "../../../../../../chunks/trash-2.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { B as Building } from "../../../../../../chunks/building.js";
import { L as Link } from "../../../../../../chunks/link.js";
import { C as Credit_card } from "../../../../../../chunks/credit-card.js";
import { M as Message_square } from "../../../../../../chunks/message-square.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
function Save($$renderer, $$props) {
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
        "d": "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      }
    ],
    ["path", { "d": "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }],
    ["path", { "d": "M7 3v4a1 1 0 0 0 1 1h7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "save" },
    $$sanitized_props,
    {
      /**
       * @component @name Save
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUuMiAzYTIgMiAwIDAgMSAxLjQuNmwzLjggMy44YTIgMiAwIDAgMSAuNiAxLjRWMTlhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yeiIgLz4KICA8cGF0aCBkPSJNMTcgMjF2LTdhMSAxIDAgMCAwLTEtMUg4YTEgMSAwIDAgMC0xIDF2NyIgLz4KICA8cGF0aCBkPSJNNyAzdjRhMSAxIDAgMCAwIDEgMWg3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/save
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let user, projects, payments, cases;
    let data = $$props["data"];
    let identification = [];
    let addresses = [];
    let companyLinks = [];
    user = data.user;
    projects = data.projects;
    payments = data.payments;
    cases = data.cases;
    if (user) {
      identification = user.identification || [];
      addresses = user.addresses || [];
      companyLinks = user.companyLinks || [];
    }
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center gap-4"><a${attr("href", `/${stringify(store_get($$store_subs ??= {}, "$page", page).params.workspace)}/admin/users`)} class="p-2 hover:bg-accent rounded-full">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></a> <div class="flex-1"><h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">`);
    if (user.avatarUrl) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img${attr("src", user.avatarUrl)}${attr("alt", `${stringify(user.firstName)} ${stringify(user.lastName)}`)} class="w-10 h-10 rounded-full object-cover"/>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">`);
      User($$renderer2, { class: "w-5 h-5 text-primary" });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--> ${escape_html(user.firstName)} ${escape_html(user.lastName)}</h2> <p class="text-muted-foreground ml-14">${escape_html(user.email)}</p></div> <div class="flex items-center gap-2"><span${attr_class(`capitalize px-3 py-1 rounded-full text-sm font-medium ${stringify(user.role === "admin" ? "bg-purple-100 text-purple-700" : user.role === "staff" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}`)}>${escape_html(user.role)}</span></div></div> <div class="border-b"><nav class="flex gap-4"><button${attr_class(`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${stringify(
      "border-primary text-primary"
    )}`)}>Información General</button> <button${attr_class(`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>Proyectos (${escape_html(projects.length)})</button> <button${attr_class(`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>Pagos (${escape_html(payments.length)})</button> <button${attr_class(`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>Soporte (${escape_html(cases.length)})</button></nav></div> <div class="mt-6">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<form action="?/updateUser" method="POST" class="space-y-8 max-w-4xl"><div class="space-y-4"><h3 class="text-lg font-semibold flex items-center gap-2">`);
      User($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> Información Personal</h3> <div class="grid grid-cols-2 gap-4"><div class="space-y-2"><label class="text-sm font-medium">Nombre</label> <input type="text" name="firstName"${attr("value", user.firstName || "")} class="w-full p-2 border rounded-md"/></div> <div class="space-y-2"><label class="text-sm font-medium">Apellido</label> <input type="text" name="lastName"${attr("value", user.lastName || "")} class="w-full p-2 border rounded-md"/></div> <div class="space-y-2"><label class="text-sm font-medium">Email</label> <input type="email" name="email"${attr("value", user.email)} class="w-full p-2 border rounded-md"/></div> <div class="space-y-2"><label class="text-sm font-medium">Teléfono</label> <input type="text" name="phone"${attr("value", user.phone || "")} class="w-full p-2 border rounded-md" placeholder="+1234567890"/></div> <div class="space-y-2"><label class="text-sm font-medium">Rol</label> `);
      $$renderer2.select(
        {
          name: "role",
          value: user.role,
          class: "w-full p-2 border rounded-md"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "staff" }, ($$renderer4) => {
            $$renderer4.push(`Staff`);
          });
          $$renderer3.option({ value: "client" }, ($$renderer4) => {
            $$renderer4.push(`Cliente`);
          });
          $$renderer3.option({ value: "provider" }, ($$renderer4) => {
            $$renderer4.push(`Proveedor`);
          });
          $$renderer3.option({ value: "admin" }, ($$renderer4) => {
            $$renderer4.push(`Admin`);
          });
        }
      );
      $$renderer2.push(`</div> <div class="space-y-2 col-span-2"><label class="text-sm font-medium">Avatar URL</label> <input type="text" name="avatarUrl"${attr("value", user.avatarUrl || "")} class="w-full p-2 border rounded-md" placeholder="https://..."/></div></div></div> <div class="space-y-4"><h3 class="text-lg font-semibold flex items-center gap-2">`);
      Map_pin($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> Direcciones</h3> <input type="hidden" name="addresses"${attr("value", JSON.stringify(addresses))}/> <div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(addresses);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let addr = each_array[i];
        $$renderer2.push(`<div class="p-4 border rounded-md space-y-3 relative bg-card"><button type="button" class="absolute top-4 right-4 text-red-500 hover:text-red-700">`);
        Trash_2($$renderer2, { class: "w-5 h-5" });
        $$renderer2.push(`<!----></button> <div class="grid grid-cols-2 gap-4"><div class="space-y-1"><label class="text-xs text-muted-foreground">Etiqueta (e.g., Casa, Oficina)</label> <input type="text"${attr("value", addr.label)} class="w-full p-2 border rounded-md" placeholder="Etiqueta"/></div> <div class="space-y-1"><label class="text-xs text-muted-foreground">Dirección</label> <input type="text"${attr("value", addr.address)} class="w-full p-2 border rounded-md" placeholder="Calle 123"/></div> <div class="space-y-1"><label class="text-xs text-muted-foreground">Ciudad</label> <input type="text"${attr("value", addr.city)} class="w-full p-2 border rounded-md" placeholder="Ciudad"/></div> <div class="space-y-1"><label class="text-xs text-muted-foreground">País</label> <input type="text"${attr("value", addr.country)} class="w-full p-2 border rounded-md" placeholder="País"/></div></div></div>`);
      }
      $$renderer2.push(`<!--]--> <button type="button" class="flex items-center gap-2 text-sm text-primary hover:underline">`);
      Plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Agregar Dirección</button></div></div> <div class="space-y-4"><h3 class="text-lg font-semibold flex items-center gap-2">`);
      Building($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> Empresa</h3> <div class="grid grid-cols-2 gap-4"><div class="space-y-2"><label class="text-sm font-medium">Nombre de la Empresa</label> <input type="text" name="company"${attr("value", user.company || "")} class="w-full p-2 border rounded-md"/></div> <div class="space-y-2"><label class="text-sm font-medium">Cargo / Rol</label> <input type="text" name="jobTitle"${attr("value", user.jobTitle || "")} class="w-full p-2 border rounded-md"/></div></div> <div class="space-y-2 pt-2"><label class="text-sm font-medium flex items-center gap-2">`);
      Link($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Enlaces de Interés</label> <input type="hidden" name="companyLinks"${attr("value", JSON.stringify(companyLinks))}/> <div class="space-y-3"><!--[-->`);
      const each_array_1 = ensure_array_like(companyLinks);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let link = each_array_1[i];
        $$renderer2.push(`<div class="flex items-end gap-3"><div class="flex-1 space-y-1"><label class="text-xs text-muted-foreground">Título</label> <input type="text"${attr("value", link.title)} class="w-full p-2 border rounded-md" placeholder="Web, LinkedIn..."/></div> <div class="flex-[2] space-y-1"><label class="text-xs text-muted-foreground">URL</label> <input type="text"${attr("value", link.url)} class="w-full p-2 border rounded-md" placeholder="https://..."/></div> <button type="button" class="p-2 text-red-500 hover:bg-red-50 rounded-md mb-[1px]">`);
        Trash_2($$renderer2, { class: "w-5 h-5" });
        $$renderer2.push(`<!----></button></div>`);
      }
      $$renderer2.push(`<!--]--> <button type="button" class="flex items-center gap-2 text-sm text-primary hover:underline mt-2">`);
      Plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Agregar Enlace</button></div></div></div> <div class="space-y-4"><h3 class="text-lg font-semibold flex items-center gap-2">`);
      Credit_card($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> Documentación</h3> <input type="hidden" name="identification"${attr("value", JSON.stringify(identification))}/> <div class="space-y-3"><!--[-->`);
      const each_array_2 = ensure_array_like(identification);
      for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
        let doc = each_array_2[i];
        $$renderer2.push(`<div class="flex items-end gap-3"><div class="flex-1 space-y-1"><label class="text-xs text-muted-foreground">Tipo (e.g., DNI, Pasaporte)</label> <input type="text"${attr("value", doc.type)} class="w-full p-2 border rounded-md" placeholder="Tipo de documento"/></div> <div class="flex-[2] space-y-1"><label class="text-xs text-muted-foreground">Número / Valor</label> <input type="text"${attr("value", doc.value)} class="w-full p-2 border rounded-md" placeholder="Número de documento"/></div> <button type="button" class="p-2 text-red-500 hover:bg-red-50 rounded-md mb-[1px]">`);
        Trash_2($$renderer2, { class: "w-5 h-5" });
        $$renderer2.push(`<!----></button></div>`);
      }
      $$renderer2.push(`<!--]--> <button type="button" class="flex items-center gap-2 text-sm text-primary hover:underline mt-2">`);
      Plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Agregar Documento</button></div></div> <div class="space-y-4"><h3 class="text-lg font-semibold flex items-center gap-2">`);
      Message_square($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> Notas Adicionales</h3> <textarea name="notes" rows="4" class="w-full p-2 border rounded-md" placeholder="Notas internas sobre el cliente...">`);
      const $$body = escape_html(user.notes || "");
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <div class="pt-4"><button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 flex items-center gap-2">`);
      Save($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Guardar Cambios</button></div></form>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
