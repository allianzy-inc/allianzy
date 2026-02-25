import { d as db, q as subservices, s as services, w as workspaces } from "../../../../../chunks/db.js";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
const load = async ({ locals, params }) => {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, params.workspace)
  });
  if (!workspace) {
    return {
      services: []
    };
  }
  const allServices = await db.select().from(services).where(eq(services.workspaceId, workspace.id));
  const serviceIds = allServices.map((s) => s.id);
  let allSubservices = [];
  if (serviceIds.length > 0) {
    const rawSubservices = await db.select().from(subservices);
    allSubservices = rawSubservices.filter((sub) => serviceIds.includes(sub.serviceId || -1));
  }
  const servicesWithSubs = allServices.map((service) => ({
    ...service,
    subservices: allSubservices.filter((sub) => sub.serviceId === service.id)
  }));
  return {
    services: servicesWithSubs
  };
};
const actions = {
  createService: async ({ request, params }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const status = formData.get("status") || "Active";
    if (!name) return fail(400, { missing: true });
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, params.workspace)
    });
    if (!workspace) return fail(404, { error: "Workspace not found" });
    await db.insert(services).values({
      name,
      description,
      price,
      status,
      workspaceId: workspace.id
    });
    return { success: true };
  },
  updateService: async ({ request }) => {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"));
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const status = formData.get("status");
    if (!id || !name) return fail(400, { missing: true });
    await db.update(services).set({ name, description, price, status }).where(eq(services.id, id));
    return { success: true };
  },
  deleteService: async ({ request }) => {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"));
    if (!id) return fail(400, { missing: true });
    await db.delete(services).where(eq(services.id, id));
    return { success: true };
  },
  createSubservice: async ({ request }) => {
    const formData = await request.formData();
    const serviceId = parseInt(formData.get("serviceId"));
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const status = formData.get("status") || "Active";
    if (!serviceId || !name) return fail(400, { missing: true });
    await db.insert(subservices).values({
      serviceId,
      name,
      description,
      price,
      status
    });
    return { success: true };
  },
  updateSubservice: async ({ request }) => {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"));
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const status = formData.get("status");
    if (!id || !name) return fail(400, { missing: true });
    await db.update(subservices).set({ name, description, price, status }).where(eq(subservices.id, id));
    return { success: true };
  },
  deleteSubservice: async ({ request }) => {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"));
    if (!id) return fail(400, { missing: true });
    await db.delete(subservices).where(eq(subservices.id, id));
    return { success: true };
  }
};
export {
  actions,
  load
};
