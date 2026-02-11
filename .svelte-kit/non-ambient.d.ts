
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/auth" | "/api/auth/[...path]" | "/api/debug-env" | "/api/public" | "/api/public/files" | "/api/test-b2" | "/api/test-email" | "/api/users" | "/api/users/get-role" | "/api/users/sync" | "/[workspace]" | "/[workspace]/admin" | "/[workspace]/admin/cases" | "/[workspace]/admin/finance" | "/[workspace]/admin/finance/categories" | "/[workspace]/admin/finance/forecast" | "/[workspace]/admin/finance/obligations" | "/[workspace]/admin/finance/recurring" | "/[workspace]/admin/finance/transactions" | "/[workspace]/admin/finance/vendors" | "/[workspace]/admin/profile" | "/[workspace]/admin/projects" | "/[workspace]/admin/projects/[id]" | "/[workspace]/admin/services" | "/[workspace]/admin/settings" | "/[workspace]/admin/support" | "/[workspace]/admin/users" | "/[workspace]/admin/users/[id]" | "/[workspace]/auth" | "/[workspace]/auth/forgot-password" | "/[workspace]/auth/login" | "/[workspace]/auth/reset-password" | "/[workspace]/config" | "/[workspace]/dashboard" | "/[workspace]/dashboard/billing" | "/[workspace]/dashboard/contact" | "/[workspace]/dashboard/profile" | "/[workspace]/dashboard/projects" | "/[workspace]/dashboard/projects/[id]" | "/[workspace]/dashboard/settings" | "/[workspace]/dashboard/support" | "/[workspace]/intake" | "/[workspace]/intake/contact" | "/[workspace]/intake/contact/[caseId]" | "/[workspace]/intake/result" | "/[workspace]/intake/result/[caseId]" | "/[workspace]/portal" | "/[workspace]/provider" | "/[workspace]/schedule" | "/[workspace]/tickets";
		RouteParams(): {
			"/api/auth/[...path]": { path: string };
			"/[workspace]": { workspace: string };
			"/[workspace]/admin": { workspace: string };
			"/[workspace]/admin/cases": { workspace: string };
			"/[workspace]/admin/finance": { workspace: string };
			"/[workspace]/admin/finance/categories": { workspace: string };
			"/[workspace]/admin/finance/forecast": { workspace: string };
			"/[workspace]/admin/finance/obligations": { workspace: string };
			"/[workspace]/admin/finance/recurring": { workspace: string };
			"/[workspace]/admin/finance/transactions": { workspace: string };
			"/[workspace]/admin/finance/vendors": { workspace: string };
			"/[workspace]/admin/profile": { workspace: string };
			"/[workspace]/admin/projects": { workspace: string };
			"/[workspace]/admin/projects/[id]": { workspace: string; id: string };
			"/[workspace]/admin/services": { workspace: string };
			"/[workspace]/admin/settings": { workspace: string };
			"/[workspace]/admin/support": { workspace: string };
			"/[workspace]/admin/users": { workspace: string };
			"/[workspace]/admin/users/[id]": { workspace: string; id: string };
			"/[workspace]/auth": { workspace: string };
			"/[workspace]/auth/forgot-password": { workspace: string };
			"/[workspace]/auth/login": { workspace: string };
			"/[workspace]/auth/reset-password": { workspace: string };
			"/[workspace]/config": { workspace: string };
			"/[workspace]/dashboard": { workspace: string };
			"/[workspace]/dashboard/billing": { workspace: string };
			"/[workspace]/dashboard/contact": { workspace: string };
			"/[workspace]/dashboard/profile": { workspace: string };
			"/[workspace]/dashboard/projects": { workspace: string };
			"/[workspace]/dashboard/projects/[id]": { workspace: string; id: string };
			"/[workspace]/dashboard/settings": { workspace: string };
			"/[workspace]/dashboard/support": { workspace: string };
			"/[workspace]/intake": { workspace: string };
			"/[workspace]/intake/contact": { workspace: string };
			"/[workspace]/intake/contact/[caseId]": { workspace: string; caseId: string };
			"/[workspace]/intake/result": { workspace: string };
			"/[workspace]/intake/result/[caseId]": { workspace: string; caseId: string };
			"/[workspace]/portal": { workspace: string };
			"/[workspace]/provider": { workspace: string };
			"/[workspace]/schedule": { workspace: string };
			"/[workspace]/tickets": { workspace: string }
		};
		LayoutParams(): {
			"/": { path?: string; workspace?: string; id?: string; caseId?: string };
			"/api": { path?: string };
			"/api/auth": { path?: string };
			"/api/auth/[...path]": { path: string };
			"/api/debug-env": Record<string, never>;
			"/api/public": Record<string, never>;
			"/api/public/files": Record<string, never>;
			"/api/test-b2": Record<string, never>;
			"/api/test-email": Record<string, never>;
			"/api/users": Record<string, never>;
			"/api/users/get-role": Record<string, never>;
			"/api/users/sync": Record<string, never>;
			"/[workspace]": { workspace: string; id?: string; caseId?: string };
			"/[workspace]/admin": { workspace: string; id?: string };
			"/[workspace]/admin/cases": { workspace: string };
			"/[workspace]/admin/finance": { workspace: string };
			"/[workspace]/admin/finance/categories": { workspace: string };
			"/[workspace]/admin/finance/forecast": { workspace: string };
			"/[workspace]/admin/finance/obligations": { workspace: string };
			"/[workspace]/admin/finance/recurring": { workspace: string };
			"/[workspace]/admin/finance/transactions": { workspace: string };
			"/[workspace]/admin/finance/vendors": { workspace: string };
			"/[workspace]/admin/profile": { workspace: string };
			"/[workspace]/admin/projects": { workspace: string; id?: string };
			"/[workspace]/admin/projects/[id]": { workspace: string; id: string };
			"/[workspace]/admin/services": { workspace: string };
			"/[workspace]/admin/settings": { workspace: string };
			"/[workspace]/admin/support": { workspace: string };
			"/[workspace]/admin/users": { workspace: string; id?: string };
			"/[workspace]/admin/users/[id]": { workspace: string; id: string };
			"/[workspace]/auth": { workspace: string };
			"/[workspace]/auth/forgot-password": { workspace: string };
			"/[workspace]/auth/login": { workspace: string };
			"/[workspace]/auth/reset-password": { workspace: string };
			"/[workspace]/config": { workspace: string };
			"/[workspace]/dashboard": { workspace: string; id?: string };
			"/[workspace]/dashboard/billing": { workspace: string };
			"/[workspace]/dashboard/contact": { workspace: string };
			"/[workspace]/dashboard/profile": { workspace: string };
			"/[workspace]/dashboard/projects": { workspace: string; id?: string };
			"/[workspace]/dashboard/projects/[id]": { workspace: string; id: string };
			"/[workspace]/dashboard/settings": { workspace: string };
			"/[workspace]/dashboard/support": { workspace: string };
			"/[workspace]/intake": { workspace: string; caseId?: string };
			"/[workspace]/intake/contact": { workspace: string; caseId?: string };
			"/[workspace]/intake/contact/[caseId]": { workspace: string; caseId: string };
			"/[workspace]/intake/result": { workspace: string; caseId?: string };
			"/[workspace]/intake/result/[caseId]": { workspace: string; caseId: string };
			"/[workspace]/portal": { workspace: string };
			"/[workspace]/provider": { workspace: string };
			"/[workspace]/schedule": { workspace: string };
			"/[workspace]/tickets": { workspace: string }
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | `/api/auth/${string}` & {} | `/api/auth/${string}/` & {} | "/api/debug-env" | "/api/debug-env/" | "/api/public" | "/api/public/" | "/api/public/files" | "/api/public/files/" | "/api/test-b2" | "/api/test-b2/" | "/api/test-email" | "/api/test-email/" | "/api/users" | "/api/users/" | "/api/users/get-role" | "/api/users/get-role/" | "/api/users/sync" | "/api/users/sync/" | `/${string}` & {} | `/${string}/` & {} | `/${string}/admin` & {} | `/${string}/admin/` & {} | `/${string}/admin/cases` & {} | `/${string}/admin/cases/` & {} | `/${string}/admin/finance` & {} | `/${string}/admin/finance/` & {} | `/${string}/admin/finance/categories` & {} | `/${string}/admin/finance/categories/` & {} | `/${string}/admin/finance/forecast` & {} | `/${string}/admin/finance/forecast/` & {} | `/${string}/admin/finance/obligations` & {} | `/${string}/admin/finance/obligations/` & {} | `/${string}/admin/finance/recurring` & {} | `/${string}/admin/finance/recurring/` & {} | `/${string}/admin/finance/transactions` & {} | `/${string}/admin/finance/transactions/` & {} | `/${string}/admin/finance/vendors` & {} | `/${string}/admin/finance/vendors/` & {} | `/${string}/admin/profile` & {} | `/${string}/admin/profile/` & {} | `/${string}/admin/projects` & {} | `/${string}/admin/projects/` & {} | `/${string}/admin/projects/${string}` & {} | `/${string}/admin/projects/${string}/` & {} | `/${string}/admin/services` & {} | `/${string}/admin/services/` & {} | `/${string}/admin/settings` & {} | `/${string}/admin/settings/` & {} | `/${string}/admin/support` & {} | `/${string}/admin/support/` & {} | `/${string}/admin/users` & {} | `/${string}/admin/users/` & {} | `/${string}/admin/users/${string}` & {} | `/${string}/admin/users/${string}/` & {} | `/${string}/auth` & {} | `/${string}/auth/` & {} | `/${string}/auth/forgot-password` & {} | `/${string}/auth/forgot-password/` & {} | `/${string}/auth/login` & {} | `/${string}/auth/login/` & {} | `/${string}/auth/reset-password` & {} | `/${string}/auth/reset-password/` & {} | `/${string}/config` & {} | `/${string}/config/` & {} | `/${string}/dashboard` & {} | `/${string}/dashboard/` & {} | `/${string}/dashboard/billing` & {} | `/${string}/dashboard/billing/` & {} | `/${string}/dashboard/contact` & {} | `/${string}/dashboard/contact/` & {} | `/${string}/dashboard/profile` & {} | `/${string}/dashboard/profile/` & {} | `/${string}/dashboard/projects` & {} | `/${string}/dashboard/projects/` & {} | `/${string}/dashboard/projects/${string}` & {} | `/${string}/dashboard/projects/${string}/` & {} | `/${string}/dashboard/settings` & {} | `/${string}/dashboard/settings/` & {} | `/${string}/dashboard/support` & {} | `/${string}/dashboard/support/` & {} | `/${string}/intake` & {} | `/${string}/intake/` & {} | `/${string}/intake/contact` & {} | `/${string}/intake/contact/` & {} | `/${string}/intake/contact/${string}` & {} | `/${string}/intake/contact/${string}/` & {} | `/${string}/intake/result` & {} | `/${string}/intake/result/` & {} | `/${string}/intake/result/${string}` & {} | `/${string}/intake/result/${string}/` & {} | `/${string}/portal` & {} | `/${string}/portal/` & {} | `/${string}/provider` & {} | `/${string}/provider/` & {} | `/${string}/schedule` & {} | `/${string}/schedule/` & {} | `/${string}/tickets` & {} | `/${string}/tickets/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/clients/gg.webp" | "/clients/roan.webp" | "/clients/safari.webp" | "/favicon.svg" | string & {};
	}
}