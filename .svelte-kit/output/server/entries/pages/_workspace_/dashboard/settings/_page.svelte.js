import { Z as store_get, $ as unsubscribe_stores, a6 as bind_props, a0 as attr_class, a4 as ensure_array_like, a5 as stringify } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { a as attr } from "../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { t as translations, c as currentLang } from "../../../../../chunks/i18n.js";
import { B as Building_2 } from "../../../../../chunks/building-2.js";
import { U as Users } from "../../../../../chunks/users.js";
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
    let t, organization, currentUser, currentUserRole, isMember;
    let data = $$props["data"];
    let addresses = [];
    let companyLinks = [];
    let documents = [];
    let saving = {};
    t = translations[store_get($$store_subs ??= {}, "$currentLang", currentLang)];
    organization = data.company || {};
    data.companyUsers || [];
    data.companyProjects || [];
    currentUser = data.currentUser;
    currentUserRole = data.companyUsers?.find((u) => u.id?.toString() === currentUser?.id?.toString())?.role;
    isMember = currentUserRole === "member";
    if (organization) {
      addresses = organization.addresses || [];
      companyLinks = organization.links || [];
      documents = organization.documents || [];
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h2 class="text-2xl font-bold tracking-tight">${escape_html(t.dashboard.page.settings.title)}</h2> <p class="text-muted-foreground">${escape_html(t.dashboard.page.settings.subtitle)}</p> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="flex border-b overflow-x-auto"><button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify(
        "border-primary text-primary"
      )}`)}>`);
      Building_2($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----> ${escape_html(t.dashboard.page.settings.tabs?.organization || "Business")}</button> <button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
      Users($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----> ${escape_html(t.dashboard.page.settings.tabs?.users || "Users & Permissions")}</button></div> `);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="space-y-6"><div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 border-b"><h3 class="text-lg font-semibold flex items-center gap-2">`);
        Building_2($$renderer3, { class: "w-5 h-5 text-primary" });
        $$renderer3.push(`<!----> ${escape_html(t.dashboard.page.settings.organization.details?.title || "Business Details")}</h3></div> <div class="p-6 space-y-8"><div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"><div class="relative group"><div class="w-24 h-24 rounded-lg overflow-hidden bg-muted border-2 border-border flex items-center justify-center">`);
        if (organization?.logo) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<img${attr("src", organization?.logo)} alt="Logo" class="w-full h-full object-cover"/>`);
        } else {
          $$renderer3.push("<!--[!-->");
          Building_2($$renderer3, { class: "w-10 h-10 text-muted-foreground" });
        }
        $$renderer3.push(`<!--]--> `);
        if (saving["logo"]) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="absolute inset-0 bg-background/50 flex items-center justify-center">`);
          Loader_circle($$renderer3, { class: "w-6 h-6 animate-spin text-primary" });
          $$renderer3.push(`<!----></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div> `);
        if (organization?.logo && !saving["logo"] && !isMember) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<button type="button" class="absolute top-0 right-0 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"${attr("title", t.dashboard.page.settings.organization.details.logo.delete_confirm?.delete || "Delete Logo")}>`);
          Trash_2($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (!isMember) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<button type="button" class="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", saving["logo"], true)}>`);
          Upload($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <input type="file" name="logo" accept="image/*" class="hidden"/></div> <div class="flex-1"><h4 class="font-medium">${escape_html(t.dashboard.page.settings.organization.details.logo?.label || "Company Logo")}</h4> `);
        if (!isMember) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="text-sm text-muted-foreground">${escape_html(t.dashboard.page.settings.organization.details.logo?.desc || "Upload your company logo. Recommended size 400x400px.")}</p>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div></div> <div class="grid grid-cols-1 gap-6"><div class="space-y-2"><label class="text-sm font-medium flex items-center justify-between">${escape_html(t.dashboard.page.settings.organization.details?.name || "Company Name")} `);
        if (saving["name"]) {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "w-3 h-3 animate-spin text-muted-foreground" });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></label> <input type="text"${attr("value", organization?.name || "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", isMember, true)}/></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium flex items-center justify-between">${escape_html(t.dashboard.page.settings.organization.details?.email || "Email Address")} `);
        if (saving["email"]) {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "w-3 h-3 animate-spin text-muted-foreground" });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></label> <input type="email"${attr("value", organization?.email || "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", isMember, true)}/></div> <div class="space-y-2"><label class="text-sm font-medium flex items-center justify-between">${escape_html(t.dashboard.page.settings.organization.details?.phone || "Phone Number")} `);
        if (saving["phone"]) {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "w-3 h-3 animate-spin text-muted-foreground" });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></label> <input type="tel"${attr("value", organization?.phone || "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", isMember, true)}/></div></div> <div class="space-y-2"><label class="text-sm font-medium flex items-center justify-between">${escape_html(t.dashboard.page.settings.organization.details?.description || "Description")} `);
        if (saving["description"]) {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "w-3 h-3 animate-spin text-muted-foreground" });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></label> <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", isMember, true)}>`);
        const $$body = escape_html(organization?.description || "");
        if ($$body) {
          $$renderer3.push(`${$$body}`);
        }
        $$renderer3.push(`</textarea></div></div></div></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 border-b flex items-center justify-between"><h3 class="text-lg font-semibold flex items-center gap-2">`);
        File_text($$renderer3, { class: "w-5 h-5 text-primary" });
        $$renderer3.push(`<!----> ${escape_html(t.dashboard.page.settings.organization.documents?.title || "Documents & IDs")} `);
        if (saving["documents"]) {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "w-4 h-4 animate-spin text-muted-foreground ml-2" });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></h3></div> <div class="p-6 space-y-4"><!--[-->`);
        const each_array = ensure_array_like(documents);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let doc = each_array[i];
          $$renderer3.push(`<div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30"><div class="flex items-center gap-3 min-w-0 flex-1 mr-2"><div class="font-medium text-sm px-2 py-0.5 bg-background border rounded shrink-0">${escape_html(doc.type)}</div> <span class="text-sm font-mono truncate">${escape_html(doc.value)}</span></div> `);
          if (!isMember) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<button type="button" class="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0">`);
            Trash_2($$renderer3, { class: "w-4 h-4" });
            $$renderer3.push(`<!----></button>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[!-->");
          if (!isMember) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<button class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">`);
            Plus($$renderer3, { class: "w-4 h-4" });
            $$renderer3.push(`<!----> ${escape_html(t.dashboard.page.settings.organization.documents?.add_button || "Add Document")}</button>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div></div></div> <div class="space-y-6"><div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 border-b flex items-center justify-between"><h3 class="text-lg font-semibold flex items-center gap-2">`);
        Map_pin($$renderer3, { class: "w-5 h-5 text-primary" });
        $$renderer3.push(`<!----> ${escape_html(t.dashboard.page.settings.organization.addresses?.title || "Addresses")} `);
        if (saving["addresses"]) {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "w-4 h-4 animate-spin text-muted-foreground ml-2" });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></h3></div> <div class="p-6 space-y-4"><!--[-->`);
        const each_array_1 = ensure_array_like(addresses);
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let address = each_array_1[i];
          $$renderer3.push(`<div class="flex items-start justify-between p-4 rounded-lg border bg-muted/30"><div><div class="font-medium">${escape_html(address.label)}</div> <div class="text-sm text-muted-foreground mt-1">${escape_html(address.address)} `);
          if (address.city || address.state || address.postalCode || address.country) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<br/> ${escape_html([
              [address.city, address.state, address.postalCode].filter(Boolean).join(" "),
              address.country
            ].filter(Boolean).join(", "))}`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div></div> `);
          if (!isMember) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<button type="button" class="text-muted-foreground hover:text-destructive transition-colors p-1">`);
            Trash_2($$renderer3, { class: "w-4 h-4" });
            $$renderer3.push(`<!----></button>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[!-->");
          if (!isMember) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<button class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">`);
            Plus($$renderer3, { class: "w-4 h-4" });
            $$renderer3.push(`<!----> ${escape_html(t.dashboard.page.settings.organization.addresses?.add_button || "Add Address")}</button>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 border-b flex items-center justify-between"><h3 class="text-lg font-semibold flex items-center gap-2">`);
        Link($$renderer3, { class: "w-5 h-5 text-primary" });
        $$renderer3.push(`<!----> ${escape_html(t.dashboard.page.settings.organization.links?.title || "Important Links")} `);
        if (saving["links"]) {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "w-4 h-4 animate-spin text-muted-foreground ml-2" });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></h3></div> <div class="p-6 space-y-4"><!--[-->`);
        const each_array_2 = ensure_array_like(companyLinks);
        for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
          let link = each_array_2[i];
          $$renderer3.push(`<div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30"><div class="flex items-center gap-3 overflow-hidden"><div class="p-2 rounded-full bg-background border">`);
          Link($$renderer3, { class: "w-4 h-4 text-muted-foreground" });
          $$renderer3.push(`<!----></div> <div class="min-w-0"><div class="font-medium truncate">${escape_html(link.title)}</div> <a${attr("href", link.url)} target="_blank" rel="noopener noreferrer" class="text-xs text-muted-foreground hover:text-primary truncate block">${escape_html(link.url)}</a></div></div> `);
          if (!isMember) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<button type="button" class="text-muted-foreground hover:text-destructive transition-colors p-1">`);
            Trash_2($$renderer3, { class: "w-4 h-4" });
            $$renderer3.push(`<!----></button>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[!-->");
          if (!isMember) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<button class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">`);
            Plus($$renderer3, { class: "w-4 h-4" });
            $$renderer3.push(`<!----> ${escape_html(t.dashboard.page.settings.organization.links?.add_button || "Add Link")}</button>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div></div></div></div>`);
      }
      $$renderer3.push(`<!--]--></div> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
