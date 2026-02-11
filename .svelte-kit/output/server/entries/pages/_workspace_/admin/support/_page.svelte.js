import "clsx";
import { M as Message_square } from "../../../../../chunks/message-square.js";
function _page($$renderer) {
  $$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between"><h2 class="text-3xl font-bold tracking-tight">Soporte</h2> <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2">`);
  Message_square($$renderer, { class: "w-4 h-4" });
  $$renderer.push(`<!----> Crear Ticket</button></div> <div class="rounded-md border"><div class="p-4"><h3 class="font-medium">Tickets Recientes</h3> <p class="text-sm text-muted-foreground">No hay tickets recientes.</p></div></div></div>`);
}
export {
  _page as default
};
