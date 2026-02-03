// @ts-nocheck

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals, url, params }: Parameters<LayoutServerLoad>[0]) => {
    console.log(`[DASHBOARD-LAYOUT] User: ${locals.user?.email} (${locals.user?.role}) trying to access ${url.pathname}`);
    
    // Non-blocking return. If user is undefined, the UI will handle it (or show empty state).
    // This allows the page to load even if server-side session validation is flaky in dev.
    return {
        user: locals.user
    };
};
