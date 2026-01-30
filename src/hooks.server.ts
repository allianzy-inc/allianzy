import { redirect, type Handle } from '@sveltejs/kit';

const DOMAIN_MAP: Record<string, string> = {
    'allianzy.com': 'allianzy',
    'www.allianzy.com': 'allianzy',
    'beltrix.agency': 'beltrix',
    'www.beltrix.agency': 'beltrix'
};

const VALID_WORKSPACES = ['allianzy', 'beltrix'];

export const handle: Handle = async ({ event, resolve }) => {
    const host = event.request.headers.get('host') || '';
    
    // 1. Determine Allowed Workspace based on Domain
    // Default to 'allianzy' for unknown domains in dev, or strict in prod
    let allowedWorkspace = DOMAIN_MAP[host];
    
    // Fallback for localhost development: Allow dynamic workspace switching based on URL
    if (!allowedWorkspace && (host.includes('localhost') || host.includes('127.0.0.1'))) {
        const pathSegments = event.url.pathname.split('/').filter(Boolean);
        const requestedWorkspace = pathSegments[0];
        
        if (requestedWorkspace && VALID_WORKSPACES.includes(requestedWorkspace)) {
            allowedWorkspace = requestedWorkspace;
        } else {
            allowedWorkspace = 'allianzy'; // Default fallback
        }
    }

    if (allowedWorkspace) {
        event.locals.allowedWorkspace = allowedWorkspace;

        // 2. Domain Isolation Logic
        const pathSegments = event.url.pathname.split('/').filter(Boolean);
        const requestedWorkspace = pathSegments[0];

        // NOTE: Redirection for root '/' is now handled by src/hooks.ts (reroute)
        // effectively mapping '/' to '/[workspace]' internally without 307 redirect.

        // Check if user is trying to access a workspace route
        if (requestedWorkspace && VALID_WORKSPACES.includes(requestedWorkspace)) {
            // Strict check: Is this workspace allowed on this domain?
            if (requestedWorkspace !== allowedWorkspace) {
                // Mismatch detected (e.g. accessing /allianzy on beltrix.agency)
                // Redirect to the correct workspace root (which looks like / to the user)
                // or just 404. Let's redirect to root of the domain.
                throw redirect(307, '/');
            }
        }
    }

    // 3. RBAC Placeholder (To be fully implemented with Server Auth)
    // If we had event.locals.user populated, we would check roles here.
    // Example:
    /*
    if (event.url.pathname.includes('/admin') && event.locals.user?.role !== 'admin') {
        throw redirect(303, `/${allowedWorkspace}/dashboard`);
    }
    */

    const response = await resolve(event);
    return response;
};
