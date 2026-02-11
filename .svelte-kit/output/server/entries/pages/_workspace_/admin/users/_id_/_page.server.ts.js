import { d as db, u as users, s as services, p as projects, f as payments, c as cases } from "../../../../../../chunks/db.js";
import { eq, or, desc } from "drizzle-orm";
import { fail, error } from "@sveltejs/kit";
const load = async ({ params }) => {
  console.log("Loading user detail for ID:", params.id);
  const userId = Number(params.id);
  if (isNaN(userId)) {
    console.error("Invalid user ID:", params.id);
    throw error(400, "Invalid user ID");
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });
  if (!user) {
    console.error("User not found:", userId);
    throw error(404, "User not found");
  }
  const userProjects = await db.select({
    id: projects.id,
    name: projects.name,
    status: projects.status,
    provider: projects.provider,
    startDate: projects.startDate,
    serviceName: services.name
  }).from(projects).leftJoin(services, eq(projects.serviceId, services.id)).where(or(
    eq(projects.clientId, userId),
    eq(services.clientId, userId)
  )).orderBy(desc(projects.createdAt));
  const userPayments = await db.select({
    id: payments.id,
    title: payments.title,
    amount: payments.amount,
    status: payments.status,
    dueDate: payments.dueDate,
    projectName: projects.name
  }).from(payments).innerJoin(projects, eq(payments.projectId, projects.id)).leftJoin(services, eq(projects.serviceId, services.id)).where(or(
    eq(projects.clientId, userId),
    eq(services.clientId, userId)
  )).orderBy(desc(payments.dueDate));
  const userCases = await db.select({
    id: cases.id,
    title: cases.title,
    status: cases.status,
    priority: cases.priority,
    createdAt: cases.createdAt,
    projectName: projects.name
  }).from(cases).innerJoin(projects, eq(cases.projectId, projects.id)).leftJoin(services, eq(projects.serviceId, services.id)).where(or(
    eq(projects.clientId, userId),
    eq(services.clientId, userId)
  )).orderBy(desc(cases.createdAt));
  return {
    user,
    projects: userProjects,
    payments: userPayments,
    cases: userCases
  };
};
const actions = {
  updateUser: async ({ request, params }) => {
    const userId = Number(params.id);
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const role = formData.get("role");
    const phone = formData.get("phone");
    const addressesJson = formData.get("addresses");
    const company = formData.get("company");
    const companyLinksJson = formData.get("companyLinks");
    const jobTitle = formData.get("jobTitle");
    const notes = formData.get("notes");
    const identificationJson = formData.get("identification");
    let identification = [];
    try {
      if (identificationJson) {
        identification = JSON.parse(identificationJson);
      }
    } catch (e) {
      console.error("Error parsing identification JSON", e);
    }
    let addresses = [];
    try {
      if (addressesJson) {
        addresses = JSON.parse(addressesJson);
      }
    } catch (e) {
      console.error("Error parsing addresses JSON", e);
    }
    let companyLinks = [];
    try {
      if (companyLinksJson) {
        companyLinks = JSON.parse(companyLinksJson);
      }
    } catch (e) {
      console.error("Error parsing companyLinks JSON", e);
    }
    try {
      await db.update(users).set({
        firstName,
        lastName,
        email,
        role,
        phone,
        addresses: addresses.length > 0 ? addresses : null,
        company,
        companyLinks: companyLinks.length > 0 ? companyLinks : null,
        jobTitle,
        notes,
        identification: identification.length > 0 ? identification : null
      }).where(eq(users.id, userId));
      return { success: true };
    } catch (err) {
      console.error("Error updating user:", err);
      return fail(500, { message: "Failed to update user" });
    }
  }
};
export {
  actions,
  load
};
