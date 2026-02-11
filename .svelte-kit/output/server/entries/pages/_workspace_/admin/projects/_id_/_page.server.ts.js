import { d as db, j as proposalComments, e as proposals, p as projects, n as notifications, k as requirementComments, r as requirements, l as requestComments, h as requests, c as cases, m as caseComments, f as payments, g as projectPayments, b as projectMilestones, u as users, s as services } from "../../../../../../chunks/db.js";
import { u as uploadFile, d as deleteFile, a as getSignedUrlForFile } from "../../../../../../chunks/storage.js";
import { eq, sql, desc, asc, getTableColumns } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { fail, error } from "@sveltejs/kit";
const load = async ({ params, url }) => {
  const projectId = Number(params.id);
  if (isNaN(projectId)) {
    throw error(400, "Invalid Project ID");
  }
  try {
    const serviceUsers = alias(users, "service_users");
    const allClients = await db.select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      company: users.company,
      email: users.email
    }).from(users).where(eq(users.role, "client"));
    const allServices = await db.select({
      id: services.id,
      name: services.name,
      clientId: services.clientId,
      status: services.status
    }).from(services).where(eq(services.status, "Active"));
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
      serviceName: services.name,
      imageUrl: projects.imageUrl,
      // Prefer direct client link, fallback to service client link
      clientName: sql`
                CASE 
                    WHEN ${users.id} IS NOT NULL THEN TRIM(BOTH ' ' FROM COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))
                    ELSE TRIM(BOTH ' ' FROM COALESCE(${serviceUsers.firstName}, '') || ' ' || COALESCE(${serviceUsers.lastName}, ''))
                END
            `,
      clientCompany: sql`COALESCE(${users.company}, ${serviceUsers.company})`,
      clientEmail: sql`COALESCE(${users.email}, ${serviceUsers.email})`,
      clientId: sql`COALESCE(${users.id}, ${serviceUsers.id})`
    }).from(projects).leftJoin(services, eq(projects.serviceId, services.id)).leftJoin(users, eq(projects.clientId, users.id)).leftJoin(serviceUsers, eq(services.clientId, serviceUsers.id)).where(eq(projects.id, projectId)).limit(1);
    if (projectData.length === 0) {
      throw error(404, "Project not found");
    }
    const project = projectData[0];
    if (project.imageUrl) {
      project.imageUrl = await getSignedUrlForFile(project.imageUrl, params.workspace);
    }
    const allProjects = await db.select({
      id: projects.id,
      name: projects.name
    }).from(projects).where(eq(projects.clientId, project.clientId));
    const rawRequirements = await db.select().from(requirements).where(eq(requirements.projectId, projectId)).orderBy(desc(requirements.createdAt));
    const projectRequirements = await Promise.all(rawRequirements.map(async (r) => {
      let files = r.files;
      if (files && Array.isArray(files)) {
        files = await Promise.all(files.map(async (f) => ({
          ...f,
          url: await getSignedUrlForFile(f.url, params.workspace)
        })));
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
        files = await Promise.all(files.map(async (f) => ({
          ...f,
          url: await getSignedUrlForFile(f.url, params.workspace)
        })));
      }
      return { ...c, files };
    }));
    let selectedCaseComments = [];
    const selectedCaseId = url.searchParams.get("caseId");
    if (selectedCaseId) {
      const rawComments = await db.select({
        id: caseComments.id,
        content: caseComments.content,
        createdAt: caseComments.createdAt,
        authorName: caseComments.authorName,
        subject: caseComments.subject,
        userId: caseComments.userId,
        userName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        files: caseComments.files
      }).from(caseComments).leftJoin(users, eq(caseComments.userId, users.id)).where(eq(caseComments.caseId, Number(selectedCaseId))).orderBy(asc(caseComments.createdAt));
      selectedCaseComments = await Promise.all(rawComments.map(async (c) => {
        let files = c.files;
        if (files && Array.isArray(files)) {
          files = await Promise.all(files.map(async (f) => ({
            ...f,
            url: await getSignedUrlForFile(f.url, params.workspace)
          })));
        }
        return { ...c, files };
      }));
    }
    let selectedRequestComments = [];
    const selectedRequestId = url.searchParams.get("requestId");
    if (selectedRequestId) {
      const rawComments = await db.select({
        id: requestComments.id,
        content: requestComments.content,
        createdAt: requestComments.createdAt,
        authorName: requestComments.authorName,
        subject: requestComments.subject,
        userId: requestComments.userId,
        userName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        files: requestComments.files
      }).from(requestComments).leftJoin(users, eq(requestComments.userId, users.id)).where(eq(requestComments.requestId, Number(selectedRequestId))).orderBy(asc(requestComments.createdAt));
      selectedRequestComments = await Promise.all(rawComments.map(async (c) => {
        let files = c.files;
        if (files && Array.isArray(files)) {
          files = await Promise.all(files.map(async (f) => ({
            ...f,
            url: await getSignedUrlForFile(f.url, params.workspace)
          })));
        }
        return { ...c, files };
      }));
    }
    let selectedRequirementComments = [];
    const selectedRequirementId = url.searchParams.get("requirementId");
    if (selectedRequirementId) {
      const rawComments = await db.select({
        id: requirementComments.id,
        content: requirementComments.content,
        createdAt: requirementComments.createdAt,
        authorName: requirementComments.authorName,
        subject: requirementComments.subject,
        userId: requirementComments.userId,
        userName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        files: requirementComments.files
      }).from(requirementComments).leftJoin(users, eq(requirementComments.userId, users.id)).where(eq(requirementComments.requirementId, Number(selectedRequirementId))).orderBy(asc(requirementComments.createdAt));
      selectedRequirementComments = await Promise.all(rawComments.map(async (c) => {
        let files = c.files;
        if (files && Array.isArray(files)) {
          files = await Promise.all(files.map(async (f) => ({
            ...f,
            url: await getSignedUrlForFile(f.url, params.workspace)
          })));
        }
        return { ...c, files };
      }));
    }
    let selectedProposalComments = [];
    const selectedProposalId = url.searchParams.get("proposalId");
    if (selectedProposalId) {
      const rawComments = await db.select({
        id: proposalComments.id,
        content: proposalComments.content,
        createdAt: proposalComments.createdAt,
        authorName: proposalComments.authorName,
        subject: proposalComments.subject,
        userId: proposalComments.userId,
        userName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        files: proposalComments.files
      }).from(proposalComments).leftJoin(users, eq(proposalComments.userId, users.id)).where(eq(proposalComments.proposalId, Number(selectedProposalId))).orderBy(asc(proposalComments.createdAt));
      selectedProposalComments = await Promise.all(rawComments.map(async (c) => {
        let files = c.files;
        if (files && Array.isArray(files)) {
          files = await Promise.all(files.map(async (f) => ({
            ...f,
            url: await getSignedUrlForFile(f.url, params.workspace)
          })));
        }
        return { ...c, files };
      }));
    }
    const rawProposals = await db.select().from(proposals).where(eq(proposals.projectId, projectId)).orderBy(desc(proposals.createdAt));
    const projectProposals = await Promise.all(rawProposals.map(async (p) => {
      let files = p.files;
      if (files && Array.isArray(files)) {
        files = await Promise.all(files.map(async (f) => ({
          ...f,
          url: await getSignedUrlForFile(f.url, params.workspace)
        })));
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
    const projectPayments$1 = await Promise.all(rawPayments.map(async (p) => {
      const associatedProjects = await db.select({
        projectId: projectPayments.projectId
      }).from(projectPayments).where(eq(projectPayments.paymentId, p.id));
      return {
        ...p,
        projectIds: associatedProjects.map((ap) => ap.projectId),
        documentUrl: await getSignedUrlForFile(p.documentUrl, params.workspace)
      };
    }));
    const rawRequests = await db.select().from(requests).where(eq(requests.projectId, projectId)).orderBy(desc(requests.createdAt));
    const projectRequests = await Promise.all(rawRequests.map(async (r) => {
      let files = r.files;
      if (files && Array.isArray(files)) {
        files = await Promise.all(files.map(async (f) => ({
          ...f,
          url: await getSignedUrlForFile(f.url, params.workspace)
        })));
      }
      return { ...r, files };
    }));
    return {
      project,
      requirements: projectRequirements,
      milestones,
      supportCases,
      proposals: projectProposals,
      payments: projectPayments$1,
      requests: projectRequests,
      selectedCaseComments,
      selectedRequestComments,
      selectedRequirementComments,
      selectedProposalComments,
      allClients,
      allServices,
      allProjects
    };
  } catch (err) {
    console.error("Error fetching project details:", err);
    throw error(500, "Internal Server Error");
  }
};
const actions = {
  // Project Actions
  updateProject: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const name = formData.get("name");
    const status = formData.get("status");
    const provider = formData.get("provider");
    const clientId = formData.get("clientId") ? Number(formData.get("clientId")) : null;
    const serviceId = Number(formData.get("serviceId"));
    const startDateStr = formData.get("startDate");
    const startTimeStr = formData.get("startTime");
    const linksJson = formData.get("links");
    const imageFile = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";
    if (!name || !status || !provider || !serviceId || !startDateStr) {
      return fail(400, { message: "All fields are required" });
    }
    try {
      const timeStr = startTimeStr || "12:00";
      const startDate = /* @__PURE__ */ new Date(`${startDateStr}T${timeStr}Z`);
      let links = [];
      if (linksJson) {
        try {
          links = JSON.parse(linksJson);
        } catch (e) {
          console.error("Error parsing links:", e);
        }
      }
      const updateData = {
        name,
        status,
        provider,
        clientId,
        serviceId,
        startDate,
        links
      };
      if (removeImage) {
        updateData.imageUrl = null;
      } else if (imageFile && imageFile.size > 0) {
        updateData.imageUrl = await uploadFile(imageFile, "project-covers");
      }
      await db.update(projects).set(updateData).where(eq(projects.id, projectId));
      return { success: true };
    } catch (err) {
      console.error("Error updating project:", err);
      return fail(500, { message: "Failed to update project" });
    }
  },
  // Requirements Actions
  createRequirement: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const title = formData.get("title");
    const description = formData.get("description");
    const reqDate = formData.get("reqDate");
    const reqTime = formData.get("reqTime");
    const uploadedFiles = [];
    const files = formData.getAll("files");
    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const url = await uploadFile(file, "requirements");
        uploadedFiles.push({
          name: file.name,
          url,
          type: file.type
        });
      }
    }
    if (!title) {
      return fail(400, { message: "Title is required" });
    }
    try {
      let createdAt = /* @__PURE__ */ new Date();
      if (reqDate) {
        const timeStr = reqTime || "12:00";
        createdAt = /* @__PURE__ */ new Date(`${reqDate}T${timeStr}`);
      }
      const [newRequirement] = await db.insert(requirements).values({
        projectId,
        title,
        description,
        status: "pending",
        files: uploadedFiles,
        createdAt
      }).returning({ id: requirements.id });
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Nuevo Requerimiento",
          message: `Se ha creado un nuevo requerimiento: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/projects/${projectId}?requirementId=${newRequirement.id}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error creating requirement:", err);
      return fail(500, { message: "Failed to create requirement" });
    }
  },
  updateRequirement: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const id = Number(formData.get("id"));
    const title = formData.get("title");
    const description = formData.get("description");
    const status = formData.get("status");
    const reqDate = formData.get("reqDate");
    const reqTime = formData.get("reqTime");
    if (!id || !title) {
      return fail(400, { message: "ID and Title are required" });
    }
    try {
      const existingRequirement = await db.select().from(requirements).where(eq(requirements.id, id)).limit(1);
      let currentFiles = [];
      if (existingRequirement.length > 0 && Array.isArray(existingRequirement[0].files)) {
        currentFiles = existingRequirement[0].files;
      }
      const existingFilesJson = formData.get("existingFiles");
      if (existingFilesJson) {
        try {
          currentFiles = JSON.parse(existingFilesJson);
        } catch (e) {
          console.error("Error parsing existingFiles:", e);
        }
      }
      const newFiles = [];
      const files = formData.getAll("files");
      for (const file of files) {
        if (file.size > 0 && file.name && file.name !== "undefined") {
          const url = await uploadFile(file, "requirements");
          newFiles.push({
            name: file.name,
            url,
            type: file.type
          });
        }
      }
      const updatedFiles = [...currentFiles, ...newFiles];
      const updateData = {
        title,
        description,
        status,
        files: updatedFiles
      };
      if (reqDate) {
        const timeStr = reqTime || "12:00";
        updateData.createdAt = /* @__PURE__ */ new Date(`${reqDate}T${timeStr}`);
      }
      await db.update(requirements).set(updateData).where(eq(requirements.id, id));
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Requerimiento Actualizado",
          message: `Se ha actualizado el requerimiento: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/projects/${projectId}?requirementId=${id}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error updating requirement:", err);
      return fail(500, { message: "Failed to update requirement" });
    }
  },
  deleteRequirement: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id) {
      return fail(400, { message: "ID is required" });
    }
    try {
      await db.delete(requirements).where(eq(requirements.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting requirement:", err);
      return fail(500, { message: "Failed to delete requirement" });
    }
  },
  createMilestone: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const title = formData.get("title");
    const order = Number(formData.get("order"));
    if (!title || isNaN(order)) {
      return fail(400, { message: "Title and order are required" });
    }
    try {
      await db.insert(projectMilestones).values({
        projectId,
        title,
        order,
        status: "pending"
      });
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Nuevo Hito en el Proceso",
          message: `Se ha agregado un nuevo hito: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/projects/${projectId}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error creating milestone:", err);
      return fail(500, { message: "Failed to create milestone" });
    }
  },
  updateMilestone: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const id = Number(formData.get("id"));
    const title = formData.get("title");
    const status = formData.get("status");
    const order = Number(formData.get("order"));
    const completedDate = formData.get("completedDate");
    const completedTime = formData.get("completedTime");
    if (!id || !title || isNaN(order)) {
      return fail(400, { message: "ID, Title and Order are required" });
    }
    try {
      const updateData = {
        title,
        status,
        order
      };
      if (status === "completed") {
        if (completedDate) {
          const timeStr = completedTime || "12:00";
          updateData.completedAt = /* @__PURE__ */ new Date(`${completedDate}T${timeStr}`);
        } else {
          updateData.completedAt = /* @__PURE__ */ new Date();
        }
      } else {
        updateData.completedAt = null;
      }
      await db.update(projectMilestones).set(updateData).where(eq(projectMilestones.id, id));
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Hito del Proceso Actualizado",
          message: `Se ha actualizado el hito: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/projects/${projectId}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error updating milestone:", err);
      return fail(500, { message: "Failed to update milestone" });
    }
  },
  deleteMilestone: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id) {
      return fail(400, { message: "ID is required" });
    }
    try {
      await db.delete(projectMilestones).where(eq(projectMilestones.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting milestone:", err);
      return fail(500, { message: "Failed to delete milestone" });
    }
  },
  // Proposal Actions
  createProposal: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const title = formData.get("title");
    const description = formData.get("description");
    let documentUrl = formData.get("documentUrl");
    const propDate = formData.get("propDate");
    const propTime = formData.get("propTime");
    const uploadedFiles = [];
    const files = formData.getAll("files");
    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const url = await uploadFile(file, "proposals");
        uploadedFiles.push({
          name: file.name,
          url,
          type: file.type
        });
      }
    }
    if (!title) {
      return fail(400, { message: "Title is required" });
    }
    try {
      let createdAt = /* @__PURE__ */ new Date();
      if (propDate) {
        const timeStr = propTime || "12:00";
        createdAt = /* @__PURE__ */ new Date(`${propDate}T${timeStr}Z`);
      }
      const [newProposal] = await db.insert(proposals).values({
        projectId,
        title,
        description,
        documentUrl,
        status: "pending",
        files: uploadedFiles,
        createdAt
      }).returning({ id: proposals.id });
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Nueva Propuesta",
          message: `Se ha creado una nueva propuesta: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/projects/${projectId}?proposalId=${newProposal.id}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error creating proposal:", err);
      return fail(500, { message: "Failed to create proposal" });
    }
  },
  updateProposal: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const id = Number(formData.get("id"));
    const title = formData.get("title");
    const description = formData.get("description");
    let documentUrl = formData.get("documentUrl");
    const status = formData.get("status");
    const propDate = formData.get("propDate");
    const propTime = formData.get("propTime");
    if (!id || !title) {
      return fail(400, { message: "ID and Title are required" });
    }
    try {
      const existingProposal = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
      let currentFiles = [];
      if (existingProposal.length > 0 && Array.isArray(existingProposal[0].files)) {
        currentFiles = existingProposal[0].files;
      }
      const existingFilesJson = formData.get("existingFiles");
      if (existingFilesJson) {
        try {
          currentFiles = JSON.parse(existingFilesJson);
        } catch (e) {
          console.error("Error parsing existingFiles:", e);
        }
      }
      const newFiles = [];
      const files = formData.getAll("files");
      for (const file of files) {
        if (file.size > 0 && file.name && file.name !== "undefined") {
          const url = await uploadFile(file, "proposals");
          newFiles.push({
            name: file.name,
            url,
            type: file.type
          });
        }
      }
      const updatedFiles = [...currentFiles, ...newFiles];
      const updateData = {
        title,
        description,
        documentUrl,
        status,
        files: updatedFiles
      };
      if (propDate) {
        const timeStr = propTime || "12:00";
        updateData.createdAt = /* @__PURE__ */ new Date(`${propDate}T${timeStr}Z`);
      }
      await db.update(proposals).set(updateData).where(eq(proposals.id, id));
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Propuesta Actualizada",
          message: `Se ha actualizado la propuesta: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/projects/${projectId}?proposalId=${id}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error updating proposal:", err);
      return fail(500, { message: "Failed to update proposal" });
    }
  },
  deleteProposal: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id) {
      return fail(400, { message: "ID is required" });
    }
    try {
      await db.delete(proposals).where(eq(proposals.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting proposal:", err);
      return fail(500, { message: "Failed to delete proposal" });
    }
  },
  // Payment Actions
  createPayment: async ({ request, params }) => {
    const formData = await request.formData();
    const currentProjectId = Number(params.id);
    const title = formData.get("title");
    const amount = formData.get("amount");
    const status = formData.get("status");
    const dueDateStr = formData.get("dueDate");
    const dueTime = formData.get("dueTime");
    const paidAtStr = formData.get("paidAt");
    const paidTime = formData.get("paidTime");
    const file = formData.get("file");
    const amountOriginal = formData.get("amountOriginal");
    const currencyOriginal = formData.get("currencyOriginal");
    const exchangeRate = formData.get("exchangeRate");
    const amountUsd = formData.get("amountUsd");
    const paymentMethod = formData.get("paymentMethod");
    const providerPaymentId = formData.get("providerPaymentId");
    const projectIds = formData.getAll("projectIds").map((id) => Number(id));
    if (projectIds.length === 0) {
      projectIds.push(currentProjectId);
    }
    if (!title || !amount) {
      return fail(400, { message: "Title and amount are required" });
    }
    try {
      let documentUrl = null;
      if (file && file.size > 0) {
        documentUrl = await uploadFile(file, "payments");
      }
      let dueDate = null;
      if (dueDateStr) {
        const timeStr = dueTime || "12:00";
        dueDate = /* @__PURE__ */ new Date(`${dueDateStr}T${timeStr}`);
      }
      let paidAt = null;
      if (paidAtStr) {
        const timeStr = paidTime || "12:00";
        paidAt = /* @__PURE__ */ new Date(`${paidAtStr}T${timeStr}`);
      }
      const [newPayment] = await db.insert(payments).values({
        projectId: currentProjectId,
        // Keep for backward compatibility/primary context
        title,
        amount,
        status: status || "pending",
        dueDate,
        paidAt,
        documentUrl,
        amountOriginal,
        currencyOriginal,
        exchangeRate,
        amountUsd,
        paymentMethod,
        providerPaymentId
      }).returning({ id: payments.id });
      if (newPayment && projectIds.length > 0) {
        const uniqueProjectIds = [...new Set(projectIds)];
        await db.insert(projectPayments).values(
          uniqueProjectIds.map((pid) => ({
            paymentId: newPayment.id,
            projectId: pid
          }))
        );
      }
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, currentProjectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Nuevo Pago",
          message: `Se ha creado un nuevo pago: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/projects/${currentProjectId}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error creating payment:", err);
      return fail(500, { message: "Failed to create payment" });
    }
  },
  updatePayment: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const id = Number(formData.get("id"));
    const title = formData.get("title");
    const amount = formData.get("amount");
    const status = formData.get("status");
    const dueDateStr = formData.get("dueDate");
    const dueTime = formData.get("dueTime");
    const paidAtStr = formData.get("paidAt");
    const paidTime = formData.get("paidTime");
    const file = formData.get("file");
    const amountOriginal = formData.get("amountOriginal");
    const currencyOriginal = formData.get("currencyOriginal");
    const exchangeRate = formData.get("exchangeRate");
    const amountUsd = formData.get("amountUsd");
    const paymentMethod = formData.get("paymentMethod");
    const providerPaymentId = formData.get("providerPaymentId");
    const projectIds = formData.getAll("projectIds").map((pid) => Number(pid));
    if (!id || !title || !amount) {
      return fail(400, { message: "ID, Title and Amount are required" });
    }
    try {
      let dueDate = null;
      if (dueDateStr) {
        const timeStr = dueTime || "12:00";
        dueDate = /* @__PURE__ */ new Date(`${dueDateStr}T${timeStr}`);
      }
      let paidAt = null;
      if (paidAtStr) {
        const timeStr = paidTime || "12:00";
        paidAt = /* @__PURE__ */ new Date(`${paidAtStr}T${timeStr}`);
      }
      const updateData = {
        title,
        amount,
        status,
        dueDate,
        paidAt,
        amountOriginal,
        currencyOriginal,
        exchangeRate,
        amountUsd,
        paymentMethod,
        providerPaymentId
      };
      if (file && file.size > 0) {
        updateData.documentUrl = await uploadFile(file, "payments");
      }
      await db.update(payments).set(updateData).where(eq(payments.id, id));
      await db.delete(projectPayments).where(eq(projectPayments.paymentId, id));
      if (projectIds.length > 0) {
        const uniqueProjectIds = [...new Set(projectIds)];
        await db.insert(projectPayments).values(
          uniqueProjectIds.map((pid) => ({
            paymentId: id,
            projectId: pid
          }))
        );
      }
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Pago Actualizado",
          message: `Se ha actualizado el pago: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/projects/${projectId}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error updating payment:", err);
      return fail(500, { message: "Failed to update payment" });
    }
  },
  deletePayment: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id) {
      return fail(400, { message: "ID is required" });
    }
    try {
      await db.delete(payments).where(eq(payments.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting payment:", err);
      return fail(500, { message: "Failed to delete payment" });
    }
  },
  // Request Actions
  createRequest: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const title = formData.get("title");
    const description = formData.get("description");
    const reqDate = formData.get("reqDate");
    const reqTime = formData.get("reqTime");
    const uploadedFiles = [];
    const files = formData.getAll("files");
    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const url = await uploadFile(file, "requests");
        uploadedFiles.push({
          name: file.name,
          url,
          type: file.type
        });
      }
    }
    if (!title) {
      return fail(400, { message: "Title is required" });
    }
    try {
      let createdAt = /* @__PURE__ */ new Date();
      if (reqDate) {
        const timeStr = reqTime || "12:00";
        createdAt = /* @__PURE__ */ new Date(`${reqDate}T${timeStr}`);
      }
      const [newRequest] = await db.insert(requests).values({
        projectId,
        title,
        description,
        status: "pending",
        files: uploadedFiles,
        createdAt
      }).returning({ id: requests.id });
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Nueva Solicitud",
          message: `Se ha creado una nueva solicitud: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/projects/${projectId}?requestId=${newRequest.id}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error creating request:", err);
      return fail(500, { message: "Failed to create request" });
    }
  },
  updateRequest: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    const title = formData.get("title");
    const description = formData.get("description");
    const status = formData.get("status");
    const reqDate = formData.get("reqDate");
    const reqTime = formData.get("reqTime");
    const existingFilesJson = formData.get("existingFiles");
    if (!id || !title) {
      return fail(400, { message: "ID and Title are required" });
    }
    try {
      let currentFiles = [];
      if (existingFilesJson) {
        try {
          currentFiles = JSON.parse(existingFilesJson);
        } catch (e) {
          console.error("Error parsing existingFiles:", e);
          const existingRequest = await db.select().from(requests).where(eq(requests.id, id)).limit(1);
          if (existingRequest.length > 0 && Array.isArray(existingRequest[0].files)) {
            currentFiles = existingRequest[0].files;
          }
        }
      } else {
        const existingRequest = await db.select().from(requests).where(eq(requests.id, id)).limit(1);
        if (existingRequest.length > 0 && Array.isArray(existingRequest[0].files)) {
          currentFiles = existingRequest[0].files;
        }
      }
      const newFiles = [];
      const files = formData.getAll("files");
      for (const file of files) {
        if (file.size > 0 && file.name && file.name !== "undefined") {
          const url = await uploadFile(file, "requests");
          newFiles.push({
            name: file.name,
            url,
            type: file.type
          });
        }
      }
      const updatedFiles = [...currentFiles, ...newFiles];
      const updateData = {
        title,
        description,
        status,
        files: updatedFiles,
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (reqDate) {
        const timeStr = reqTime || "12:00";
        updateData.createdAt = /* @__PURE__ */ new Date(`${reqDate}T${timeStr}`);
      }
      await db.update(requests).set(updateData).where(eq(requests.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error updating request:", err);
      return fail(500, { message: "Failed to update request" });
    }
  },
  deleteRequest: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id) {
      return fail(400, { message: "ID is required" });
    }
    try {
      await db.delete(requests).where(eq(requests.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting request:", err);
      return fail(500, { message: "Failed to delete request" });
    }
  },
  // Case Actions
  createCase: async ({ request, params }) => {
    const formData = await request.formData();
    const projectId = Number(params.id);
    const title = formData.get("title");
    const description = formData.get("description");
    const priority = formData.get("priority");
    const status = formData.get("status") || "open";
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
    if (!title) {
      return fail(400, { message: "Title is required" });
    }
    try {
      const [newCase] = await db.insert(cases).values({
        projectId,
        title,
        description,
        content: description || "",
        // Use description as content since content is required
        priority,
        status,
        files: uploadedFiles
      }).returning({ id: cases.id });
      const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
      if (project.length > 0 && project[0].clientId) {
        await db.insert(notifications).values({
          userId: project[0].clientId,
          title: "Nuevo Ticket de Soporte",
          message: `Se ha creado un nuevo ticket: ${title}`,
          type: "info",
          link: `/${params.workspace}/dashboard/support?caseId=${newCase.id}`
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Error creating case:", err);
      return fail(500, { message: "Failed to create case" });
    }
  },
  updateCase: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    const title = formData.get("title");
    const description = formData.get("description");
    const priority = formData.get("priority");
    const status = formData.get("status");
    if (!id || !title) {
      return fail(400, { message: "ID and Title are required" });
    }
    try {
      const existingCase = await db.select().from(cases).where(eq(cases.id, id)).limit(1);
      let currentFiles = [];
      if (existingCase.length > 0 && Array.isArray(existingCase[0].files)) {
        currentFiles = existingCase[0].files;
      }
      const existingFilesJson = formData.get("existingFiles");
      if (existingFilesJson) {
        try {
          currentFiles = JSON.parse(existingFilesJson);
        } catch (e) {
          console.error("Error parsing existingFiles:", e);
        }
      }
      const newFiles = [];
      const files = formData.getAll("files");
      for (const file of files) {
        if (file.size > 0 && file.name && file.name !== "undefined") {
          const url = await uploadFile(file, "cases");
          newFiles.push({
            name: file.name,
            url,
            type: file.type
          });
        }
      }
      const updatedFiles = [...currentFiles, ...newFiles];
      let closedAt = existingCase[0]?.closedAt;
      if (status === "closed" && existingCase[0]?.status !== "closed") {
        closedAt = /* @__PURE__ */ new Date();
      } else if (status !== "closed") {
        closedAt = null;
      }
      await db.update(cases).set({
        title,
        description,
        content: description || "",
        // Keep content in sync with description
        priority,
        status,
        files: updatedFiles,
        closedAt
      }).where(eq(cases.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error updating case:", err);
      return fail(500, { message: "Failed to update case" });
    }
  },
  addCaseComment: async ({ request, params }) => {
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
    const authorName = "Admin";
    try {
      await db.insert(caseComments).values({
        caseId,
        authorName,
        subject,
        content,
        files: uploadedFiles
      });
      const caseData = await db.select({ projectId: cases.projectId }).from(cases).where(eq(cases.id, caseId)).limit(1);
      if (caseData.length > 0 && caseData[0].projectId) {
        const projectId = caseData[0].projectId;
        const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
        if (project.length > 0 && project[0].clientId) {
          await db.insert(notifications).values({
            userId: project[0].clientId,
            title: "Nuevo mensaje de soporte",
            message: `Nuevo comentario en el ticket #${caseId}: ${subject || "Sin asunto"}`,
            type: "info",
            link: `/${params.workspace}/dashboard/support?caseId=${caseId}`
          });
        }
      }
      return { success: true };
    } catch (err) {
      console.error("Error adding comment:", err);
      return fail(500, { message: "Failed to add comment" });
    }
  },
  deleteCase: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id) {
      return fail(400, { message: "ID is required" });
    }
    try {
      const caseData = await db.select().from(cases).where(eq(cases.id, id)).limit(1);
      if (caseData.length === 0) {
        return fail(404, { message: "Case not found" });
      }
      const comments = await db.select().from(caseComments).where(eq(caseComments.caseId, id));
      if (caseData[0].files && Array.isArray(caseData[0].files)) {
        for (const file of caseData[0].files) {
          if (file.url) await deleteFile(file.url);
        }
      }
      for (const comment of comments) {
        if (comment.files && Array.isArray(comment.files)) {
          for (const file of comment.files) {
            if (file.url) await deleteFile(file.url);
          }
        }
      }
      await db.delete(caseComments).where(eq(caseComments.caseId, id));
      await db.delete(cases).where(eq(cases.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting case:", err);
      return fail(500, { message: "Failed to delete case" });
    }
  },
  addRequestComment: async ({ request, params }) => {
    const formData = await request.formData();
    const requestId = Number(formData.get("requestId"));
    const content = formData.get("content");
    const subject = formData.get("subject");
    const uploadedFiles = [];
    const files = formData.getAll("files");
    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const url = await uploadFile(file, "requests");
        uploadedFiles.push({
          name: file.name,
          url,
          type: file.type
        });
      }
    }
    if (!requestId || !content) {
      return fail(400, { message: "Request ID and Content are required" });
    }
    const authorName = "Admin";
    try {
      await db.insert(requestComments).values({
        requestId,
        authorName,
        subject,
        content,
        files: uploadedFiles
      });
      const requestData = await db.select({ projectId: requests.projectId }).from(requests).where(eq(requests.id, requestId)).limit(1);
      if (requestData.length > 0 && requestData[0].projectId) {
        const projectId = requestData[0].projectId;
        const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
        if (project.length > 0 && project[0].clientId) {
          await db.insert(notifications).values({
            userId: project[0].clientId,
            title: "Nuevo Mensaje en Solicitud",
            message: `Nuevo comentario en la solicitud: ${subject || "Sin asunto"}`,
            type: "info",
            link: `/${params.workspace}/dashboard/projects/${projectId}?requestId=${requestId}`
          });
        }
      }
      return { success: true };
    } catch (err) {
      console.error("Error adding request comment:", err);
      return fail(500, { message: "Failed to add request comment" });
    }
  },
  addRequirementComment: async ({ request, params }) => {
    const formData = await request.formData();
    const requirementId = Number(formData.get("requirementId"));
    const content = formData.get("content");
    const subject = formData.get("subject");
    const uploadedFiles = [];
    const files = formData.getAll("files");
    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const url = await uploadFile(file, "requirements");
        uploadedFiles.push({
          name: file.name,
          url,
          type: file.type
        });
      }
    }
    if (!requirementId || !content) {
      return fail(400, { message: "Requirement ID and Content are required" });
    }
    const authorName = "Admin";
    try {
      await db.insert(requirementComments).values({
        requirementId,
        authorName,
        subject,
        content,
        files: uploadedFiles
      });
      const requirementData = await db.select({ projectId: requirements.projectId }).from(requirements).where(eq(requirements.id, requirementId)).limit(1);
      if (requirementData.length > 0 && requirementData[0].projectId) {
        const projectId = requirementData[0].projectId;
        const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
        if (project.length > 0 && project[0].clientId) {
          await db.insert(notifications).values({
            userId: project[0].clientId,
            title: "Nuevo Mensaje en Requerimiento",
            message: `Nuevo comentario en el requerimiento: ${subject || "Sin asunto"}`,
            type: "info",
            link: `/${params.workspace}/dashboard/projects/${projectId}?requirementId=${requirementId}`
          });
        }
      }
      return { success: true };
    } catch (err) {
      console.error("Error adding requirement comment:", err);
      return fail(500, { message: "Failed to add requirement comment" });
    }
  },
  addProposalComment: async ({ request, params }) => {
    const formData = await request.formData();
    const proposalId = Number(formData.get("proposalId"));
    const content = formData.get("content");
    const subject = formData.get("subject");
    const uploadedFiles = [];
    const files = formData.getAll("files");
    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const url = await uploadFile(file, "proposals");
        uploadedFiles.push({
          name: file.name,
          url,
          type: file.type
        });
      }
    }
    if (!proposalId || !content) {
      return fail(400, { message: "Proposal ID and Content are required" });
    }
    const authorName = "Admin";
    try {
      await db.insert(proposalComments).values({
        proposalId,
        authorName,
        subject,
        content,
        files: uploadedFiles
      });
      const proposalData = await db.select({ projectId: proposals.projectId }).from(proposals).where(eq(proposals.id, proposalId)).limit(1);
      if (proposalData.length > 0 && proposalData[0].projectId) {
        const projectId = proposalData[0].projectId;
        const project = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).limit(1);
        if (project.length > 0 && project[0].clientId) {
          await db.insert(notifications).values({
            userId: project[0].clientId,
            title: "Nuevo Mensaje en Propuesta",
            message: `Nuevo comentario en la propuesta: ${subject || "Sin asunto"}`,
            type: "info",
            link: `/${params.workspace}/dashboard/projects/${projectId}?proposalId=${proposalId}`
          });
        }
      }
      return { success: true };
    } catch (err) {
      console.error("Error adding proposal comment:", err);
      return fail(500, { message: "Failed to add proposal comment" });
    }
  }
};
export {
  actions,
  load
};
