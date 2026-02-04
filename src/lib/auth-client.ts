import { createAuthClient } from 'better-auth/client';
import { browser } from '$app/environment';

const baseURL = browser ? `${window.location.origin}/api/auth` : import.meta.env.VITE_NEON_AUTH_URL;
if (browser) {
    console.log('[Auth Client] Initializing with baseURL:', baseURL);
}

export const authClient = createAuthClient({
    baseURL
});
