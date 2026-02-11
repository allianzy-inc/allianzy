import { a1 as sanitize_props, a2 as spread_props, _ as slot } from "./index2.js";
import { I as Icon } from "./Icon.js";
function Layers($$renderer, $$props) {
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
        "d": "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
      }
    ],
    [
      "path",
      { "d": "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" }
    ],
    [
      "path",
      { "d": "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "layers" },
    $$sanitized_props,
    {
      /**
       * @component @name Layers
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIuODMgMi4xOGEyIDIgMCAwIDAtMS42NiAwTDIuNiA2LjA4YTEgMSAwIDAgMCAwIDEuODNsOC41OCAzLjkxYTIgMiAwIDAgMCAxLjY2IDBsOC41OC0zLjlhMSAxIDAgMCAwIDAtMS44M1oiIC8+CiAgPHBhdGggZD0ibTIyIDE3LjY1LTkuMTcgNC4xNmEyIDIgMCAwIDEtMS42NiAwTDIgMTcuNjUiIC8+CiAgPHBhdGggZD0ibTIyIDEyLjY1LTkuMTcgNC4xNmEyIDIgMCAwIDEtMS42NiAwTDIgMTIuNjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layers
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
export {
  Layers as L
};
