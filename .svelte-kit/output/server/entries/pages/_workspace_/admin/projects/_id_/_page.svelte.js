import { a0 as attr_class, a5 as stringify, a4 as ensure_array_like, a6 as bind_props } from "../../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import { a as attr } from "../../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/state.svelte.js";
import { E as External_link, D as DocumentPreviewModal } from "../../../../../../chunks/DocumentPreviewModal.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { P as Pencil } from "../../../../../../chunks/pencil.js";
import { U as User } from "../../../../../../chunks/user.js";
import { B as Briefcase } from "../../../../../../chunks/briefcase.js";
import { C as Clock, I as Inbox, a as Circle, b as Info } from "../../../../../../chunks/info.js";
import { F as File_text } from "../../../../../../chunks/file-text.js";
import { M as Message_square } from "../../../../../../chunks/message-square.js";
import { D as Dollar_sign } from "../../../../../../chunks/dollar-sign.js";
import { C as Credit_card } from "../../../../../../chunks/credit-card.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { C as Circle_check } from "../../../../../../chunks/circle-check.js";
import { T as Trash_2 } from "../../../../../../chunks/trash-2.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let project, requirements, milestones, supportCases, proposals, payments, requests, selectedCaseComments, selectedRequestComments, selectedRequirementComments, selectedProposalComments;
    let data = $$props["data"];
    function formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC"
      });
    }
    let isPreviewModalOpen = false;
    let previewFile = { title: "", url: null };
    function closePreview() {
      isPreviewModalOpen = false;
      previewFile = { title: "", url: null };
    }
    ({
      project,
      requirements,
      milestones,
      supportCases,
      proposals,
      payments,
      requests,
      selectedCaseComments,
      selectedRequestComments,
      selectedRequirementComments,
      selectedProposalComments
    } = data);
    data.allClients;
    data.allServices;
    data.allServices;
    $$renderer2.push(`<div class="space-y-6 relative"><div class="flex items-center gap-4"><a href="../projects" class="p-2 hover:bg-accent rounded-full transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></a> <div><div class="flex items-center gap-2"><h1 class="text-2xl font-bold tracking-tight">${escape_html(project.name)}</h1> <button class="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted" title="Editar Proyecto">`);
    Pencil($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button></div> <p class="text-muted-foreground flex items-center gap-2 text-sm"><span class="inline-flex items-center gap-1">`);
    User($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----> ${escape_html(project.clientName)} `);
    if (project.clientCompany) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="text-muted-foreground font-semibold">| ${escape_html(project.clientCompany)}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></span> <span>•</span> <span class="inline-flex items-center gap-1">`);
    Briefcase($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----> ${escape_html(project.serviceName)}</span> <span>•</span> <span class="inline-flex items-center gap-1"><span class="text-xs font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">${escape_html(project.provider || "Allianzy")}</span></span></p></div> <div class="ml-auto flex gap-2"><span${attr_class(`px-3 py-1 rounded-full text-sm font-medium ${stringify(project.status === "In Progress" ? "bg-blue-100 text-blue-700" : project.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}`)}>${escape_html(project.status)}</span></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="md:col-span-2 space-y-6"><div class="flex border-b overflow-x-auto"><button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify(
      "border-primary text-primary"
    )}`)}>`);
    Clock($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Proceso</button> <button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
    Inbox($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Solicitudes</button> <button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
    File_text($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Requerimientos</button> <button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
    Message_square($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Soporte</button> <button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
    Dollar_sign($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Propuestas</button> <button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
    Credit_card($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Pagos</button></div> <div class="bg-card rounded-lg border p-6 min-h-[400px]">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-8"><div class="flex justify-between items-center mb-6"><h3 class="font-semibold">Etapas del Proyecto</h3> <button class="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1">`);
      Plus($$renderer2, { class: "w-3 h-3" });
      $$renderer2.push(`<!----> Nueva Etapa</button></div> <div class="relative pl-8 border-l-2 border-muted space-y-8"><!--[-->`);
      const each_array = ensure_array_like(milestones);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let step = each_array[$$index];
        $$renderer2.push(`<div class="relative group"><div class="absolute -left-[41px] bg-background p-1">`);
        if (step.status === "completed") {
          $$renderer2.push("<!--[-->");
          Circle_check($$renderer2, { class: "w-6 h-6 text-green-500" });
        } else {
          $$renderer2.push("<!--[!-->");
          if (step.status === "in_progress") {
            $$renderer2.push("<!--[-->");
            Circle($$renderer2, { class: "w-6 h-6 text-blue-500 fill-blue-100" });
          } else {
            $$renderer2.push("<!--[!-->");
            Circle($$renderer2, { class: "w-6 h-6 text-muted-foreground" });
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div> <div class="flex items-start justify-between"><div><h3${attr_class(`font-semibold text-base ${stringify(step.status === "pending" ? "text-muted-foreground" : "")}`)}>${escape_html(step.title)}</h3> `);
        if (step.completedAt) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-xs text-muted-foreground mt-1">Completado el ${escape_html(formatDate(step.completedAt))}</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (step.status === "in_progress") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">En curso</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground" title="Editar">`);
        Pencil($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button> <form action="?/deleteMilestone" method="POST"><input type="hidden" name="id"${attr("value", step.id)}/> <button type="submit" class="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600" title="Eliminar">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></form></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="space-y-6"><div class="rounded-lg border bg-card text-card-foreground shadow-sm"><div class="p-6"><h3 class="font-semibold flex items-center gap-2 mb-4">`);
    User($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Cliente</h3> <div class="space-y-3 text-sm"><div><p class="text-muted-foreground text-xs">Nombre</p> <p class="font-medium">${escape_html(project.clientName)}</p></div> `);
    if (project.clientCompany) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div><p class="text-muted-foreground text-xs">Empresa</p> <p class="font-medium">${escape_html(project.clientCompany)}</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div><p class="text-muted-foreground text-xs">Email</p> <p class="font-medium">${escape_html(project.clientEmail)}</p></div></div></div></div> <div class="rounded-lg border bg-card text-card-foreground shadow-sm"><div class="p-6"><h3 class="font-semibold flex items-center gap-2 mb-4">`);
    Briefcase($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Detalles</h3> <div class="space-y-3 text-sm"><div><p class="text-muted-foreground text-xs">Servicio</p> <p class="font-medium">${escape_html(project.serviceName)}</p></div> <div class="grid grid-cols-2 gap-2"><div><p class="text-muted-foreground text-xs">Inicio</p> <p class="font-medium">${escape_html(formatDate(project.startDate))}</p></div></div></div></div></div> <div class="rounded-lg border bg-card text-card-foreground shadow-sm"><div class="p-6"><h3 class="font-semibold flex items-center gap-2 mb-4">`);
    External_link($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Enlaces</h3> `);
    if (project.links && project.links.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-3 text-sm"><!--[-->`);
      const each_array_9 = ensure_array_like(project.links);
      for (let $$index_9 = 0, $$length = each_array_9.length; $$index_9 < $$length; $$index_9++) {
        let link = each_array_9[$$index_9];
        $$renderer2.push(`<div><p class="text-muted-foreground text-xs">${escape_html(link.title)}</p> <div class="flex items-center gap-1"><a${attr("href", link.url)} target="_blank" rel="noopener noreferrer" class="font-medium text-primary hover:underline break-all flex items-center gap-1">${escape_html(link.url)} `);
        External_link($$renderer2, { class: "w-3 h-3 flex-shrink-0" });
        $$renderer2.push(`<!----></a> `);
        if (link.note) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="relative group">`);
          Info($$renderer2, { class: "w-3.5 h-3.5 text-blue-600 cursor-help" });
          $$renderer2.push(`<!----> <div class="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs rounded-md border shadow-md p-2 w-max max-w-[200px] z-50 right-0">${escape_html(link.note)}</div></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p class="text-muted-foreground text-sm">No hay enlaces registrados.</p>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    DocumentPreviewModal($$renderer2, {
      isOpen: isPreviewModalOpen,
      title: previewFile.title,
      fileUrl: previewFile.url,
      onClose: closePreview
    });
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    DocumentPreviewModal($$renderer2, {
      isOpen: isPreviewModalOpen,
      title: previewFile.title,
      fileUrl: previewFile.url,
      onClose: closePreview
    });
    $$renderer2.push(`<!---->`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
