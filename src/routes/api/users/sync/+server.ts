import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, workspaces } from '$lib/server/schema';
import { eq, ilike } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, name, role, workspaceSlug } = await request.json();

        if (!email) {
            return json({ error: 'Email is required' }, { status: 400 });
        }
        
        const cleanEmail = email.trim().toLowerCase();

        // Find or create workspace if slug provided
        let workspaceId = null;
        if (workspaceSlug) {
            const existingWorkspace = await db.select().from(workspaces).where(eq(workspaces.slug, workspaceSlug)).limit(1);
            
            if (existingWorkspace.length > 0) {
                workspaceId = existingWorkspace[0].id;
            } else {
                // Auto-create workspace for now (dev convenience)
                const newWorkspace = await db.insert(workspaces).values({
                    name: workspaceSlug === 'allianzy' ? 'Allianzy Inc.' : workspaceSlug === 'beltix' ? 'Beltix Agency' : workspaceSlug,
                    slug: workspaceSlug
                }).returning();
                workspaceId = newWorkspace[0].id;
            }
        }

        // Check if user already exists (case-insensitive)
        const existingUser = await db.select().from(users).where(ilike(users.email, cleanEmail)).limit(1);

        if (existingUser.length > 0) {
            // User exists
            return json({ success: true, message: 'User already exists', user: existingUser[0] });
        }

        // Create new user (ensure email is lowercase)
        const parts = (name || '').trim().split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';

        const newUser = await db.insert(users).values({
            email: cleanEmail,
            firstName,
            lastName,
            role: role || 'client',
            workspaceId: workspaceId
        }).returning();

        return json({ success: true, user: newUser[0] });

    } catch (error) {
        console.error('Error syncing user:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
