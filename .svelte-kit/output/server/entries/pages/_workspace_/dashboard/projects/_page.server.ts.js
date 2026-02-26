import { d as db, a as userCompanies, p as projects, w as workspaces, s as services } from "../../../../../chunks/db.js";
import { a as getSignedUrlForFile } from "../../../../../chunks/storage.js";
import { and, eq, or, isNull, inArray } from "drizzle-orm";
const load = async ({ locals, params }) => {
  if (!locals.user) {
    return {
      projects: [],
      workspace: params.workspace
    };
  }
  console.log("[Dashboard Projects] User:", locals.user.id, "Workspace:", locals.allowedWorkspace);
  const userId = parseInt(locals.user.id);
  let allowedProjectIds = [];
  if (locals.user.companyId) {
    const userCompany = await db.query.userCompanies.findFirst({
      where: and(
        eq(userCompanies.userId, userId),
        eq(userCompanies.companyId, locals.user.companyId)
      )
    });
    if (userCompany && userCompany.status === "active" && userCompany.permissions) {
      const perms = userCompany.permissions;
      allowedProjectIds = Object.keys(perms).map((id) => parseInt(id)).filter((id) => !isNaN(id));
    }
  }
  const sameCompanyCondition = locals.user.companyId ? and(eq(projects.clientId, userId), or(eq(projects.companyId, locals.user.companyId), isNull(projects.companyId))) : eq(projects.clientId, userId);
  const visibilityConditions = [
    sameCompanyCondition,
    and(
      eq(workspaces.slug, locals.allowedWorkspace),
      eq(services.clientId, userId),
      isNull(projects.clientId)
    )
  ];
  if (allowedProjectIds.length > 0) {
    const allowedCondition = locals.user.companyId ? and(inArray(projects.id, allowedProjectIds), or(eq(projects.companyId, locals.user.companyId), isNull(projects.companyId))) : inArray(projects.id, allowedProjectIds);
    visibilityConditions.push(allowedCondition);
  }
  const workspaceProjects = await db.select({
    id: projects.id,
    name: projects.name,
    description: projects.description,
    status: projects.status,
    startDate: projects.startDate,
    endDate: projects.endDate,
    imageUrl: projects.imageUrl,
    serviceName: services.name
  }).from(projects).leftJoin(services, eq(projects.serviceId, services.id)).leftJoin(workspaces, eq(services.workspaceId, workspaces.id)).where(or(...visibilityConditions));
  const projectsWithSignedUrls = await Promise.all(workspaceProjects.map(async (p) => {
    if (p.imageUrl) {
      p.imageUrl = await getSignedUrlForFile(p.imageUrl, params.workspace);
    }
    return p;
  }));
  return {
    projects: projectsWithSignedUrls,
    workspace: params.workspace
  };
};
export {
  load
};
