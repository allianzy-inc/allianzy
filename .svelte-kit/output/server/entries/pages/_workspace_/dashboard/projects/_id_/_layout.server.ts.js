import { d as db, a as userCompanies, p as projects, u as users, s as services, w as workspaces, r as requirements, e as projectMilestones, f as cases, g as proposals, h as payments, i as projectPayments, j as requests } from "../../../../../../chunks/db.js";
import { a as getSignedUrlForFile } from "../../../../../../chunks/storage.js";
import { and, eq, sql, or, isNull, inArray, desc, asc, getTableColumns } from "drizzle-orm";
import { error } from "@sveltejs/kit";
import * as fs from "fs";
import * as path from "path";
function logUrlDebug(message) {
  try {
    const logPath = path.resolve("debug-urls.log");
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}
`);
  } catch (e) {
  }
}
const load = async ({ params, locals }) => {
  const projectId = Number(params.id);
  if (isNaN(projectId)) {
    throw error(400, "Invalid Project ID");
  }
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }
  try {
    let allowedProjectIds = [];
    let currentProjectPermissions = [];
    if (locals.user.companyId) {
      const userCompany = await db.query.userCompanies.findFirst({
        where: and(
          eq(userCompanies.userId, parseInt(locals.user.id)),
          eq(userCompanies.companyId, locals.user.companyId)
        )
      });
      if (userCompany && userCompany.status === "active" && userCompany.permissions) {
        const perms = userCompany.permissions;
        allowedProjectIds = Object.keys(perms).map((id) => parseInt(id)).filter((id) => !isNaN(id));
        if (perms[projectId.toString()] && Array.isArray(perms[projectId.toString()])) {
          currentProjectPermissions = perms[projectId.toString()];
        }
      }
    }
    const projectData = await db.select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      provider: projects.provider,
      serviceId: projects.serviceId,
      links: projects.links,
      startDate: projects.startDate,
      endDate: projects.endDate,
      imageUrl: projects.imageUrl,
      serviceName: services.name,
      serviceClientId: services.clientId,
      clientName: sql`TRIM(BOTH ' ' FROM COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`,
      clientCompany: users.company,
      clientEmail: users.email,
      clientId: users.id,
      projectClientId: projects.clientId
    }).from(projects).leftJoin(services, eq(projects.serviceId, services.id)).leftJoin(users, eq(users.id, parseInt(locals.user.id))).innerJoin(workspaces, eq(services.workspaceId, workspaces.id)).where(
      and(
        eq(projects.id, projectId),
        or(
          // 1. Direct Project Assignment (Highest Priority)
          eq(projects.clientId, parseInt(locals.user.id)),
          // 2. Service Fallback (Only if Project has NO specific client assigned)
          and(
            eq(workspaces.slug, locals.allowedWorkspace),
            eq(services.clientId, parseInt(locals.user.id)),
            isNull(projects.clientId)
          ),
          // 3. Permission-based Access
          allowedProjectIds.length > 0 ? inArray(projects.id, allowedProjectIds) : void 0
        )
      )
    ).limit(1);
    if (projectData.length === 0) {
      throw error(404, "Project not found or access denied");
    }
    const project = projectData[0];
    if (project.imageUrl) {
      project.imageUrl = await getSignedUrlForFile(project.imageUrl, params.workspace);
    }
    const rawRequirements = await db.select().from(requirements).where(eq(requirements.projectId, projectId)).orderBy(desc(requirements.createdAt));
    const projectRequirements = await Promise.all(rawRequirements.map(async (r) => {
      let files = r.files;
      if (files && Array.isArray(files)) {
        files = await Promise.all(files.map(async (f) => {
          const newUrl = await getSignedUrlForFile(f.url, params.workspace);
          logUrlDebug(`Requirement File: ${f.name}, Original: ${f.url}, Proxy: ${newUrl}`);
          return {
            ...f,
            url: newUrl
          };
        }));
      }
      return {
        ...r,
        files
      };
    }));
    const milestones = await db.select().from(projectMilestones).where(eq(projectMilestones.projectId, projectId)).orderBy(asc(projectMilestones.order));
    const rawSupportCases = await db.select().from(cases).where(eq(cases.projectId, projectId)).orderBy(asc(cases.createdAt));
    const supportCases = await Promise.all(rawSupportCases.map(async (c) => {
      let files = c.files;
      if (files && Array.isArray(files)) {
        files = await Promise.all(files.map(async (f) => {
          const newUrl = await getSignedUrlForFile(f.url, params.workspace);
          logUrlDebug(`Case File: ${f.name}, Original: ${f.url}, Proxy: ${newUrl}`);
          return {
            ...f,
            url: newUrl
          };
        }));
      }
      return { ...c, files };
    }));
    const rawProposals = await db.select().from(proposals).where(eq(proposals.projectId, projectId)).orderBy(desc(proposals.createdAt));
    const projectProposals = await Promise.all(rawProposals.map(async (p) => {
      let files = p.files;
      if (files && Array.isArray(files)) {
        files = await Promise.all(files.map(async (f) => {
          const newUrl = await getSignedUrlForFile(f.url, params.workspace);
          logUrlDebug(`Proposal File: ${f.name}, Original: ${f.url}, Proxy: ${newUrl}`);
          return {
            ...f,
            url: newUrl
          };
        }));
      }
      return {
        ...p,
        files,
        documentUrl: await getSignedUrlForFile(p.documentUrl, params.workspace)
      };
    }));
    const rawPayments = await db.select({
      ...getTableColumns(payments)
    }).from(payments).innerJoin(projectPayments, eq(payments.id, projectPayments.paymentId)).where(eq(projectPayments.projectId, projectId)).orderBy(asc(payments.dueDate));
    const projectPayments$1 = await Promise.all(rawPayments.map(async (p) => ({
      ...p,
      documentUrl: await getSignedUrlForFile(p.documentUrl, params.workspace)
    })));
    const rawRequests = await db.select().from(requests).where(eq(requests.projectId, projectId)).orderBy(desc(requests.createdAt));
    const projectRequests = await Promise.all(rawRequests.map(async (r) => {
      let files = r.files;
      if (files && Array.isArray(files)) {
        files = await Promise.all(files.map(async (f) => {
          const newUrl = await getSignedUrlForFile(f.url, params.workspace);
          logUrlDebug(`Request File: ${f.name}, Original: ${f.url}, Proxy: ${newUrl}`);
          return {
            ...f,
            url: newUrl
          };
        }));
      }
      return { ...r, files };
    }));
    let effectivePermissions = currentProjectPermissions;
    const isOwner = project.projectClientId === parseInt(locals.user.id);
    const isServiceOwner = !project.projectClientId && project.serviceClientId === parseInt(locals.user.id);
    if (isOwner || isServiceOwner) {
      effectivePermissions = ["process", "requests", "requirements", "support", "proposals", "payments"];
    }
    return {
      project,
      requirements: projectRequirements,
      milestones,
      supportCases,
      proposals: projectProposals,
      payments: projectPayments$1,
      requests: projectRequests,
      user: locals.user,
      permissions: effectivePermissions
    };
  } catch (err) {
    console.error("Error fetching project details:", err);
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    throw error(500, "Internal Server Error");
  }
};
export {
  load
};
