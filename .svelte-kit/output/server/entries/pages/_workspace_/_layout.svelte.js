import { Z as store_get, a0 as attr_class, _ as slot, $ as unsubscribe_stores } from "../../../chunks/index2.js";
import { p as page } from "../../../chunks/stores.js";
import { c as clsx, a as attr } from "../../../chunks/attributes.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let workspace, isBeltix, isAllianzy;
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    isBeltix = workspace === "beltix";
    isAllianzy = workspace === "allianzy";
    $$renderer2.push(`<div${attr_class(clsx(isBeltix ? "font-merriweather" : isAllianzy ? "font-bricolage" : "font-sans"))}${attr("data-theme", workspace)}><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
