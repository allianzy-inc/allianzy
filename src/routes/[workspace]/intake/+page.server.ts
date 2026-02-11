import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { intakeCases } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

type HelpType =
    | 'sistemas_plataforma'
    | 'automatizacion_integraciones'
    | 'escalabilidad_control'
    | 'diagnostico_estrategico'
    | 'marketing_diseno_web';

type ImpactType =
    | 'perdida_tiempo'
    | 'costos'
    | 'falta_control'
    | 'riesgo'
    | 'crecimiento_bloqueado';

type PeopleRange = '1_3' | '4_10' | '10_50' | '50_plus';

type Urgency = 'exploratorio' | 'proximos_3_meses' | 'inmediato';

type PriorAttempt =
    | 'nada'
    | 'ajustes_internos'
    | 'software_externo'
    | 'desarrollo_a_medida'
    | 'consultoria_previa';

type CurrentStack =
    | 'whatsapp_email'
    | 'sheets_excel'
    | 'software_generico'
    | 'sistema_propio'
    | 'sin_proceso_formal';

type FinalDecisor = 'yo' | 'direccion' | 'socios' | 'otro';

export const load: PageServerLoad = async ({ params, url, locals }) => {
    const workspace = params.workspace;
    const caseIdParam = url.searchParams.get('caseId');

    if (!caseIdParam) {
        // New intake, show step 1
        return {
            workspace,
            step: 1,
            existingCase: null
        };
    }

    const caseId = Number(caseIdParam);
    if (Number.isNaN(caseId)) {
        throw error(400, 'Invalid case id');
    }

    // SECURITY: if user is logged in, we allow access to any case in this workspace.
    // If not logged in, we require anonymous token cookie to match.
    const token = locals.user ? null : url.searchParams.get('token');

    const where = [eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace)] as const;

    const intakeCase = await db.query.intakeCases.findFirst({
        where: and(...where)
    });

    if (!intakeCase) {
        throw error(404, 'Case not found');
    }

    return {
        workspace,
        step: 2,
        existingCase: intakeCase,
        // For convenience in the UI
        caseId: intakeCase.id
    };
};

function computeScore(input: {
    helpType: HelpType;
    impact: ImpactType;
    people: PeopleRange;
    urgency: Urgency;
    priorAttempt: PriorAttempt;
    currentStack: CurrentStack;
}): number {
    let score = 0;

    // Help type
    if (
        input.helpType === 'sistemas_plataforma' ||
        input.helpType === 'automatizacion_integraciones' ||
        input.helpType === 'escalabilidad_control'
    ) {
        score += 3;
    } else if (input.helpType === 'diagnostico_estrategico') {
        score += 2;
    }

    // Impact
    switch (input.impact) {
        case 'crecimiento_bloqueado':
            score += 3;
            break;
        case 'riesgo':
            score += 2;
            break;
        case 'falta_control':
            score += 2;
            break;
        case 'costos':
        case 'perdida_tiempo':
            score += 1;
            break;
    }

    // People
    switch (input.people) {
        case '50_plus':
            score += 3;
            break;
        case '10_50':
            score += 2;
            break;
        case '4_10':
            score += 1;
            break;
        case '1_3':
            score += 0;
            break;
    }

    // Urgency
    switch (input.urgency) {
        case 'inmediato':
            score += 2;
            break;
        case 'proximos_3_meses':
            score += 1;
            break;
        case 'exploratorio':
            score += 0;
            break;
    }

    // Prior attempts
    switch (input.priorAttempt) {
        case 'consultoria_previa':
        case 'desarrollo_a_medida':
            score += 2;
            break;
        case 'software_externo':
        case 'ajustes_internos':
            score += 1;
            break;
        case 'nada':
            score += 0;
            break;
    }

    // Current stack
    switch (input.currentStack) {
        case 'sistema_propio':
        case 'software_generico':
            score += 2;
            break;
        case 'sheets_excel':
        case 'whatsapp_email':
            score += 1;
            break;
        case 'sin_proceso_formal':
            score += 0;
            break;
    }

    return score;
}

function computeStatus(score: number, helpType: HelpType): string {
    if (helpType === 'marketing_diseno_web') {
        return 'redirect_beltrix';
    }
    if (score >= 7) return 'qualifies_allianzy';
    if (score >= 4) return 'needs_review';
    return 'closed_no_fit';
}

