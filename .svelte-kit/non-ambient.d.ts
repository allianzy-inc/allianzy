
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
		RouteId(): "/" | "/api" | "/api/users" | "/api/users/get-role" | "/api/users/sync" | "/[workspace]" | "/[workspace]/admin" | "/[workspace]/admin/cases" | "/[workspace]/admin/profile" | "/[workspace]/admin/projects" | "/[workspace]/admin/services" | "/[workspace]/admin/settings" | "/[workspace]/admin/support" | "/[workspace]/admin/users" | "/[workspace]/auth" | "/[workspace]/auth/login" | "/[workspace]/config" | "/[workspace]/dashboard" | "/[workspace]/dashboard/contact" | "/[workspace]/dashboard/profile" | "/[workspace]/dashboard/projects" | "/[workspace]/dashboard/settings" | "/[workspace]/dashboard/support" | "/[workspace]/intake" | "/[workspace]/portal" | "/[workspace]/provider" | "/[workspace]/schedule" | "/[workspace]/tickets";
		RouteParams(): {
			"/[workspace]": { workspace: string };
			"/[workspace]/admin": { workspace: string };
			"/[workspace]/admin/cases": { workspace: string };
			"/[workspace]/admin/profile": { workspace: string };
			"/[workspace]/admin/projects": { workspace: string };
			"/[workspace]/admin/services": { workspace: string };
			"/[workspace]/admin/settings": { workspace: string };
			"/[workspace]/admin/support": { workspace: string };
			"/[workspace]/admin/users": { workspace: string };
			"/[workspace]/auth": { workspace: string };
			"/[workspace]/auth/login": { workspace: string };
			"/[workspace]/config": { workspace: string };
			"/[workspace]/dashboard": { workspace: string };
			"/[workspace]/dashboard/contact": { workspace: string };
			"/[workspace]/dashboard/profile": { workspace: string };
			"/[workspace]/dashboard/projects": { workspace: string };
			"/[workspace]/dashboard/settings": { workspace: string };
			"/[workspace]/dashboard/support": { workspace: string };
			"/[workspace]/intake": { workspace: string };
			"/[workspace]/portal": { workspace: string };
			"/[workspace]/provider": { workspace: string };
			"/[workspace]/schedule": { workspace: string };
			"/[workspace]/tickets": { workspace: string }
		};
		LayoutParams(): {
			"/": { workspace?: string };
			"/api": Record<string, never>;
			"/api/users": Record<string, never>;
			"/api/users/get-role": Record<string, never>;
			"/api/users/sync": Record<string, never>;
			"/[workspace]": { workspace: string };
			"/[workspace]/admin": { workspace: string };
			"/[workspace]/admin/cases": { workspace: string };
			"/[workspace]/admin/profile": { workspace: string };
			"/[workspace]/admin/projects": { workspace: string };
			"/[workspace]/admin/services": { workspace: string };
			"/[workspace]/admin/settings": { workspace: string };
			"/[workspace]/admin/support": { workspace: string };
			"/[workspace]/admin/users": { workspace: string };
			"/[workspace]/auth": { workspace: string };
			"/[workspace]/auth/login": { workspace: string };
			"/[workspace]/config": { workspace: string };
			"/[workspace]/dashboard": { workspace: string };
			"/[workspace]/dashboard/contact": { workspace: string };
			"/[workspace]/dashboard/profile": { workspace: string };
			"/[workspace]/dashboard/projects": { workspace: string };
			"/[workspace]/dashboard/settings": { workspace: string };
			"/[workspace]/dashboard/support": { workspace: string };
			"/[workspace]/intake": { workspace: string };
			"/[workspace]/portal": { workspace: string };
			"/[workspace]/provider": { workspace: string };
			"/[workspace]/schedule": { workspace: string };
			"/[workspace]/tickets": { workspace: string }
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/users" | "/api/users/" | "/api/users/get-role" | "/api/users/get-role/" | "/api/users/sync" | "/api/users/sync/" | `/${string}` & {} | `/${string}/` & {} | `/${string}/admin` & {} | `/${string}/admin/` & {} | `/${string}/admin/cases` & {} | `/${string}/admin/cases/` & {} | `/${string}/admin/profile` & {} | `/${string}/admin/profile/` & {} | `/${string}/admin/projects` & {} | `/${string}/admin/projects/` & {} | `/${string}/admin/services` & {} | `/${string}/admin/services/` & {} | `/${string}/admin/settings` & {} | `/${string}/admin/settings/` & {} | `/${string}/admin/support` & {} | `/${string}/admin/support/` & {} | `/${string}/admin/users` & {} | `/${string}/admin/users/` & {} | `/${string}/auth` & {} | `/${string}/auth/` & {} | `/${string}/auth/login` & {} | `/${string}/auth/login/` & {} | `/${string}/config` & {} | `/${string}/config/` & {} | `/${string}/dashboard` & {} | `/${string}/dashboard/` & {} | `/${string}/dashboard/contact` & {} | `/${string}/dashboard/contact/` & {} | `/${string}/dashboard/profile` & {} | `/${string}/dashboard/profile/` & {} | `/${string}/dashboard/projects` & {} | `/${string}/dashboard/projects/` & {} | `/${string}/dashboard/settings` & {} | `/${string}/dashboard/settings/` & {} | `/${string}/dashboard/support` & {} | `/${string}/dashboard/support/` & {} | `/${string}/intake` & {} | `/${string}/intake/` & {} | `/${string}/portal` & {} | `/${string}/portal/` & {} | `/${string}/provider` & {} | `/${string}/provider/` & {} | `/${string}/schedule` & {} | `/${string}/schedule/` & {} | `/${string}/tickets` & {} | `/${string}/tickets/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}