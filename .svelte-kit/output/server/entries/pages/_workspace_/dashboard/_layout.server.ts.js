import { redirect } from "@sveltejs/kit";
import { d as db, n as notifications, a as userCompanies } from "../../../../chunks/db.js";
import { eq, desc } from "drizzle-orm";
import { a as getSignedUrlForFile } from "../../../../chunks/storage.js";
const load = async ({ locals, url, params }) => {
  console.log(`[DASHBOARD-LAYOUT] User: ${locals.user?.email} (${locals.user?.role}) trying to access ${url.pathname}`);
  if (!locals.user) {
    throw redirect(303, `/${params.workspace}/auth/login`);
  }
  const userNotifications = await db.select().from(notifications).where(eq(notifications.userId, parseInt(locals.user.id))).orderBy(desc(notifications.createdAt));
  const userCompaniesList = await db.query.userCompanies.findMany({
    where: eq(userCompanies.userId, parseInt(locals.user.id)),
    with: {
      company: true
    }
  });
  const validCompanies = userCompaniesList.filter((uc) => uc.company && uc.status === "active");
  const mappedCompanies = await Promise.all(validCompanies.map(async (uc) => {
    const company = uc.company;
    const logoUrl = company.logo ? await getSignedUrlForFile(company.logo) : null;
    return {
      id: company.id,
      name: company.name,
      logo: logoUrl,
      permissions: uc.permissions,
      role: uc.role
    };
  }));
  if (mappedCompanies.length === 0 && locals.user.companyName) ;
  return {
    user: locals.user,
    companies: mappedCompanies,
    notifications: userNotifications
  };
};
export {
  load
};
