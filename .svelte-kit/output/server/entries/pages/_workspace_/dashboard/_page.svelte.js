import { Z as store_get, $ as unsubscribe_stores, a6 as bind_props } from "../../../../chunks/index2.js";
import "../../../../chunks/auth-client.js";
import { p as page } from "../../../../chunks/stores.js";
import { c as currentLang } from "../../../../chunks/i18n.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let user, isSpanish, companies, selectedCompany, currentUserRole, currentUserPermissions;
    store_get($$store_subs ??= {}, "$page", page).params.workspace;
    let session = null;
    let data = $$props["data"];
    data.projects || [];
    user = data.user || session?.user;
    isSpanish = store_get($$store_subs ??= {}, "$currentLang", currentLang) === "es";
    companies = data.companies || [];
    selectedCompany = companies.length > 0 && user?.companyId ? companies.find((c) => c.id === user.companyId) || companies[0] : companies[0] || null;
    currentUserRole = selectedCompany?.role;
    currentUserPermissions = selectedCompany?.permissions || {};
    currentUserRole === "owner" || currentUserRole === "admin" || Object.values(currentUserPermissions).some((p) => Array.isArray(p) && p.includes("payments"));
    currentUserRole === "owner" || currentUserRole === "admin" || Object.values(currentUserPermissions).some((p) => Array.isArray(p) && p.includes("support"));
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-64"><p class="text-muted-foreground">${escape_html(isSpanish ? "Cargando panel..." : "Loading dashboard...")}</p></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
