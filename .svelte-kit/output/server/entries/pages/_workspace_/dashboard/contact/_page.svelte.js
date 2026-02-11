import "clsx";
import { M as Mail } from "../../../../../chunks/mail.js";
import { a1 as sanitize_props, a2 as spread_props, _ as slot } from "../../../../../chunks/index2.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
function Phone($$renderer, $$props) {
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
        "d": "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "phone" },
    $$sanitized_props,
    {
      /**
       * @component @name Phone
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTYuOTJ2M2EyIDIgMCAwIDEtMi4xOCAyIDE5Ljc5IDE5Ljc5IDAgMCAxLTguNjMtMy4wNyAxOS41IDE5LjUgMCAwIDEtNi02IDE5Ljc5IDE5Ljc5IDAgMCAxLTMuMDctOC42N0EyIDIgMCAwIDEgNC4xMSAyaDNhMiAyIDAgMCAxIDIgMS43MiAxMi44NCAxMi44NCAwIDAgMCAuNyAyLjgxIDIgMiAwIDAgMS0uNDUgMi4xMUw4LjA5IDkuOTFhMTYgMTYgMCAwIDAgNiA2bDEuMjctMS4yN2EyIDIgMCAwIDEgMi4xMS0uNDUgMTIuODQgMTIuODQgMCAwIDAgMi44MS43QTIgMiAwIDAgMSAyMiAxNi45MnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/phone
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
  $$renderer.push(`<div class="space-y-6"><h2 class="text-3xl font-bold tracking-tight">Contactar</h2> <div class="grid gap-6 md:grid-cols-2"><div class="space-y-6"><div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6"><h3 class="text-lg font-semibold mb-4">Envíanos un mensaje</h3> <form class="space-y-4"><div class="grid gap-2"><label class="text-sm font-medium">Asunto</label> <input type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Consulta general"/></div> <div class="grid gap-2"><label class="text-sm font-medium">Mensaje</label> <textarea class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="¿En qué podemos ayudarte?"></textarea></div> <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 w-full">Enviar Mensaje</button></form></div></div> <div class="space-y-6"><div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6"><h3 class="text-lg font-semibold mb-4">Información de Contacto</h3> <div class="space-y-4"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">`);
  Mail($$renderer, { class: "w-5 h-5 text-primary" });
  $$renderer.push(`<!----></div> <div><p class="text-sm font-medium">Email</p> <p class="text-sm text-muted-foreground">contacto@allianzy.com</p></div></div> <div class="flex items-center gap-3"><div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">`);
  Phone($$renderer, { class: "w-5 h-5 text-primary" });
  $$renderer.push(`<!----></div> <div><p class="text-sm font-medium">Teléfono</p> <p class="text-sm text-muted-foreground">+1 (555) 000-0000</p></div></div> <div class="flex items-center gap-3"><div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">`);
  Map_pin($$renderer, { class: "w-5 h-5 text-primary" });
  $$renderer.push(`<!----></div> <div><p class="text-sm font-medium">Oficina</p> <p class="text-sm text-muted-foreground">123 Business Ave, Suite 100</p></div></div></div></div></div></div></div>`);
}
export {
  _page as default
};
