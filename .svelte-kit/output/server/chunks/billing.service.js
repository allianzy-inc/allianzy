import { createBillingDocument as createBillingDocument$1 } from "./billing-documents.repository.js";
import "./db.js";
async function createBillingDocument(input) {
  return createBillingDocument$1(input);
}
export {
  createBillingDocument as c
};
