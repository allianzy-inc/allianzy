import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, workspaces, userCompanies } from '$lib/server/schema';
import { eq, ilike, and } from 'drizzle-orm';
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

        let user;

        if (existingUser.length > 0) {
            user = existingUser[0];
        } else {
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
            
            user = newUser[0];
        }

        // Activate any pending company memberships when user logs in/syncs.
        // This ensures invited users are automatically enabled upon accepting the invite (signing up/in).
        await db.update(userCompanies)
            .set({ status: 'active' })
            .where(and(
                eq(userCompanies.userId, user.id),
                eq(userCompanies.status, 'pending')
            ));

        return json({ success: true, user });

    } catch (error) {
        console.error('Error syncing user:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
