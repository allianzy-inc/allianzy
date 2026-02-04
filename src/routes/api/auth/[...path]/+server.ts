import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || env.VITE_NEON_AUTH_URL || process.env.VITE_NEON_AUTH_URL;

async function proxy(request: Request, path: string) {
    if (!AUTH_URL) {
        return new Response(JSON.stringify({ message: 'Auth URL not configured on server' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Handle query parameters
    const url = new URL(request.url);
    const search = url.search;
    const baseUrl = AUTH_URL.replace(/\/$/, '');
    const targetUrl = `${baseUrl}/${path}${search}`;
    
    console.log('[Auth Proxy]', request.method, path, '->', targetUrl);

    const headers = new Headers(request.headers);
    
    // Remove headers that might cause issues
    headers.delete('connection');
    // headers.delete('origin'); // Keep origin if possible, or set to AUTH_URL origin?
    // Better Auth might require Origin to match the allowed origins.
    // If we proxy, the Origin is localhost. If Neon Auth accepts localhost, good.
    // If not, we might need to spoof Origin, but that might break CORS on return.
    // Let's try forwarding first.

    const body = request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined;

    const authUrlObj = new URL(AUTH_URL);
    const requestUrl = new URL(request.url);
    const origin = headers.get('origin');
    
    // Normalize Origin for production (www -> root) and localhost
    if (origin) {
        if (origin.startsWith('https://www.')) {
            headers.set('origin', origin.replace('https://www.', 'https://'));
        } else if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            // Spoof Origin for localhost to match Auth Server expectation
            headers.set('origin', authUrlObj.origin);
        }
    } else {
         headers.set('origin', requestUrl.origin);
    }

    const referer = headers.get('referer');
    if (referer && referer.startsWith('https://www.')) {
        headers.set('referer', referer.replace('https://www.', 'https://'));
    }

    headers.set('host', authUrlObj.host);
    headers.set('x-forwarded-host', authUrlObj.host); // Spoof host to match Neon Auth expectation
    headers.set('x-forwarded-proto', 'https'); // Force HTTPS
    // if (requestUrl.port) {
    //     headers.set('x-forwarded-port', requestUrl.port);
    // }
    // headers.set('forwarded', `host=${requestUrl.host};proto=https`);

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

        // Rewrite CORS for localhost
        const requestOrigin = request.headers.get('origin') || requestUrl.origin;
        if (requestOrigin && (requestOrigin.includes('localhost') || requestOrigin.includes('127.0.0.1'))) {
             responseHeaders.set('Access-Control-Allow-Origin', requestOrigin);
             responseHeaders.set('Access-Control-Allow-Credentials', 'true');
        }

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
        });
    } catch (error: any) {
        console.error('Auth proxy error:', error);
        return new Response(JSON.stringify({ 
            message: 'Auth proxy error', 
            details: error?.message || String(error) 
        }), { 
            status: 502,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export const GET: RequestHandler = ({ request, params }) => proxy(request, params.path);
export const POST: RequestHandler = ({ request, params }) => proxy(request, params.path);
