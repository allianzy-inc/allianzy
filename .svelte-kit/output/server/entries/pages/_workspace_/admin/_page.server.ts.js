import { d as db, n as notifications, a as userCompanies } from "../../../../chunks/db.js";
import { and, eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
const actions = {
  archiveNotification: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id || !locals.user) return fail(400, { message: "ID is required" });
    try {
      await db.update(notifications).set({ archived: true }).where(and(eq(notifications.id, id), eq(notifications.userId, parseInt(locals.user.id))));
      return { success: true };
    } catch (err) {
      console.error("Error archiving notification:", err);
      return fail(500, { message: "Failed to archive notification" });
    }
  },
  markNotificationRead: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id || !locals.user) return fail(400, { message: "ID is required" });
    try {
      await db.update(notifications).set({ read: true }).where(and(eq(notifications.id, id), eq(notifications.userId, parseInt(locals.user.id))));
      return { success: true };
    } catch (err) {
      console.error("Error marking notification as read:", err);
      return fail(500, { message: "Failed to mark as read" });
    }
  },
  deleteNotification: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id || !locals.user) return fail(400, { message: "ID is required" });
    try {
      const [notification] = await db.select().from(notifications).where(and(eq(notifications.id, id), eq(notifications.userId, parseInt(locals.user.id)))).limit(1);
      if (!notification) return fail(404, { message: "Notification not found" });
      if (!notification.archived) return fail(400, { message: "Only archived notifications can be deleted" });
      await db.delete(notifications).where(and(eq(notifications.id, id), eq(notifications.userId, parseInt(locals.user.id))));
      return { success: true };
    } catch (err) {
      console.error("Error deleting notification:", err);
      return fail(500, { message: "Failed to delete notification" });
    }
  },
  acceptInvitation: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id || !locals.user) return fail(400, { message: "ID is required" });
    try {
      const [notification] = await db.select().from(notifications).where(and(eq(notifications.id, id), eq(notifications.userId, parseInt(locals.user.id)))).limit(1);
      if (!notification || notification.type !== "invitation") return fail(404, { message: "Invitation not found" });
      const metadata = notification.metadata;
      if (!metadata?.companyId) return fail(400, { message: "Invalid invitation data" });
      await db.update(userCompanies).set({ status: "active" }).where(and(eq(userCompanies.userId, parseInt(locals.user.id)), eq(userCompanies.companyId, metadata.companyId)));
      await db.update(notifications).set({ read: true, archived: true, title: "Invitation Accepted", message: `You have joined ${metadata.companyName}.`, type: "success" }).where(eq(notifications.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error accepting invitation:", err);
      return fail(500, { message: "Failed to accept invitation" });
    }
  },
  rejectInvitation: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    if (!id || !locals.user) return fail(400, { message: "ID is required" });
    try {
      const [notification] = await db.select().from(notifications).where(and(eq(notifications.id, id), eq(notifications.userId, parseInt(locals.user.id)))).limit(1);
      if (!notification || notification.type !== "invitation") return fail(404, { message: "Invitation not found" });
      const metadata = notification.metadata;
      if (!metadata?.companyId) return fail(400, { message: "Invalid invitation data" });
      await db.update(userCompanies).set({ status: "rejected" }).where(and(eq(userCompanies.userId, parseInt(locals.user.id)), eq(userCompanies.companyId, metadata.companyId)));
      await db.update(notifications).set({ read: true, archived: true, title: "Invitation Rejected", message: `You rejected the invitation to join ${metadata.companyName}.`, type: "warning" }).where(eq(notifications.id, id));
      return { success: true };
    } catch (err) {
      console.error("Error rejecting invitation:", err);
      return fail(500, { message: "Failed to reject invitation" });
    }
  }
};
export {
  actions
};
