import { d as db, m as caseComments, p as projects, s as services, w as workspaces, c as cases, a as userCompanies, u as users } from "../../../../../chunks/db.js";
import { eq, or, and, isNull, desc, inArray, sql, asc } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { u as uploadFile, a as getSignedUrlForFile } from "../../../../../chunks/storage.js";
const load = async ({ locals, url, params }) => {
  const userId = Number(locals.user?.id);
  if (!userId || isNaN(userId)) {
    return { tickets: [], projectsList: [], selectedCaseComments: [] };
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
        if (Array.isArray(pList) && pList.includes("support")) {
          allowedProjectIds.push(Number(pid));
        }
      }
    }
  }
  const rawTickets = await db.select({
    id: cases.id,
    title: cases.title,
    description: cases.description,
    status: cases.status,
    priority: cases.priority,
    createdAt: cases.createdAt,
    files: cases.files,
    projectName: projects.name,
    serviceName: services.name,
    projectId: projects.id
  }).from(cases).innerJoin(projects, eq(cases.projectId, projects.id)).leftJoin(services, eq(projects.serviceId, services.id)).leftJoin(workspaces, eq(services.workspaceId, workspaces.id)).where(or(
    // 1. Direct Project Assignment
    eq(projects.clientId, userId),
    // 2. Explicit Permissions
    allowedProjectIds.length > 0 ? inArray(projects.id, allowedProjectIds) : void 0,
    // 3. Service Fallback (Only if Project has NO specific client assigned)
    and(
      eq(workspaces.slug, params.workspace),
      eq(services.clientId, userId),
      isNull(projects.clientId)
    )
  )).orderBy(desc(cases.createdAt));
  const tickets = await Promise.all(rawTickets.map(async (t) => {
    let files = t.files;
    if (files && Array.isArray(files)) {
      files = await Promise.all(files.map(async (f) => {
        const newUrl = await getSignedUrlForFile(f.url, params.workspace);
        return { ...f, url: newUrl };
      }));
    }
    return { ...t, files };
  }));
  const projectsList = await db.select({
    id: projects.id,
    name: projects.name,
    serviceName: services.name
  }).from(projects).leftJoin(services, eq(projects.serviceId, services.id)).leftJoin(workspaces, eq(services.workspaceId, workspaces.id)).where(or(
    // 1. Direct Project Assignment
    eq(projects.clientId, userId),
    // 2. Explicit Permissions
    allowedProjectIds.length > 0 ? inArray(projects.id, allowedProjectIds) : void 0,
    // 3. Service Fallback (Only if Project has NO specific client assigned)
    and(
      eq(workspaces.slug, params.workspace),
      eq(services.clientId, userId),
      isNull(projects.clientId)
    )
  )).orderBy(desc(projects.createdAt));
  let selectedCaseComments = [];
  const selectedCaseId = url.searchParams.get("caseId");
  if (selectedCaseId) {
    const caseExists = tickets.find((t) => t.id === Number(selectedCaseId));
    if (caseExists) {
      const rawComments = await db.select({
        id: caseComments.id,
        content: caseComments.content,
        createdAt: caseComments.createdAt,
        authorName: caseComments.authorName,
        subject: caseComments.subject,
        userId: caseComments.userId,
        authorRole: users.role,
        companyRole: sql`(SELECT role FROM ${userCompanies} WHERE ${userCompanies.userId} = ${users.id} LIMIT 1)`,
        files: caseComments.files
      }).from(caseComments).leftJoin(users, eq(caseComments.userId, users.id)).where(eq(caseComments.caseId, Number(selectedCaseId))).orderBy(asc(caseComments.createdAt));
      selectedCaseComments = rawComments.map((c) => {
        let files = c.files;
        if (files && Array.isArray(files)) {
          files = files.map((f) => ({
            ...f,
            url: getSignedUrlForFile(f.url, params.workspace)
          }));
        }
        return { ...c, files };
      });
    }
  }
  return {
    tickets,
    projectsList,
    selectedCaseComments,
    user: locals.user
  };
};
const actions = {
  createCase: async ({ request, locals, params }) => {
    const formData = await request.formData();
    let projectId = Number(formData.get("projectId"));
    let title = formData.get("title");
    const description = formData.get("description");
    const priority = formData.get("priority");
    const status = "open";
    if (!projectId || isNaN(projectId)) {
      const userId = Number(locals.user?.id);
      if (userId) {
        const firstProject = await db.select({ id: projects.id }).from(projects).leftJoin(services, eq(projects.serviceId, services.id)).leftJoin(workspaces, eq(services.workspaceId, workspaces.id)).where(or(
          // 1. Direct Project Assignment
          eq(projects.clientId, userId),
          // 2. Service Fallback (Only if Project has NO specific client assigned)
          and(
            eq(workspaces.slug, params.workspace),
            eq(services.clientId, userId),
            isNull(projects.clientId)
          )
        )).orderBy(desc(projects.createdAt)).limit(1);
        if (firstProject.length > 0) {
          projectId = firstProject[0].id;
        }
      }
    }
    if (!title || title === "Nueva Solicitud") {
      if (description) {
        title = description.substring(0, 50) + (description.length > 50 ? "..." : "");
      } else {
        title = "Nueva Solicitud de Soporte";
      }
    }
    const uploadedFiles = [];
    const files = formData.getAll("files");
    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const url = await uploadFile(file, "cases");
        uploadedFiles.push({
          name: file.name,
          url,
          type: file.type
        });
      }
    }
    if (!title || !projectId) {
      return fail(400, { message: "Project is required. Please ensure you have at least one active project." });
    }
    try {
      const project = await db.select({ serviceId: projects.serviceId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      let workspaceId = null;
      if (project.length > 0 && project[0].serviceId) {
        const service = await db.select({ workspaceId: services.workspaceId }).from(services).where(eq(services.id, project[0].serviceId)).limit(1);
        if (service.length > 0) workspaceId = service[0].workspaceId;
      }
      await db.insert(cases).values({
        projectId,
        title,
        description,
        content: description || "",
        priority,
        status,
        files: uploadedFiles
      });
      return { success: true };
    } catch (err) {
      console.error("Error creating case:", err);
      return fail(500, { message: "Failed to create case" });
    }
  },
  addCaseComment: async ({ request, locals }) => {
    const formData = await request.formData();
    const caseId = Number(formData.get("caseId"));
    const content = formData.get("content");
    const subject = formData.get("subject");
    const uploadedFiles = [];
    const files = formData.getAll("files");
    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const url = await uploadFile(file, "cases");
        uploadedFiles.push({
          name: file.name,
          url,
          type: file.type
        });
      }
    }
    if (!caseId || !content) {
      return fail(400, { message: "Case ID and Content are required" });
    }
    const authorName = locals.user ? `${locals.user.firstName} ${locals.user.lastName}` : "Client";
    const userId = locals.user ? parseInt(locals.user.id) : null;
    try {
      await db.insert(caseComments).values({
        caseId,
        userId,
        authorName,
        subject,
        content,
        files: uploadedFiles
      });
      return { success: true };
    } catch (err) {
      console.error("Error adding comment:", err);
      return fail(500, { message: "Failed to add comment" });
    }
  }
};
export {
  actions,
  load
};
