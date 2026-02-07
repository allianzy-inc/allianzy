import { redirect, type Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users, userCompanies } from '$lib/server/schema';
import { ilike, eq, and } from 'drizzle-orm';
import { getSignedUrlForFile } from '$lib/server/storage';

const DOMAIN_MAP: Record<string, string> = {
    'allianzy.com': 'allianzy',
    'www.allianzy.com': 'allianzy',
    'beltrix.agency': 'beltrix',
    'www.beltrix.agency': 'beltrix'
};

const VALID_WORKSPACES = ['allianzy', 'beltrix'];

export const handle: Handle = async ({ event, resolve }) => {
    console.log(`[HOOKS] Request: ${event.request.method} ${event.url.pathname}`);
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

    // 3. Authentication
    const sessionData = await validateSession(event.request);
    
    if (sessionData && sessionData.user) {
        // Fetch local user details
        const localUser = await db.query.users.findFirst({
            where: ilike(users.email, sessionData.user.email)
        });

        if (localUser) {
            const avatarUrl = await getSignedUrlForFile(localUser.avatarUrl, event.locals.allowedWorkspace);
            
            // Fetch primary company
            let primaryCompanyLink = await db.query.userCompanies.findFirst({
                where: and(
                    eq(userCompanies.userId, localUser.id),
                    eq(userCompanies.isPrimary, true)
                ),
                with: {
                    company: true
                }
            });

            // Fallback: If no primary, take the first one available
            if (!primaryCompanyLink) {
                primaryCompanyLink = await db.query.userCompanies.findFirst({
                    where: eq(userCompanies.userId, localUser.id),
                    with: {
                        company: true
                    }
                });
            }

            event.locals.user = {
                id: localUser.id.toString(),
                email: localUser.email,
                firstName: localUser.firstName || '',
                lastName: localUser.lastName || '',
                role: localUser.role || 'client',
                image: avatarUrl || '',
                companyId: primaryCompanyLink?.companyId || undefined,
                companyName: primaryCompanyLink?.company?.name
            };
        }
    }

    // 4. RBAC Placeholder (To be fully implemented with Server Auth)
    // If we had event.locals.user populated, we would check roles here.
    // Example:
    /*
    if (event.url.pathname.includes('/admin') && event.locals.user?.role !== 'admin') {
        throw redirect(303, `/${allowedWorkspace}/dashboard`);
    }
    */

    const response = await resolve(event);

    // Prevent caching of the HTML document to avoid version mismatch issues
    if (event.url.pathname.startsWith('/') && !event.url.pathname.includes('.')) {
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
    }

    return response;
};
