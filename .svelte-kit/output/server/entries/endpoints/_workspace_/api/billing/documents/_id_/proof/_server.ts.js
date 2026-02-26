import { json } from "@sveltejs/kit";
import { getBillingCompanyId } from "../../../../../../../../chunks/billing.js";
import { findBillingDocumentById, updateBillingDocument } from "../../../../../../../../chunks/billing-documents.repository.js";
import { u as uploadFile } from "../../../../../../../../chunks/storage.js";
const POST = async (event) => {
  const documentId = event.params.id;
  if (!documentId) return json({ error: "id required" }, { status: 400 });
  const companyId = await getBillingCompanyId(event);
  if (companyId == null) return json({ error: "Unauthorized" }, { status: 403 });
  const doc = await findBillingDocumentById(documentId);
  if (!doc) return json({ error: "Document not found" }, { status: 404 });
  if (doc.companyId !== companyId) return json({ error: "Forbidden" }, { status: 403 });
  if (doc.provider === "stripe") return json({ error: "No se puede subir comprobante para facturas Stripe" }, { status: 400 });
  const formData = await event.request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File) || file.size === 0) {
    return json({ error: "Archivo requerido" }, { status: 400 });
  }
  try {
    const proofUrl = await uploadFile(file, "billing-proofs");
    const meta = doc.metadata ?? {};
    const updated = await updateBillingDocument(documentId, {
      metadata: {
        ...meta,
        proof_url: proofUrl,
        proof_uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    return json({ ok: true, proof_url: proofUrl, document: updated });
  } catch (err) {
    console.error("[billing/proof] upload error:", err);
    return json({ error: "Error al subir el archivo" }, { status: 500 });
  }
};
export {
  POST
};
