import { redirect } from "@sveltejs/kit";
import { d as db, c as companies } from "../../../../../../chunks/db.js";
import { eq } from "drizzle-orm";
const load = async ({ params }) => {
  const companyId = parseInt(params.companyId, 10);
  if (Number.isNaN(companyId)) {
    throw redirect(303, `/${params.workspace}/admin/companies`);
  }
  const rows = await db.select({ id: companies.id, name: companies.name, stripeCustomerId: companies.stripeCustomerId }).from(companies).where(eq(companies.id, companyId)).limit(1);
  const company = rows[0] ?? null;
  if (!company) {
    throw redirect(303, `/${params.workspace}/admin/companies`);
  }
  return {
    companyId: company.id,
    companyName: company.name,
    stripeCustomerId: company.stripeCustomerId ?? null,
    canViewBilling: true,
    canManageBilling: true
  };
};
export {
  load
};
