import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as providerConfigRepo from '$lib/server/billing-domain/provider-config.repository';

function isAdmin(event: { locals: { user?: { role?: string } } }) {
	return String(event.locals.user?.role ?? '').toLowerCase() === 'admin';
}

/** GET: listado completo de configuración de proveedores (solo admin). */
export const GET: RequestHandler = async (event) => {
	if (!isAdmin(event)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const configs = await providerConfigRepo.findAllProviderConfigs(false);
	return json({ configs });
};

type DetailItem = { label: string; value: string };

/** POST: crear o actualizar proveedor. Crear: code + label. Actualizar: code + label/displayOrder/enabled/details. Solo admin. */
export const POST: RequestHandler = async (event) => {
	if (!isAdmin(event)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	let body: {
		code: string;
		label?: string;
		displayOrder?: number;
		enabled?: boolean;
		details?: DetailItem[];
	};
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
	const codeInput = body.code?.trim();
	const label = body.label?.trim();
	const code = codeInput ? slugify(codeInput) : (label ? slugify(label) : '');
	if (!code) {
		return json({ error: 'code o label requerido' }, { status: 400 });
	}
	const details = Array.isArray(body.details)
		? body.details
				.filter((d) => d && typeof d.label === 'string' && typeof d.value === 'string')
				.map((d) => ({ label: String(d.label).trim(), value: String(d.value).trim() }))
		: undefined;
	const existing = await providerConfigRepo.findProviderConfigByCode(code);
	if (existing) {
		const updated = await providerConfigRepo.updateProviderConfig(code, {
			...(label != null && label !== '' && { label }),
			displayOrder: body.displayOrder,
			enabled: body.enabled,
			...(details !== undefined && { details })
		});
		return json({ ok: true, config: updated });
	}
	if (!label) {
		return json({ error: 'label requerido para crear' }, { status: 400 });
	}
	const created = await providerConfigRepo.createProviderConfig({
		code,
		label,
		displayOrder: body.displayOrder,
		details: details ?? []
	});
	return json({ ok: true, config: created });
};

/** DELETE: eliminar método de pago. No se puede eliminar Stripe. Solo admin. */
export const DELETE: RequestHandler = async (event) => {
	if (!isAdmin(event)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const code = event.url.searchParams.get('code')?.trim();
	if (!code) {
		return json({ error: 'code requerido (query param)' }, { status: 400 });
	}
	if (code === 'stripe') {
		return json({ error: 'No se puede eliminar Stripe' }, { status: 400 });
	}
	const deleted = await providerConfigRepo.deleteProviderConfig(code);
	if (!deleted) {
		return json({ error: 'Proveedor no encontrado' }, { status: 404 });
	}
	return json({ ok: true });
};

function slugify(s: string): string {
	return s
		.toLowerCase()
		.replace(/\s+/g, '_')
		.replace(/[^a-z0-9_-]/g, '')
		.slice(0, 64) || '';
}
