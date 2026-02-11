import { a4 as ensure_array_like } from "../../../../chunks/index2.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$renderer) {
  const tickets = [
    {
      id: "TK-1",
      subject: "Login issue",
      status: "Open",
      created: "1 hour ago"
    }
  ];
  $$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between"><h2 class="text-2xl font-bold tracking-tight">Support Tickets</h2> <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">New Ticket</button></div> <div class="bg-card border rounded-lg overflow-hidden">`);
  if (tickets.length === 0) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<div class="p-8 text-center text-muted-foreground">No open tickets.</div>`);
  } else {
    $$renderer.push("<!--[!-->");
    $$renderer.push(`<table class="w-full text-sm text-left"><thead class="bg-muted/50 border-b"><tr><th class="px-4 py-3 font-medium">ID</th><th class="px-4 py-3 font-medium">Subject</th><th class="px-4 py-3 font-medium">Status</th><th class="px-4 py-3 font-medium">Created</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(tickets);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let ticket = each_array[$$index];
      $$renderer.push(`<tr class="border-b last:border-0"><td class="px-4 py-3 font-medium">${escape_html(ticket.id)}</td><td class="px-4 py-3">${escape_html(ticket.subject)}</td><td class="px-4 py-3"><span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">${escape_html(ticket.status)}</span></td><td class="px-4 py-3 text-muted-foreground">${escape_html(ticket.created)}</td></tr>`);
    }
    $$renderer.push(`<!--]--></tbody></table>`);
  }
  $$renderer.push(`<!--]--></div></div>`);
}
export {
  _page as default
};
