import { a4 as ensure_array_like, a0 as attr_class, a5 as stringify } from "../../../../chunks/index2.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$renderer) {
  const services = [
    {
      name: "Website Maintenance",
      status: "Active",
      renewal: "2023-11-01",
      price: "$500/mo"
    },
    {
      name: "SEO Optimization",
      status: "Pending Payment",
      renewal: "-",
      price: "$300/mo"
    }
  ];
  $$renderer.push(`<div class="space-y-6"><h2 class="text-2xl font-bold tracking-tight">Client Portal</h2> <div class="grid gap-6 md:grid-cols-2"><div class="bg-card border rounded-lg p-6 shadow-sm"><h3 class="text-lg font-semibold mb-4">Your Services</h3> <div class="space-y-4"><!--[-->`);
  const each_array = ensure_array_like(services);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let service = each_array[$$index];
    $$renderer.push(`<div class="flex items-center justify-between p-4 bg-muted/50 rounded-md"><div><p class="font-medium">${escape_html(service.name)}</p> <p class="text-sm text-muted-foreground">${escape_html(service.price)}</p></div> <div class="text-right"><span${attr_class(`inline-block px-2 py-1 text-xs font-medium rounded-full ${stringify(service.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}`)}>${escape_html(service.status)}</span> `);
    if (service.status === "Pending Payment") {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<button class="block mt-2 text-xs text-primary font-medium hover:underline">Pay Now</button>`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]--></div></div>`);
  }
  $$renderer.push(`<!--]--></div></div> <div class="bg-card border rounded-lg p-6 shadow-sm"><h3 class="text-lg font-semibold mb-4">Quick Actions</h3> <div class="grid grid-cols-2 gap-4"><a href="schedule" class="p-4 border rounded-md hover:bg-muted transition-colors text-center flex flex-col items-center justify-center gap-2"><span class="block font-medium">Book Meeting</span></a> <a href="tickets" class="p-4 border rounded-md hover:bg-muted transition-colors text-center flex flex-col items-center justify-center gap-2"><span class="block font-medium">Open Ticket</span></a></div></div></div></div>`);
}
export {
  _page as default
};
