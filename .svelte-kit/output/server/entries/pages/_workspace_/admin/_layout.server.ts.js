import { d as db, n as notifications } from "../../../../chunks/db.js";
import { eq, desc } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.user?.id) {
    return { notifications: [] };
  }
  const userNotifications = await db.select().from(notifications).where(eq(notifications.userId, parseInt(locals.user.id))).orderBy(desc(notifications.createdAt));
  return { notifications: userNotifications };
};
export {
  load
};
