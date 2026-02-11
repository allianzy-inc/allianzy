import { w as writable } from "./index.js";
const financeRole = writable("admin");
const canEditFinance = (role) => ["admin", "accountant"].includes(role);
const canViewFinance = (role) => ["admin", "accountant", "client_owner"].includes(role);
export {
  canEditFinance as a,
  canViewFinance as c,
  financeRole as f
};
