import { a4 as ensure_array_like, a5 as stringify, a0 as attr_class, a6 as bind_props } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { a as attr } from "../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { S as Search } from "../../../../../chunks/search.js";
import { F as Filter, E as Ellipsis_vertical } from "../../../../../chunks/filter.js";
import { U as User } from "../../../../../chunks/user.js";
import { P as Package } from "../../../../../chunks/package.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { P as Pencil } from "../../../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../../../chunks/trash-2.js";
import { B as Briefcase } from "../../../../../chunks/briefcase.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let projects;
    let data = $$props["data"];
    let showActionsFor = null;
    function formatDisplayDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
    }
    projects = data.projects;
    data.clients || [];
    data.services || [];
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h2 class="text-3xl font-bold tracking-tight">Proyectos</h2> <p class="text-muted-foreground">Gestiona los proyectos en curso y su estado.</p></div> <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2 font-medium">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Nuevo Proyecto</button></div> <div class="flex items-center gap-4"><div class="relative flex-1 max-w-sm">`);
    Search($$renderer2, {
      class: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar proyectos..." class="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/></div> <button class="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent hover:text-accent-foreground">`);
    Filter($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Filtrar</button></div> <div class="rounded-md border bg-card"><table class="w-full text-sm text-left"><thead class="text-muted-foreground bg-muted/50 font-medium"><tr><th class="p-4">Proyecto</th><th class="p-4">Cliente</th><th class="p-4">Servicio</th><th class="p-4">Fechas</th><th class="p-4">Estado</th><th class="p-4 text-right">Acciones</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(projects);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let project = each_array[$$index];
      $$renderer2.push(`<tr class="border-t hover:bg-muted/50 transition-colors relative"><td class="p-4"><a${attr("href", `./projects/${stringify(project.id)}`)} class="font-medium hover:underline hover:text-primary transition-colors block text-base">${escape_html(project.name)}</a> <div class="text-xs text-muted-foreground truncate max-w-[200px] mt-1">${escape_html(project.description || "Sin descripción")}</div></td><td class="p-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">`);
      User($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></div> <div class="flex flex-col"><span class="font-medium text-foreground">${escape_html(project.clientName || "Sin asignar")}</span> `);
      if (project.clientCompany) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-xs text-muted-foreground font-medium">${escape_html(project.clientCompany)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></td><td class="p-4"><div class="flex items-center gap-2">`);
      Package($$renderer2, { class: "w-4 h-4 text-muted-foreground" });
      $$renderer2.push(`<!----> <span>${escape_html(project.serviceName || "-")}</span></div></td><td class="p-4"><div class="flex items-center gap-2 text-xs text-muted-foreground">`);
      Calendar($$renderer2, { class: "w-3.5 h-3.5" });
      $$renderer2.push(`<!----> <span>${escape_html(formatDisplayDate(project.startDate))} - ${escape_html(formatDisplayDate(project.endDate))}</span></div></td><td class="p-4"><span${attr_class(`px-2.5 py-1 rounded-full text-xs font-medium border ${stringify(project.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200" : project.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200")}`)}>${escape_html(project.status)}</span></td><td class="p-4 text-right relative"><button class="p-2 hover:bg-accent rounded-full transition-colors">`);
      Ellipsis_vertical($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></button> `);
      if (showActionsFor === project.id) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute right-12 top-2 z-10 bg-card border rounded-lg shadow-lg py-1 min-w-[140px] flex flex-col"><button class="px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2">`);
        Pencil($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> Editar</button> <button class="px-4 py-2 text-left text-sm hover:bg-red-50 text-red-500 flex items-center gap-2">`);
        Trash_2($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> Eliminar</button></div> <div class="fixed inset-0 z-0"></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></td></tr>`);
    }
    $$renderer2.push(`<!--]-->`);
    if (projects.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<tr><td colspan="6" class="p-12 text-center border-t"><div class="flex flex-col items-center justify-center text-muted-foreground">`);
      Briefcase($$renderer2, { class: "w-10 h-10 mb-3 opacity-20" });
      $$renderer2.push(`<!----> <p class="text-lg font-medium text-foreground">No hay proyectos</p> <p class="text-sm">Comienza creando el primer proyecto para un cliente.</p> <button class="mt-4 text-primary font-medium hover:underline">Crear Proyecto</button></div></td></tr>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div> `);
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
