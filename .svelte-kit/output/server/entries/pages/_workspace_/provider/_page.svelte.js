import { a4 as ensure_array_like, a0 as attr_class, a5 as stringify } from "../../../../chunks/index2.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$renderer) {
  const tasks = [
    {
      id: "T-101",
      title: "Design Homepage Mockup",
      due: "2023-10-05",
      priority: "High"
    },
    {
      id: "T-102",
      title: "Implement Auth Flow",
      due: "2023-10-08",
      priority: "Medium"
    }
  ];
  $$renderer.push(`<div class="space-y-6"><h2 class="text-2xl font-bold tracking-tight">Assigned Tasks</h2> <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
  const each_array = ensure_array_like(tasks);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let task = each_array[$$index];
    $$renderer.push(`<div class="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"><div class="flex justify-between items-start mb-4"><span class="text-xs font-mono bg-muted px-2 py-1 rounded">${escape_html(task.id)}</span> <span${attr_class(`text-xs font-medium px-2 py-1 rounded-full ${stringify(task.priority === "High" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700")}`)}>${escape_html(task.priority)}</span></div> <h3 class="text-lg font-semibold mb-2">${escape_html(task.title)}</h3> <p class="text-sm text-muted-foreground mb-4">Due: ${escape_html(task.due)}</p> <button class="w-full py-2 border rounded hover:bg-muted transition-colors text-sm font-medium">View Details</button></div>`);
  }
  $$renderer.push(`<!--]--></div></div>`);
}
export {
  _page as default
};
