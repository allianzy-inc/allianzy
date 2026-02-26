import { d as db, x as caseComments, p as projects, s as services, w as workspaces, f as cases, u as users, n as notifications, a as userCompanies } from "../../../../../chunks/db.js";
import { eq, or, and, isNull, desc, inArray, sql, asc } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { u as uploadFile, a as getSignedUrlForFile } from "../../../../../chunks/storage.js";
import { s as sendEmail } from "../../../../../chunks/email.js";
import { b as private_env } from "../../../../../chunks/shared-server.js";
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
  const companyId = locals.user?.companyId ?? null;
  const sameCompanyFilter = companyId ? or(eq(projects.companyId, companyId), isNull(projects.companyId)) : void 0;
  const ticketConditions = [
    companyId ? and(eq(projects.clientId, userId), sameCompanyFilter) : eq(projects.clientId, userId),
    companyId ? and(eq(workspaces.slug, params.workspace), eq(services.clientId, userId), isNull(projects.clientId), sameCompanyFilter) : and(eq(workspaces.slug, params.workspace), eq(services.clientId, userId), isNull(projects.clientId))
  ];
  if (allowedProjectIds.length > 0) {
    ticketConditions.push(companyId ? and(inArray(projects.id, allowedProjectIds), sameCompanyFilter) : inArray(projects.id, allowedProjectIds));
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
  }).from(cases).innerJoin(projects, eq(cases.projectId, projects.id)).leftJoin(services, eq(projects.serviceId, services.id)).leftJoin(workspaces, eq(services.workspaceId, workspaces.id)).where(or(...ticketConditions)).orderBy(desc(cases.createdAt));
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
  const projectConditions = [
    companyId ? and(eq(projects.clientId, userId), sameCompanyFilter) : eq(projects.clientId, userId),
    companyId ? and(eq(workspaces.slug, params.workspace), eq(services.clientId, userId), isNull(projects.clientId), sameCompanyFilter) : and(eq(workspaces.slug, params.workspace), eq(services.clientId, userId), isNull(projects.clientId))
  ];
  if (allowedProjectIds.length > 0) {
    projectConditions.push(companyId ? and(inArray(projects.id, allowedProjectIds), sameCompanyFilter) : inArray(projects.id, allowedProjectIds));
  }
  const projectsList = await db.select({
    id: projects.id,
    name: projects.name,
    serviceName: services.name
  }).from(projects).leftJoin(services, eq(projects.serviceId, services.id)).leftJoin(workspaces, eq(services.workspaceId, workspaces.id)).where(or(...projectConditions)).orderBy(desc(projects.createdAt));
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
      const projectRows = await db.select({
        serviceId: projects.serviceId,
        workspaceId: services.workspaceId,
        workspaceSlug: workspaces.slug
      }).from(projects).innerJoin(services, eq(projects.serviceId, services.id)).innerJoin(workspaces, eq(services.workspaceId, workspaces.id)).where(eq(projects.id, projectId)).limit(1);
      const [inserted] = await db.insert(cases).values({
        projectId,
        title,
        description,
        content: description || "",
        priority,
        status,
        files: uploadedFiles
      }).returning({ id: cases.id });
      const caseId = inserted?.id;
      if (projectRows.length > 0 && caseId) {
        const workspaceId = projectRows[0].workspaceId;
        const workspaceSlug = projectRows[0].workspaceSlug;
        if (workspaceId) {
          const adminUsers = await db.select({ id: users.id, email: users.email }).from(users).where(and(eq(users.workspaceId, workspaceId), eq(users.role, "admin")));
          const adminEmails = adminUsers.map((u) => u.email).filter((e) => !!e && e.length > 0);
          const supportLink = `/${workspaceSlug}/admin/support?caseId=${caseId}`;
          for (const admin of adminUsers) {
            if (admin.id) {
              await db.insert(notifications).values({
                userId: admin.id,
                title: "Nueva consulta de soporte",
                message: title,
                type: "info",
                link: supportLink
              });
            }
          }
          if (adminEmails.length > 0) {
            const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
            const baseUrl = (private_env.PUBLIC_APP_URL || private_env.APP_BASE_URL || "").replace(/\/$/, "");
            const supportPath = `/${workspaceSlug}/admin/support?caseId=${caseId}`;
            const projectPath = `/${workspaceSlug}/admin/projects/${projectId}`;
            const supportLinkAbs = baseUrl ? `${baseUrl}${supportPath}` : supportPath;
            const projectPathFull = `/${workspaceSlug}/admin/projects/${projectId}`;
            const projectLink = baseUrl ? `${baseUrl}${projectPathFull}` : projectPathFull;
            const subject = `Nueva consulta de soporte: ${title}`;
            const safeTitle = escape(title);
            const safeDesc = description ? escape(description.slice(0, 500)) + (description.length > 500 ? "…" : "") : "";
            const html = `
                            <p>Un cliente ha creado una nueva consulta de soporte.</p>
                            <p><strong>Título:</strong> ${safeTitle}</p>
                            ${safeDesc ? `<p><strong>Descripción:</strong> ${safeDesc}</p>` : ""}
                            <p><strong>Prioridad:</strong> ${priority || "medium"}</p>
                            <p>Accede al panel de administración para ver y responder el ticket:</p>
                            <p><a href="${supportLinkAbs}">Ver Soporte</a> · <a href="${projectLink}">Ver en el proyecto</a></p>
                        `;
            await sendEmail({
              to: adminEmails,
              subject,
              html
            });
          }
        }
      }
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
