import { json } from "@sveltejs/kit";
import { d as deleteProviderConfig, a as findAllProviderConfigs, f as findProviderConfigByCode, u as updateProviderConfig, c as createProviderConfig } from "../../../../../../chunks/provider-config.repository.js";
function isAdmin(event) {
  return String(event.locals.user?.role ?? "").toLowerCase() === "admin";
}
const GET = async (event) => {
  if (!isAdmin(event)) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  const configs = await findAllProviderConfigs(false);
  return json({ configs });
};
const POST = async (event) => {
  if (!isAdmin(event)) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  let body;
  try {
    body = await event.request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }
  const codeInput = body.code?.trim();
  const label = body.label?.trim();
  const code = codeInput ? slugify(codeInput) : label ? slugify(label) : "";
  if (!code) {
    return json({ error: "code o label requerido" }, { status: 400 });
  }
  const details = Array.isArray(body.details) ? body.details.filter((d) => d && typeof d.label === "string" && typeof d.value === "string").map((d) => ({ label: String(d.label).trim(), value: String(d.value).trim() })) : void 0;
  const existing = await findProviderConfigByCode(code);
  if (existing) {
    const updated = await updateProviderConfig(code, {
      ...label != null && label !== "" && { label },
      displayOrder: body.displayOrder,
      enabled: body.enabled,
      ...details !== void 0 && { details }
    });
    return json({ ok: true, config: updated });
  }
  if (!label) {
    return json({ error: "label requerido para crear" }, { status: 400 });
  }
  const created = await createProviderConfig({
    code,
    label,
    displayOrder: body.displayOrder,
    details: details ?? []
  });
  return json({ ok: true, config: created });
};
const DELETE = async (event) => {
  if (!isAdmin(event)) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  const code = event.url.searchParams.get("code")?.trim();
  if (!code) {
    return json({ error: "code requerido (query param)" }, { status: 400 });
  }
  if (code === "stripe") {
    return json({ error: "No se puede eliminar Stripe" }, { status: 400 });
  }
  const deleted = await deleteProviderConfig(code);
  if (!deleted) {
    return json({ error: "Proveedor no encontrado" }, { status: 404 });
  }
  return json({ ok: true });
};
function slugify(s) {
  return s.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/g, "").slice(0, 64) || "";
}
export {
  DELETE,
  GET,
  POST
};
