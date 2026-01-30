import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email) {
            return json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (user.length === 0) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        return json({ role: user[0].role });

    } catch (error) {
        console.error('Error fetching user role:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};