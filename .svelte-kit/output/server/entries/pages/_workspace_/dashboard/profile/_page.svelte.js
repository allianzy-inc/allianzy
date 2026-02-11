import { Z as store_get, a4 as ensure_array_like, $ as unsubscribe_stores, a6 as bind_props } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { a as attr } from "../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { t as translations, c as currentLang } from "../../../../../chunks/i18n.js";
import { U as User } from "../../../../../chunks/user.js";
import { L as Loader_circle, U as Upload } from "../../../../../chunks/upload.js";
import { T as Trash_2 } from "../../../../../chunks/trash-2.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
import { L as Link } from "../../../../../chunks/link.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let profile, t;
    let data = $$props["data"];
    let addresses = [];
    let companyLinks = [];
    let identification = [];
    let saving = {};
    profile = data.profile;
    t = translations[store_get($$store_subs ??= {}, "$currentLang", currentLang)];
    if (profile) {
      addresses = profile.addresses || [];
      companyLinks = profile.companyLinks || profile.company_links || [];
      identification = profile.identification || [];
    }
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h2 class="text-2xl font-bold tracking-tight">${escape_html(
      // Temporary state for new items
      // File input references
      // Loading states
      // trigger reactivity
      // Reset file input
      t.dashboard.page.profile.title
    )}</h2> <p class="text-muted-foreground">${escape_html(t.dashboard.page.profile.subtitle)}</p> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="space-y-6"><div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 border-b"><h3 class="text-lg font-semibold flex items-center gap-2">`);
    User($$renderer2, { class: "w-5 h-5 text-primary" });
    $$renderer2.push(`<!----> ${escape_html(t.dashboard.page.profile.personal_info.title)}</h3></div> <div class="p-6 space-y-8"><div class="flex items-center gap-6"><div class="relative group"><div class="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">`);
    if (profile?.avatarUrl || profile?.avatar_url) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img${attr("src", profile?.avatarUrl || profile?.avatar_url)} alt="Profile" class="w-full h-full object-cover"/>`);
    } else {
      $$renderer2.push("<!--[!-->");
      User($$renderer2, { class: "w-10 h-10 text-muted-foreground" });
    }
    $$renderer2.push(`<!--]--> `);
    if (saving["avatar"]) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="absolute inset-0 bg-background/50 flex items-center justify-center">`);
      Loader_circle($$renderer2, { class: "w-6 h-6 animate-spin text-primary" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if ((profile?.avatarUrl || profile?.avatar_url) && !saving["avatar"]) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button type="button" class="absolute top-0 right-0 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"${attr("title", t.dashboard.page.profile.personal_info.avatar.delete_tooltip)}>`);
      Trash_2($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <button type="button" class="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-sm"${attr("disabled", saving["avatar"], true)}>`);
    Upload($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button> <input type="file" name="avatar" accept="image/*" class="hidden"/></div> <div class="flex-1"><h4 class="font-medium">${escape_html(t.dashboard.page.profile.personal_info.avatar.label)}</h4> <p class="text-sm text-muted-foreground">${escape_html(t.dashboard.page.profile.personal_info.avatar.desc)}</p></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium flex items-center justify-between">${escape_html(t.dashboard.page.profile.personal_info.name)} `);
    if (saving["firstName"]) {
      $$renderer2.push("<!--[-->");
      Loader_circle($$renderer2, { class: "w-3 h-3 animate-spin text-muted-foreground" });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></label> <input type="text"${attr("value", profile?.firstName || profile?.first_name || "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div> <div class="space-y-2"><label class="text-sm font-medium flex items-center justify-between">${escape_html(t.dashboard.page.profile.personal_info.lastname)} `);
    if (saving["lastName"]) {
      $$renderer2.push("<!--[-->");
      Loader_circle($$renderer2, { class: "w-3 h-3 animate-spin text-muted-foreground" });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></label> <input type="text"${attr("value", profile?.lastName || profile?.last_name || "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div> <div class="space-y-2"><label class="text-sm font-medium">${escape_html(t.dashboard.page.profile.personal_info.email)}</label> <input type="email"${attr("value", profile?.email || "")} disabled class="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-70 cursor-not-allowed"/></div> <div class="space-y-2"><label class="text-sm font-medium flex items-center justify-between">${escape_html(t.dashboard.page.profile.personal_info.phone)} `);
    if (saving["phone"]) {
      $$renderer2.push("<!--[-->");
      Loader_circle($$renderer2, { class: "w-3 h-3 animate-spin text-muted-foreground" });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></label> <input type="tel"${attr("value", profile?.phone || "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div></div></div></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 border-b flex items-center justify-between"><h3 class="text-lg font-semibold flex items-center gap-2">`);
    File_text($$renderer2, { class: "w-5 h-5 text-primary" });
    $$renderer2.push(`<!----> ${escape_html(t.dashboard.page.profile.documents.title)} `);
    if (saving["identification"]) {
      $$renderer2.push("<!--[-->");
      Loader_circle($$renderer2, { class: "w-4 h-4 animate-spin text-muted-foreground ml-2" });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></h3></div> <div class="p-6 space-y-4"><!--[-->`);
    const each_array = ensure_array_like(identification);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let id = each_array[i];
      $$renderer2.push(`<div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30"><div class="flex items-center gap-3"><div class="font-medium text-sm px-2 py-0.5 bg-background border rounded">${escape_html(id.type)}</div> <span class="text-sm font-mono">${escape_html(id.value)}</span></div> <button type="button" class="text-muted-foreground hover:text-destructive transition-colors p-1">`);
      Trash_2($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">`);
      Plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> ${escape_html(t.dashboard.page.profile.documents.add_button)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="space-y-6"><div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 border-b flex items-center justify-between"><h3 class="text-lg font-semibold flex items-center gap-2">`);
    Map_pin($$renderer2, { class: "w-5 h-5 text-primary" });
    $$renderer2.push(`<!----> ${escape_html(t.dashboard.page.profile.addresses.title)} `);
    if (saving["addresses"]) {
      $$renderer2.push("<!--[-->");
      Loader_circle($$renderer2, { class: "w-4 h-4 animate-spin text-muted-foreground ml-2" });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></h3></div> <div class="p-6 space-y-4"><!--[-->`);
    const each_array_1 = ensure_array_like(addresses);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let address = each_array_1[i];
      $$renderer2.push(`<div class="flex items-start justify-between p-4 rounded-lg border bg-muted/30"><div><div class="font-medium">${escape_html(address.label)}</div> <div class="text-sm text-muted-foreground mt-1">${escape_html(address.address)} `);
      if (address.city || address.state || address.postalCode || address.country) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<br/> ${escape_html([
          [address.city, address.state, address.postalCode].filter(Boolean).join(" "),
          address.country
        ].filter(Boolean).join(", "))}`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div> <button type="button" class="text-muted-foreground hover:text-destructive transition-colors p-1">`);
      Trash_2($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">`);
      Plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> ${escape_html(t.dashboard.page.profile.addresses.add_button)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 border-b flex items-center justify-between"><h3 class="text-lg font-semibold flex items-center gap-2">`);
    Link($$renderer2, { class: "w-5 h-5 text-primary" });
    $$renderer2.push(`<!----> ${escape_html(t.dashboard.page.profile.links.title)} `);
    if (saving["links"]) {
      $$renderer2.push("<!--[-->");
      Loader_circle($$renderer2, { class: "w-4 h-4 animate-spin text-muted-foreground ml-2" });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></h3></div> <div class="p-6 space-y-4"><!--[-->`);
    const each_array_2 = ensure_array_like(companyLinks);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let link = each_array_2[i];
      $$renderer2.push(`<div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30"><div class="flex items-center gap-3 overflow-hidden"><div class="font-medium text-sm whitespace-nowrap">${escape_html(link.title)}</div> <div class="text-sm text-muted-foreground truncate">${escape_html(link.url)}</div></div> <button type="button" class="text-muted-foreground hover:text-destructive transition-colors p-1">`);
      Trash_2($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">`);
      Plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> ${escape_html(t.dashboard.page.profile.links.add_button)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
