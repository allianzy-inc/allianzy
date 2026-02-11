import { Z as store_get, a0 as attr_class, $ as unsubscribe_stores, a5 as stringify } from "../../../../../chunks/index2.js";
import { p as page } from "../../../../../chunks/stores.js";
import "../../../../../chunks/auth-client.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { a as attr } from "../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { l as logoLight, a as logoDark } from "../../../../../chunks/logo-dark.js";
import { c as currentLang } from "../../../../../chunks/i18n.js";
import { M as Mail } from "../../../../../chunks/mail.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang;
    const workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    let email = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("email") || "";
    let isLoading = false;
    lang = store_get($$store_subs ??= {}, "$currentLang", currentLang);
    $$renderer2.push(`<div${attr_class(`relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-950 ${stringify(workspace === "allianzy" ? "font-bricolage" : workspace === "beltrix" ? "font-merriweather" : "font-sans")}`)}><div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"><div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse"></div> <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" style="animation-delay: 1.5s;"></div> <div class="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-pink-500/20 blur-[120px] animate-pulse" style="animation-delay: 3s;"></div></div> <div class="relative w-full max-w-md p-8 backdrop-blur-2xl bg-white/70 dark:bg-zinc-900/60 border border-white/20 dark:border-white/5 rounded-3xl shadow-2xl z-10 mx-4 transition-all duration-300"><div class="flex flex-col items-center mb-8 text-center">`);
    if (workspace === "allianzy") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a href="/" class="mb-6 transition-opacity hover:opacity-80 block"><img${attr("src", logoLight)} alt="Allianzy" class="h-10 dark:hidden"/> <img${attr("src", logoDark)} alt="Allianzy" class="h-10 hidden dark:block"/></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<a${attr("href", `/${stringify(workspace)}`)} class="block mb-4 transition-opacity hover:opacity-80"><h1 class="text-3xl font-bold tracking-tight text-foreground">Beltrix Agency</h1></a>`);
    }
    $$renderer2.push(`<!--]--> <h2 class="text-2xl font-bold text-foreground tracking-tight">${escape_html(lang === "es" ? "¿Olvidaste tu contraseña?" : "Forgot your password?")}</h2> <p class="text-sm text-muted-foreground mt-2">${escape_html(lang === "es" ? "Ingresa el correo asociado a tu cuenta y te enviaremos un enlace para restablecerla." : "Enter the email associated with your account and we'll send you a reset link.")}</p></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <form class="space-y-5"><div class="space-y-2"><label class="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">${escape_html(lang === "es" ? "Correo electrónico" : "Email Address")}</label> <div class="relative group">`);
    Mail($$renderer2, {
      class: "absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors"
    });
    $$renderer2.push(`<!----> <input type="email"${attr("value", email)} required class="flex h-11 w-full rounded-xl border border-input bg-white/50 dark:bg-black/20 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all shadow-sm"${attr("placeholder", lang === "es" ? "correo@ejemplo.com" : "name@example.com")}/></div></div> <button type="submit"${attr("disabled", isLoading, true)} class="w-full h-11 mt-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`${escape_html(lang === "es" ? "Enviar enlace de restablecimiento" : "Send reset link")} <span class="text-lg">→</span>`);
    }
    $$renderer2.push(`<!--]--></button></form> <div class="mt-8 pt-6 border-t border-border/50"><button type="button" class="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mx-auto">`);
    Arrow_left($$renderer2, { class: "w-4 h-4 mr-1" });
    $$renderer2.push(`<!----> ${escape_html(lang === "es" ? "Volver al acceso" : "Back to login")}</button></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