export const actions: Actions = {
    start: async ({ request, params, cookies }) => {
        const workspace = params.workspace;
        const formData = await request.formData();

        const helpType = formData.get('help_type') as HelpType | null;
        const impact = formData.get('impact') as ImpactType | null;
        const people = formData.get('people') as PeopleRange | null;
        const urgency = formData.get('urgency') as Urgency | null;

        if (!helpType || !impact || !people || !urgency) {
            return fail(400, {
                error: 'Completa todas las preguntas para continuar.',
                values: Object.fromEntries(formData)
            });
        }

        // Early branch to Beltrix
        if (helpType === 'marketing_diseno_web') {
            const anonymousToken = cookies.get('intake_token') ?? randomUUID();

            const [created] = await db
                .insert(intakeCases)
                .values({
                    workspace,
                    status: 'redirect_beltrix',
                    score: null,
                    anonymousToken,
                    answersJson: {
                        preEvaluation: {
                            helpType,
                            impact,
                            people,
                            urgency
                        }
                    }
                })
                .returning();

            cookies.set('intake_token', anonymousToken, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7
            });

            throw redirect(303, `/beltrix/intake?from=${workspace}`);
        }

        const anonymousToken = cookies.get('intake_token') ?? randomUUID();

        const [created] = await db
            .insert(intakeCases)
            .values({
                workspace,
                status: 'draft',
                score: null,
                anonymousToken,
                answersJson: {
                    preEvaluation: {
                        helpType,
                        impact,
                        people,
                        urgency
                    }
                }
            })
            .returning();

        cookies.set('intake_token', anonymousToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7
        });

        throw redirect(303, `/${workspace}/intake?caseId=${created.id}`);
    },

    complete: async ({ request, params, cookies, locals, url }) => {
        const workspace = params.workspace;
        const formData = await request.formData();

        const caseIdRaw = formData.get('case_id');
        const caseId = Number(caseIdRaw);
        if (!caseIdRaw || Number.isNaN(caseId)) {
            return fail(400, { error: 'Caso inválido.' });
        }

        const context = String(formData.get('context') || '').slice(0, 2000);
        const problem = String(formData.get('problem') || '').slice(0, 2000);
        const attempts = formData.get('prior_attempt') as PriorAttempt | null;
        const stack = formData.get('current_stack') as CurrentStack | null;
        const expected = String(formData.get('expected_result') || '').slice(0, 2000);
        const decisor = formData.get('final_decisor') as FinalDecisor | null;

        if (!attempts || !stack || !decisor) {
            return fail(400, {
                error: 'Completa todos los campos obligatorios.',
                values: Object.fromEntries(formData)
            });
        }

        const anonymousToken = cookies.get('intake_token');

        const conditions = [eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace)];
        if (!locals.user) {
            if (!anonymousToken) {
                throw error(403, 'Not allowed');
            }
            conditions.push(eq(intakeCases.anonymousToken, anonymousToken));
        }

        const existing = await db.query.intakeCases.findFirst({
            where: and(...conditions)
        });

        if (!existing) {
            throw error(404, 'Case not found');
        }

        const answers = existing.answersJson ?? {};
        const pre = (answers as any).preEvaluation ?? {};
        const helpType = pre.helpType as HelpType | undefined;
        const impact = pre.impact as ImpactType | undefined;
        const people = pre.people as PeopleRange | undefined;
        const urgency = pre.urgency as Urgency | undefined;

        if (!helpType || !impact || !people || !urgency) {
            throw error(400, 'Pre-evaluation incomplete.');
        }

        const score = computeScore({
            helpType,
            impact,
            people,
            urgency,
            priorAttempt: attempts,
            currentStack: stack
        });
        const status = computeStatus(score, helpType);

        const updatedAnswers = {
            ...answers,
            preEvaluation: pre,
            guidedEvaluation: {
                context,
                problem,
                priorAttempt: attempts,
                currentStack: stack,
                expectedResult: expected,
                finalDecisor: decisor
            }
        };

        await db
            .update(intakeCases)
            .set({
                answersJson: updatedAnswers,
                score,
                status,
                updatedAt: new Date()
            })
            .where(and(eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace)));

        throw redirect(303, `/${workspace}/intake/result/${caseId}`);
    }
};

