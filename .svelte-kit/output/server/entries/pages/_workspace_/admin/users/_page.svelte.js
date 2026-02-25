import { a4 as ensure_array_like, a5 as stringify, Z as store_get, a0 as attr_class, $ as unsubscribe_stores, a6 as bind_props } from "../../../../../chunks/index2.js";
import { p as page } from "../../../../../chunks/stores.js";
import { U as Users } from "../../../../../chunks/users.js";
import { S as Search } from "../../../../../chunks/search.js";
import { F as Filter } from "../../../../../chunks/filter.js";
import { E as Ellipsis_vertical } from "../../../../../chunks/ellipsis-vertical.js";
import { a as attr } from "../../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let users;
    let data = $$props["data"];
    users = data.users;
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h2 class="text-3xl font-bold tracking-tight">Usuarios</h2> <p class="text-muted-foreground">Gestiona clientes, empleados y administradores.</p></div> <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2">`);
    Users($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Nuevo Usuario</button></div> <div class="flex items-center gap-4"><div class="relative flex-1 max-w-sm">`);
    Search($$renderer2, {
      class: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar usuarios..." class="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/></div> <button class="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent hover:text-accent-foreground">`);
    Filter($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Filtrar</button></div> <div class="rounded-md border bg-card"><table class="w-full text-sm text-left"><thead class="text-muted-foreground bg-muted/50 font-medium"><tr><th class="p-4">Nombre</th><th class="p-4">Email</th><th class="p-4">Rol</th><th class="p-4">Estado</th><th class="p-4 text-right">Acciones</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(users);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let user = each_array[$$index];
      $$renderer2.push(`<tr class="border-t hover:bg-muted/50 transition-colors"><td class="p-4 font-medium"><a${attr("href", `/${stringify(store_get($$store_subs ??= {}, "$page", page).params.workspace)}/admin/users/${stringify(user.id)}`)} class="hover:underline text-primary">${escape_html(user.firstName)} ${escape_html(user.lastName)}</a></td><td class="p-4">${escape_html(user.email)}</td><td class="p-4"><span${attr_class(`capitalize px-2 py-1 rounded-full text-xs font-medium ${stringify(user.role === "admin" ? "bg-purple-100 text-purple-700" : user.role === "staff" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}`)}>${escape_html(user.role)}</span></td><td class="p-4"><span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">${escape_html(user.status)}</span></td><td class="p-4 text-right"><button class="p-2 hover:bg-accent rounded-full">`);
      Ellipsis_vertical($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></button></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
