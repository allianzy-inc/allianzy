import { Z as store_get, a4 as ensure_array_like, a0 as attr_class, a5 as stringify, $ as unsubscribe_stores, a6 as bind_props } from "../../../../../chunks/index2.js";
import { p as page } from "../../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { a as attr } from "../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { M as Message_square } from "../../../../../chunks/message-square.js";
import { E as External_link, D as Download } from "../../../../../chunks/external-link.js";
import { X } from "../../../../../chunks/x.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { C as Chevron_down } from "../../../../../chunks/chevron-down.js";
import { P as Paperclip } from "../../../../../chunks/paperclip.js";
import { S as Send } from "../../../../../chunks/send.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let workspace, tickets, selectedCase, selectedCaseComments;
    let data = $$props["data"];
    let commentContent = "";
    let commentFiles = [];
    function formatDate(date) {
      if (!date) return "—";
      return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function getStatusColor(status) {
      if (status === "closed") return "bg-muted text-muted-foreground";
      if (status === "in_progress") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    }
    function getStatusLabel(status) {
      const map = {
        open: "Abierto",
        in_progress: "En progreso",
        closed: "Cerrado"
      };
      return map[status] || status;
    }
    workspace = store_get($$store_subs ??= {}, "$page", page).params.workspace;
    tickets = data.tickets ?? [];
    selectedCase = data.selectedCase ?? null;
    selectedCaseComments = data.selectedCaseComments ?? [];
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><h2 class="text-3xl font-bold tracking-tight">Soporte</h2> <a${attr("href", `/${stringify(workspace)}/admin/projects`)} class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2">`);
    Message_square($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Crear Ticket</a></div> <div class="rounded-md border"><div class="p-4"><h3 class="font-medium mb-4">Tickets Recientes</h3> `);
    if (tickets.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-sm text-muted-foreground">No hay tickets recientes.</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b text-left"><th class="pb-2 pr-4 font-medium">Título</th><th class="pb-2 pr-4 font-medium">Cliente</th><th class="pb-2 pr-4 font-medium">Proyecto</th><th class="pb-2 pr-4 font-medium">Estado</th><th class="pb-2 pr-4 font-medium">Prioridad</th><th class="pb-2 font-medium">Fecha</th><th class="w-10"></th></tr></thead><tbody><!--[-->`);
      const each_array = ensure_array_like(tickets);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let ticket = each_array[$$index];
        $$renderer2.push(`<tr class="border-b last:border-0 hover:bg-muted/50 cursor-pointer"><td class="py-3 pr-4">${escape_html(ticket.title)}</td><td class="py-3 pr-4">${escape_html(ticket.clientName)}</td><td class="py-3 pr-4">${escape_html(ticket.projectName ?? "—")}</td><td class="py-3 pr-4"><span${attr_class(`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stringify(ticket.status === "closed" ? "bg-muted text-muted-foreground" : ticket.status === "in_progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300")}`)}>${escape_html(ticket.status === "open" ? "Abierto" : ticket.status === "in_progress" ? "En progreso" : ticket.status === "closed" ? "Cerrado" : ticket.status)}</span></td><td class="py-3 pr-4"><span${attr_class(`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stringify(ticket.priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : ticket.priority === "medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" : "bg-muted text-muted-foreground")}`)}>${escape_html(ticket.priority === "high" ? "Alta" : ticket.priority === "medium" ? "Media" : ticket.priority === "low" ? "Baja" : ticket.priority)}</span></td><td class="py-3 pr-4 text-muted-foreground">${escape_html(ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" }) : "—")}</td><td class="py-3"><a${attr("href", `/${stringify(workspace)}/admin/projects/${stringify(ticket.projectId)}`)} class="text-primary hover:underline inline-flex items-center gap-1" title="Ver en el proyecto">`);
        External_link($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></a></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (selectedCase) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-end" role="button" tabindex="0"><div class="bg-card h-full w-full max-w-2xl border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden" role="presentation"><div class="p-6 border-b flex items-start justify-between bg-card shrink-0"><div class="space-y-1"><h3 class="text-xl font-bold">${escape_html(selectedCase.title)}</h3> <div class="text-sm text-muted-foreground flex flex-wrap items-center gap-2"><span>${escape_html(selectedCase.clientName)} · ${escape_html(selectedCase.projectName ?? "—")}</span> <span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stringify(getStatusColor(selectedCase.status || "open"))}`)}>${escape_html(getStatusLabel(selectedCase.status || "open"))}</span></div></div> <button type="button" class="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-full transition-colors">`);
      X($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></button></div> <div class="flex-1 flex flex-col min-h-0 overflow-hidden"><div class="border-b bg-card shadow-sm shrink-0"><button type="button" class="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"><div class="flex items-center gap-2 font-medium text-sm">`);
      File_text($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span>Detalle del Caso</span></div> `);
      {
        $$renderer2.push("<!--[!-->");
        Chevron_down($$renderer2, { class: "w-4 h-4 text-muted-foreground" });
      }
      $$renderer2.push(`<!--]--></button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">`);
      if (selectedCaseComments.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-8 text-muted-foreground text-sm">No hay mensajes aún. Escribe una respuesta abajo.</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(selectedCaseComments);
        for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
          let comment = each_array_2[$$index_3];
          const isClient = comment.authorRole === "client" || comment.authorRole === "owner" || comment.authorRole === "member";
          $$renderer2.push(`<div${attr_class(`flex gap-3 ${stringify(isClient ? "flex-row-reverse" : "")}`)}><div${attr_class(`w-8 h-8 rounded-full ${stringify(isClient ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} flex items-center justify-center font-bold text-xs shrink-0 mt-1`)}>${escape_html((comment.authorName || "U").charAt(0).toUpperCase())}</div> <div class="flex flex-col gap-1 max-w-[85%]"><div${attr_class(`flex items-center gap-2 ${stringify(isClient ? "flex-row-reverse" : "")}`)}><span class="text-xs font-medium text-foreground">${escape_html(comment.authorName || "Usuario")}</span> <span class="text-[10px] text-muted-foreground">${escape_html(formatDate(comment.createdAt))}</span></div> <div${attr_class(`rounded-lg p-3 text-sm shadow-sm border ${stringify(isClient ? "bg-primary/10 text-foreground border-primary/20" : "bg-muted/40 text-foreground border-border")}`)}><div class="whitespace-pre-wrap leading-relaxed">${escape_html(comment.content)}</div> `);
          if (comment.files && comment.files.length > 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50"><!--[-->`);
            const each_array_3 = ensure_array_like(comment.files);
            for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
              let file = each_array_3[$$index_2];
              $$renderer2.push(`<div class="flex items-center gap-2 px-2 py-1 bg-background rounded border text-xs">`);
              File_text($$renderer2, { class: "w-3 h-3 text-muted-foreground" });
              $$renderer2.push(`<!----> <span class="truncate max-w-[120px]">${escape_html(file.name)}</span> <a${attr("href", file.url)} target="_blank" class="hover:text-primary" title="Descargar">`);
              Download($$renderer2, { class: "w-3 h-3" });
              $$renderer2.push(`<!----></a></div>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div></div></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> <div class="p-4 border-t bg-muted/10 shrink-0"><form method="POST" action="?/addCaseComment" enctype="multipart/form-data" class="space-y-4"><input type="hidden" name="caseId"${attr("value", selectedCase.id)}/> <input type="hidden" name="subject"${attr("value", selectedCase.title)}/> <div class="space-y-2"><textarea name="content" rows="3" class="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none" placeholder="Escribe una respuesta al cliente..." required>`);
      const $$body = escape_html(commentContent);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <div class="flex items-center justify-between"><label class="cursor-pointer inline-flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Adjuntar archivos">`);
      Paperclip($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <input type="file" name="files" multiple class="hidden"/></label> <button type="submit" class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 flex items-center gap-2"${attr("disabled", !commentContent.trim(), true)}>`);
      Send($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Enviar</button></div> `);
      if (commentFiles.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
        const each_array_4 = ensure_array_like(commentFiles);
        for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
          let file = each_array_4[i];
          $$renderer2.push(`<div class="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded border"><span class="truncate max-w-[100px]">${escape_html(file.name)}</span> <button type="button" class="hover:text-destructive">`);
          X($$renderer2, { class: "w-3 h-3" });
          $$renderer2.push(`<!----></button></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></form></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
