import { a1 as sanitize_props, a2 as spread_props, _ as slot, Z as store_get, a4 as ensure_array_like, $ as unsubscribe_stores } from "../../../../../../chunks/index2.js";
import { p as page } from "../../../../../../chunks/stores.js";
import { a as attr } from "../../../../../../chunks/attributes.js";
import { a as canEditFinance, f as financeRole } from "../../../../../../chunks/finance-role.store.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/state.svelte.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { S as Search } from "../../../../../../chunks/search.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
function Arrow_up_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "m21 16-4 4-4-4" }],
    ["path", { "d": "M17 20V4" }],
    ["path", { "d": "m3 8 4-4 4 4" }],
    ["path", { "d": "M7 4v16" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-up-down" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowUpDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMTYtNCA0LTQtNCIgLz4KICA8cGF0aCBkPSJNMTcgMjBWNCIgLz4KICA8cGF0aCBkPSJtMyA4IDQtNCA0IDQiIC8+CiAgPHBhdGggZD0iTTcgNHYxNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-up-down
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
    let canEdit, filteredTransactions, totalPages;
    let transactions = [];
    let searchQuery = "";
    let sortField = "date";
    let currentPage = 1;
    let itemsPerPage = 10;
    ({
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    store_get($$store_subs ??= {}, "$page", page).params.workspace;
    canEdit = canEditFinance(store_get($$store_subs ??= {}, "$financeRole", financeRole));
    filteredTransactions = transactions.filter((t) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch = (t.notes || "").toLowerCase().includes(search) || t.amount.toString().includes(search) || t.status.includes(search);
      return matchesSearch;
    }).sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (fieldA < fieldB) return 1;
      if (fieldA > fieldB) return -1;
      return 0;
    });
    totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold tracking-tight">Transactions</h1> <p class="text-muted-foreground text-sm">View and manage all financial transactions.</p></div> `);
    if (
      // --- Actions ---
      // Default to asc for new field? or desc for date?
      // Clear action param if present
      // Simple validation
      // Mock org
      // --- Helpers ---
      canEdit
    ) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm font-medium">`);
      Plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Add Transaction</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex flex-col items-center justify-between bg-card p-4 rounded-lg border"><div class="relative w-full sm:w-72">`);
    Search($$renderer2, {
      class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Search by description or amount..."${attr("value", searchQuery)} class="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"/></div></div> <div class="rounded-lg border bg-card overflow-hidden shadow-sm"><div class="overflow-x-auto"><table class="w-full text-sm text-left"><thead class="bg-muted/50 text-muted-foreground font-medium uppercase text-xs"><tr><th class="px-6 py-3 cursor-pointer hover:text-foreground"><div class="flex items-center gap-1">Date `);
    Arrow_up_down($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----></div></th><th class="px-6 py-3">Description</th><th class="px-6 py-3">Category</th><th class="px-6 py-3 cursor-pointer hover:text-foreground"><div class="flex items-center gap-1">Amount `);
    Arrow_up_down($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----></div></th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Actions</th></tr></thead><tbody class="divide-y">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(Array(5));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        $$renderer2.push(`<tr class="animate-pulse"><td class="px-6 py-4"><div class="h-4 bg-muted rounded w-24"></div></td><td class="px-6 py-4"><div class="h-4 bg-muted rounded w-48"></div></td><td class="px-6 py-4"><div class="h-4 bg-muted rounded w-20"></div></td><td class="px-6 py-4"><div class="h-4 bg-muted rounded w-16"></div></td><td class="px-6 py-4"><div class="h-6 bg-muted rounded-full w-20"></div></td><td class="px-6 py-4"><div class="h-8 bg-muted rounded w-8 ml-auto"></div></td></tr>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div> <div class="px-6 py-4 border-t bg-muted/20 flex items-center justify-between"><span class="text-xs text-muted-foreground">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredTransactions.length))} of ${escape_html(filteredTransactions.length)} results</span> <div class="flex items-center gap-2"><button class="px-3 py-1 text-xs border rounded-md hover:bg-muted disabled:opacity-50"${attr("disabled", currentPage === 1, true)}>Previous</button> <button class="px-3 py-1 text-xs border rounded-md hover:bg-muted disabled:opacity-50"${attr("disabled", currentPage === totalPages, true)}>Next</button></div></div></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
