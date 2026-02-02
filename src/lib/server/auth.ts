import { env } from '$env/dynamic/private';

// Try multiple ways to get the env var
const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || env.VITE_NEON_AUTH_URL || process.env.VITE_NEON_AUTH_URL;

export async function validateSession(request: Request) {
    if (!AUTH_URL) {
        console.error('VITE_NEON_AUTH_URL is not defined in process.env or $env/dynamic/public');
        return null;
    }

    try {
        const cookie = request.headers.get('cookie');
        if (!cookie) {
            console.log('Session validation: No cookie found');
            return null;
        }

        console.log('Session validation: Validating against', AUTH_URL);
        const response = await fetch(`${AUTH_URL}/get-session`, {
            headers: {
                cookie
            }
        });

        if (!response.ok) {
            console.log('Session validation: Auth service returned', response.status);
            return null;
        }

        const data = await response.json();
        // console.log('Session validation: Success', data.user?.email);
        return data; // { session: ..., user: ... }
    } catch (error) {
        console.error('Session validation error:', error);
        return null;
    }
}
