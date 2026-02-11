import { Z as store_get, _ as slot, $ as unsubscribe_stores } from "../../chunks/index2.js";
import { u as updated } from "../../chunks/stores.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    if (store_get($$store_subs ??= {}, "$updated", updated)) {
      window.location.reload();
    }
    $$renderer2.push(`<!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
