import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { intakeCases, intakeCaseContacts } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';

const ContactSchema = z.object({
    full_name: z.string().min(1, 'Nombre completo requerido'),
    email: z.string().email('Correo electrónico inválido'),
    company: z.string().min(1, 'Empresa requerida'),
    role_title: z.string().optional()
});

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
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

    return {
        workspace,
        caseId: intakeCase.id
    };
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const caseId = Number(params.caseId);
        if (Number.isNaN(caseId)) {
            return fail(400, { error: 'Caso inválido.' });
        }

        const formData = await request.formData();
        const values = Object.fromEntries(formData) as Record<string, string>;

        const parsed = ContactSchema.safeParse(values);
        if (!parsed.success) {
            return fail(400, {
                error: 'Revisá los datos ingresados.',
                fieldErrors: parsed.error.flatten().fieldErrors,
                values
            });
        }

        const { full_name, email, company, role_title } = parsed.data;

        // Gentle warning for free email providers (no bloqueo)
        let emailWarning: string | null = null;
        if (/@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/i.test(email)) {
            emailWarning =
                'Sugerimos usar un correo corporativo si está disponible, pero procesaremos igualmente tu solicitud.';
        }

        await db.insert(intakeCaseContacts).values({
            caseId,
            fullName: full_name,
            email,
            company,
            roleTitle: role_title || null
        });

        await db
            .update(intakeCases)
            .set({
                status: 'pending_contact',
                updatedAt: new Date()
            })
            .where(eq(intakeCases.id, caseId));

        return {
            success: true,
            emailWarning
        };
    }
};

