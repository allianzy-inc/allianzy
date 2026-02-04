import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
    const authUrl = import.meta.env.VITE_NEON_AUTH_URL || env.VITE_NEON_AUTH_URL || process.env.VITE_NEON_AUTH_URL;
    
    return new Response(JSON.stringify({
        vite_env: !!import.meta.env.VITE_NEON_AUTH_URL ? 'Set' : 'Unset',
        process_env: !!process.env.VITE_NEON_AUTH_URL ? 'Set' : 'Unset',
        dynamic_env: !!env.VITE_NEON_AUTH_URL ? 'Set' : 'Unset',
        auth_url_prefix: authUrl ? authUrl.substring(0, 8) + '...' : 'None'
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
};
