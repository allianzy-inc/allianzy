import { d as db, q as proposalComments, t as requirementComments, v as requestComments, x as caseComments, f as cases, u as users, a as userCompanies } from "../../../../../../chunks/db.js";
import { u as uploadFile, a as getSignedUrlForFile } from "../../../../../../chunks/storage.js";
import { sql, eq, asc } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
const load = async ({ params, url }) => {
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
      authorRole: users.role,
      companyRole: sql`(SELECT role FROM ${userCompanies} WHERE ${userCompanies.userId} = ${users.id} LIMIT 1)`,
      files: requestComments.files
    }).from(requestComments).leftJoin(users, eq(requestComments.userId, users.id)).where(eq(requestComments.requestId, Number(selectedRequestId))).orderBy(asc(requestComments.createdAt));
    selectedRequestComments = rawComments.map((c) => {
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
      authorRole: users.role,
      companyRole: sql`(SELECT role FROM ${userCompanies} WHERE ${userCompanies.userId} = ${users.id} LIMIT 1)`,
      files: requirementComments.files
    }).from(requirementComments).leftJoin(users, eq(requirementComments.userId, users.id)).where(eq(requirementComments.requirementId, Number(selectedRequirementId))).orderBy(asc(requirementComments.createdAt));
    selectedRequirementComments = rawComments.map((c) => {
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
      authorRole: users.role,
      companyRole: sql`(SELECT role FROM ${userCompanies} WHERE ${userCompanies.userId} = ${users.id} LIMIT 1)`,
      files: proposalComments.files
    }).from(proposalComments).leftJoin(users, eq(proposalComments.userId, users.id)).where(eq(proposalComments.proposalId, Number(selectedProposalId))).orderBy(asc(proposalComments.createdAt));
    selectedProposalComments = rawComments.map((c) => {
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
  return {
    selectedCaseComments,
    selectedRequestComments,
    selectedRequirementComments,
    selectedProposalComments
  };
};
const actions = {
  // Case Actions (Allowed for Client)
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
      await db.insert(cases).values({
        projectId,
        title,
        description,
        content: description,
        // Mapping description to content as required by schema
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
  },
  addRequestComment: async ({ request, locals }) => {
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
    const authorName = locals.user ? `${locals.user.firstName} ${locals.user.lastName}` : "Client";
    const userId = locals.user ? parseInt(locals.user.id) : null;
    try {
      await db.insert(requestComments).values({
        requestId,
        userId,
        authorName,
        subject,
        content,
        files: uploadedFiles
      });
      return { success: true };
    } catch (err) {
      console.error("Error adding request comment:", err);
      return fail(500, { message: "Failed to add request comment" });
    }
  },
  addRequirementComment: async ({ request, locals }) => {
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
    const authorName = locals.user ? `${locals.user.firstName} ${locals.user.lastName}` : "Client";
    const userId = locals.user ? parseInt(locals.user.id) : null;
    try {
      await db.insert(requirementComments).values({
        requirementId,
        userId,
        authorName,
        subject,
        content,
        files: uploadedFiles
      });
      return { success: true };
    } catch (err) {
      console.error("Error adding requirement comment:", err);
      return fail(500, { message: "Failed to add requirement comment" });
    }
  },
  addProposalComment: async ({ request, locals }) => {
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
    const authorName = locals.user ? `${locals.user.firstName} ${locals.user.lastName}` : "Client";
    const userId = locals.user ? parseInt(locals.user.id) : null;
    try {
      await db.insert(proposalComments).values({
        proposalId,
        userId,
        authorName,
        subject,
        content,
        files: uploadedFiles
      });
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
