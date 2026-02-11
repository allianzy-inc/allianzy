import { d as db, a as userCompanies, s as services, p as projects, f as payments } from "../../../../../chunks/db.js";
import { a as getSignedUrlForFile } from "../../../../../chunks/storage.js";
import { and, eq, or, inArray, desc } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";
const load = async ({ locals, params }) => {
  const userId = Number(locals.user?.id);
  if (!userId || isNaN(userId)) {
    return { payments: [] };
  }
  let allowedProjectIds = [];
  if (locals.user?.companyId) {
    const userCompany = await db.query.userCompanies.findFirst({
      where: and(
        eq(userCompanies.userId, userId),
        eq(userCompanies.companyId, locals.user.companyId)
      )
    });
    if (userCompany && userCompany.permissions) {
      const perms = userCompany.permissions;
      for (const [pid, pList] of Object.entries(perms)) {
        if (Array.isArray(pList) && pList.includes("payments")) {
          allowedProjectIds.push(Number(pid));
        }
      }
    }
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
  }).from(payments).innerJoin(projects, eq(payments.projectId, projects.id)).leftJoin(services, eq(projects.serviceId, services.id)).where(or(
    eq(projects.clientId, userId),
    eq(services.clientId, userId),
    allowedProjectIds.length > 0 ? inArray(projects.id, allowedProjectIds) : void 0
  )).orderBy(desc(payments.dueDate));
  const userPayments = await Promise.all(rawPayments.map(async (p) => ({
    ...p,
    documentUrl: await getSignedUrlForFile(p.documentUrl, params.workspace)
  })));
  return {
    payments: userPayments
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
