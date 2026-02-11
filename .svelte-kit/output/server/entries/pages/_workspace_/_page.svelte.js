import { a1 as sanitize_props, a2 as spread_props, _ as slot, Z as store_get, $ as unsubscribe_stores, a4 as ensure_array_like, a0 as attr_class, a7 as attr_style, a6 as bind_props, a5 as stringify, a3 as head } from "../../../chunks/index2.js";
import { p as page } from "../../../chunks/stores.js";
import { c as currentLang, t as translations } from "../../../chunks/i18n.js";
import "clsx";
import { I as Icon } from "../../../chunks/Icon.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import { a as attr } from "../../../chunks/attributes.js";
import { l as logoLight, a as logoDark } from "../../../chunks/logo-dark.js";
import { L as Laptop, a as Languages, b as beltrixLogoLight, c as beltrixLogoDark } from "../../../chunks/beltrix-logo-dark.js";
import { M as Menu, S as Shield } from "../../../chunks/shield.js";
import { A as Arrow_right } from "../../../chunks/arrow-right.js";
import { U as Users } from "../../../chunks/users.js";
import { F as File_text } from "../../../chunks/file-text.js";
import { L as Layers } from "../../../chunks/layers.js";
import { S as Search } from "../../../chunks/search.js";
import { X } from "../../../chunks/x.js";
import { C as Circle_check } from "../../../chunks/circle-check.js";
import { T as Trending_up } from "../../../chunks/trending-up.js";
import { B as Briefcase } from "../../../chunks/briefcase.js";
import { C as Chevron_down } from "../../../chunks/chevron-down.js";
import { M as Mail } from "../../../chunks/mail.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function Arrow_up_right($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M7 7h10v10" }],
    ["path", { "d": "M7 17 17 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-up-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowUpRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNyA3aDEwdjEwIiAvPgogIDxwYXRoIGQ9Ik03IDE3IDE3IDciIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/arrow-up-right
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
function Brain($$renderer, $$props) {
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
        "d": "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
      }
    ],
    [
      "path",
      {
        "d": "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"
      }
    ],
    [
      "path",
      { "d": "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" }
    ],
    ["path", { "d": "M17.599 6.5a3 3 0 0 0 .399-1.375" }],
    ["path", { "d": "M6.003 5.125A3 3 0 0 0 6.401 6.5" }],
    ["path", { "d": "M3.477 10.896a4 4 0 0 1 .585-.396" }],
    ["path", { "d": "M19.938 10.5a4 4 0 0 1 .585.396" }],
    ["path", { "d": "M6 18a4 4 0 0 1-1.967-.516" }],
    ["path", { "d": "M19.967 17.484A4 4 0 0 1 18 18" }]
  ];
  Icon($$renderer, spread_props([
    { name: "brain" },
    $$sanitized_props,
    {
      /**
       * @component @name Brain
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNWEzIDMgMCAxIDAtNS45OTcuMTI1IDQgNCAwIDAgMC0yLjUyNiA1Ljc3IDQgNCAwIDAgMCAuNTU2IDYuNTg4QTQgNCAwIDEgMCAxMiAxOFoiIC8+CiAgPHBhdGggZD0iTTEyIDVhMyAzIDAgMSAxIDUuOTk3LjEyNSA0IDQgMCAwIDEgMi41MjYgNS43NyA0IDQgMCAwIDEtLjU1NiA2LjU4OEE0IDQgMCAxIDEgMTIgMThaIiAvPgogIDxwYXRoIGQ9Ik0xNSAxM2E0LjUgNC41IDAgMCAxLTMtNCA0LjUgNC41IDAgMCAxLTMgNCIgLz4KICA8cGF0aCBkPSJNMTcuNTk5IDYuNWEzIDMgMCAwIDAgLjM5OS0xLjM3NSIgLz4KICA8cGF0aCBkPSJNNi4wMDMgNS4xMjVBMyAzIDAgMCAwIDYuNDAxIDYuNSIgLz4KICA8cGF0aCBkPSJNMy40NzcgMTAuODk2YTQgNCAwIDAgMSAuNTg1LS4zOTYiIC8+CiAgPHBhdGggZD0iTTE5LjkzOCAxMC41YTQgNCAwIDAgMSAuNTg1LjM5NiIgLz4KICA8cGF0aCBkPSJNNiAxOGE0IDQgMCAwIDEtMS45NjctLjUxNiIgLz4KICA8cGF0aCBkPSJNMTkuOTY3IDE3LjQ4NEE0IDQgMCAwIDEgMTggMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/brain
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
function Chevron_up($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [["path", { "d": "m18 15-6-6-6 6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-up" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggMTUtNi02LTYgNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-up
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
function Clipboard_check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      {
        "width": "8",
        "height": "4",
        "x": "8",
        "y": "2",
        "rx": "1",
        "ry": "1"
      }
    ],
    [
      "path",
      {
        "d": "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
      }
    ],
    ["path", { "d": "m9 14 2 2 4-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "clipboard-check" },
    $$sanitized_props,
    {
      /**
       * @component @name ClipboardCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB4PSI4IiB5PSIyIiByeD0iMSIgcnk9IjEiIC8+CiAgPHBhdGggZD0iTTE2IDRoMmEyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJINmEyIDIgMCAwIDEtMi0yVjZhMiAyIDAgMCAxIDItMmgyIiAvPgogIDxwYXRoIGQ9Im05IDE0IDIgMiA0LTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/clipboard-check
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
function Cpu($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      { "width": "16", "height": "16", "x": "4", "y": "4", "rx": "2" }
    ],
    [
      "rect",
      { "width": "6", "height": "6", "x": "9", "y": "9", "rx": "1" }
    ],
    ["path", { "d": "M15 2v2" }],
    ["path", { "d": "M15 20v2" }],
    ["path", { "d": "M2 15h2" }],
    ["path", { "d": "M2 9h2" }],
    ["path", { "d": "M20 15h2" }],
    ["path", { "d": "M20 9h2" }],
    ["path", { "d": "M9 2v2" }],
    ["path", { "d": "M9 20v2" }]
  ];
  Icon($$renderer, spread_props([
    { name: "cpu" },
    $$sanitized_props,
    {
      /**
       * @component @name Cpu
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHg9IjQiIHk9IjQiIHJ4PSIyIiAvPgogIDxyZWN0IHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHg9IjkiIHk9IjkiIHJ4PSIxIiAvPgogIDxwYXRoIGQ9Ik0xNSAydjIiIC8+CiAgPHBhdGggZD0iTTE1IDIwdjIiIC8+CiAgPHBhdGggZD0iTTIgMTVoMiIgLz4KICA8cGF0aCBkPSJNMiA5aDIiIC8+CiAgPHBhdGggZD0iTTIwIDE1aDIiIC8+CiAgPHBhdGggZD0iTTIwIDloMiIgLz4KICA8cGF0aCBkPSJNOSAydjIiIC8+CiAgPHBhdGggZD0iTTkgMjB2MiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/cpu
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
function Database($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["ellipse", { "cx": "12", "cy": "5", "rx": "9", "ry": "3" }],
    ["path", { "d": "M3 5V19A9 3 0 0 0 21 19V5" }],
    ["path", { "d": "M3 12A9 3 0 0 0 21 12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "database" },
    $$sanitized_props,
    {
      /**
       * @component @name Database
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8ZWxsaXBzZSBjeD0iMTIiIGN5PSI1IiByeD0iOSIgcnk9IjMiIC8+CiAgPHBhdGggZD0iTTMgNVYxOUE5IDMgMCAwIDAgMjEgMTlWNSIgLz4KICA8cGF0aCBkPSJNMyAxMkE5IDMgMCAwIDAgMjEgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/database
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
function Facebook($$renderer, $$props) {
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
        "d": "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "facebook" },
    $$sanitized_props,
    {
      /**
       * @component @name Facebook
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggMmgtM2E1IDUgMCAwIDAtNSA1djNIN3Y0aDN2OGg0di04aDNsMS00aC00VjdhMSAxIDAgMCAxIDEtMWgzeiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/facebook
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=facebook instead. This icon will be removed in v1.0
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
function Git_branch($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["line", { "x1": "6", "x2": "6", "y1": "3", "y2": "15" }],
    ["circle", { "cx": "18", "cy": "6", "r": "3" }],
    ["circle", { "cx": "6", "cy": "18", "r": "3" }],
    ["path", { "d": "M18 9a9 9 0 0 1-9 9" }]
  ];
  Icon($$renderer, spread_props([
    { name: "git-branch" },
    $$sanitized_props,
    {
      /**
       * @component @name GitBranch
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iNiIgeDI9IjYiIHkxPSIzIiB5Mj0iMTUiIC8+CiAgPGNpcmNsZSBjeD0iMTgiIGN5PSI2IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjYiIGN5PSIxOCIgcj0iMyIgLz4KICA8cGF0aCBkPSJNMTggOWE5IDkgMCAwIDEtOSA5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/git-branch
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
function Image($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2",
        "ry": "2"
      }
    ],
    ["circle", { "cx": "9", "cy": "9", "r": "2" }],
    ["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
  ];
  Icon($$renderer, spread_props([
    { name: "image" },
    $$sanitized_props,
    {
      /**
       * @component @name Image
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgLz4KICA8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/image
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
function Instagram($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      {
        "width": "20",
        "height": "20",
        "x": "2",
        "y": "2",
        "rx": "5",
        "ry": "5"
      }
    ],
    [
      "path",
      { "d": "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }
    ],
    [
      "line",
      { "x1": "17.5", "x2": "17.51", "y1": "6.5", "y2": "6.5" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "instagram" },
    $$sanitized_props,
    {
      /**
       * @component @name Instagram
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHg9IjIiIHk9IjIiIHJ4PSI1IiByeT0iNSIgLz4KICA8cGF0aCBkPSJNMTYgMTEuMzdBNCA0IDAgMSAxIDEyLjYzIDggNCA0IDAgMCAxIDE2IDExLjM3eiIgLz4KICA8bGluZSB4MT0iMTcuNSIgeDI9IjE3LjUxIiB5MT0iNi41IiB5Mj0iNi41IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/instagram
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=instagram instead. This icon will be removed in v1.0
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
function Lightbulb($$renderer, $$props) {
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
        "d": "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
      }
    ],
    ["path", { "d": "M9 18h6" }],
    ["path", { "d": "M10 22h4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "lightbulb" },
    $$sanitized_props,
    {
      /**
       * @component @name Lightbulb
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41IiAvPgogIDxwYXRoIGQ9Ik05IDE4aDYiIC8+CiAgPHBhdGggZD0iTTEwIDIyaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/lightbulb
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
function Linkedin($$renderer, $$props) {
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
        "d": "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      }
    ],
    ["rect", { "width": "4", "height": "12", "x": "2", "y": "9" }],
    ["circle", { "cx": "4", "cy": "4", "r": "2" }]
  ];
  Icon($$renderer, spread_props([
    { name: "linkedin" },
    $$sanitized_props,
    {
      /**
       * @component @name Linkedin
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgOGE2IDYgMCAwIDEgNiA2djdoLTR2LTdhMiAyIDAgMCAwLTItMiAyIDIgMCAwIDAtMiAydjdoLTR2LTdhNiA2IDAgMCAxIDYtNnoiIC8+CiAgPHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iMTIiIHg9IjIiIHk9IjkiIC8+CiAgPGNpcmNsZSBjeD0iNCIgY3k9IjQiIHI9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/linkedin
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
function Megaphone($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "m3 11 18-5v12L3 14v-3z" }],
    ["path", { "d": "M11.6 16.8a3 3 0 1 1-5.8-1.6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "megaphone" },
    $$sanitized_props,
    {
      /**
       * @component @name Megaphone
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMyAxMSAxOC01djEyTDMgMTR2LTN6IiAvPgogIDxwYXRoIGQ9Ik0xMS42IDE2LjhhMyAzIDAgMSAxLTUuOC0xLjYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/megaphone
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
function Moon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [["path", { "d": "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }]];
  Icon($$renderer, spread_props([
    { name: "moon" },
    $$sanitized_props,
    {
      /**
       * @component @name Moon
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM2E2IDYgMCAwIDAgOSA5IDkgOSAwIDEgMS05LTlaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/moon
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
function Palette($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "circle",
      { "cx": "13.5", "cy": "6.5", "r": ".5", "fill": "currentColor" }
    ],
    [
      "circle",
      {
        "cx": "17.5",
        "cy": "10.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      { "cx": "8.5", "cy": "7.5", "r": ".5", "fill": "currentColor" }
    ],
    [
      "circle",
      { "cx": "6.5", "cy": "12.5", "r": ".5", "fill": "currentColor" }
    ],
    [
      "path",
      {
        "d": "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "palette" },
    $$sanitized_props,
    {
      /**
       * @component @name Palette
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMy41IiBjeT0iNi41IiByPSIuNSIgZmlsbD0iY3VycmVudENvbG9yIiAvPgogIDxjaXJjbGUgY3g9IjE3LjUiIGN5PSIxMC41IiByPSIuNSIgZmlsbD0iY3VycmVudENvbG9yIiAvPgogIDxjaXJjbGUgY3g9IjguNSIgY3k9IjcuNSIgcj0iLjUiIGZpbGw9ImN1cnJlbnRDb2xvciIgLz4KICA8Y2lyY2xlIGN4PSI2LjUiIGN5PSIxMi41IiByPSIuNSIgZmlsbD0iY3VycmVudENvbG9yIiAvPgogIDxwYXRoIGQ9Ik0xMiAyQzYuNSAyIDIgNi41IDIgMTJzNC41IDEwIDEwIDEwYy45MjYgMCAxLjY0OC0uNzQ2IDEuNjQ4LTEuNjg4IDAtLjQzNy0uMTgtLjgzNS0uNDM3LTEuMTI1LS4yOS0uMjg5LS40MzgtLjY1Mi0uNDM4LTEuMTI1YTEuNjQgMS42NCAwIDAgMSAxLjY2OC0xLjY2OGgxLjk5NmMzLjA1MSAwIDUuNTU1LTIuNTAzIDUuNTU1LTUuNTU0QzIxLjk2NSA2LjAxMiAxNy40NjEgMiAxMiAyeiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/palette
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
function Share_2($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "18", "cy": "5", "r": "3" }],
    ["circle", { "cx": "6", "cy": "12", "r": "3" }],
    ["circle", { "cx": "18", "cy": "19", "r": "3" }],
    [
      "line",
      { "x1": "8.59", "x2": "15.42", "y1": "13.51", "y2": "17.49" }
    ],
    [
      "line",
      { "x1": "15.41", "x2": "8.59", "y1": "6.51", "y2": "10.49" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "share-2" },
    $$sanitized_props,
    {
      /**
       * @component @name Share2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxOCIgY3k9IjUiIHI9IjMiIC8+CiAgPGNpcmNsZSBjeD0iNiIgY3k9IjEyIiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjE4IiBjeT0iMTkiIHI9IjMiIC8+CiAgPGxpbmUgeDE9IjguNTkiIHgyPSIxNS40MiIgeTE9IjEzLjUxIiB5Mj0iMTcuNDkiIC8+CiAgPGxpbmUgeDE9IjE1LjQxIiB4Mj0iOC41OSIgeTE9IjYuNTEiIHkyPSIxMC40OSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/share-2
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
function Zap($$renderer, $$props) {
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
        "d": "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "zap" },
    $$sanitized_props,
    {
      /**
       * @component @name Zap
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxNGExIDEgMCAwIDEtLjc4LTEuNjNsOS45LTEwLjJhLjUuNSAwIDAgMSAuODYuNDZsLTEuOTIgNi4wMkExIDEgMCAwIDAgMTMgMTBoN2ExIDEgMCAwIDEgLjc4IDEuNjNsLTkuOSAxMC4yYS41LjUgMCAwIDEtLjg2LS40NmwxLjkyLTYuMDJBMSAxIDAgMCAwIDExIDE0eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/zap
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
function ThemeToggle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<button class="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors" aria-label="Toggle Theme">`);
    {
      $$renderer2.push("<!--[-->");
      Moon($$renderer2, { class: "w-5 h-5 text-white" });
    }
    $$renderer2.push(`<!--]--></button>`);
  });
}
function LanguageToggle($$renderer) {
  var $$store_subs;
  $$renderer.push(`<button class="px-3 py-1 rounded-full border border-current text-xs font-bold uppercase tracking-wider hover:bg-current hover:text-black dark:hover:text-black transition-all">${escape_html(store_get($$store_subs ??= {}, "$currentLang", currentLang) === "en" ? "ES" : "EN")}</button>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
function ProcessCarousel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let steps = $$props["steps"];
    let activeIndex = 0;
    const DURATION = 5e3;
    const images = {
      eval: "https://images.unsplash.com/photo-1553877612-823271e47490?q=80&w=2607&auto=format&fit=crop",
      // Meeting/Analysis
      diag: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
      // Data/Charts
      arch: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
      // Technical/Structure
      scale: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
      // Global/Network
      measure: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2676&auto=format&fit=crop",
      // Analytics
      opt: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop"
      // Lightning/Energy
    };
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="bg-neutral-50 dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-2xl shadow-purple-900/10" role="region" aria-label="Process Carousel"><div class="flex overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 scrollbar-hide svelte-jm8qpj"><!--[-->`);
    const each_array = ensure_array_like(steps);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let step = each_array[i];
      $$renderer2.push(`<button${attr_class("flex-1 min-w-[150px] px-6 py-6 text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group text-left outline-none focus:outline-none", void 0, {
        "text-purple-600": activeIndex === i,
        "dark:text-purple-400": activeIndex === i,
        "text-neutral-500": activeIndex !== i,
        "dark:text-neutral-500": activeIndex !== i
      })}><span class="block text-xs mb-1 opacity-50">Step ${escape_html(i + 1)}</span> ${escape_html(step.title)} `);
      if (activeIndex === i) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute bottom-0 left-0 w-full h-1 bg-purple-500"></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="absolute bottom-0 left-0 w-full h-1 bg-neutral-200 dark:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"></div></button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]"><div class="p-8 md:p-16 flex flex-col justify-center relative overflow-hidden"><!---->`);
    {
      $$renderer2.push(`<div class="relative z-10"><div class="text-purple-500 font-bold mb-4 tracking-widest uppercase text-sm">Phase ${escape_html(activeIndex + 1)}</div> <h3 class="text-3xl md:text-5xl font-black mb-8 text-black dark:text-white leading-tight">${escape_html(steps[activeIndex].title)}</h3> `);
      if (steps[activeIndex].subtitle) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-xl text-neutral-600 dark:text-neutral-300 mb-8 font-light">${escape_html(steps[activeIndex].subtitle)}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="space-y-4">`);
      if (steps[activeIndex].items) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(steps[activeIndex].items);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let item = each_array_1[$$index_1];
          $$renderer2.push(`<div class="flex items-start"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4 mt-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span> <span class="text-lg text-neutral-700 dark:text-neutral-300 font-medium">${escape_html(item)}</span></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (steps[activeIndex].desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex items-start"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4 mt-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span> <span class="text-lg text-neutral-700 dark:text-neutral-300 font-medium">${escape_html(steps[activeIndex].desc)}</span></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> <div class="absolute bottom-0 left-0 h-1 bg-purple-500/10 w-full mt-12 hidden md:block"><!---->`);
      {
        $$renderer2.push(`<div class="h-full bg-purple-500"${attr_style(`width: 0%; animation: progress ${stringify(DURATION)}ms linear forwards;`)}></div>`);
      }
      $$renderer2.push(`<!----></div></div>`);
    }
    $$renderer2.push(`<!----></div> <div class="relative overflow-hidden h-64 lg:h-auto"><!---->`);
    {
      $$renderer2.push(`<div class="absolute inset-0"><div class="absolute inset-0 bg-gradient-to-r from-neutral-50 dark:from-neutral-900 to-transparent z-10 lg:w-1/3"></div> <img${attr("src", images[steps[activeIndex].id] || images.eval)}${attr("alt", steps[activeIndex].title)} class="w-full h-full object-cover transform scale-105 transition-transform duration-[10000ms]"/> <div class="absolute inset-0 bg-purple-900/10 mix-blend-overlay"></div></div>`);
    }
    $$renderer2.push(`<!----></div></div></div>`);
    bind_props($$props, { steps });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let workspace, t, processSteps;
    const serviceIcons = [Briefcase, Layers, Zap, Shield, Trending_up, Clipboard_check];
    let data = $$props["data"];
    let openFaqIndex = null;
    let activeProcessStep = 0;
    let mouseX = 0;
    let mouseY = 0;
    let activeReviewIndex = 0;
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    t = translations[store_get($$store_subs ??= {}, "$currentLang", currentLang)];
    processSteps = t?.beltrix?.process?.steps ? [
      { id: "eval", ...t.beltrix.process.steps.eval },
      { id: "diag", ...t.beltrix.process.steps.diag },
      { id: "arch", ...t.beltrix.process.steps.arch },
      { id: "scale", ...t.beltrix.process.steps.scale },
      { id: "measure", ...t.beltrix.process.steps.measure },
      { id: "opt", ...t.beltrix.process.steps.opt }
    ] : [];
    head("1mwcxk2", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(workspace === "beltrix" ? "Beltrix" : "Allianzy Inc")}</title>`);
      });
    });
    if (workspace === "allianzy") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="min-h-screen bg-background text-foreground flex flex-col font-bricolage transition-colors duration-300 overflow-x-hidden selection:bg-primary/20 selection:text-primary relative"><div class="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden"><div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/20 blur-[100px] animate-pulse"></div> <div class="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" style="animation-delay: 2s;"></div> <div class="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-pink-500/20 blur-[100px] animate-pulse" style="animation-delay: 4s;"></div> <div class="absolute top-[40%] left-[-20%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" style="animation-duration: 8s;"></div> <div class="absolute bottom-[20%] right-[-20%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" style="animation-delay: 3s; animation-duration: 9s;"></div></div> <div class="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"${attr_style(` background: radial-gradient(600px circle at ${stringify(mouseX)}px ${stringify(mouseY)}px, rgba(124, 58, 237, 0.15), transparent 40%); `)}></div> <header${attr_class(`fixed top-0 z-50 w-full transition-all duration-300 ${stringify("bg-transparent border-transparent")}`)}><div class="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 relative"><div class="flex items-center gap-2"><a href="#home" class="block"><img${attr("src", logoLight)} alt="Allianzy" class="h-8 w-auto dark:hidden"/> <img${attr("src", logoDark)} alt="Allianzy" class="h-8 w-auto hidden dark:block"/></a></div> <nav class="hidden lg:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2"><a href="#home" class="transition-colors hover:text-primary relative group">${escape_html(t.nav.home)}</a> <a href="#capabilities" class="transition-colors hover:text-primary">${escape_html(t.nav.capabilities)}</a> <a href="#services" class="transition-colors hover:text-primary">${escape_html(t.nav.services)}</a> <a href="#faq" class="transition-colors hover:text-primary">${escape_html(t.nav.faq)}</a></nav> <div class="hidden lg:flex items-center gap-4"><div class="flex items-center gap-1"><div class="relative"><button class="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">`);
      {
        $$renderer2.push("<!--[!-->");
        {
          $$renderer2.push("<!--[!-->");
          Laptop($$renderer2, { class: "h-5 w-5" });
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="relative"><button class="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">`);
      Languages($$renderer2, { class: "h-5 w-5" });
      $$renderer2.push(`<!----></button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (data?.user) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a href="/dashboard" class="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">${escape_html(t.nav.dashboard)}</a>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="flex items-center gap-2"><a href="/allianzy/auth/login" class="px-5 py-2.5 rounded-full bg-transparent text-foreground border border-input text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all">${escape_html(t.nav.login)}</a> <a href="/allianzy/intake" class="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">${escape_html(t.nav.start_eval)}</a></div>`);
      }
      $$renderer2.push(`<!--]--></div> <button class="lg:hidden p-2">`);
      {
        $$renderer2.push("<!--[!-->");
        Menu($$renderer2, { class: "h-6 w-6" });
      }
      $$renderer2.push(`<!--]--></button></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></header> <section id="home" class="relative z-10 flex-1 flex flex-col items-center justify-center py-32 lg:py-48 text-center px-4 overflow-visible scroll-mt-[98px]"><div class="absolute inset-0 w-full h-full pointer-events-none -z-10"><div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/30 blur-[120px] animate-pulse"></div> <div class="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/30 blur-[120px] animate-pulse" style="animation-delay: 1.5s;"></div> <div class="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-500/30 blur-[120px] animate-pulse" style="animation-delay: 3s;"></div></div> <div class="relative z-10 inline-flex overflow-hidden rounded-full p-[1px] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 group cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all"><span class="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#a855f7_50%,#3b82f6_100%)]"></span> <div class="inline-flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-black px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-3xl"><span class="mr-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary tracking-wide">${escape_html(t.hero.badge?.new)}</span> <span class="mr-1">${escape_html(t.hero.badge?.text)}</span> `);
      Arrow_right($$renderer2, {
        class: "ml-1 h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform"
      });
      $$renderer2.push(`<!----></div></div> <h1 class="relative z-10 text-5xl sm:text-7xl font-bold tracking-tight lg:text-8xl max-w-5xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100 whitespace-pre-line leading-tight svelte-1mwcxk2">${escape_html(t.hero.title)}</h1> <p class="relative z-10 text-xl sm:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200 whitespace-pre-line svelte-1mwcxk2">${escape_html(t.hero.subtitle)}</p> <div class="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-400 items-center justify-center svelte-1mwcxk2"><a href="/allianzy/intake" class="px-8 py-4 rounded-full bg-foreground text-background font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 min-w-[160px]">${escape_html(t.hero.cta)}</a> <a href="#how-we-work" class="px-8 py-4 rounded-full border border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-md font-medium text-lg hover:bg-white/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 min-w-[160px] shadow-lg">${escape_html(t.hero.cta_secondary)}</a></div></section> <section class="py-12 md:py-24 px-4 relative z-10"><div class="container mx-auto max-w-6xl text-center relative z-10"><h2 class="text-3xl md:text-5xl font-bold mb-12">${escape_html(t.problem.title)}</h2> <div class="grid md:grid-cols-3 gap-12 text-left mb-16"><!--[-->`);
      const each_array = ensure_array_like(t.problem.items);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let item = each_array[i];
        $$renderer2.push(`<div class="flex flex-col items-start gap-4 group"><div class="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 mb-2"><!---->`);
        [Users, File_text, Git_branch][i]?.($$renderer2, { class: "w-6 h-6" });
        $$renderer2.push(`<!----></div> <p class="text-lg leading-relaxed text-gray-600 dark:text-white/70">${escape_html(item)}</p></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-2 text-xl md:text-2xl font-medium text-muted-foreground"><p>${escape_html(t.problem.closure_1)}</p> <p class="text-foreground font-bold">${escape_html(t.problem.closure_2)}</p></div></div></section> <section id="capabilities" class="py-12 md:py-24 px-4 relative scroll-mt-[98px]"><div class="container mx-auto max-w-6xl relative z-10"><div class="rounded-[2.5rem] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#05050A]/60 backdrop-blur-3xl overflow-hidden relative grid lg:grid-cols-5 shadow-2xl transition-colors duration-500"><div class="lg:col-span-2 relative p-8 md:p-12 flex flex-col justify-center overflow-hidden"><div class="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/80 to-transparent z-0"></div> <div class="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-pink-500/50 blur-[100px] animate-pulse rounded-full z-0"></div> <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/70 dark:to-[#05050A]/60 z-0 opacity-100 transition-colors duration-500"></div> <div class="relative z-10 max-w-[85%]"><div class="inline-flex items-center rounded-lg bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-8 text-white shadow-lg">${escape_html(t.capabilities.badge)}</div> <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">${escape_html(t.capabilities.title)}</h2> <p class="text-lg text-white/90 mb-10 max-w-md leading-relaxed font-medium">${escape_html(t.hero.subtitle)}</p> <a href="/allianzy/intake" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 hover:scale-105 transition-all shadow-xl">${escape_html(t.hero.cta)}</a></div></div> <div class="lg:col-span-3 bg-transparent p-8 md:p-12 grid sm:grid-cols-2 gap-x-8 gap-y-12 relative z-10"><div class="group"><div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5 text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">`);
      Git_branch($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div> <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-3 transition-colors">${escape_html(t.capabilities.items.custom.title)}</h3> <p class="text-gray-600 dark:text-white/60 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors">${escape_html(t.capabilities.items.custom.desc)}</p></div> <div class="group"><div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5 text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">`);
      Zap($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div> <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-3 transition-colors">${escape_html(t.capabilities.items.automation.title)}</h3> <p class="text-gray-600 dark:text-white/60 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors">${escape_html(t.capabilities.items.automation.desc)}</p></div> <div class="group"><div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5 text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">`);
      Layers($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div> <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-3 transition-colors">${escape_html(t.capabilities.items.platform.title)}</h3> <p class="text-gray-600 dark:text-white/60 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors">${escape_html(t.capabilities.items.platform.desc)}</p></div> <div class="group"><div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5 text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">`);
      Search($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div> <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-3 transition-colors">${escape_html(t.capabilities.items.consulting.title)}</h3> <p class="text-gray-600 dark:text-white/60 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors">${escape_html(t.capabilities.items.consulting.desc)}</p></div></div></div></div></section> <section class="py-12 md:py-24 px-4 relative"><div class="container mx-auto max-w-5xl relative z-10"><div class="mb-16 text-center"><h2 class="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">${escape_html(t.why_allianzy.title)}</h2></div> <div class="grid grid-cols-2 pb-6 border-b border-gray-200 dark:border-white/10 mb-2"><div class="text-lg font-semibold flex items-center gap-3 text-muted-foreground">`);
      Users($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> <span>${escape_html(t.why_allianzy.traditional.title)}</span></div> <div class="text-lg font-semibold flex items-center gap-3 text-gray-900 dark:text-white pl-6">`);
      Shield($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> <span>${escape_html(t.why_allianzy.allianzy.title)}</span></div></div> <div class="space-y-0"><!--[-->`);
      const each_array_1 = ensure_array_like(t.why_allianzy.traditional.items);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let item = each_array_1[i];
        $$renderer2.push(`<div class="grid grid-cols-2 border-b border-gray-200 dark:border-white/10 last:border-0 group transition-colors py-6"><div class="pr-6 flex items-start gap-3 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">`);
        X($$renderer2, {
          class: "w-5 h-5 text-red-500/50 group-hover:text-red-500 shrink-0 mt-1 transition-colors"
        });
        $$renderer2.push(`<!----> <span>${escape_html(item)}</span></div> <div class="pl-6 flex items-start gap-3 font-medium text-gray-700 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors relative"><div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-primary group-hover:h-full transition-all duration-300"></div> `);
        Circle_check($$renderer2, { class: "w-5 h-5 text-primary shrink-0 mt-1" });
        $$renderer2.push(`<!----> <span>${escape_html(t.why_allianzy.allianzy.items[i])}</span></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></section> <section class="py-12 md:py-24 px-4 relative"><div class="container mx-auto max-w-6xl relative z-10 flex justify-center"><div class="relative flex items-center gap-0 w-full justify-center md:justify-between"><style>
                        @keyframes flow-line-horizontal {
                            0%, 100% { background-position: -100% 0%; opacity: 0.3; }
                            50% { background-position: 100% 0%; opacity: 1; }
                        }
                        @keyframes pulse-block {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
                            50% { box-shadow: 0 0 50px 10px rgba(168, 85, 247, 0.4); border-color: rgba(168, 85, 247, 0.9); }
                        }
                        
                        /* Updated duration to 4.8s for 6 steps (0.8s intervals) */
                        .block-pulse-1 { animation: pulse-block 4.8s infinite ease-in-out 0s; }
                        .block-pulse-2 { animation: pulse-block 4.8s infinite ease-in-out 0.8s; }
                        .block-pulse-3 { animation: pulse-block 4.8s infinite ease-in-out 1.6s; }
                        .block-pulse-4 { animation: pulse-block 4.8s infinite ease-in-out 2.4s; }
                        .block-pulse-5 { animation: pulse-block 4.8s infinite ease-in-out 3.2s; }
                        .block-pulse-6 { animation: pulse-block 4.8s infinite ease-in-out 4.0s; }
                        
                        /* Responsive animations for lines */
                        .line-flow-1 { animation: flow-line-horizontal 4.8s infinite linear 0.4s; }
                        .line-flow-2 { animation: flow-line-horizontal 4.8s infinite linear 1.2s; }
                        .line-flow-3 { animation: flow-line-horizontal 4.8s infinite linear 2.0s; }
                        .line-flow-4 { animation: flow-line-horizontal 4.8s infinite linear 2.8s; }
                        .line-flow-5 { animation: flow-line-horizontal 4.8s infinite linear 3.6s; }
                    </style> <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-1 shadow-sm shrink-0">`);
      Database($$renderer2, {
        class: "w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70"
      });
      $$renderer2.push(`<!----></div> <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]"><div class="absolute inset-0 w-full h-full line-flow-1 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div></div> <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-2 shadow-sm shrink-0">`);
      Search($$renderer2, {
        class: "w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70"
      });
      $$renderer2.push(`<!----></div> <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]"><div class="absolute inset-0 w-full h-full line-flow-2 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div></div> <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-3 shadow-sm shrink-0">`);
      Cpu($$renderer2, {
        class: "w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70"
      });
      $$renderer2.push(`<!----></div> <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]"><div class="absolute inset-0 w-full h-full line-flow-3 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div></div> <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-4 shadow-sm shrink-0">`);
      Git_branch($$renderer2, {
        class: "w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70"
      });
      $$renderer2.push(`<!----></div> <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]"><div class="absolute inset-0 w-full h-full line-flow-4 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div></div> <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-5 shadow-sm shrink-0">`);
      Lightbulb($$renderer2, {
        class: "w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70"
      });
      $$renderer2.push(`<!----></div> <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]"><div class="absolute inset-0 w-full h-full line-flow-5 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div></div> <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-6 shadow-sm shrink-0">`);
      Trending_up($$renderer2, {
        class: "w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70"
      });
      $$renderer2.push(`<!----></div></div></div></section> <section id="services" class="py-12 md:py-24 px-4 relative scroll-mt-[98px]"><div class="container mx-auto max-w-6xl relative z-10"><div class="text-center mb-16"><h2 class="text-3xl md:text-5xl font-bold mb-4">${escape_html(t.services.title)}</h2> <p class="text-xl text-muted-foreground">${escape_html(t.services.principle)}</p></div> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"><!--[-->`);
      const each_array_2 = ensure_array_like(t.services.items);
      for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
        let item = each_array_2[i];
        $$renderer2.push(`<div class="group relative p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur-2xl hover:bg-white/80 dark:hover:bg-purple-500/5 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all duration-500 overflow-hidden shadow-[0_0_30px_-10px_rgba(168,85,247,0.1)] dark:shadow-[0_0_30px_-10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.2)] dark:hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.15)]"><div class="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 dark:bg-purple-600/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 dark:group-hover:bg-purple-600/20 transition-all duration-500"></div> <div class="relative z-10 mb-12 flex items-start justify-between"><div class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/10 group-hover:border-purple-300 dark:group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-500 shadow-[0_0_15px_-5px_rgba(168,85,247,0.1)]"><!---->`);
        (serviceIcons[i] || Briefcase)?.($$renderer2, { class: "w-7 h-7" });
        $$renderer2.push(`<!----></div> <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">`);
        Arrow_up_right($$renderer2, { class: "w-6 h-6 text-purple-500 dark:text-purple-400/80" });
        $$renderer2.push(`<!----></div></div> <div class="relative z-10"><h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">${escape_html(item.title)}</h3> <p class="text-base text-muted-foreground leading-relaxed group-hover:text-gray-600 dark:group-hover:text-purple-100/70 transition-colors duration-300">${escape_html(item.desc)}</p></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></section> <section id="how-we-work" class="py-12 md:py-24 px-4 relative scroll-mt-[98px]"><div class="container mx-auto max-w-6xl relative z-10"><div class="text-center mb-16"><h2 class="text-3xl md:text-5xl font-bold mb-6">${escape_html(t.process.title)}</h2></div> <div class="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start relative"><div class="space-y-6 relative" role="region" aria-label="Process steps"><div class="hidden lg:block absolute top-8 bottom-8 right-[-48px] w-px bg-border/50"></div> <!--[-->`);
      const each_array_3 = ensure_array_like(t.process.steps);
      for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
        let step = each_array_3[i];
        $$renderer2.push(`<div class="relative"><button${attr_class(`w-full text-left p-6 rounded-2xl transition-all duration-300 border flex flex-col gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-primary relative z-10 ${stringify(activeProcessStep === i ? "bg-card border-primary/50 shadow-lg scale-[1.02]" : "bg-card/30 border-transparent hover:bg-card/50 opacity-60 hover:opacity-100")}`)}><span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">${escape_html(store_get($$store_subs ??= {}, "$currentLang", currentLang) === "en" ? "Step" : "Paso")} ${escape_html(i + 1)}</span> <h3${attr_class(`text-xl font-bold text-foreground ${stringify(activeProcessStep === i ? "text-primary" : "")}`)}>${escape_html(step.title)}</h3></button> <div${attr_class(`hidden lg:flex absolute top-1/2 -translate-y-1/2 right-[-54px] z-20 items-center justify-center w-3 h-3 rounded-full transition-all duration-300 ${stringify(activeProcessStep === i ? "bg-background border-2 border-primary scale-150 shadow-[0_0_15px_rgba(124,58,237,0.5)]" : "bg-background border border-muted-foreground/30")}`)}>`);
        if (activeProcessStep === i) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="lg:sticky lg:top-32 mt-8 lg:mt-0"><div class="relative h-[520px] lg:h-[580px] rounded-3xl overflow-hidden border border-white/10 bg-card/30 backdrop-blur-xl shadow-2xl flex flex-col transition-all duration-500 group"><div class="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full transition-all duration-500 opacity-50 group-hover:opacity-100 pointer-events-none"></div> <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full transition-all duration-500 opacity-50 group-hover:opacity-100 pointer-events-none"></div> <div class="relative z-10 p-8 md:p-12 pb-0 flex-1"><div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-xl mb-6 shadow-inner">${escape_html(activeProcessStep + 1)}</div> <!---->`);
      {
        $$renderer2.push(`<div><h3 class="text-2xl md:text-3xl font-bold mb-4 text-foreground leading-tight">${escape_html(t.process.steps[activeProcessStep].title)}</h3> <p class="text-lg text-muted-foreground leading-relaxed mb-8">${escape_html(t.process.steps[activeProcessStep].desc)}</p></div>`);
      }
      $$renderer2.push(`<!----></div> <div class="relative w-full h-64 mt-auto overflow-hidden" style="mask-image: linear-gradient(to bottom, transparent, black 40%); -webkit-mask-image: linear-gradient(to bottom, transparent, black 40%);"><!---->`);
      {
        $$renderer2.push(`<div class="absolute inset-0"><img${attr("src", t.process.steps[activeProcessStep].image)}${attr("alt", t.process.steps[activeProcessStep].title)} class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"/></div>`);
      }
      $$renderer2.push(`<!----></div></div></div></div></div></section> <section class="py-12 md:py-24 px-4 relative"><div class="container mx-auto max-w-4xl relative z-10"><div class="text-center mb-16">`);
      if (t.reviews.items && t.reviews.items.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="relative min-h-[600px] md:min-h-[500px] flex flex-col items-center justify-center"><!---->`);
        {
          $$renderer2.push(`<div class="absolute inset-0 flex flex-col items-center justify-center"><div class="text-center px-4"><blockquote class="text-xl md:text-3xl font-medium leading-relaxed mb-10 text-foreground/90 max-w-3xl mx-auto">"${escape_html(t.reviews.items[activeReviewIndex].quote)}"</blockquote> <div class="flex flex-col items-center gap-4"><div class="h-16 w-32 flex items-center justify-center"><img${attr("src", t.reviews.items[activeReviewIndex].logo)}${attr("alt", t.reviews.items[activeReviewIndex].company)} class="max-w-full max-h-full object-contain"/></div> <div class="text-center"><div class="font-bold text-lg">${escape_html(t.reviews.items[activeReviewIndex].author)}</div> <div class="text-sm text-muted-foreground font-medium uppercase tracking-wider">${escape_html(t.reviews.items[activeReviewIndex].company)}</div></div></div></div></div>`);
        }
        $$renderer2.push(`<!----></div> <div class="flex justify-center gap-3 mt-4"><!--[-->`);
        const each_array_4 = ensure_array_like(t.reviews.items);
        for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
          each_array_4[i];
          $$renderer2.push(`<button${attr_class(`w-2.5 h-2.5 rounded-full transition-all duration-300 ${stringify(activeReviewIndex === i ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50")}`)}${attr("aria-label", `Go to review ${stringify(i + 1)}`)}></button>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></section> <section id="faq" class="py-12 md:py-24 px-4 relative isolate overflow-hidden scroll-mt-[98px]"><div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10"><div class="absolute top-[20%] right-[30%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[90px] animate-pulse" style="animation-duration: 9s;"></div></div> <div class="container mx-auto max-w-3xl relative z-10"><div class="text-center mb-16"><h2 class="text-3xl font-bold">${escape_html(t.faq.title)}</h2></div> <div class="space-y-4"><!--[-->`);
      const each_array_5 = ensure_array_like(t.faq.items);
      for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
        let item = each_array_5[i];
        $$renderer2.push(`<div class="border border-white/10 rounded-xl overflow-hidden bg-white/5 dark:bg-white/5 backdrop-blur-md transition-all duration-300 hover:shadow-md hover:bg-white/10 dark:hover:bg-white/10"><button class="w-full flex items-center justify-between p-5 text-left font-medium hover:text-primary transition-colors">${escape_html(item.q)} `);
        if (openFaqIndex === i) {
          $$renderer2.push("<!--[-->");
          Chevron_up($$renderer2, { class: "w-4 h-4 text-muted-foreground" });
        } else {
          $$renderer2.push("<!--[!-->");
          Chevron_down($$renderer2, { class: "w-4 h-4 text-muted-foreground" });
        }
        $$renderer2.push(`<!--]--></button> `);
        if (openFaqIndex === i) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="p-5 text-muted-foreground leading-relaxed border-t border-white/10 bg-black/5 dark:bg-white/5">${escape_html(item.a)}</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></section> <section class="py-12 md:py-24 px-4 relative isolate overflow-hidden"><div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10"><div class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-primary/10 blur-[100px] animate-pulse"></div></div> <div class="container mx-auto max-w-6xl relative z-10"><div class="relative rounded-3xl overflow-hidden border border-white/10 bg-transparent shadow-2xl shadow-blue-500/20 group"><div class="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div> <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/40 blur-[80px] rounded-full group-hover:bg-blue-500/50 transition-all duration-500"></div> <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/40 blur-[80px] rounded-full group-hover:bg-purple-500/50 transition-all duration-500"></div> <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/3 bg-gradient-to-t from-pink-500/20 to-transparent blur-3xl opacity-50"></div> <div class="relative z-10 px-8 py-20 md:py-32 text-center"><h2 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-foreground drop-shadow-sm">${escape_html(t.cta_final.title)}</h2> <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">${escape_html(t.cta_final.subtitle)}</p> <a href="/allianzy/intake" class="px-10 py-5 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 border border-white/10 shadow-lg shadow-primary/20">${escape_html(t.cta_final.button)} `);
      Arrow_right($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></a></div> <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div></div></div></section> <footer class="py-16 border-t bg-muted/10 text-sm"><div class="container mx-auto px-4"><div class="grid md:grid-cols-4 gap-12 mb-12"><div class="col-span-1 md:col-span-1"><div class="flex items-center gap-2 mb-4"><img${attr("src", logoLight)} alt="Allianzy" class="h-8 w-auto dark:hidden"/> <img${attr("src", logoDark)} alt="Allianzy" class="h-8 w-auto hidden dark:block"/></div> <p class="text-muted-foreground mb-4">${escape_html(t.footer.desc)}</p> <div class="flex gap-4"><a href="https://www.linkedin.com/company/allianzyinc/" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors">`);
      Linkedin($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></a> <a href="https://www.instagram.com/allianzy.inc/" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors">`);
      Instagram($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></a> <a href="https://www.facebook.com/allianzy.inc" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors">`);
      Facebook($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></a> <a href="mailto:support@allianzy.us" class="text-muted-foreground hover:text-foreground transition-colors">`);
      Mail($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></a></div></div> <div class="col-span-1 md:col-span-3 flex justify-end"><div><h3 class="font-semibold mb-4">${escape_html(t.footer.menu.title)}</h3> <ul class="space-y-2 text-muted-foreground"><li><a href="#home" class="hover:text-foreground transition-colors">${escape_html(t.footer.menu.home)}</a></li> <li><a href="#capabilities" class="hover:text-foreground transition-colors">${escape_html(t.footer.menu.capabilities)}</a></li> <li><a href="#services" class="hover:text-foreground transition-colors">${escape_html(t.footer.menu.services)}</a></li> <li><a href="#faq" class="hover:text-foreground transition-colors">${escape_html(t.footer.menu.faq)}</a></li></ul></div></div></div> <div class="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs"><p>© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Allianzy Inc. ${escape_html(t.footer.rights)}</p> <div class="flex gap-6"><a href="/" class="hover:text-foreground transition-colors">${escape_html(t.footer.privacy)}</a> <a href="/" class="hover:text-foreground transition-colors">${escape_html(t.footer.terms)}</a></div></div></div></footer></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (workspace === "beltrix") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="min-h-screen bg-white dark:bg-black text-black dark:text-white font-merriweather selection:bg-purple-500 selection:text-white transition-colors duration-300"><nav class="fixed w-full z-50 top-0 px-6 py-6 text-black dark:text-white transition-colors duration-300"><div class="max-w-7xl mx-auto flex justify-between items-center"><a href="/beltrix" class="block"><img${attr("src", beltrixLogoLight)} alt="Beltrix" class="h-8 w-auto dark:hidden"/> <img${attr("src", beltrixLogoDark)} alt="Beltrix" class="h-8 w-auto hidden dark:block"/></a> <div class="flex gap-6 items-center">`);
        LanguageToggle($$renderer2);
        $$renderer2.push(`<!----> `);
        ThemeToggle($$renderer2);
        $$renderer2.push(`<!----> <a href="/beltrix/auth/login" class="text-sm font-bold uppercase tracking-widest hover:text-purple-400 transition-colors">${escape_html(t.beltrix.nav.login)}</a> <a href="/beltrix/dashboard" class="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">${escape_html(t.beltrix.nav.start)}</a></div></div></nav> <section class="relative min-h-screen flex items-center justify-center overflow-hidden"><div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-white dark:via-black to-white dark:to-black transition-colors duration-300"></div> <div class="relative z-10 text-center max-w-5xl mx-auto px-4"><h1 class="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-b from-black to-neutral-500 dark:from-white dark:to-neutral-500">${html(t.beltrix.hero.title)}</h1> <p class="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12 font-light">${escape_html(t.beltrix.hero.subtitle)}</p> <div class="flex flex-col sm:flex-row items-center justify-center gap-6"><a href="/dashboard" class="group relative px-8 py-4 bg-transparent border border-neutral-200 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors rounded-full overflow-hidden"><span class="relative z-10 font-bold uppercase tracking-widest text-sm text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors">${escape_html(t.beltrix.hero.enter)}</span> <div class="absolute inset-0 bg-black dark:bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0"></div> <span class="absolute inset-0 z-10 flex items-center justify-center font-bold uppercase tracking-widest text-sm text-white dark:text-black translate-y-full group-hover:translate-y-0 transition-transform duration-300">${escape_html(t.beltrix.hero.enter)}</span></a></div></div></section> <div class="border-y border-neutral-200 dark:border-white/10 py-4 bg-white dark:bg-black overflow-hidden whitespace-nowrap transition-colors duration-300"><div class="inline-block animate-marquee"><span class="text-4xl font-bold uppercase text-transparent stroke-text px-8 svelte-1mwcxk2">${escape_html(t.beltrix.ticker.strategy)}</span> <span class="text-4xl font-bold uppercase text-black dark:text-white px-8">${escape_html(t.beltrix.ticker.design)}</span> <span class="text-4xl font-bold uppercase text-transparent stroke-text px-8 svelte-1mwcxk2">${escape_html(t.beltrix.ticker.dev)}</span> <span class="text-4xl font-bold uppercase text-black dark:text-white px-8">${escape_html(t.beltrix.ticker.branding)}</span> <span class="text-4xl font-bold uppercase text-transparent stroke-text px-8 svelte-1mwcxk2">${escape_html(t.beltrix.ticker.marketing)}</span> <span class="text-4xl font-bold uppercase text-black dark:text-white px-8">${escape_html(t.beltrix.ticker.content)}</span></div></div> <section class="py-32 px-4 bg-slate-50 dark:bg-black transition-colors duration-300"><div class="max-w-7xl mx-auto"><div class="mb-20"><h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-black dark:text-white transition-colors">${escape_html(t.beltrix.services.title)}</h2> <div class="h-1 w-20 bg-purple-600"></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"><div class="space-y-12"><div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none"><div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&amp;w=1974&amp;auto=format&amp;fit=crop" alt="Social Media" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/></div> <div class="p-8 md:p-10 relative"><div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">`);
        Share_2($$renderer2, { class: "w-8 h-8 text-purple-600 dark:text-purple-400" });
        $$renderer2.push(`<!----></div> <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.social.title)}</h3> <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">${escape_html(t.beltrix.services.social.desc)}</p> <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.social.cta)} `);
        Arrow_right($$renderer2, { class: "ml-2 w-4 h-4" });
        $$renderer2.push(`<!----></a></div></div> <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none"><div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&amp;w=2070&amp;auto=format&amp;fit=crop" alt="Digital Ads" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/></div> <div class="p-8 md:p-10 relative"><div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">`);
        Megaphone($$renderer2, { class: "w-8 h-8 text-purple-600 dark:text-purple-400" });
        $$renderer2.push(`<!----></div> <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.ads.title)}</h3> <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">${escape_html(t.beltrix.services.ads.desc)}</p> <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.ads.cta)} `);
        Arrow_right($$renderer2, { class: "ml-2 w-4 h-4" });
        $$renderer2.push(`<!----></a></div></div> <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none"><div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&amp;w=2070&amp;auto=format&amp;fit=crop" alt="Design" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/></div> <div class="p-8 md:p-10 relative"><div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">`);
        Image($$renderer2, { class: "w-8 h-8 text-purple-600 dark:text-purple-400" });
        $$renderer2.push(`<!----></div> <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.design.title)}</h3> <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">${escape_html(t.beltrix.services.design.desc)}</p> <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.design.cta)} `);
        Arrow_right($$renderer2, { class: "ml-2 w-4 h-4" });
        $$renderer2.push(`<!----></a></div></div></div> <div class="space-y-12 md:pt-32"><div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none"><div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&amp;w=2015&amp;auto=format&amp;fit=crop" alt="Website" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/></div> <div class="p-8 md:p-10 relative"><div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">`);
        Laptop($$renderer2, { class: "w-8 h-8 text-purple-600 dark:text-purple-400" });
        $$renderer2.push(`<!----></div> <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.web.title)}</h3> <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">${escape_html(t.beltrix.services.web.desc)}</p> <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.web.cta)} `);
        Arrow_right($$renderer2, { class: "ml-2 w-4 h-4" });
        $$renderer2.push(`<!----></a></div></div> <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none"><div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&amp;w=2070&amp;auto=format&amp;fit=crop" alt="Branding" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/></div> <div class="p-8 md:p-10 relative"><div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">`);
        Palette($$renderer2, { class: "w-8 h-8 text-purple-600 dark:text-purple-400" });
        $$renderer2.push(`<!----></div> <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.brand.title)}</h3> <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">${escape_html(t.beltrix.services.brand.desc)}</p> <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.brand.cta)} `);
        Arrow_right($$renderer2, { class: "ml-2 w-4 h-4" });
        $$renderer2.push(`<!----></a></div></div> <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none"><div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&amp;w=2070&amp;auto=format&amp;fit=crop" alt="Consulting" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/></div> <div class="p-8 md:p-10 relative"><div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">`);
        Brain($$renderer2, { class: "w-8 h-8 text-purple-600 dark:text-purple-400" });
        $$renderer2.push(`<!----></div> <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.consulting.title)}</h3> <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">${escape_html(t.beltrix.services.consulting.desc)}</p> <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">${escape_html(t.beltrix.services.consulting.cta)} `);
        Arrow_right($$renderer2, { class: "ml-2 w-4 h-4" });
        $$renderer2.push(`<!----></a></div></div></div></div></div></section> <section class="py-32 bg-white dark:bg-black transition-colors duration-300 border-t border-neutral-200 dark:border-neutral-800"><div class="max-w-7xl mx-auto px-6"><div class="text-center mb-16"><h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-black dark:text-white transition-colors">${escape_html(t.beltrix.process.title)}</h2> <p class="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-light max-w-3xl mx-auto">${escape_html(t.beltrix.process.subtitle)}</p></div> `);
        ProcessCarousel($$renderer2, { steps: processSteps });
        $$renderer2.push(`<!----></div></section> <section class="py-32 bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300"><div class="max-w-7xl mx-auto px-6"><h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 text-center text-black dark:text-white transition-colors">${escape_html(t.beltrix.testimonials.title)}</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"><!--[-->`);
        const each_array_6 = ensure_array_like(t.beltrix.testimonials.items);
        for (let $$index_7 = 0, $$length = each_array_6.length; $$index_7 < $$length; $$index_7++) {
          let item = each_array_6[$$index_7];
          $$renderer2.push(`<div class="bg-white dark:bg-black p-10 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-300 shadow-sm dark:shadow-none"><div class="mb-8"><!--[-->`);
          const each_array_7 = ensure_array_like(Array(5));
          for (let $$index_6 = 0, $$length2 = each_array_7.length; $$index_6 < $$length2; $$index_6++) {
            each_array_7[$$index_6];
            $$renderer2.push(`<span class="text-purple-500">★</span>`);
          }
          $$renderer2.push(`<!--]--></div> <p class="text-xl font-medium mb-8 leading-relaxed text-neutral-800 dark:text-neutral-200">"${escape_html(item.quote)}"</p> <div><p class="font-bold text-black dark:text-white uppercase tracking-wider">${escape_html(item.author)}</p> <p class="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">${escape_html(item.role)}</p></div></div>`);
        }
        $$renderer2.push(`<!--]--></div></div></section> <section class="py-32 bg-white dark:bg-black transition-colors duration-300 border-t border-neutral-200 dark:border-neutral-800"><div class="max-w-4xl mx-auto px-6"><h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 text-center text-black dark:text-white transition-colors">${escape_html(t.beltrix.faq.title)}</h2> <div class="space-y-6"><!--[-->`);
        const each_array_8 = ensure_array_like(t.beltrix.faq.items);
        for (let $$index_8 = 0, $$length = each_array_8.length; $$index_8 < $$length; $$index_8++) {
          let item = each_array_8[$$index_8];
          $$renderer2.push(`<div class="group border-b border-neutral-200 dark:border-neutral-800 pb-6"><h3 class="text-2xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-500 transition-colors cursor-pointer flex justify-between items-center">${escape_html(item.q)} <span class="text-purple-500">+</span></h3> <p class="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">${escape_html(item.a)}</p></div>`);
        }
        $$renderer2.push(`<!--]--></div></div></section></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
