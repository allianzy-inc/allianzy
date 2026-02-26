import { t as ssr_context, n as noop } from "./context.js";
import "clsx";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function createEventDispatcher() {
  return noop;
}
async function tick() {
}
export {
  createEventDispatcher as c,
  onDestroy as o,
  tick as t
};
