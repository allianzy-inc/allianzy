import { Z as store_get, a0 as attr_class, a7 as attr_style, _ as slot, $ as unsubscribe_stores, a5 as stringify } from "../../../../chunks/index2.js";
import { p as page } from "../../../../chunks/stores.js";
import { a as logoDark, l as logoLight } from "../../../../chunks/logo-dark.js";
import { L as Laptop, a as Languages, b as beltrixLogoLight, c as beltrixLogoDark } from "../../../../chunks/beltrix-logo-dark.js";
import { a as attr } from "../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let workspace, isAllianzyIntake, effectiveDark, showDarkIntake;
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    let prefersDark = true;
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    isAllianzyIntake = workspace === "allianzy";
    effectiveDark = prefersDark;
    showDarkIntake = isAllianzyIntake && effectiveDark;
    $$renderer2.push(`<div${attr_class(`min-h-screen flex flex-col ${stringify(isAllianzyIntake ? showDarkIntake ? "text-zinc-100" : "bg-zinc-100 text-zinc-900" : "bg-background text-foreground")}`)}${attr_style(isAllianzyIntake && showDarkIntake ? "background: radial-gradient(ellipse 120% 100% at 50% -10%, rgba(15, 23, 42, 0.6) 0%, transparent 50%), linear-gradient(180deg, #0B0F1A 0%, #070A12 70%, #050810 100%);" : isAllianzyIntake && !showDarkIntake ? "background: linear-gradient(180deg, #f4f4f5 0%, #e4e4e7 100%);" : void 0)}><header${attr_class(isAllianzyIntake ? showDarkIntake ? "border-white/10 bg-black/30 backdrop-blur-md" : "border-zinc-200/80 bg-white/80 backdrop-blur-md" : "border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60")}><div class="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between"><a${attr("href", `/${stringify(workspace)}`)} class="flex items-center gap-2">`);
    if (workspace === "beltrix") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img${attr("src", beltrixLogoLight)} alt="Beltrix" class="h-7 w-auto dark:hidden"/> <img${attr("src", beltrixLogoDark)} alt="Beltrix" class="h-7 w-auto hidden dark:block"/>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (isAllianzyIntake) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", showDarkIntake ? logoDark : logoLight)} alt="Allianzy" class="h-7 w-auto"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<img${attr("src", logoLight)} alt="Allianzy" class="h-7 w-auto dark:hidden"/> <img${attr("src", logoDark)} alt="Allianzy" class="h-7 w-auto hidden dark:block"/>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></a> <div class="flex items-center gap-3"><div class="relative"><button${attr_class(`p-2 rounded-full transition-colors ${stringify(isAllianzyIntake ? showDarkIntake ? "hover:bg-white/10 text-zinc-400 hover:text-zinc-100" : "hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900" : "hover:bg-accent text-muted-foreground hover:text-foreground")}`)} aria-label="Cambiar tema">`);
    {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[!-->");
        Laptop($$renderer2, { class: "h-5 w-5" });
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="relative"><button${attr_class(`p-2 rounded-full transition-colors ${stringify(isAllianzyIntake ? showDarkIntake ? "hover:bg-white/10 text-zinc-400 hover:text-zinc-100" : "hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900" : "hover:bg-accent text-muted-foreground hover:text-foreground")}`)} aria-label="Cambiar idioma">`);
    Languages($$renderer2, { class: "h-5 w-5" });
    $$renderer2.push(`<!----></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div></header> <main class="flex-1 flex flex-col items-center px-4 py-6 md:py-8">`);
    if (isAllianzyIntake) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="w-full max-w-3xl flex flex-col flex-1"><div${attr_class(`w-full rounded-2xl border shadow-xl p-6 md:p-8 flex-1 ${stringify(showDarkIntake ? "dark border-white/10 bg-zinc-900/90 shadow-black/20" : "border-zinc-200/80 bg-white/95 shadow-zinc-200/50")}`)}><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></main> <footer${attr_class(`border-t py-4 text-xs ${stringify(isAllianzyIntake ? showDarkIntake ? "border-white/10 text-zinc-500" : "border-zinc-200 text-zinc-500" : "text-muted-foreground")}`)}><div class="container mx-auto px-4 flex items-center justify-between gap-4"><span>© ${escape_html(year)} Allianzy Inc. Todos los derechos reservados.</span> <span class="hidden sm:inline">Evaluación preliminar. No constituye propuesta ni aceptación definitiva de proyecto.</span></div></footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
