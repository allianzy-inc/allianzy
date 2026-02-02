// @ts-nocheck
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import type { PageServerLoad } from './$types';

export const load = async () => {
    try {
        const allUsers = await db.select().from(users);
        
        // Add default status since it's not in the schema yet, or handle it in UI
        const usersWithStatus = allUsers.map(user => ({
            ...user,
            status: 'Active' // Placeholder until we have a status field
        }));

        return {
            users: usersWithStatus
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        return {
            users: []
        };
    }
};;null as any as PageServerLoad;