import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { notifications } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.user?.id) {
        return { notifications: [] };
    }
    const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, parseInt(locals.user.id)))
        .orderBy(desc(notifications.createdAt));
    return { notifications: userNotifications };
};
