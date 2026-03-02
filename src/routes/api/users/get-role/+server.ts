import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq, ilike } from 'drizzle-orm';
import type { RequestHandler } from './$types';

/** Solo usuarios autenticados; cada uno puede consultar su propio rol o un admin puede consultar cualquier email. */
export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        if (!locals.user?.email) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const email = typeof body?.email === 'string' ? body.email.trim() : '';

        if (!email) {
            return json({ error: 'Email is required' }, { status: 400 });
        }

        const isAdmin = String(locals.user.role ?? '').toLowerCase() === 'admin';
        const isOwnEmail = email.toLowerCase() === locals.user.email.toLowerCase();

        if (!isAdmin && !isOwnEmail) {
            return json({ error: 'Forbidden' }, { status: 403 });
        }

        const [user] = await db.select({ role: users.role }).from(users).where(ilike(users.email, email)).limit(1);

        if (!user) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        return json({ role: user.role });
    } catch (error) {
        console.error('Error fetching user role:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};