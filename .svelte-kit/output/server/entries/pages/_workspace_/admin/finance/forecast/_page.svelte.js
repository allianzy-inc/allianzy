import "clsx";
import { P as Pie_chart } from "../../../../../../chunks/pie-chart.js";
function _page($$renderer) {
  $$renderer.push(`<div class="flex flex-col items-center justify-center h-[60vh] text-center space-y-4"><div class="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">`);
  Pie_chart($$renderer, { class: "w-12 h-12 text-emerald-600 dark:text-emerald-400" });
  $$renderer.push(`<!----></div> <h1 class="text-2xl font-bold">Budgets &amp; Forecast</h1> <p class="text-muted-foreground max-w-md">This module is coming soon. Plan your financial future with budgeting tools and cash flow forecasting.</p></div>`);
}
export {
  _page as default
};
