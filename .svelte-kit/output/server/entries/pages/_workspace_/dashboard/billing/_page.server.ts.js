import { d as db, a as userCompanies, p as projects, s as services, h as payments } from "../../../../../chunks/db.js";
import { a as getSignedUrlForFile } from "../../../../../chunks/storage.js";
import { and, eq, or, isNull, inArray, desc } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";
const load = async ({ locals, params }) => {
  const userId = Number(locals.user?.id);
  if (!userId || isNaN(userId)) {
    return { payments: [], subscriptions: [], canViewBilling: false, canManageBilling: false };
  }
  let canViewBilling = false;
  let canManageBilling = false;
  let allowedProjectIds = [];
  if (locals.user?.companyId) {
    const userCompany = await db.query.userCompanies.findFirst({
      where: and(
        eq(userCompanies.userId, userId),
        eq(userCompanies.companyId, locals.user.companyId)
      )
    });
    const role = userCompany?.role ?? "";
    if (role === "owner" || role === "admin") {
      canViewBilling = true;
      canManageBilling = true;
    }
    if (userCompany && userCompany.permissions) {
      const perms = userCompany.permissions;
      for (const [pid, pList] of Object.entries(perms)) {
        if (Array.isArray(pList) && pList.includes("payments")) {
          allowedProjectIds.push(Number(pid));
          canViewBilling = true;
        }
      }
    }
  }
  const companyId = locals.user?.companyId ?? null;
  const sameCompanyFilter = companyId ? or(eq(projects.companyId, companyId), isNull(projects.companyId)) : void 0;
  const visibilityConditions = [
    companyId ? and(eq(projects.clientId, userId), sameCompanyFilter) : eq(projects.clientId, userId),
    companyId ? and(eq(services.clientId, userId), sameCompanyFilter) : eq(services.clientId, userId)
  ];
  if (allowedProjectIds.length > 0) {
    visibilityConditions.push(
      companyId ? and(inArray(projects.id, allowedProjectIds), sameCompanyFilter) : inArray(projects.id, allowedProjectIds)
    );
  }
  const rawPayments = await db.select({
    id: payments.id,
    title: payments.title,
    amount: payments.amount,
    status: payments.status,
    dueDate: payments.dueDate,
    paidAt: payments.paidAt,
    documentUrl: payments.documentUrl,
    projectName: projects.name,
    serviceName: services.name
  }).from(payments).innerJoin(projects, eq(payments.projectId, projects.id)).leftJoin(services, eq(projects.serviceId, services.id)).where(or(...visibilityConditions)).orderBy(desc(payments.dueDate));
  const userPayments = await Promise.all(rawPayments.map(async (p) => ({
    ...p,
    documentUrl: p.documentUrl ? await getSignedUrlForFile(p.documentUrl, params.workspace) : null
  })));
  const rawSubscriptions = await db.select({
    serviceId: services.id,
    serviceName: services.name,
    serviceStatus: services.status,
    renewalDate: services.renewalDate,
    price: services.price,
    projectName: projects.name,
    projectId: projects.id
  }).from(projects).innerJoin(services, eq(projects.serviceId, services.id)).where(or(...visibilityConditions)).orderBy(services.name);
  const subscriptions = rawSubscriptions.filter((s) => s.serviceStatus === "Active");
  return {
    payments: userPayments,
    subscriptions,
    canViewBilling,
    canManageBilling
  };
};
const actions = {
  manageStripe: async ({ locals }) => {
    console.log(`[STRIPE] User ${locals.user?.email} requested Stripe portal access`);
    throw redirect(303, "https://billing.stripe.com/p/login/test_12345");
  }
};
export {
  actions,
  load
};
