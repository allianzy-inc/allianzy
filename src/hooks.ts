export function reroute({ url }) {
    // Map domains to workspaces
    const DOMAIN_MAP: Record<string, string> = {
        'allianzy.com': 'allianzy',
        'www.allianzy.com': 'allianzy',
        'beltrix.agency': 'beltrix',
        'www.beltrix.agency': 'beltrix',
        // Localhost mapping for testing (optional, defaults to allianzy)
        'localhost:5173': 'allianzy',
        '127.0.0.1:5173': 'allianzy'
    };

    const host = url.host;
    const assignedWorkspace = DOMAIN_MAP[host];

    // List of valid workspaces to check against to avoid double-nesting
    const VALID_WORKSPACES = ['allianzy', 'beltrix'];

    if (assignedWorkspace) {
        // If the path already starts with the correct workspace, leave it alone
        // (This happens if internal logic redirects explicitly, or for safety)
        if (url.pathname.startsWith(`/${assignedWorkspace}`)) {
            return url.pathname;
        }

        // EXCLUSION: Do not rewrite /api/* routes
        // This ensures API calls are not prefixed with workspace slug
        if (url.pathname.startsWith('/api')) {
            return url.pathname;
        }

        // Check if the path starts with ANY valid workspace
        // If it starts with a DIFFERENT workspace (e.g. accessing /beltrix on allianzy.com),
        // we might want to let it through to 404, or rewrite it.
        // For now, let's assume we want to rewrite EVERYTHING to the assigned workspace scope
        // EXCEPT if it looks like a system path or asset (though SvelteKit handles assets separately)
        
        const firstSegment = url.pathname.split('/')[1];
        if (VALID_WORKSPACES.includes(firstSegment)) {
             // If we are here, it means we have a path like /beltrix/dashboard on allianzy.com
             // We should probably NOT rewrite this, and let the server hook handle the 404/redirect
             // because reroute is for finding the code to run.
             return url.pathname;
        }

        // Rewriting rule:
        // /dashboard -> /allianzy/dashboard
        // / -> /allianzy
        return `/${assignedWorkspace}${url.pathname === '/' ? '' : url.pathname}`;
    }

    return url.pathname;
}
