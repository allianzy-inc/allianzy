import { a0 as attr_class, a4 as ensure_array_like, a5 as stringify, a6 as bind_props } from "../../../../../../chunks/index2.js";
import { o as onDestroy } from "../../../../../../chunks/index-server.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import { a as attr } from "../../../../../../chunks/attributes.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/state.svelte.js";
import { C as Circle_alert, D as DocumentPreviewModal } from "../../../../../../chunks/DocumentPreviewModal.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { C as Clock, I as Inbox, a as Circle, b as Info } from "../../../../../../chunks/info.js";
import { F as File_text } from "../../../../../../chunks/file-text.js";
import { M as Message_square } from "../../../../../../chunks/message-square.js";
import { D as Dollar_sign } from "../../../../../../chunks/dollar-sign.js";
import { C as Credit_card } from "../../../../../../chunks/credit-card.js";
import { C as Circle_check } from "../../../../../../chunks/circle-check.js";
import { C as Calendar } from "../../../../../../chunks/calendar.js";
import { P as Paperclip } from "../../../../../../chunks/paperclip.js";
import { E as Eye } from "../../../../../../chunks/eye.js";
import { U as User } from "../../../../../../chunks/user.js";
import { B as Building } from "../../../../../../chunks/building.js";
import { B as Briefcase } from "../../../../../../chunks/briefcase.js";
import { E as External_link } from "../../../../../../chunks/external-link.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let project, requirements, milestones, supportCases, proposals, payments, requests, selectedCaseComments, selectedRequestComments, selectedRequirementComments, selectedProposalComments, user, permissions;
    let data = $$props["data"];
    onDestroy(() => {
    });
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
    let activeTab = "process";
    let isPreviewModalOpen = false;
    let previewFile = { title: "", url: null };
    function closePreview() {
      isPreviewModalOpen = false;
      previewFile = { title: "", url: null };
    }
    "--\n" + (user ? `${user.firstName} ${user.lastName}
${user.email}` : "Cliente");
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
      selectedProposalComments,
      user,
      permissions
    } = data);
    if (permissions && permissions.length > 0 && !permissions.includes(activeTab)) {
      activeTab = permissions[0];
    }
    $$renderer2.push(`<div class="space-y-6 relative"><div class="h-48 w-full rounded-xl overflow-hidden relative shadow-sm group"><img${attr(
      "src",
      // Reset input
      // Requirement Details Logic
      // Request Details Logic (Additional state)
      // Proposal Details Logic
      // Case Modal Logic
      // Case Details Logic
      project.imageUrl || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
    )} alt="Project Cover" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/> <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div></div> <div class="flex flex-col gap-4 md:flex-row md:items-center"><div class="flex items-start gap-4 w-full"><a href="../projects" class="p-2 hover:bg-accent rounded-full transition-colors mt-1 md:mt-0">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></a> <div class="flex-1 min-w-0"><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><h1 class="text-2xl font-bold tracking-tight truncate">${escape_html(project.name)}</h1></div></div></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="md:col-span-2 space-y-6 order-2 md:order-1"><div class="flex border-b overflow-x-auto">`);
    if (!permissions || permissions.includes("process")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify(activeTab === "process" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
      Clock($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Proceso</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!permissions || permissions.includes("requests")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify(activeTab === "requests" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
      Inbox($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Solicitudes</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!permissions || permissions.includes("requirements")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify(activeTab === "requirements" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
      File_text($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Requerimientos</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!permissions || permissions.includes("support")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify(activeTab === "support" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
      Message_square($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Soporte</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!permissions || permissions.includes("proposals")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify(activeTab === "proposals" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
      Dollar_sign($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Propuestas</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!permissions || permissions.includes("payments")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify(activeTab === "payments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
      Credit_card($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Pagos</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="bg-card rounded-lg border p-6 min-h-[400px]">`);
    if (activeTab === "process") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-8"><div class="flex justify-between items-center mb-6"><h3 class="font-semibold">Etapas del Proyecto</h3></div> <div class="space-y-0"><!--[-->`);
      const each_array = ensure_array_like(milestones);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let step = each_array[i];
        $$renderer2.push(`<div class="relative pl-8 sm:pl-10 pb-12 last:pb-0">`);
        if (i !== milestones.length - 1) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="absolute left-[11px] top-0 bottom-0 w-[2px] bg-border"></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="absolute left-0 top-0 z-10 bg-background rounded-full flex items-center justify-center">`);
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
        $$renderer2.push(`<!--]--></div> <div class="pt-0.5"><h3${attr_class(`font-semibold text-base ${stringify(step.status === "pending" ? "text-muted-foreground" : "")}`)}>${escape_html(step.title)}</h3> `);
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
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (activeTab === "requests") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-4"><div class="flex justify-between items-center mb-4"><h3 class="font-semibold">Solicitudes</h3></div> `);
        if (!requests || requests.length === 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-muted-foreground text-sm">No hay solicitudes registradas.</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(requests);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let req = each_array_1[$$index_1];
            $$renderer2.push(`<div class="group flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors cursor-pointer"><div class="flex-1"><div class="flex flex-col sm:flex-row sm:items-center gap-2"><h4 class="font-medium text-sm">${escape_html(req.title)}</h4> <span${attr_class(`w-fit px-2 py-0.5 rounded text-[10px] capitalize border ${stringify(req.status === "completed" ? "bg-green-100 text-green-700 border-green-200" : req.status === "in_progress" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-yellow-100 text-yellow-700 border-yellow-200")}`)}>${escape_html(req.status)}</span></div> <p class="text-xs text-muted-foreground mt-1 line-clamp-2">${escape_html(req.description)}</p> <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2"><span class="text-xs text-muted-foreground flex items-center gap-1">`);
            Calendar($$renderer2, { class: "w-3 h-3" });
            $$renderer2.push(`<!----> ${escape_html(formatDate(req.createdAt))}</span> `);
            if (req.files && req.files.length > 0) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<span class="text-xs text-muted-foreground flex items-center gap-1">`);
              Paperclip($$renderer2, { class: "w-3 h-3" });
              $$renderer2.push(`<!----> ${escape_html(req.files.length)} archivos</span>`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--></div></div></div>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (activeTab === "requirements") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="space-y-4"><div class="flex justify-between items-center mb-4"><h3 class="font-semibold">Requerimientos</h3></div> `);
          if (!requirements || requirements.length === 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<p class="text-muted-foreground text-sm">No hay requerimientos registrados.</p>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<!--[-->`);
            const each_array_2 = ensure_array_like(requirements);
            for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
              let req = each_array_2[$$index_2];
              $$renderer2.push(`<div class="group flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors cursor-pointer"><div class="flex-1"><div class="flex flex-col sm:flex-row sm:items-center gap-2"><h4 class="font-medium text-sm">${escape_html(req.title)}</h4> <span${attr_class(`w-fit px-2 py-0.5 rounded text-[10px] capitalize border ${stringify(req.status === "approved" ? "bg-green-100 text-green-700 border-green-200" : req.status === "rejected" ? "bg-red-100 text-red-700 border-red-200" : "bg-yellow-100 text-yellow-700 border-yellow-200")}`)}>${escape_html(req.status)}</span></div> <p class="text-xs text-muted-foreground mt-1 line-clamp-2">${escape_html(req.description)}</p> <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2"><span class="text-xs text-muted-foreground flex items-center gap-1">`);
              Calendar($$renderer2, { class: "w-3 h-3" });
              $$renderer2.push(`<!----> ${escape_html(formatDate(req.createdAt))}</span> `);
              if (req.files && req.files.length > 0) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<span class="text-xs text-muted-foreground flex items-center gap-1">`);
                Paperclip($$renderer2, { class: "w-3 h-3" });
                $$renderer2.push(`<!----> ${escape_html(req.files.length)} archivos</span>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]--></div></div></div>`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (activeTab === "support") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="space-y-4"><div class="flex justify-between items-center mb-4"><h3 class="font-semibold">Historial de soporte</h3></div> `);
            if (!supportCases || supportCases.length === 0) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<p class="text-muted-foreground text-sm">No hay tickets de soporte.</p>`);
            } else {
              $$renderer2.push("<!--[!-->");
              $$renderer2.push(`<div class="space-y-3"><!--[-->`);
              const each_array_3 = ensure_array_like(supportCases);
              for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
                let c = each_array_3[$$index_3];
                $$renderer2.push(`<div class="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer group"><div><div class="flex flex-col sm:flex-row sm:items-center gap-2"><h4 class="font-medium text-sm">${escape_html(c.title)}</h4> <span${attr_class(`w-fit px-2 py-0.5 rounded text-[10px] capitalize border ${stringify(c.status === "open" ? "bg-green-100 text-green-700 border-green-200" : c.status === "closed" ? "bg-gray-100 text-gray-700 border-gray-200" : "bg-yellow-100 text-yellow-700 border-yellow-200")}`)}>${escape_html(c.status)}</span></div> <p class="text-xs text-muted-foreground mt-1 line-clamp-1">${escape_html(c.description)}</p> <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">`);
                if (c.priority === "high") {
                  $$renderer2.push("<!--[-->");
                  $$renderer2.push(`<span class="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">`);
                  Circle_alert($$renderer2, { class: "w-3 h-3" });
                  $$renderer2.push(`<!----> Alta Prioridad</span>`);
                } else {
                  $$renderer2.push("<!--[!-->");
                }
                $$renderer2.push(`<!--]--> <span class="text-xs text-muted-foreground flex items-center gap-1">`);
                Calendar($$renderer2, { class: "w-3 h-3" });
                $$renderer2.push(`<!----> ${escape_html(formatDate(c.createdAt))}</span></div></div></div>`);
              }
              $$renderer2.push(`<!--]--></div>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (activeTab === "proposals") {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<div class="space-y-4"><div class="flex justify-between items-center mb-4"><h3 class="font-semibold">Propuestas</h3></div> `);
              if (!proposals || proposals.length === 0) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<p class="text-muted-foreground text-sm">No hay propuestas registradas.</p>`);
              } else {
                $$renderer2.push("<!--[!-->");
                $$renderer2.push(`<!--[-->`);
                const each_array_4 = ensure_array_like(proposals);
                for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
                  let prop = each_array_4[$$index_4];
                  $$renderer2.push(`<div class="group flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors cursor-pointer"><div class="flex-1"><div class="flex flex-col sm:flex-row sm:items-center gap-2"><h4 class="font-medium text-sm">${escape_html(prop.title)}</h4> <span${attr_class(`w-fit px-2 py-0.5 rounded text-[10px] capitalize border ${stringify(prop.status === "approved" ? "bg-green-100 text-green-700 border-green-200" : prop.status === "rejected" ? "bg-red-100 text-red-700 border-red-200" : "bg-yellow-100 text-yellow-700 border-yellow-200")}`)}>${escape_html(prop.status)}</span></div> <p class="text-xs text-muted-foreground mt-1 line-clamp-2">${escape_html(prop.description)}</p> <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2"><span class="text-xs text-muted-foreground flex items-center gap-1">`);
                  Calendar($$renderer2, { class: "w-3 h-3" });
                  $$renderer2.push(`<!----> ${escape_html(formatDate(prop.createdAt))}</span> `);
                  if (prop.files && prop.files.length > 0) {
                    $$renderer2.push("<!--[-->");
                    $$renderer2.push(`<span class="text-xs text-muted-foreground flex items-center gap-1">`);
                    Paperclip($$renderer2, { class: "w-3 h-3" });
                    $$renderer2.push(`<!----> ${escape_html(prop.files.length)} archivos</span>`);
                  } else {
                    $$renderer2.push("<!--[!-->");
                  }
                  $$renderer2.push(`<!--]--></div></div></div>`);
                }
                $$renderer2.push(`<!--]-->`);
              }
              $$renderer2.push(`<!--]--></div>`);
            } else {
              $$renderer2.push("<!--[!-->");
              if (activeTab === "payments") {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<div class="space-y-4"><div class="flex justify-between items-center mb-4"><h3 class="font-semibold">Pagos</h3></div> `);
                if (!payments || payments.length === 0) {
                  $$renderer2.push("<!--[-->");
                  $$renderer2.push(`<p class="text-muted-foreground text-sm">No hay pagos registrados.</p>`);
                } else {
                  $$renderer2.push("<!--[!-->");
                  $$renderer2.push(`<div class="space-y-3"><!--[-->`);
                  const each_array_5 = ensure_array_like(payments);
                  for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
                    let pay = each_array_5[$$index_5];
                    $$renderer2.push(`<div class="flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors"><div class="flex-1"><div class="flex flex-col sm:flex-row sm:items-center gap-2"><h4 class="font-medium text-sm">${escape_html(pay.title)}</h4> <span${attr_class(`w-fit px-2 py-0.5 rounded text-[10px] capitalize border ${stringify(pay.status === "paid" ? "bg-green-100 text-green-700 border-green-200" : pay.status === "overdue" ? "bg-red-100 text-red-700 border-red-200" : "bg-yellow-100 text-yellow-700 border-yellow-200")}`)}>${escape_html(pay.status)}</span></div> <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2"><span class="font-medium text-sm">${escape_html(pay.amount)}</span> <span class="text-xs text-muted-foreground flex items-center gap-1">`);
                    Calendar($$renderer2, { class: "w-3 h-3" });
                    $$renderer2.push(`<!----> Vence: ${escape_html(formatDate(pay.dueDate))}</span> `);
                    if (pay.paidAt) {
                      $$renderer2.push("<!--[-->");
                      $$renderer2.push(`<span class="text-xs text-green-600 flex items-center gap-1">`);
                      Circle_check($$renderer2, { class: "w-3 h-3" });
                      $$renderer2.push(`<!----> Pagado: ${escape_html(formatDate(pay.paidAt))}</span>`);
                    } else {
                      $$renderer2.push("<!--[!-->");
                    }
                    $$renderer2.push(`<!--]--></div></div> `);
                    if (pay.documentUrl) {
                      $$renderer2.push("<!--[-->");
                      $$renderer2.push(`<button class="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground" title="Ver comprobante">`);
                      Eye($$renderer2, { class: "w-4 h-4" });
                      $$renderer2.push(`<!----></button>`);
                    } else {
                      $$renderer2.push("<!--[!-->");
                    }
                    $$renderer2.push(`<!--]--></div>`);
                  }
                  $$renderer2.push(`<!--]--></div>`);
                }
                $$renderer2.push(`<!--]--></div>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="space-y-6 order-1 md:order-2"><div class="bg-card rounded-lg border p-6 space-y-6"><div><div class="flex items-center justify-between mb-4"><h3 class="font-semibold">Detalles</h3> <span${attr_class(`px-3 py-1 rounded-full text-sm font-medium ${stringify(project.status === "In Progress" ? "bg-blue-100 text-blue-700" : project.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}`)}>${escape_html(project.status)}</span></div> <div class="space-y-4 text-sm">`);
    if (project.startDate) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-3 text-muted-foreground">`);
      Calendar($$renderer2, { class: "w-4 h-4 shrink-0" });
      $$renderer2.push(`<!----> <span>${escape_html(formatDate(project.startDate))}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (project.clientName) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-3 text-muted-foreground">`);
      User($$renderer2, { class: "w-4 h-4 shrink-0" });
      $$renderer2.push(`<!----> <span>${escape_html(project.clientName)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (project.clientCompany) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-3 text-muted-foreground">`);
      Building($$renderer2, { class: "w-4 h-4 shrink-0" });
      $$renderer2.push(`<!----> <span>${escape_html(project.clientCompany)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (project.serviceName) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-3 text-muted-foreground">`);
      Briefcase($$renderer2, { class: "w-4 h-4 shrink-0" });
      $$renderer2.push(`<!----> <span>${escape_html(project.serviceName)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (project.endDate && (project.status === "Completed" || project.status === "completed")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-3 text-muted-foreground">`);
      Circle_check($$renderer2, { class: "w-4 h-4 shrink-0" });
      $$renderer2.push(`<!----> <span>Completado: ${escape_html(formatDate(project.endDate))}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="pt-4 border-t"><h3 class="font-semibold mb-2">Enlaces</h3> `);
    if (project.links && Array.isArray(project.links) && project.links.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-2"><!--[-->`);
      const each_array_6 = ensure_array_like(project.links);
      for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
        let link = each_array_6[$$index_6];
        $$renderer2.push(`<div><p class="text-muted-foreground text-xs">${escape_html(link.title)}</p> <div class="flex items-center gap-1 max-w-full"><a${attr("href", link.url)} target="_blank" rel="noopener noreferrer" class="text-xs font-medium text-primary hover:underline flex items-center gap-1 truncate"><span class="truncate">${escape_html(link.url)}</span> `);
        External_link($$renderer2, { class: "w-3 h-3 flex-shrink-0" });
        $$renderer2.push(`<!----></a> `);
        if (link.note) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="relative group flex-shrink-0">`);
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
