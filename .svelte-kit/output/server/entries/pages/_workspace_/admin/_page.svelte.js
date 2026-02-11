import "clsx";
import { U as Users } from "../../../../chunks/users.js";
import { B as Briefcase } from "../../../../chunks/briefcase.js";
import { D as Dollar_sign } from "../../../../chunks/dollar-sign.js";
import { a1 as sanitize_props, a2 as spread_props, _ as slot } from "../../../../chunks/index2.js";
import { I as Icon } from "../../../../chunks/Icon.js";
function Activity($$renderer, $$props) {
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
        "d": "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "activity" },
    $$sanitized_props,
    {
      /**
       * @component @name Activity
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTJoLTIuNDhhMiAyIDAgMCAwLTEuOTMgMS40NmwtMi4zNSA4LjM2YS4yNS4yNSAwIDAgMS0uNDggMEw5LjI0IDIuMThhLjI1LjI1IDAgMCAwLS40OCAwbC0yLjM1IDguMzZBMiAyIDAgMCAxIDQuNDkgMTJIMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/activity
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
function _page($$renderer) {
  $$renderer.push(`<div class="space-y-6"><div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2"><h3 class="tracking-tight text-sm font-medium">Total Usuarios</h3> `);
  Users($$renderer, { class: "h-4 w-4 text-muted-foreground" });
  $$renderer.push(`<!----></div> <div class="p-6 pt-0"><div class="text-2xl font-bold">1,234</div> <p class="text-xs text-muted-foreground">+20.1% del mes pasado</p></div></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2"><h3 class="tracking-tight text-sm font-medium">Proyectos Activos</h3> `);
  Briefcase($$renderer, { class: "h-4 w-4 text-muted-foreground" });
  $$renderer.push(`<!----></div> <div class="p-6 pt-0"><div class="text-2xl font-bold">23</div> <p class="text-xs text-muted-foreground">+2 nuevos esta semana</p></div></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2"><h3 class="tracking-tight text-sm font-medium">Ingresos</h3> `);
  Dollar_sign($$renderer, { class: "h-4 w-4 text-muted-foreground" });
  $$renderer.push(`<!----></div> <div class="p-6 pt-0"><div class="text-2xl font-bold">$45,231.89</div> <p class="text-xs text-muted-foreground">+15% del mes pasado</p></div></div> <div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2"><h3 class="tracking-tight text-sm font-medium">Actividad</h3> `);
  Activity($$renderer, { class: "h-4 w-4 text-muted-foreground" });
  $$renderer.push(`<!----></div> <div class="p-6 pt-0"><div class="text-2xl font-bold">+573</div> <p class="text-xs text-muted-foreground">+201 desde la última hora</p></div></div></div></div>`);
}
export {
  _page as default
};
