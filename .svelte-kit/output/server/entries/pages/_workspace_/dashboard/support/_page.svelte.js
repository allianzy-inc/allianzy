import { Z as store_get, a0 as attr_class, a5 as stringify, a4 as ensure_array_like, $ as unsubscribe_stores, a6 as bind_props } from "../../../../../chunks/index2.js";
import { t as translations, c as currentLang } from "../../../../../chunks/i18n.js";
import { o as onDestroy } from "../../../../../chunks/index-server.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { a as attr } from "../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { p as page } from "../../../../../chunks/stores.js";
import { D as DocumentPreviewModal } from "../../../../../chunks/DocumentPreviewModal.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { X } from "../../../../../chunks/x.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { C as Chevron_down } from "../../../../../chunks/chevron-down.js";
import { E as Eye } from "../../../../../chunks/eye.js";
import { D as Download } from "../../../../../chunks/external-link.js";
import { P as Paperclip } from "../../../../../chunks/paperclip.js";
import { S as Send } from "../../../../../chunks/send.js";
import { M as Message_square } from "../../../../../chunks/message-square.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let t, tickets, projectsList, selectedCaseComments, user;
    let data = $$props["data"];
    onDestroy(() => {
    });
    let isTicketDetailsOpen = false;
    let selectedTicket = null;
    let commentFiles = [];
    let commentContent = "";
    "--\n" + (user ? `${user.firstName} ${user.lastName}
${user.email}` : "Cliente");
    let isPreviewModalOpen = false;
    let previewFile = { title: "", url: null };
    function closePreview() {
      isPreviewModalOpen = false;
      previewFile = { title: "", url: null };
    }
    function getStatusColor(status) {
      switch (status) {
        case "open":
          return "bg-blue-100 text-blue-700 border-blue-200";
        case "in_progress":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "closed":
          return "bg-green-100 text-green-700 border-green-200";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    }
    function getStatusLabel(status) {
      const map = {
        "open": "Abierto",
        "in_progress": "En Progreso",
        "closed": "Cerrado"
      };
      return map[status] || status;
    }
    function formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function isPreviewable(file) {
      if (file.type?.startsWith("image/") || file.type?.includes("pdf")) return true;
      const name = file.name?.toLowerCase() || "";
      return /\.(jpeg|jpg|png|gif|webp|pdf)$/i.test(name);
    }
    t = translations[store_get($$store_subs ??= {}, "$currentLang", currentLang)];
    tickets = data.tickets;
    projectsList = data.projectsList;
    selectedCaseComments = data.selectedCaseComments;
    user = data.user;
    if (projectsList && projectsList.length > 0) {
      projectsList[0].id;
    }
    {
      const caseId = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("caseId");
      if (caseId && tickets) {
        const foundTicket = tickets.find((t2) => t2.id == caseId);
        if (foundTicket) {
          selectedTicket = foundTicket;
          isTicketDetailsOpen = true;
        }
      } else {
        isTicketDetailsOpen = false;
        selectedTicket = null;
      }
    }
    DocumentPreviewModal($$renderer2, {
      isOpen: (
        // Create Modal Functions
        // Reset input
        // Ticket Details Functions
        // Reset comment form
        // Comment Functions
        // Reset input
        // Helper to check for previewable files
        isPreviewModalOpen
      ),
      title: previewFile.title,
      fileUrl: previewFile.url,
      onClose: closePreview
    });
    $$renderer2.push(`<!----> <div class="space-y-6"><div class="flex items-center justify-between"><div><h2 class="text-2xl font-bold tracking-tight">${escape_html(t.dashboard.page.support.title)}</h2> <p class="text-muted-foreground">${escape_html(t.dashboard.page.support.subtitle)}</p></div> <button class="bg-primary text-primary-foreground p-2 sm:px-4 sm:py-2 rounded-md hover:opacity-90 flex items-center gap-2" aria-label="Nueva solicitud">`);
    Plus($$renderer2, { class: "w-5 h-5 sm:w-4 sm:h-4" });
    $$renderer2.push(`<!----> <span class="hidden sm:inline">Nueva solicitud</span></button></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (isTicketDetailsOpen && selectedTicket) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-end" role="button" tabindex="0"><div class="bg-card h-full w-full max-w-2xl border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" role="presentation"><div class="p-6 border-b flex items-start justify-between bg-card z-10"><div class="space-y-1"><h3 class="text-xl font-bold">${escape_html(selectedTicket.title)}</h3> <div class="text-sm text-muted-foreground flex flex-col gap-0.5"><span>${escape_html(selectedTicket.projectName)} `);
      if (selectedTicket.serviceName) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`(${escape_html(selectedTicket.serviceName)})`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></span> <div class="flex items-center gap-3"><span class="flex items-center gap-1">`);
      Calendar($$renderer2, { class: "w-3 h-3" });
      $$renderer2.push(`<!----> Created ${escape_html(formatDate(selectedTicket.createdAt))}</span> <span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stringify(getStatusColor(selectedTicket.status || "open"))}`)}>${escape_html(getStatusLabel(selectedTicket.status || "open"))}</span></div></div></div> <button class="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-full transition-colors">`);
      X($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></button></div> <div class="flex-1 flex flex-col min-h-0 overflow-hidden"><div class="border-b bg-card z-10 shadow-sm shrink-0"><button class="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"><div class="flex items-center gap-2 font-medium text-sm">`);
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
      $$renderer2.push(`<!--]--></div> <div class="flex-1 overflow-y-auto p-4 space-y-4 relative bg-muted/5">`);
      if (!selectedCaseComments || selectedCaseComments.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-8 text-muted-foreground text-sm">No hay mensajes aún. Inicia la conversación abajo.</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        const each_array_3 = ensure_array_like(selectedCaseComments);
        for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
          let comment = each_array_3[$$index_4];
          const isMe = comment.userId === (user ? parseInt(user.id) : -1);
          const isClient = ["client", "owner", "member", "admin"].includes(comment.authorRole) || ["owner", "member", "admin"].includes(comment.companyRole);
          $$renderer2.push(`<div${attr_class(`flex gap-3 ${stringify(isClient ? "flex-row-reverse" : "")}`)}><div${attr_class(`w-8 h-8 rounded-full ${stringify(isClient ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} flex items-center justify-center font-bold text-xs shrink-0 mt-1`)}>${escape_html((comment.authorName || "U").charAt(0).toUpperCase())}</div> <div class="flex flex-col gap-1 max-w-[85%]"><div${attr_class(`flex items-center gap-2 ${stringify(isClient ? "flex-row-reverse" : "")}`)}><span class="text-xs font-medium text-foreground">${escape_html(comment.authorName || "Usuario")} `);
          if (isMe) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`(Yo)`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></span> <span class="text-[10px] text-muted-foreground">${escape_html(formatDate(comment.createdAt))}</span></div> <div${attr_class(`rounded-lg p-3 text-sm shadow-sm border ${stringify(isClient ? "bg-primary/10 text-foreground border-primary/20" : "bg-muted/40 text-foreground border-border")}`)}><div class="whitespace-pre-wrap leading-relaxed">${escape_html(comment.content)}</div> `);
          if (comment.files && comment.files.length > 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50"><!--[-->`);
            const each_array_4 = ensure_array_like(comment.files);
            for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
              let file = each_array_4[$$index_3];
              $$renderer2.push(`<div class="flex items-center gap-2 px-2 py-1 bg-background rounded border text-xs">`);
              File_text($$renderer2, { class: "w-3 h-3 text-muted-foreground" });
              $$renderer2.push(`<!----> <span class="truncate max-w-[120px]">${escape_html(file.name)}</span> `);
              if (isPreviewable(file)) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<button class="hover:text-primary" title="Vista previa">`);
                Eye($$renderer2, { class: "w-3 h-3" });
                $$renderer2.push(`<!----></button>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]--> <a${attr("href", file.url)} target="_blank" class="hover:text-primary" title="Descargar">`);
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
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div> <div class="p-4 border-t bg-muted/10"><form method="POST" action="?/addCaseComment" enctype="multipart/form-data" class="space-y-4"><input type="hidden" name="caseId"${attr("value", selectedTicket.id)}/> <input type="hidden" name="subject"${attr("value", selectedTicket.title)}/> <div class="space-y-2"><textarea name="content" rows="3" class="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none" placeholder="Escribe un comentario o respuesta..." required>`);
      const $$body = escape_html(commentContent);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <div class="flex items-center justify-between"><div class="flex items-center gap-2"><label class="cursor-pointer inline-flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Adjuntar archivos">`);
      Paperclip($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <input type="file" name="files" multiple class="hidden"/></label> `);
      if (commentFiles.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-xs text-muted-foreground">${escape_html(commentFiles.length)} archivo(s)</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <button type="submit" class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 flex items-center gap-2"${attr("disabled", !commentContent.trim(), true)}>`);
      Send($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Enviar</button></div> `);
      if (commentFiles.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
        const each_array_5 = ensure_array_like(commentFiles);
        for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
          let file = each_array_5[i];
          $$renderer2.push(`<div class="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded border"><span class="truncate max-w-[100px]">${escape_html(file.name)}</span> <button type="button" class="hover:text-destructive">`);
          X($$renderer2, { class: "w-3 h-3" });
          $$renderer2.push(`<!----></button></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></form></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="rounded-md border bg-card"><div class="p-6">`);
    if (tickets.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-12">`);
      Message_square($$renderer2, {
        class: "h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50"
      });
      $$renderer2.push(`<!----> <h3 class="text-lg font-medium">No hay tickets de soporte</h3> <p class="text-muted-foreground mt-1">Aún no tienes tickets de soporte registrados.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="hidden md:block relative w-full overflow-auto"><table class="w-full caption-bottom text-sm text-left"><thead class="[&amp;_tr]:border-b"><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Título</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Proyecto / Servicio</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground">Fecha</th></tr></thead><tbody class="[&amp;_tr:last-child]:border-0"><!--[-->`);
      const each_array_6 = ensure_array_like(tickets);
      for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
        let ticket = each_array_6[$$index_6];
        $$renderer2.push(`<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"><td class="p-4 align-middle font-medium">${escape_html(ticket.title)}</td><td class="p-4 align-middle"><div class="flex flex-col"><span>${escape_html(ticket.projectName)}</span> `);
        if (ticket.serviceName) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-xs text-muted-foreground">${escape_html(ticket.serviceName)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></td><td class="p-4 align-middle"><span${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${stringify(getStatusColor(ticket.status || "open"))}`)}>${escape_html(getStatusLabel(ticket.status || "open"))}</span></td><td class="p-4 align-middle">`);
        if (ticket.createdAt) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex items-center gap-2">`);
          Calendar($$renderer2, { class: "h-3 w-3 text-muted-foreground" });
          $$renderer2.push(`<!----> ${escape_html(new Date(ticket.createdAt).toLocaleDateString())}</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`-`);
        }
        $$renderer2.push(`<!--]--></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div> <div class="grid gap-4 md:hidden"><!--[-->`);
      const each_array_7 = ensure_array_like(tickets);
      for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
        let ticket = each_array_7[$$index_7];
        $$renderer2.push(`<div class="bg-card rounded-lg border p-4 space-y-3 cursor-pointer hover:bg-muted/50 transition-colors shadow-sm"><div class="flex items-start justify-between gap-4"><div class="space-y-1 overflow-hidden"><h3 class="font-medium leading-none truncate">${escape_html(ticket.title)}</h3> <div class="flex flex-col text-sm text-muted-foreground"><span class="truncate">${escape_html(ticket.projectName)}</span> `);
        if (ticket.serviceName) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-xs opacity-80 truncate">${escape_html(ticket.serviceName)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div> <span${attr_class(`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${stringify(getStatusColor(ticket.status || "open"))}`)}>${escape_html(getStatusLabel(ticket.status || "open"))}</span></div> <div class="flex items-center text-sm text-muted-foreground pt-2 border-t">`);
        Calendar($$renderer2, { class: "mr-2 h-3 w-3" });
        $$renderer2.push(`<!----> `);
        if (ticket.createdAt) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`${escape_html(new Date(ticket.createdAt).toLocaleDateString())}`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`-`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
