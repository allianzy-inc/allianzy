
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, params }) => {
    console.log(`[DASHBOARD-LAYOUT] User: ${locals.user?.email} (${locals.user?.role}) trying to access ${url.pathname}`);
    
    if (!locals.user) {
        throw redirect(303, `/${params.workspace}/auth/login`);
    }

    return {
        user: locals.user
    };
};
