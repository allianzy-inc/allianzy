import { a1 as sanitize_props, a2 as spread_props, _ as slot, Z as store_get, a4 as ensure_array_like, a0 as attr_class, a5 as stringify, $ as unsubscribe_stores } from "../../../../../chunks/index2.js";
import { p as page } from "../../../../../chunks/stores.js";
import { D as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
import { T as Trending_up } from "../../../../../chunks/trending-up.js";
import { C as Credit_card } from "../../../../../chunks/credit-card.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { P as Pie_chart } from "../../../../../chunks/pie-chart.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { A as Arrow_right } from "../../../../../chunks/arrow-right.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { U as Users } from "../../../../../chunks/users.js";
import { T as Tags } from "../../../../../chunks/tags.js";
import { a as attr } from "../../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
function Trending_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["polyline", { "points": "22 17 13.5 8.5 8.5 13.5 2 7" }],
    ["polyline", { "points": "16 17 22 17 22 11" }]
  ];
  Icon($$renderer, spread_props([
    { name: "trending-down" },
    $$sanitized_props,
    {
      /**
       * @component @name TrendingDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWxpbmUgcG9pbnRzPSIyMiAxNyAxMy41IDguNSA4LjUgMTMuNSAyIDciIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMTYgMTcgMjIgMTcgMjIgMTEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trending-down
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let workspace, modules;
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    modules = [
      {
        title: "Transactions",
        description: "Manage income, expenses, and transfers.",
        icon: Credit_card,
        href: `/${workspace}/admin/finance/transactions`,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
      },
      {
        title: "Recurring Payments",
        description: "Track subscriptions and repeat bills.",
        icon: Calendar,
        href: `/${workspace}/admin/finance/recurring`,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
      },
      {
        title: "Obligations",
        description: "Tax and compliance deadlines.",
        icon: File_text,
        href: `/${workspace}/admin/finance/obligations`,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
      },
      {
        title: "Budgets & Forecast",
        description: "Plan financial future and limits.",
        icon: Pie_chart,
        href: `/${workspace}/admin/finance/forecast`,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
      },
      {
        title: "Vendors",
        description: "Manage supplier details and contacts.",
        icon: Users,
        href: `/${workspace}/admin/finance/vendors`,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10"
      },
      {
        title: "Categories",
        description: "Organize financial data structure.",
        icon: Tags,
        href: `/${workspace}/admin/finance/categories`,
        color: "text-pink-500",
        bg: "bg-pink-500/10"
      }
    ];
    $$renderer2.push(`<div class="space-y-8"><div><h1 class="text-3xl font-bold tracking-tight">Financial Overview</h1> <p class="text-muted-foreground mt-2">Manage your organization's financial health, obligations, and planning.</p></div> <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6"><div class="flex flex-row items-center justify-between space-y-0 pb-2"><h3 class="tracking-tight text-sm font-medium">Total Revenue</h3> `);
    Dollar_sign($$renderer2, { class: "h-4 w-4 text-muted-foreground" });
    $$renderer2.push(`<!----></div> <div class="text-2xl font-bold">$45,231.89</div> <p class="text-xs text-muted-foreground flex items-center mt-1 text-emerald-500">`);
    Trending_up($$renderer2, { class: "w-3 h-3 mr-1" });
    $$renderer2.push(`<!----> +20.1% from last month</p></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6"><div class="flex flex-row items-center justify-between space-y-0 pb-2"><h3 class="tracking-tight text-sm font-medium">Expenses</h3> `);
    Credit_card($$renderer2, { class: "h-4 w-4 text-muted-foreground" });
    $$renderer2.push(`<!----></div> <div class="text-2xl font-bold">$12,345.00</div> <p class="text-xs text-muted-foreground flex items-center mt-1 text-red-500">`);
    Trending_down($$renderer2, { class: "w-3 h-3 mr-1" });
    $$renderer2.push(`<!----> +4.5% from last month</p></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6"><div class="flex flex-row items-center justify-between space-y-0 pb-2"><h3 class="tracking-tight text-sm font-medium">Net Income</h3> `);
    Pie_chart($$renderer2, { class: "h-4 w-4 text-muted-foreground" });
    $$renderer2.push(`<!----></div> <div class="text-2xl font-bold">$32,886.89</div> <p class="text-xs text-muted-foreground flex items-center mt-1 text-emerald-500">`);
    Trending_up($$renderer2, { class: "w-3 h-3 mr-1" });
    $$renderer2.push(`<!----> +12.3% from last month</p></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6"><div class="flex flex-row items-center justify-between space-y-0 pb-2"><h3 class="tracking-tight text-sm font-medium">Pending Obligations</h3> `);
    File_text($$renderer2, { class: "h-4 w-4 text-muted-foreground" });
    $$renderer2.push(`<!----></div> <div class="text-2xl font-bold">3</div> <p class="text-xs text-muted-foreground mt-1">2 due within 7 days</p></div></div> <div><h2 class="text-xl font-semibold mb-4">Modules</h2> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
    const each_array = ensure_array_like(modules);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let module = each_array[$$index];
      $$renderer2.push(`<a${attr("href", module.href)} class="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"><div class="flex items-center gap-4"><div${attr_class(`p-3 rounded-lg ${stringify(module.bg)} ${stringify(module.color)}`)}><!---->`);
      module.icon?.($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div> <div class="flex-1"><h3 class="font-semibold group-hover:text-primary transition-colors">${escape_html(module.title)}</h3> <p class="text-sm text-muted-foreground line-clamp-2">${escape_html(module.description)}</p></div> `);
      Arrow_right($$renderer2, {
        class: "w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
      });
      $$renderer2.push(`<!----></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
