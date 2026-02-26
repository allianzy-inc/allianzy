import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as providerConfigRepo from '$lib/server/billing-domain/provider-config.repository';

/** GET: listado de proveedores de pago habilitados (para tabs/selector en facturación). */
export const GET: RequestHandler = async () => {
	const configs = await providerConfigRepo.findAllProviderConfigs(true);
	return json({
		providers: configs.map((c) => ({
			code: c.code,
			label: c.label,
			isAutomatic: c.isAutomatic
		}))
	});
};
