import { eq, asc } from "drizzle-orm";
import { d as db, l as paymentProviderConfig } from "./db.js";
async function findAllProviderConfigs(enabledOnly = false) {
  const conditions = enabledOnly ? eq(paymentProviderConfig.enabled, true) : void 0;
  return db.query.paymentProviderConfig.findMany({
    where: conditions,
    orderBy: [asc(paymentProviderConfig.displayOrder), asc(paymentProviderConfig.code)],
    columns: {
      code: true,
      label: true,
      isAutomatic: true,
      displayOrder: true,
      enabled: true,
      details: true,
      createdAt: true,
      updatedAt: true
    }
  });
}
async function updateProviderConfig(code, updates) {
  const [row] = await db.update(paymentProviderConfig).set({
    ...updates.label != null && { label: updates.label },
    ...updates.displayOrder != null && { displayOrder: updates.displayOrder },
    ...updates.enabled != null && { enabled: updates.enabled },
    ...updates.details !== void 0 && { details: Array.isArray(updates.details) ? updates.details : [] },
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(paymentProviderConfig.code, code)).returning();
  return row ?? null;
}
async function findProviderConfigByCode(code) {
  return db.query.paymentProviderConfig.findFirst({
    where: eq(paymentProviderConfig.code, code)
  });
}
async function createProviderConfig(input) {
  const [row] = await db.insert(paymentProviderConfig).values({
    code: input.code,
    label: input.label,
    isAutomatic: false,
    displayOrder: input.displayOrder ?? 999,
    enabled: true,
    details: Array.isArray(input.details) ? input.details : [],
    updatedAt: /* @__PURE__ */ new Date()
  }).returning();
  return row ?? null;
}
async function deleteProviderConfig(code) {
  if (code === "stripe") return null;
  const [row] = await db.delete(paymentProviderConfig).where(eq(paymentProviderConfig.code, code)).returning();
  return row ?? null;
}
export {
  findAllProviderConfigs as a,
  createProviderConfig as c,
  deleteProviderConfig as d,
  findProviderConfigByCode as f,
  updateProviderConfig as u
};
