import { a1 as sanitize_props, a2 as spread_props, _ as slot, Z as store_get, a3 as head, a0 as attr_class, a4 as ensure_array_like, a5 as stringify, $ as unsubscribe_stores, a6 as bind_props } from "../../../../chunks/index2.js";
import { p as page } from "../../../../chunks/stores.js";
import "../../../../chunks/auth-client.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import { a as attr } from "../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { l as logoLight, a as logoDark } from "../../../../chunks/logo-dark.js";
import { t as translations, c as currentLang } from "../../../../chunks/i18n.js";
import { L as Layout_dashboard } from "../../../../chunks/layout-dashboard.js";
import { B as Briefcase } from "../../../../chunks/briefcase.js";
import { C as Credit_card } from "../../../../chunks/credit-card.js";
import { T as Ticket, S as Settings, P as Panel_left_close, B as Bell } from "../../../../chunks/ticket.js";
import { X } from "../../../../chunks/x.js";
import { B as Building } from "../../../../chunks/building.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { M as Menu } from "../../../../chunks/menu.js";
import { U as User } from "../../../../chunks/user.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function Chevrons_up_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "m7 15 5 5 5-5" }],
    ["path", { "d": "m7 9 5-5 5 5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "chevrons-up-down" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronsUpDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNyAxNSA1IDUgNS01IiAvPgogIDxwYXRoIGQ9Im03IDkgNS01IDUgNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevrons-up-down
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
function Circle_help($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-help" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleHelp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNOS4wOSA5YTMgMyAwIDAgMSA1LjgzIDFjMCAyLTMgMy0zIDMiIC8+CiAgPHBhdGggZD0iTTEyIDE3aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/circle-help
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
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let t, workspace, path, notifications, inboxNotifications, unreadCount, companies, currentUserRole, currentUserPermissions, canViewBilling, canViewSupport, showOnlyInicio, menuItems;
    let data = $$props["data"];
    let isMobileMenuOpen = false;
    let selectedCompany = null;
    t = translations[store_get($$store_subs ??= {}, "$currentLang", currentLang)];
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    path = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    notifications = data.notifications || [];
    inboxNotifications = notifications.filter((n) => !n.archived);
    notifications.filter((n) => n.archived);
    unreadCount = inboxNotifications.filter((n) => !n.read).length;
    companies = data.companies || [];
    if (companies.length > 0 && !selectedCompany) {
      if (data.user?.companyId) {
        selectedCompany = companies.find((c) => c.id === data.user.companyId) || companies[0];
      } else {
        selectedCompany = companies[0];
      }
    }
    currentUserRole = selectedCompany?.role;
    currentUserPermissions = selectedCompany?.permissions || {};
    canViewBilling = currentUserRole === "owner" || currentUserRole === "admin" || Object.values(currentUserPermissions).some((p) => p && p.includes("payments"));
    canViewSupport = currentUserRole === "owner" || currentUserRole === "admin" || Object.values(currentUserPermissions).some((p) => p && p.includes("support"));
    showOnlyInicio = !(data.hasAnyCompany ?? true) && !(data.hasAnyProject ?? true);
    menuItems = showOnlyInicio ? [
      {
        href: `/${workspace}/dashboard`,
        label: t.dashboard.menu.overview,
        icon: Layout_dashboard
      }
    ] : [
      {
        href: `/${workspace}/dashboard`,
        label: t.dashboard.menu.overview,
        icon: Layout_dashboard
      },
      {
        href: `/${workspace}/dashboard/projects`,
        label: t.dashboard.menu.projects,
        icon: Briefcase
      },
      ...canViewBilling ? [
        {
          href: `/${workspace}/dashboard/billing`,
          label: t.dashboard.menu.billing,
          icon: Credit_card
        }
      ] : [],
      ...canViewSupport ? [
        {
          href: `/${workspace}/dashboard/support`,
          label: t.dashboard.menu.support,
          icon: Ticket
        }
      ] : [],
      {
        href: `/${workspace}/dashboard/settings`,
        label: t.dashboard.menu.settings,
        icon: Settings
      }
    ];
    store_get($$store_subs ??= {}, "$currentLang", currentLang) === "es";
    if (path) {
      isMobileMenuOpen = false;
    }
    head("1ldobtw", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Allianzy Inc</title>`);
      });
    });
    $$renderer2.push(`<div class="flex h-screen overflow-hidden bg-background">`);
    if (isMobileMenuOpen) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <aside${attr_class(`fixed inset-y-0 left-0 z-50 bg-background border-r flex flex-col transition-[width,transform] duration-200 ease-in-out ${stringify(isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64")} ${stringify("lg:translate-x-0 lg:w-64")}`)}><div${attr_class(`border-b h-16 flex items-center justify-between shrink-0 ${stringify("p-4 lg:p-6")}`)}>`);
    if (workspace === "allianzy") {
      $$renderer2.push("<!--[-->");
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<a${attr("href", `/${stringify(workspace)}`)} class="block shrink-0"><img${attr("src", logoLight)} alt="Allianzy" class="h-8 dark:hidden"/> <img${attr("src", logoDark)} alt="Allianzy" class="h-8 hidden dark:block"/></a>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<h2 class="text-lg font-bold tracking-tight uppercase truncate">${escape_html(workspace)}</h2>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> <button class="lg:hidden ml-auto shrink-0">`);
    X($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button></div> `);
    if (companies.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class("px-4 pb-2 pt-4")}><div class="relative"><button${attr_class(`w-full flex items-center justify-between p-2 rounded-md border bg-card hover:bg-accent transition-colors shadow-sm ${stringify("")}`)}${attr("disabled", companies.length <= 1, true)}${attr("title", "")}><div${attr_class(`flex items-center gap-2 overflow-hidden ${stringify("")}`)}><div class="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-muted/50 border">`);
      if (selectedCompany?.logo) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", selectedCompany.logo)}${attr("alt", selectedCompany.name)} class="w-full h-full object-cover rounded"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
        Building($$renderer2, { class: "w-3.5 h-3.5 text-muted-foreground" });
      }
      $$renderer2.push(`<!--]--></div> <span${attr_class(`text-sm font-medium truncate ${stringify("")}`)}>${escape_html(selectedCompany?.name || "Empresa")}</span></div> `);
      if (companies.length > 1) {
        $$renderer2.push("<!--[-->");
        Chevrons_up_down($$renderer2, {
          class: `w-4 h-4 text-muted-foreground ml-2 shrink-0 opacity-50 ${stringify("")}`
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <nav class="flex-1 p-4 space-y-1 overflow-hidden"><!--[-->`);
    const each_array_1 = ensure_array_like(menuItems);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array_1[$$index_1];
      $$renderer2.push(`<a${attr("href", item.href)}${attr("title", "")}${attr_class(`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${stringify("")} ${stringify(path === item.href || item.href !== "/dashboard" && item.href !== `/${workspace}/dashboard` && path.startsWith(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}`)}>`);
      item.icon($$renderer2, { class: "w-4 h-4 shrink-0" });
      $$renderer2.push(`<!----> <span${attr_class(`truncate ${stringify("")}`)}>${escape_html(item.label)}</span></a>`);
    }
    $$renderer2.push(`<!--]--></nav> <div${attr_class(`p-4 border-t space-y-4 shrink-0 ${stringify("")}`)}><a href="mailto:support@allianzy.us"${attr_class(`flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-2 ${stringify("")}`)}${attr("title", "")}>`);
    Circle_help($$renderer2, { class: "w-4 h-4 shrink-0" });
    $$renderer2.push(`<!----> <span${attr_class("")}>${escape_html(t.dashboard.footer.help_support)}</span></a> <div${attr_class(`text-xs text-muted-foreground px-2 space-y-1 ${stringify("")}`)}><p>${escape_html(t.dashboard.footer.rights)}</p></div></div></aside> <main${attr_class(`flex-1 flex flex-col overflow-hidden transition-[margin] duration-200 ${stringify("lg:ml-64")}`)}><header class="h-16 bg-background border-b flex items-center justify-between px-4 md:px-8 shrink-0"><div class="flex items-center gap-4"><button class="lg:hidden" aria-label="Abrir menú">`);
    Menu($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <button class="hidden lg:flex p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"${attr("aria-label", "Ocultar menú")}${attr("title", "Ocultar menú")}>`);
    {
      $$renderer2.push("<!--[!-->");
      Panel_left_close($$renderer2, { class: "w-5 h-5" });
    }
    $$renderer2.push(`<!--]--></button> <h1 class="text-lg font-semibold">Dashboard</h1></div> <div class="flex items-center gap-4"><div class="relative"><button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">`);
    Bell($$renderer2, { class: "w-4 h-4 text-muted-foreground" });
    $$renderer2.push(`<!----> `);
    if (unreadCount > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="relative"><button class="w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden bg-muted">`);
    if (data.user?.image) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img${attr("src", data.user.image)} alt="Avatar" class="w-full h-full object-cover"/>`);
    } else {
      $$renderer2.push("<!--[!-->");
      User($$renderer2, { class: "w-4 h-4 text-muted-foreground" });
    }
    $$renderer2.push(`<!--]--></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></header> <div class="flex-1 overflow-y-auto p-8"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _layout as default
};
