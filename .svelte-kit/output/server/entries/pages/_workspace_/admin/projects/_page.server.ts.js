import { d as db, c as cases, h as requests, r as requirements, e as proposals, f as payments, p as projects, u as users, s as services } from "../../../../../chunks/db.js";
import { eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { fail, redirect } from "@sveltejs/kit";
const load = async ({ locals, params }) => {
  try {
    const clients = await db.select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      company: users.company,
      email: users.email
    }).from(users).where(eq(users.role, "client"));
    const allServices = await db.select({
      id: services.id,
      name: services.name,
      price: services.price
    }).from(services).where(eq(services.status, "Active"));
    const serviceUsers = alias(users, "service_users");
    const allProjects = await db.select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      startDate: projects.startDate,
      endDate: projects.endDate,
      provider: projects.provider,
      serviceName: services.name,
      // Coalesce client details from project link (preferred) or service link (legacy)
      clientName: sql`
                CASE 
                    WHEN ${users.id} IS NOT NULL THEN TRIM(BOTH ' ' FROM COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))
                    ELSE TRIM(BOTH ' ' FROM COALESCE(${serviceUsers.firstName}, '') || ' ' || COALESCE(${serviceUsers.lastName}, ''))
                END
            `,
      clientCompany: sql`COALESCE(${users.company}, ${serviceUsers.company})`,
      clientEmail: sql`COALESCE(${users.email}, ${serviceUsers.email})`
    }).from(projects).leftJoin(services, eq(projects.serviceId, services.id)).leftJoin(users, eq(projects.clientId, users.id)).leftJoin(serviceUsers, eq(services.clientId, serviceUsers.id));
    return {
      projects: allProjects,
      clients,
      services: allServices
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      projects: [],
      clients: [],
      services: []
    };
  }
};
const actions = {
  createProject: async ({ request, params }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const clientId = formData.get("clientId") ? parseInt(formData.get("clientId")) : null;
    const serviceId = formData.get("serviceId") ? parseInt(formData.get("serviceId")) : null;
    const provider = formData.get("provider") || "Allianzy";
    const status = formData.get("status") || "Pending";
    const startDateStr = formData.get("startDate");
    const endDateStr = formData.get("endDate");
    if (!name || !clientId || !serviceId) {
      return fail(400, { missing: true });
    }
    try {
      const [newProject] = await db.insert(projects).values({
        name,
        description,
        clientId,
        serviceId,
        provider,
        status,
        startDate: startDateStr ? new Date(startDateStr) : null,
        endDate: endDateStr ? new Date(endDateStr) : null
      }).returning({ id: projects.id });
      throw redirect(303, `/${params.workspace}/admin/projects/${newProject.id}`);
    } catch (error) {
      if (error.status === 303) {
        throw error;
      }
      console.error("Error creating project:", error);
      return fail(500, { error: "Failed to create project" });
    }
  },
  updateProject: async ({ request }) => {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"));
    const name = formData.get("name");
    const description = formData.get("description");
    const clientId = formData.get("clientId") ? parseInt(formData.get("clientId")) : null;
    const serviceId = formData.get("serviceId") ? parseInt(formData.get("serviceId")) : null;
    const provider = formData.get("provider");
    const status = formData.get("status");
    const startDateStr = formData.get("startDate");
    const endDateStr = formData.get("endDate");
    if (!id || !name) {
      return fail(400, { missing: true });
    }
    try {
      await db.update(projects).set({
        name,
        description,
        clientId,
        serviceId,
        provider,
        status,
        startDate: startDateStr ? new Date(startDateStr) : null,
        endDate: endDateStr ? new Date(endDateStr) : null
      }).where(eq(projects.id, id));
      return { success: true };
    } catch (error) {
      console.error("Error updating project:", error);
      return fail(500, { error: "Failed to update project" });
    }
  },
  deleteProject: async ({ request }) => {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"));
    if (!id) return fail(400, { missing: true });
    try {
      await db.delete(cases).where(eq(cases.projectId, id));
      await db.delete(requests).where(eq(requests.projectId, id));
      await db.delete(requirements).where(eq(requirements.projectId, id));
      await db.delete(proposals).where(eq(proposals.projectId, id));
      await db.delete(payments).where(eq(payments.projectId, id));
      await db.delete(projects).where(eq(projects.id, id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting project:", error);
      return fail(500, { error: "Failed to delete project" });
    }
  }
};
export {
  actions,
  load
};
