import { a6 as bind_props } from "../../../../../../chunks/index2.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
import { a as attr } from "../../../../../../chunks/attributes.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    $$renderer2.push(`<div class="space-y-8"><div class="space-y-2"><h1 class="text-2xl font-bold">Solicitar contacto técnico</h1> <p class="text-sm text-muted-foreground">Si preferís no crear una cuenta todavía, podés dejar tus datos y continuaremos el proceso por email.</p></div> `);
    if (form?.success) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:border dark:border-emerald-800/50 dark:text-emerald-200 px-4 py-3 text-sm space-y-2"><p>Hemos recibido tu solicitud. Uno de nuestros asesores técnicos se contactará contigo vía email.</p> `);
      if (form.emailWarning) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-xs text-emerald-900 dark:text-emerald-300">${escape_html(form.emailWarning)}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (form?.error) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="rounded-md bg-red-50 text-red-700 dark:bg-red-950/80 dark:border dark:border-red-800/50 dark:text-red-200 px-4 py-3 text-sm">${escape_html(form.error)}</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <form method="POST" class="space-y-6"><div class="space-y-2"><label class="text-sm font-medium" for="full_name">Nombre completo</label> <input id="full_name" name="full_name" type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"${attr("value", form?.values?.full_name)} required/> `);
      if (form?.fieldErrors?.full_name) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-xs text-red-600">${escape_html(form.fieldErrors.full_name[0])}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-2"><label class="text-sm font-medium" for="email">Correo electrónico</label> <input id="email" name="email" type="email" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"${attr("value", form?.values?.email)} required/> `);
      if (form?.fieldErrors?.email) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-xs text-red-600">${escape_html(form.fieldErrors.email[0])}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-2"><label class="text-sm font-medium" for="company">Empresa</label> <input id="company" name="company" type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"${attr("value", form?.values?.company)} required/> `);
      if (form?.fieldErrors?.company) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-xs text-red-600">${escape_html(form.fieldErrors.company[0])}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-2"><label class="text-sm font-medium" for="role_title">Cargo / Rol (opcional)</label> <input id="role_title" name="role_title" type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"${attr("value", form?.values?.role_title)}/></div> <button type="submit" class="w-full h-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-colors">Enviar solicitud</button></form>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
