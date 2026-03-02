import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

/** Solo disponible fuera de producción para evitar filtración de información de configuración. */
export const GET: RequestHandler = async () => {
    if (env.NODE_ENV === 'production') {
        return json({ error: 'Not Found' }, { status: 404 });
    }
    const authUrl = import.meta.env.VITE_NEON_AUTH_URL || env.VITE_NEON_AUTH_URL || process.env.VITE_NEON_AUTH_URL;
    return json({
        vite_env: !!import.meta.env.VITE_NEON_AUTH_URL ? 'Set' : 'Unset',
        process_env: !!process.env.VITE_NEON_AUTH_URL ? 'Set' : 'Unset',
        dynamic_env: !!env.VITE_NEON_AUTH_URL ? 'Set' : 'Unset',
        auth_url_prefix: authUrl ? authUrl.substring(0, 8) + '...' : 'None'
    });
};
