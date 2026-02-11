import { fail, redirect } from "@sveltejs/kit";
import { d as db, n as notifications, a as userCompanies, u as users, p as projects, q as companies } from "../../../../../chunks/db.js";
import { and, eq, inArray } from "drizzle-orm";
import { u as uploadFile, a as getSignedUrlForFile } from "../../../../../chunks/storage.js";
import { Resend } from "resend";
const RESEND_API_KEY = "re_SPeur9fR_2dRTtEnTSMNqmjUannfzjg43";
const resend = new Resend(RESEND_API_KEY);
async function sendEmail({ from = "Allianzy <no-reply@updates.allianzy.us>", to, subject, html, text }) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
const load = async ({ locals, params }) => {
  if (!locals.user) {
    throw redirect(303, "/");
  }
  const companyId = locals.user.companyId;
  let companyData = null;
  let companyUsers = [];
  let companyProjects = [];
  if (companyId) {
    companyData = await db.query.companies.findFirst({
      where: eq(companies.id, companyId)
    });
    if (companyData && companyData.logo) {
      try {
        companyData.logo = await getSignedUrlForFile(companyData.logo, params.workspace);
      } catch (e) {
        console.error("Error signing logo url", e);
      }
    }
    const userLinks = await db.query.userCompanies.findMany({
      where: eq(userCompanies.companyId, companyId),
      with: {
        user: true
      }
    });
    userLinks.map((l) => l.userId).filter((id) => id !== null);
    if (locals.user && locals.user.id) {
      companyProjects = await db.query.projects.findMany({
        where: eq(projects.clientId, parseInt(locals.user.id))
      });
    }
    companyUsers = userLinks.map((link) => ({
      id: link.user?.id,
      firstName: link.user?.firstName,
      lastName: link.user?.lastName,
      email: link.user?.email,
      role: link.role,
      status: link.status,
      avatarUrl: link.user?.avatarUrl,
      permissions: link.permissions
    }));
  }
  return {
    company: companyData,
    companyUsers,
    companyProjects,
    currentUser: locals.user
  };
};
const actions = {
  updateCompany: async ({ request, locals }) => {
    if (!locals.user || !locals.user.companyId) return fail(401, { message: "Unauthorized" });
    const formData = await request.formData();
    const updateData = {};
    const textFields = ["name", "phone", "email", "website", "description"];
    for (const field of textFields) {
      if (formData.has(field)) {
        updateData[field] = formData.get(field);
      }
    }
    const documentsJson = formData.get("documents");
    if (formData.has("documents") && documentsJson) {
      try {
        updateData.documents = JSON.parse(documentsJson);
      } catch (e) {
        console.error("Error parsing documents JSON", e);
      }
    }
    const linksJson = formData.get("links");
    if (formData.has("links") && linksJson) {
      try {
        updateData.links = JSON.parse(linksJson);
      } catch (e) {
        console.error("Error parsing links JSON", e);
      }
    }
    const addressesJson = formData.get("addresses");
    if (formData.has("addresses") && addressesJson) {
      try {
        updateData.addresses = JSON.parse(addressesJson);
      } catch (e) {
        console.error("Error parsing addresses JSON", e);
      }
    }
    const deleteLogo = formData.get("deleteLogo");
    if (deleteLogo === "true") {
      updateData.logo = null;
    }
    const logo = formData.get("logo");
    if (logo && logo.size > 0 && logo.name && logo.name !== "undefined") {
      try {
        const url = await uploadFile(logo, "logos");
        updateData.logo = url;
      } catch (err) {
        console.error("Error uploading logo:", err);
        return fail(500, { message: "Error uploading logo" });
      }
    }
    if (Object.keys(updateData).length === 0) {
      return { success: true, message: "No se detectaron cambios" };
    }
    try {
      await db.update(companies).set(updateData).where(eq(companies.id, locals.user.companyId));
      return { success: true, message: "Guardado correctamente" };
    } catch (err) {
      console.error("Error updating company:", err);
      return fail(500, { message: "Error updating company" });
    }
  },
  saveUser: async ({ request, locals, params }) => {
    if (!locals.user || !locals.user.companyId) return fail(401, { message: "Unauthorized" });
    const formData = await request.formData();
    const userId = formData.get("id");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const status = formData.get("status") || "active";
    const permissionsJson = formData.get("permissions");
    let permissions = {};
    try {
      permissions = JSON.parse(permissionsJson);
    } catch (e) {
      console.error("Error parsing permissions", e);
    }
    if (!email) {
      return fail(400, { message: "Email is required", type: "validation_error" });
    }
    if (userId && (!firstName || !lastName)) {
      return fail(400, { message: "Name fields are required for existing users" });
    }
    const hasValidPermissions = Object.values(permissions).some(
      (perms) => Array.isArray(perms) && perms.length > 0
    );
    if (!hasValidPermissions) {
      return fail(400, { message: "At least one project must have a permission selected", type: "validation_error" });
    }
    let targetUserId = userId ? parseInt(userId) : null;
    if (targetUserId && targetUserId === parseInt(locals.user.id) && status !== "active") {
      return fail(400, { message: "Cannot disable your own account" });
    }
    if (targetUserId) {
      const link = await db.query.userCompanies.findFirst({
        where: (uc, { and: and2, eq: eq2 }) => and2(eq2(uc.userId, targetUserId), eq2(uc.companyId, locals.user.companyId)),
        with: { user: true }
      });
      if (link && link.status !== "active" && targetUserId !== parseInt(locals.user.id)) {
        await db.update(users).set({ firstName, lastName, email }).where(eq(users.id, targetUserId));
      }
      if (link) {
        if (status === "inactive" && link.status !== "inactive") {
          const companyName = locals.user.companyName || "Allianzy";
          await db.insert(notifications).values({
            userId: targetUserId,
            title: "Account Deactivated",
            message: `Your access to ${companyName} has been deactivated.`,
            type: "alert",
            link: null,
            metadata: {
              companyId: locals.user.companyId,
              companyName
            }
          });
          if (link.user && link.user.email) {
            try {
              await sendEmail({
                to: link.user.email,
                subject: `Account Deactivated - ${companyName}`,
                html: `
                                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                        <h2>Account Deactivated</h2>
                                        <p>Hello ${link.user.firstName || "User"},</p>
                                        <p>Your access to <strong>${companyName}</strong> on Allianzy has been deactivated by the administrator.</p>
                                        <p>If you believe this is an error, please contact your company administrator.</p>
                                    </div>
                                `
              });
            } catch (err) {
              console.error("Error sending deactivation email:", err);
            }
          }
        }
        if (status === "active" && (link.status === "inactive" || link.status === "pending")) {
          const companyName = locals.user.companyName || "Allianzy";
          await db.insert(notifications).values({
            userId: targetUserId,
            title: link.status === "pending" ? "Invitation Accepted" : "Account Reactivated",
            message: link.status === "pending" ? `You have been manually activated in ${companyName}.` : `Your access to ${companyName} has been restored.`,
            type: "info",
            link: `/${params.workspace}/dashboard`,
            metadata: {
              companyId: locals.user.companyId,
              companyName
            }
          });
          if (link.user && link.user.email) {
            try {
              await sendEmail({
                to: link.user.email,
                subject: `${link.status === "pending" ? "Account Activated" : "Account Reactivated"} - ${companyName}`,
                html: `
                                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                        <h2>${link.status === "pending" ? "Account Activated" : "Account Reactivated"}</h2>
                                        <p>Hello ${link.user.firstName || "User"},</p>
                                        <p>${link.status === "pending" ? `Your account for <strong>${companyName}</strong> has been manually activated.` : `Your access to <strong>${companyName}</strong> on Allianzy has been restored.`}</p>
                                        <p>You can now access the dashboard and your projects.</p>
                                        <div style="margin: 30px 0;">
                                            <a href="${new URL(request.url).origin}/${params.workspace}/dashboard" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">Go to Dashboard</a>
                                        </div>
                                    </div>
                                `
              });
            } catch (err) {
              console.error("Error sending activation email:", err);
            }
          }
        }
        const oldPermissions = link.permissions;
        const newPermissions = permissions;
        if (JSON.stringify(oldPermissions) !== JSON.stringify(newPermissions)) {
          const companyName = locals.user.companyName || "Allianzy";
          const changedProjectIds = /* @__PURE__ */ new Set();
          for (const [projectId, perms] of Object.entries(newPermissions)) {
            if (!oldPermissions[projectId] || JSON.stringify(oldPermissions[projectId]) !== JSON.stringify(perms)) {
              changedProjectIds.add(projectId);
            }
          }
          for (const projectId of Object.keys(oldPermissions)) {
            if (!newPermissions[projectId]) {
              changedProjectIds.add(projectId);
            }
          }
          if (changedProjectIds.size > 0) {
            const projectList = await db.select({ id: projects.id, name: projects.name }).from(projects).where(inArray(projects.id, Array.from(changedProjectIds).map((id) => parseInt(id))));
            const projectNames = projectList.map((p) => p.name).join(", ");
            await db.insert(notifications).values({
              userId: targetUserId,
              title: "Permissions Updated",
              message: `Your permissions for ${projectNames ? projectNames : "projects"} have been updated.`,
              type: "info",
              link: `/${params.workspace}/dashboard`,
              metadata: {
                companyId: locals.user.companyId,
                companyName
              }
            });
            if (link.user && link.user.email) {
              try {
                await sendEmail({
                  to: link.user.email,
                  subject: `Permissions Updated - ${companyName}`,
                  html: `
                                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                            <h2>Permissions Updated</h2>
                                            <p>Hello ${link.user.firstName || "User"},</p>
                                            <p>Your permissions for <strong>${projectNames ? projectNames : "projects"}</strong> in ${companyName} have been updated by the administrator.</p>
                                            <p>Please check your dashboard to see the changes.</p>
                                            <div style="margin: 30px 0;">
                                                <a href="${new URL(request.url).origin}/${params.workspace}/dashboard" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">Go to Dashboard</a>
                                            </div>
                                        </div>
                                    `
                });
              } catch (err) {
                console.error("Error sending permissions update email:", err);
              }
            }
          }
        }
        await db.update(userCompanies).set({ permissions, status }).where(eq(userCompanies.id, link.id));
      }
    } else {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
      });
      if (existingUser) {
        targetUserId = existingUser.id;
        const link = await db.query.userCompanies.findFirst({
          where: (uc, { and: and2, eq: eq2 }) => and2(eq2(uc.userId, targetUserId), eq2(uc.companyId, locals.user.companyId))
        });
        if (link) {
          await db.update(userCompanies).set({ permissions, status }).where(eq(userCompanies.id, link.id));
        } else {
          await db.insert(userCompanies).values({
            userId: targetUserId,
            companyId: locals.user.companyId,
            role: "member",
            status: "pending",
            permissions
          });
          const companyName = locals.user.companyName || "Allianzy";
          await db.insert(notifications).values({
            userId: targetUserId,
            title: "Invitation Received",
            message: `You have been invited to join ${companyName}.`,
            type: "invitation",
            link: `/${params.workspace}/dashboard`,
            metadata: {
              companyId: locals.user.companyId,
              companyName,
              role: "member"
            }
          });
          try {
            await sendEmail({
              to: email,
              subject: `You have been added to ${companyName}`,
              html: `
                                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                    <h2>Welcome to ${companyName}</h2>
                                    <p>Hello ${existingUser.firstName || "there"},</p>
                                    <p>You have been added to <strong>${companyName}</strong> on Allianzy.</p>
                                    <p>You can now access the workspace dashboard to view your projects.</p>
                                    <div style="margin: 30px 0;">
                                        <a href="${new URL(request.url).origin}/${params.workspace}/dashboard" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">Go to Dashboard</a>
                                    </div>
                                    <p style="color: #666; font-size: 14px;">If you did not expect this email, please ignore it.</p>
                                </div>
                            `
            });
          } catch (err) {
            console.error("Error sending email:", err);
          }
        }
      } else {
        const company = await db.query.companies.findFirst({
          where: eq(companies.id, locals.user.companyId)
        });
        const [newUser] = await db.insert(users).values({
          firstName,
          lastName,
          email,
          role: "staff",
          workspaceId: company?.workspaceId
        }).returning();
        targetUserId = newUser.id;
        await db.insert(userCompanies).values({
          userId: targetUserId,
          companyId: locals.user.companyId,
          role: "member",
          status: "pending",
          permissions
        });
        await db.insert(notifications).values({
          userId: targetUserId,
          title: "Invitation Received",
          message: `You have been invited to join ${locals.user.companyName || "Allianzy"}.`,
          type: "invitation",
          link: `/${params.workspace}/dashboard`,
          metadata: {
            companyId: locals.user.companyId,
            companyName: locals.user.companyName || "Allianzy",
            role: "member"
          }
        });
        const companyName = locals.user.companyName || "Allianzy";
        const inviteLink = `${new URL(request.url).origin}/${params.workspace}/auth/login?mode=register&email=${encodeURIComponent(email)}`;
        try {
          await sendEmail({
            to: email,
            subject: `Invitation to join ${companyName}`,
            html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2>You're invited to join ${companyName}</h2>
                                <p>Hello ${firstName},</p>
                                <p>You have been invited to join <strong>${companyName}</strong> on Allianzy.</p>
                                <p>Please click the button below to create your account and access the workspace.</p>
                                <div style="margin: 30px 0;">
                                    <a href="${inviteLink}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">Accept Invitation</a>
                                </div>
                                <p style="color: #666; font-size: 14px;">If you already have an account, you can log in using the same link.</p>
                            </div>
                        `
          });
        } catch (err) {
          console.error("Error sending invitation email:", err);
        }
      }
    }
    return { success: true, message: "Usuario guardado correctamente" };
  },
  deleteUser: async ({ request, locals }) => {
    if (!locals.user || !locals.user.companyId) return fail(401, { message: "Unauthorized" });
    const formData = await request.formData();
    const userId = formData.get("id");
    if (!userId) {
      return fail(400, { message: "Missing user ID" });
    }
    const targetUserId = parseInt(userId);
    if (targetUserId === parseInt(locals.user.id)) {
      return fail(400, { message: "Cannot delete yourself" });
    }
    const link = await db.query.userCompanies.findFirst({
      where: (uc, { and: and2, eq: eq2 }) => and2(eq2(uc.userId, targetUserId), eq2(uc.companyId, locals.user.companyId)),
      with: { user: true }
    });
    if (!link) {
      return fail(404, { message: "User not found in this company" });
    }
    try {
      const companyName = locals.user.companyName || "Allianzy";
      await db.insert(notifications).values({
        userId: targetUserId,
        title: "Removed from Company",
        message: `You have been removed from ${companyName}.`,
        type: "alert",
        link: null,
        metadata: {
          companyId: locals.user.companyId,
          companyName
        }
      });
      if (link.user && link.user.email) {
        try {
          await sendEmail({
            to: link.user.email,
            subject: `Removed from ${companyName}`,
            html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2>Removed from ${companyName}</h2>
                                <p>Hello ${link.user.firstName || "User"},</p>
                                <p>You have been removed from the company <strong>${companyName}</strong> on Allianzy.</p>
                                <p>You will no longer have access to this company's dashboard and projects.</p>
                                <p>If you believe this is an error, please contact the company administrator.</p>
                            </div>
                        `
          });
        } catch (err) {
          console.error("Error sending removal email:", err);
        }
      }
      await db.delete(userCompanies).where(
        and(
          eq(userCompanies.userId, targetUserId),
          eq(userCompanies.companyId, locals.user.companyId)
        )
      );
      console.log(`[deleteUser] Successfully deleted all links for user ${targetUserId} in company ${locals.user.companyId}`);
      return { success: true, message: "Usuario removido del equipo correctamente" };
    } catch (err) {
      console.error("Error deleting user:", err);
      return fail(500, { message: "Error deleting user" });
    }
  }
};
export {
  actions,
  load
};
