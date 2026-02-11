// @ts-nocheck
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { intakeCases } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
    const workspace = params.workspace;

    const cases = await db
        .select()
        .from(intakeCases)
        .where(eq(intakeCases.workspace, workspace))
        .orderBy(intakeCases.createdAt);

    return {
        workspace,
        intakeCases: cases
    };
};

