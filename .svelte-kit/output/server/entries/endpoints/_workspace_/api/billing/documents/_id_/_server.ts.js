import { json } from "@sveltejs/kit";
import { findBillingDocumentById, deleteBillingDocument, updateBillingDocument } from "../../../../../../../chunks/billing-documents.repository.js";
function isAdmin(event) {
  return String(event.locals.user?.role ?? "").toLowerCase() === "admin";
}
const PUT = async (event) => {
  if (!isAdmin(event)) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  const id = event.params.id;
  if (!id) return json({ error: "id required" }, { status: 400 });
  const doc = await findBillingDocumentById(id);
  if (!doc) return json({ error: "Document not found" }, { status: 404 });
  if (doc.provider === "stripe") {
    return json({ error: "Cannot edit Stripe documents" }, { status: 400 });
  }
  let body;
  try {
    body = await event.request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }
  const amountTotal = body.amountTotal !== void 0 ? Math.round(Number(body.amountTotal)) : void 0;
  const amountDue = body.amountDue !== void 0 ? Math.round(Number(body.amountDue)) : void 0;
  const updated = await updateBillingDocument(id, {
    number: body.number,
    amountTotal,
    amountDue,
    status: body.status,
    dueDate: body.dueDate ? new Date(body.dueDate) : void 0,
    description: body.description
  });
  return json({ ok: true, document: updated });
};
const DELETE = async (event) => {
  if (!isAdmin(event)) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  const id = event.params.id;
  if (!id) return json({ error: "id required" }, { status: 400 });
  const doc = await findBillingDocumentById(id);
  if (!doc) return json({ error: "Document not found" }, { status: 404 });
  if (doc.provider === "stripe") {
    return json({ error: "Cannot delete Stripe documents" }, { status: 400 });
  }
  await deleteBillingDocument(id);
  return json({ ok: true });
};
export {
  DELETE,
  PUT
};
