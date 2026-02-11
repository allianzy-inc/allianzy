// @ts-nocheck
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { intakeCases } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load = async ({ params, locals, cookies }: Parameters<PageServerLoad>[0]) => {
    const workspace = params.workspace;
    const caseId = Number(params.caseId);

    if (Number.isNaN(caseId)) {
        throw error(400, 'Invalid case id');
    }

    const anonymousToken = cookies.get('intake_token');

    const conditions = [eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace)];
    if (!locals.user) {
        if (!anonymousToken) {
            throw error(403, 'Not allowed');
        }
        conditions.push(eq(intakeCases.anonymousToken, anonymousToken));
    }

    const intakeCase = await db.query.intakeCases.findFirst({
        where: and(...conditions)
    });

    if (!intakeCase) {
        throw error(404, 'Case not found');
    }

    const status = intakeCase.status ?? 'draft';

    const beltrixBase = (env.BELTRIX_AGENCY_URL ?? '').replace(/\/$/, '');

    return {
        workspace,
        caseId: intakeCase.id,
        status,
        score: intakeCase.score,
        answers: intakeCase.answersJson,
        hasSession: Boolean(locals.user),
        beltrixAgencyUrl: beltrixBase || null
    };
};

