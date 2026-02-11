import { a1 as sanitize_props, a2 as spread_props, _ as slot } from "./index2.js";
import { I as Icon } from "./Icon.js";
function Languages($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "m5 8 6 6" }],
    ["path", { "d": "m4 14 6-6 2-3" }],
    ["path", { "d": "M2 5h12" }],
    ["path", { "d": "M7 2h1" }],
    ["path", { "d": "m22 22-5-10-5 10" }],
    ["path", { "d": "M14 18h6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "languages" },
    $$sanitized_props,
    {
      /**
       * @component @name Languages
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNSA4IDYgNiIgLz4KICA8cGF0aCBkPSJtNCAxNCA2LTYgMi0zIiAvPgogIDxwYXRoIGQ9Ik0yIDVoMTIiIC8+CiAgPHBhdGggZD0iTTcgMmgxIiAvPgogIDxwYXRoIGQ9Im0yMiAyMi01LTEwLTUgMTAiIC8+CiAgPHBhdGggZD0iTTE0IDE4aDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/languages
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
function Laptop($$renderer, $$props) {
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
        "d": "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "laptop" },
    $$sanitized_props,
    {
      /**
       * @component @name Laptop
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTZWN2EyIDIgMCAwIDAtMi0ySDZhMiAyIDAgMCAwLTIgMnY5bTE2IDBING0xNiAwIDEuMjggMi41NWExIDEgMCAwIDEtLjkgMS40NUgzLjYyYTEgMSAwIDAgMS0uOS0xLjQ1TDQgMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/laptop
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
const beltrixLogoLight = "/_app/immutable/assets/beltrix-logo-light.CXgpNiEW.svg";
const beltrixLogoDark = "/_app/immutable/assets/beltrix-logo-dark.CTslLaL0.svg";
export {
  Laptop as L,
  Languages as a,
  beltrixLogoLight as b,
  beltrixLogoDark as c
};
