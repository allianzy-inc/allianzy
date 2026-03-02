import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { notifications } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals, params }) => {
    if (!locals.user?.id) {
        throw redirect(303, `/${params.workspace}/auth/login`);
    }
    if (String(locals.user.role ?? '').toLowerCase() !== 'admin') {
        throw redirect(303, `/${params.workspace}/dashboard`);
    }
    const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, parseInt(locals.user.id)))
        .orderBy(desc(notifications.createdAt));
    return { notifications: userNotifications };
};
