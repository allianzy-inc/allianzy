import { a1 as sanitize_props, a2 as spread_props, _ as slot, Z as store_get, a4 as ensure_array_like, a0 as attr_class, a5 as stringify, $ as unsubscribe_stores } from "../../../../../chunks/index2.js";
import { p as page } from "../../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { a as attr } from "../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { c as canViewFinance, f as financeRole } from "../../../../../chunks/finance-role.store.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { C as Chevron_right } from "../../../../../chunks/chevron-right.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { L as Layout_dashboard } from "../../../../../chunks/layout-dashboard.js";
import { C as Credit_card } from "../../../../../chunks/credit-card.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { P as Pie_chart } from "../../../../../chunks/pie-chart.js";
import { U as Users } from "../../../../../chunks/users.js";
import { T as Tags } from "../../../../../chunks/tags.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
function Wallet($$renderer, $$props) {
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
        "d": "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
      }
    ],
    ["path", { "d": "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "wallet" },
    $$sanitized_props,
    {
      /**
       * @component @name Wallet
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgN1Y0YTEgMSAwIDAgMC0xLTFINWEyIDIgMCAwIDAgMCA0aDE1YTEgMSAwIDAgMSAxIDF2NGgtM2EyIDIgMCAwIDAgMCA0aDNhMSAxIDAgMCAwIDEtMXYtMmExIDEgMCAwIDAtMS0xIiAvPgogIDxwYXRoIGQ9Ik0zIDV2MTRhMiAyIDAgMCAwIDIgMmgxNWExIDEgMCAwIDAgMS0xdi00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/wallet
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
    let workspace, path, searchParams, period, currency, navItems;
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    path = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    searchParams = store_get($$store_subs ??= {}, "$page", page).url.searchParams;
    period = searchParams.get("period") || "month";
    currency = searchParams.get("currency") || "USD";
    navItems = [
      {
        href: `/${workspace}/admin/finance`,
        label: "Overview",
        icon: Layout_dashboard,
        exact: true
      },
      {
        href: `/${workspace}/admin/finance/transactions`,
        label: "Transactions",
        icon: Credit_card
      },
      {
        href: `/${workspace}/admin/finance/recurring`,
        label: "Recurring",
        icon: Calendar
      },
      {
        href: `/${workspace}/admin/finance/obligations`,
        label: "Obligations",
        icon: File_text
      },
      {
        href: `/${workspace}/admin/finance/forecast`,
        label: "Forecast",
        icon: Pie_chart
      },
      {
        href: `/${workspace}/admin/finance/vendors`,
        label: "Vendors",
        icon: Users
      },
      {
        href: `/${workspace}/admin/finance/categories`,
        label: "Categories",
        icon: Tags
      }
    ];
    if (!canViewFinance(store_get($$store_subs ??= {}, "$financeRole", financeRole))) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-background text-center p-8 svelte-14aen8u"><div class="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4 svelte-14aen8u"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 text-red-600 dark:text-red-400 svelte-14aen8u"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" class="svelte-14aen8u"></path><path d="m9 12 2 2 4-4" class="svelte-14aen8u"></path></svg></div> <h1 class="text-2xl font-bold mb-2 svelte-14aen8u">Access Denied</h1> <p class="text-muted-foreground max-w-md svelte-14aen8u">You do not have permission to view the Finance module. 
            Please contact your administrator if you believe this is a mistake.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="flex flex-col h-full bg-background min-h-[calc(100vh-4rem)] svelte-14aen8u"><div class="border-b bg-card px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 svelte-14aen8u"><div class="flex items-center gap-2 text-muted-foreground svelte-14aen8u">`);
      Wallet($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> <span class="font-semibold text-foreground svelte-14aen8u">Finance</span> `);
      Chevron_right($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span class="text-sm font-medium svelte-14aen8u">${escape_html(navItems.find((i) => i.exact ? path === i.href : path.startsWith(i.href))?.label || "Overview")}</span></div> <div class="flex items-center gap-3 flex-wrap svelte-14aen8u"><div class="flex items-center bg-background border rounded-md px-2 py-1.5 shadow-sm svelte-14aen8u">`);
      Calendar($$renderer2, { class: "w-4 h-4 mr-2 text-muted-foreground" });
      $$renderer2.push(`<!----> `);
      $$renderer2.select(
        {
          value: period,
          class: "bg-transparent text-sm border-none focus:ring-0 cursor-pointer outline-none min-w-[100px]"
        },
        ($$renderer3) => {
          $$renderer3.option(
            { value: "month", class: "" },
            ($$renderer4) => {
              $$renderer4.push(`This Month`);
            },
            "svelte-14aen8u"
          );
          $$renderer3.option(
            { value: "quarter", class: "" },
            ($$renderer4) => {
              $$renderer4.push(`This Quarter`);
            },
            "svelte-14aen8u"
          );
          $$renderer3.option(
            { value: "year", class: "" },
            ($$renderer4) => {
              $$renderer4.push(`This Year`);
            },
            "svelte-14aen8u"
          );
          $$renderer3.option(
            { value: "custom", class: "" },
            ($$renderer4) => {
              $$renderer4.push(`Custom`);
            },
            "svelte-14aen8u"
          );
        },
        "svelte-14aen8u"
      );
      $$renderer2.push(`</div> <div class="flex items-center bg-background border rounded-md px-2 py-1.5 shadow-sm svelte-14aen8u"><span class="text-xs font-bold text-muted-foreground mr-2 svelte-14aen8u">CUR</span> `);
      $$renderer2.select(
        {
          value: currency,
          class: "bg-transparent text-sm border-none focus:ring-0 cursor-pointer outline-none min-w-[60px]"
        },
        ($$renderer3) => {
          $$renderer3.option(
            { value: "USD", class: "" },
            ($$renderer4) => {
              $$renderer4.push(`USD`);
            },
            "svelte-14aen8u"
          );
          $$renderer3.option(
            { value: "UYU", class: "" },
            ($$renderer4) => {
              $$renderer4.push(`UYU`);
            },
            "svelte-14aen8u"
          );
          $$renderer3.option(
            { value: "ARS", class: "" },
            ($$renderer4) => {
              $$renderer4.push(`ARS`);
            },
            "svelte-14aen8u"
          );
          $$renderer3.option(
            { value: "EUR", class: "" },
            ($$renderer4) => {
              $$renderer4.push(`EUR`);
            },
            "svelte-14aen8u"
          );
          $$renderer3.option(
            { value: "GBP", class: "" },
            ($$renderer4) => {
              $$renderer4.push(`GBP`);
            },
            "svelte-14aen8u"
          );
        },
        "svelte-14aen8u"
      );
      $$renderer2.push(`</div> <div class="relative svelte-14aen8u"><button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm svelte-14aen8u">`);
      Plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Quick Add</button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div> <div class="border-b bg-muted/30 px-6 py-1 overflow-x-auto svelte-14aen8u"><div class="flex items-center gap-1 min-w-max svelte-14aen8u"><!--[-->`);
      const each_array = ensure_array_like(navItems);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<a${attr("href", item.href)}${attr_class(
          `px-3 py-2 text-sm font-medium rounded-md transition-colors border-b-2 border-transparent hover:text-primary ${stringify((item.exact ? path === item.href : path.startsWith(item.href)) ? "text-primary border-primary bg-primary/5" : "text-muted-foreground")}`,
          "svelte-14aen8u"
        )}><span class="flex items-center gap-2 svelte-14aen8u">`);
        item.icon($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> ${escape_html(item.label)}</span></a>`);
      }
      $$renderer2.push(`<!--]--></div></div> <div class="flex-1 p-6 overflow-auto svelte-14aen8u"><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></div></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
