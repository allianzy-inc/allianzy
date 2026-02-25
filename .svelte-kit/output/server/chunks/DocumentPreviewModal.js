import { a1 as sanitize_props, a2 as spread_props, _ as slot, a6 as bind_props, a5 as stringify } from "./index2.js";
import { F as File_text } from "./file-text.js";
import { D as Download, E as External_link } from "./external-link.js";
import { X } from "./x.js";
import { I as Icon } from "./Icon.js";
import { w as fallback } from "./context.js";
import { a as attr } from "./attributes.js";
import { e as escape_html } from "./escaping.js";
function Circle_alert($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.0.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
    [
      "line",
      { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-alert" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function DocumentPreviewModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let fileName, isPdf, isImage;
    let isOpen = fallback($$props["isOpen"], false);
    let title = fallback($$props["title"], "");
    let fileUrl = fallback($$props["fileUrl"], null);
    let onClose = $$props["onClose"];
    let loadError = false;
    let previewUrl = null;
    let lastRequestedUrl = null;
    let currentAbort = null;
    fileName = (() => {
      if (!fileUrl) return "";
      try {
        if (fileUrl.includes("url=")) {
          const urlObj = new URL(fileUrl, "http://localhost");
          const embeddedUrl = urlObj.searchParams.get("url");
          if (embeddedUrl) {
            return embeddedUrl.split("?")[0].split("/").pop() || "";
          }
        }
        if (fileUrl.includes("key=")) {
          const url = new URL(fileUrl, "http://localhost");
          const key = url.searchParams.get("key");
          if (key) return key;
        }
        return fileUrl.split("?")[0].split("/").pop() || "";
      } catch (e) {
        return fileUrl;
      }
    })();
    isPdf = fileName.toLowerCase().endsWith(".pdf");
    isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(fileName);
    if (isOpen && fileUrl) {
      console.log("DocumentPreviewModal opening:", { title, fileUrl });
    }
    if (isOpen && fileUrl && fileUrl !== lastRequestedUrl) {
      loadError = false;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      previewUrl = null;
      lastRequestedUrl = fileUrl;
      currentAbort?.abort();
      currentAbort = new AbortController();
      fetch(fileUrl, { signal: currentAbort.signal }).then((res) => {
        if (!res.ok) {
          loadError = true;
          return null;
        }
        return res.blob();
      }).then((blob) => {
        if (!blob || currentAbort?.signal.aborted) return;
        previewUrl = URL.createObjectURL(blob);
      }).catch(() => {
        if (!currentAbort?.signal.aborted) loadError = true;
      });
    }
    if (isOpen) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"><div class="bg-background w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"><div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-muted/30 gap-3"><div class="flex items-center gap-3 min-w-0 flex-1"><div class="p-2 bg-primary/10 rounded-lg text-primary shrink-0">`);
      File_text($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></div> <div class="min-w-0 flex-1"><h3 class="font-semibold text-base sm:text-lg leading-tight truncate"${attr("title", title)}>${escape_html(title)}</h3> <p class="text-xs text-muted-foreground mt-0.5 truncate"${attr("title", fileName)}>${escape_html(fileName)}</p></div></div> <div class="flex items-center gap-1 sm:gap-2 shrink-0">`);
      if (fileUrl) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attr("href", fileUrl)} download="" target="_blank" class="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Descargar">`);
        Download($$renderer2, { class: "w-5 h-5" });
        $$renderer2.push(`<!----></a> <a${attr("href", fileUrl)} target="_blank" class="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Abrir en nueva pestaña">`);
        External_link($$renderer2, { class: "w-5 h-5" });
        $$renderer2.push(`<!----></a>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <button class="p-2 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors ml-1 sm:ml-2" title="Cerrar">`);
      X($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></button></div></div> <div class="flex-1 bg-gray-100/50 relative overflow-hidden flex items-center justify-center p-4">`);
      if (fileUrl && !loadError) {
        $$renderer2.push("<!--[-->");
        if (isPdf) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<iframe${attr("src", `${stringify(previewUrl || fileUrl)}#toolbar=0`)} class="w-full h-full rounded-lg border bg-white shadow-sm" title="Document Preview"></iframe>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (isImage) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<img${attr("src", previewUrl || fileUrl)}${attr("alt", title)} class="max-w-full max-h-full object-contain rounded-lg shadow-sm"/>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="text-center space-y-4"><div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">`);
            File_text($$renderer2, { class: "w-8 h-8 text-muted-foreground" });
            $$renderer2.push(`<!----></div> <div><p class="font-medium">Vista previa no disponible</p> <p class="text-sm text-muted-foreground">Este tipo de archivo no se puede previsualizar directamente.</p></div> <a${attr("href", fileUrl)} target="_blank" class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90">`);
            Download($$renderer2, { class: "w-4 h-4" });
            $$renderer2.push(`<!----> Descargar Archivo</a></div>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="text-center space-y-4">`);
        Circle_alert($$renderer2, { class: "w-12 h-12 text-destructive mx-auto" });
        $$renderer2.push(`<!----> <p class="font-medium text-destructive">No se pudo cargar el documento</p> <p class="text-sm text-muted-foreground">El archivo no está disponible o el enlace ha expirado.</p></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { isOpen, title, fileUrl, onClose });
  });
}
export {
  Circle_alert as C,
  DocumentPreviewModal as D
};
