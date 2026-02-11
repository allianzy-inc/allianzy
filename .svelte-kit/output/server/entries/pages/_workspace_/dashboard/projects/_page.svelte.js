import { Z as store_get, a4 as ensure_array_like, a5 as stringify, a0 as attr_class, $ as unsubscribe_stores, a6 as bind_props } from "../../../../../chunks/index2.js";
import { t as translations, c as currentLang } from "../../../../../chunks/i18n.js";
import { L as Layers } from "../../../../../chunks/layers.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
import { a as attr } from "../../../../../chunks/attributes.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let t;
    let data = $$props["data"];
    t = translations[store_get($$store_subs ??= {}, "$currentLang", currentLang)];
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h2 class="text-2xl font-bold tracking-tight">${escape_html(t.dashboard.page.projects.title)}</h2> <p class="text-muted-foreground">${escape_html(t.dashboard.page.projects.subtitle)}</p></div></div> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">`);
    if (data.projects.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="col-span-full text-center p-12 border-2 border-dashed rounded-lg bg-muted/10"><p class="text-muted-foreground">No hay proyectos activos asignados a tu cuenta.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.projects);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let project = each_array[$$index];
        $$renderer2.push(`<a${attr("href", `/${stringify(data.workspace)}/dashboard/projects/${stringify(project.id)}`)} class="group block h-full"><div class="h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-lg hover:border-primary/50 overflow-hidden flex flex-col"><div class="h-32 w-full bg-muted border-b relative overflow-hidden">`);
        if (project.imageUrl) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<img${attr("src", project.imageUrl)} alt="Project Cover" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" loading="lazy"/> <div class="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="w-full h-full bg-neutral-200 dark:bg-neutral-800"></div>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="p-6 flex flex-col flex-grow space-y-4"><div class="space-y-2"><div class="flex items-start justify-between gap-2"><h3 class="font-bold text-xl leading-tight tracking-tight group-hover:text-primary transition-colors">${escape_html(project.name)}</h3></div> <p class="text-sm text-muted-foreground line-clamp-2 leading-relaxed">${escape_html(project.description || "Sin descripción disponible.")}</p></div> <div class="pt-4 mt-auto border-t flex items-center justify-between text-sm"><div class="flex flex-col gap-1"><span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</span> <span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${stringify(project.status === "Active" || project.status === "In Progress" ? "border-transparent bg-green-500/15 text-green-700 dark:text-green-400" : project.status === "Pending" ? "border-transparent bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" : "border-transparent bg-secondary text-secondary-foreground")}`)}>${escape_html(project.status)}</span></div> `);
        if (project.endDate) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex flex-col gap-1 text-right"><span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Entrega</span> <span class="font-medium">${escape_html(new Date(project.endDate).toLocaleDateString())}</span></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> `);
        if (project.serviceName) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="text-xs text-muted-foreground font-medium pt-2 flex items-center gap-1">`);
          Layers($$renderer2, { class: "w-3 h-3" });
          $$renderer2.push(`<!----> ${escape_html(project.serviceName)}</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div></a>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
