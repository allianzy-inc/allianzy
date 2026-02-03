import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || env.VITE_NEON_AUTH_URL || process.env.VITE_NEON_AUTH_URL;

async function proxy(request: Request, path: string) {
    if (!AUTH_URL) {
        return new Response('Auth URL not configured', { status: 500 });
    }

    // Handle query parameters
    const url = new URL(request.url);
    const search = url.search;
    const baseUrl = AUTH_URL.replace(/\/$/, '');
    const targetUrl = `${baseUrl}/${path}${search}`;
    
    console.log('[Auth Proxy]', request.method, path, '->', targetUrl);

    const headers = new Headers(request.headers);
    
    // Remove headers that might cause issues
    headers.delete('host');
    headers.delete('connection');
    // headers.delete('origin'); // Keep origin if possible, or set to AUTH_URL origin?
    // Better Auth might require Origin to match the allowed origins.
    // If we proxy, the Origin is localhost. If Neon Auth accepts localhost, good.
    // If not, we might need to spoof Origin, but that might break CORS on return.
    // Let's try forwarding first.

    const body = request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined;

    try {
        const response = await fetch(targetUrl, {
            method: request.method,
            headers,
            body,
            redirect: 'manual'
        });

        const responseHeaders = new Headers(response.headers);

        // Rewrite Set-Cookie to remove Domain attribute so it works on localhost
        const setCookie = responseHeaders.get('set-cookie');
        if (setCookie) {
            // Remove "Domain=...;" or "Domain=..."
            // Also ensure Secure is not preventing set on localhost (it shouldn't)
            let newSetCookie = setCookie.replace(/Domain=[^;]+;?/gi, '');
            
            // Also replace Path if it's restricted (e.g. Path=/allianzy/auth) to Path=/
            // This ensures the cookie is available for the whole app
            newSetCookie = newSetCookie.replace(/Path=[^;]+;?/gi, 'Path=/;');
            
            responseHeaders.set('set-cookie', newSetCookie);
        }

        // Add CORS headers if needed (though we are same-origin now)
        // responseHeaders.set('Access-Control-Allow-Origin', url.origin);
        // responseHeaders.set('Access-Control-Allow-Credentials', 'true');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
        });
    } catch (error) {
        console.error('Auth proxy error:', error);
        return new Response('Auth proxy error', { status: 502 });
    }
}

export const GET: RequestHandler = ({ request, params }) => proxy(request, params.path);
export const POST: RequestHandler = ({ request, params }) => proxy(request, params.path);
