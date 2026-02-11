import { a1 as sanitize_props, a2 as spread_props, _ as slot, Z as store_get, a3 as head, a4 as ensure_array_like, a0 as attr_class, a5 as stringify, $ as unsubscribe_stores } from "../../../../chunks/index2.js";
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
import { f as financeRole } from "../../../../chunks/finance-role.store.js";
import { U as User } from "../../../../chunks/user.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { L as Layout_dashboard } from "../../../../chunks/layout-dashboard.js";
import { U as Users } from "../../../../chunks/users.js";
import { P as Package } from "../../../../chunks/package.js";
import { B as Briefcase } from "../../../../chunks/briefcase.js";
import { T as Ticket, S as Settings } from "../../../../chunks/ticket.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function Badge_dollar_sign($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      }
    ],
    ["path", { "d": "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }],
    ["path", { "d": "M12 18V6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "badge-dollar-sign" },
    $$sanitized_props,
    {
      /**
       * @component @name BadgeDollarSign
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMy44NSA4LjYyYTQgNCAwIDAgMSA0Ljc4LTQuNzcgNCA0IDAgMCAxIDYuNzQgMCA0IDQgMCAwIDEgNC43OCA0Ljc4IDQgNCAwIDAgMSAwIDYuNzQgNCA0IDAgMCAxLTQuNzcgNC43OCA0IDQgMCAwIDEtNi43NSAwIDQgNCAwIDAgMS00Ljc4LTQuNzcgNCA0IDAgMCAxIDAtNi43NloiIC8+CiAgPHBhdGggZD0iTTE2IDhoLTZhMiAyIDAgMSAwIDAgNGg0YTIgMiAwIDEgMSAwIDRIOCIgLz4KICA8cGF0aCBkPSJNMTIgMThWNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/badge-dollar-sign
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
function House($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }
    ],
    [
      "path",
      {
        "d": "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "house" },
    $$sanitized_props,
    {
      /**
       * @component @name House
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMjF2LThhMSAxIDAgMCAwLTEtMWgtNGExIDEgMCAwIDAtMSAxdjgiIC8+CiAgPHBhdGggZD0iTTMgMTBhMiAyIDAgMCAxIC43MDktMS41MjhsNy01Ljk5OWEyIDIgMCAwIDEgMi41ODIgMGw3IDUuOTk5QTIgMiAwIDAgMSAyMSAxMHY5YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yeiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/house
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
    let workspace, path, showFinance, menuItems;
    translations[store_get($$store_subs ??= {}, "$currentLang", currentLang)];
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    path = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    showFinance = ["admin", "accountant", "client_owner"].includes(store_get($$store_subs ??= {}, "$financeRole", financeRole));
    menuItems = [
      {
        href: `/${workspace}/dashboard`,
        label: "Vista Cliente",
        icon: House
      },
      {
        href: `/${workspace}/admin`,
        label: "Overview",
        icon: Layout_dashboard
      },
      {
        href: `/${workspace}/admin/users`,
        label: "Usuarios",
        icon: Users
      },
      {
        href: `/${workspace}/admin/services`,
        label: "Servicios",
        icon: Package
      },
      {
        href: `/${workspace}/admin/projects`,
        label: "Proyectos",
        icon: Briefcase
      },
      ...showFinance ? [
        {
          href: `/${workspace}/admin/finance`,
          label: "Finance",
          icon: Badge_dollar_sign
        }
      ] : [],
      {
        href: `/${workspace}/admin/support`,
        label: "Soporte",
        icon: Ticket
      },
      {
        href: `/${workspace}/admin/settings`,
        label: "Configuraciones",
        icon: Settings
      }
    ];
    head("ra0usj", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Allianzy Inc - Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="flex h-screen bg-background text-foreground"><aside class="w-64 bg-background border-r flex flex-col"><div class="p-6 border-b h-16 flex items-center justify-between">`);
    if (workspace === "allianzy") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr("href", `/${stringify(workspace)}/admin`)} class="block"><img${attr("src", logoLight)} alt="Allianzy" class="h-8 dark:hidden"/> <img${attr("src", logoDark)} alt="Allianzy" class="h-8 hidden dark:block"/></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<h2 class="text-lg font-bold tracking-tight uppercase truncate">${escape_html(workspace)}</h2>`);
    }
    $$renderer2.push(`<!--]--> <span class="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded ml-2">ADMIN</span></div> <nav class="flex-1 p-4 space-y-1"><!--[-->`);
    const each_array = ensure_array_like(menuItems);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${stringify(path === item.href || item.href !== `/${workspace}/admin` && path.startsWith(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}`)}>`);
      item.icon($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> ${escape_html(item.label)}</a>`);
    }
    $$renderer2.push(`<!--]--></nav></aside> <main class="flex-1 flex flex-col overflow-hidden"><header class="h-16 bg-background border-b flex items-center justify-between px-8 shrink-0"><h1 class="text-lg font-semibold">Admin Dashboard</h1> <div class="flex items-center gap-4"><div class="relative"><button class="w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden bg-muted">`);
    {
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
  });
}
export {
  _layout as default
};
