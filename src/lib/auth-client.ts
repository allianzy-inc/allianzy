import { createAuthClient } from 'better-auth/client';
import { browser } from '$app/environment';

export const authClient = createAuthClient({
    baseURL: browser ? `${window.location.origin}/api/auth` : import.meta.env.VITE_NEON_AUTH_URL
});
