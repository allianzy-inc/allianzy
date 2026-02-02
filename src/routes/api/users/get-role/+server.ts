import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq, ilike } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email) {
            console.error('get-role: Email is required');
            return json({ error: 'Email is required' }, { status: 400 });
        }

        const cleanEmail = email.trim();
        console.log(`get-role: Searching for '${cleanEmail}' (Length: ${cleanEmail.length})`);

        // Case-insensitive search using ilike
        const user = await db.select().from(users).where(ilike(users.email, cleanEmail)).limit(1);

        if (user.length === 0) {
            console.error(`get-role: User not found for email '${cleanEmail}'`);
            
            // DEBUG: List all users in DB to find mismatch
            const allUsers = await db.select({ email: users.email, role: users.role }).from(users);
            console.log('DEBUG: Existing users in DB:', JSON.stringify(allUsers, null, 2));

            return json({ 
                error: 'User not found', 
                receivedEmail: cleanEmail,
                receivedLength: cleanEmail.length,
                availableUsers: allUsers 
            }, { status: 404 });
        }

        return json({ role: user[0].role });

    } catch (error) {
        console.error('Error fetching user role:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};