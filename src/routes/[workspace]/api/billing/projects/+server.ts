import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/** GET: lista de proyectos de la empresa (solo admin). Query: companyId=number. Para vincular facturas Stripe a proyectos. */
export const GET: RequestHandler = async (event) => {
	if (String(event.locals.user?.role ?? '').toLowerCase() !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const companyId = event.url.searchParams.get('companyId');
	const id = companyId != null ? parseInt(companyId, 10) : NaN;
	if (isNaN(id)) return json({ error: 'companyId required' }, { status: 400 });

	const rows = await db
		.select({ id: projects.id, name: projects.name })
		.from(projects)
		.where(eq(projects.companyId, id))
		.orderBy(projects.name);

	return json({ projects: rows });
};
