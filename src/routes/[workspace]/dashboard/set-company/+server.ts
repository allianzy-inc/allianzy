import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userCompanies } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

const COOKIE_NAME = 'selected_company_id';
const COOKIE_OPTIONS = { path: '/', httpOnly: true, sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 365 };

export const POST: RequestHandler = async ({ request, cookies, locals, params, url }) => {
    if (!locals.user?.id) {
        throw redirect(303, `/${params.workspace}/auth/login`);
    }
    const formData = await request.formData();
    const companyIdRaw = formData.get('companyId');
    const companyId = companyIdRaw != null ? parseInt(String(companyIdRaw), 10) : NaN;
    if (isNaN(companyId)) {
        cookies.delete(COOKIE_NAME, COOKIE_OPTIONS);
        throw redirect(303, url.searchParams.get('redirect') || `/${params.workspace}/dashboard`);
    }
    const userId = parseInt(locals.user.id);
    const link = await db.query.userCompanies.findFirst({
        where: and(
            eq(userCompanies.userId, userId),
            eq(userCompanies.companyId, companyId),
            eq(userCompanies.status, 'active')
        )
    });
    if (!link) {
        cookies.delete(COOKIE_NAME, COOKIE_OPTIONS);
        throw redirect(303, url.searchParams.get('redirect') || `/${params.workspace}/dashboard`);
    }
    cookies.set(COOKIE_NAME, String(companyId), COOKIE_OPTIONS);
    throw redirect(303, url.searchParams.get('redirect') || `/${params.workspace}/dashboard`);
};
