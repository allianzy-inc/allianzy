
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
		RouteId(): "/" | "/api" | "/api/auth" | "/api/auth/[...path]" | "/api/files" | "/api/public" | "/api/public/files" | "/api/users" | "/api/users/get-role" | "/api/users/sync" | "/seed" | "/[workspace]" | "/[workspace]/admin" | "/[workspace]/admin/cases" | "/[workspace]/admin/profile" | "/[workspace]/admin/projects" | "/[workspace]/admin/projects/[id]" | "/[workspace]/admin/services" | "/[workspace]/admin/settings" | "/[workspace]/admin/support" | "/[workspace]/admin/users" | "/[workspace]/admin/users/[id]" | "/[workspace]/api" | "/[workspace]/auth" | "/[workspace]/auth/login" | "/[workspace]/config" | "/[workspace]/dashboard" | "/[workspace]/dashboard/api" | "/[workspace]/dashboard/api/files" | "/[workspace]/dashboard/contact" | "/[workspace]/dashboard/profile" | "/[workspace]/dashboard/projects" | "/[workspace]/dashboard/projects/[id]" | "/[workspace]/dashboard/settings" | "/[workspace]/dashboard/support" | "/[workspace]/intake" | "/[workspace]/portal" | "/[workspace]/provider" | "/[workspace]/schedule" | "/[workspace]/tickets";
		RouteParams(): {
			"/api/auth/[...path]": { path: string };
			"/[workspace]": { workspace: string };
			"/[workspace]/admin": { workspace: string };
			"/[workspace]/admin/cases": { workspace: string };
			"/[workspace]/admin/profile": { workspace: string };
			"/[workspace]/admin/projects": { workspace: string };
			"/[workspace]/admin/projects/[id]": { workspace: string; id: string };
			"/[workspace]/admin/services": { workspace: string };
			"/[workspace]/admin/settings": { workspace: string };
			"/[workspace]/admin/support": { workspace: string };
			"/[workspace]/admin/users": { workspace: string };
			"/[workspace]/admin/users/[id]": { workspace: string; id: string };
			"/[workspace]/api": { workspace: string };
			"/[workspace]/auth": { workspace: string };
			"/[workspace]/auth/login": { workspace: string };
			"/[workspace]/config": { workspace: string };
			"/[workspace]/dashboard": { workspace: string };
			"/[workspace]/dashboard/api": { workspace: string };
			"/[workspace]/dashboard/api/files": { workspace: string };
			"/[workspace]/dashboard/contact": { workspace: string };
			"/[workspace]/dashboard/profile": { workspace: string };
			"/[workspace]/dashboard/projects": { workspace: string };
			"/[workspace]/dashboard/projects/[id]": { workspace: string; id: string };
			"/[workspace]/dashboard/settings": { workspace: string };
			"/[workspace]/dashboard/support": { workspace: string };
			"/[workspace]/intake": { workspace: string };
			"/[workspace]/portal": { workspace: string };
			"/[workspace]/provider": { workspace: string };
			"/[workspace]/schedule": { workspace: string };
			"/[workspace]/tickets": { workspace: string }
		};
		LayoutParams(): {
			"/": { path?: string; workspace?: string; id?: string };
			"/api": { path?: string };
			"/api/auth": { path?: string };
			"/api/auth/[...path]": { path: string };
			"/api/files": Record<string, never>;
			"/api/public": Record<string, never>;
			"/api/public/files": Record<string, never>;
			"/api/users": Record<string, never>;
			"/api/users/get-role": Record<string, never>;
			"/api/users/sync": Record<string, never>;
			"/seed": Record<string, never>;
			"/[workspace]": { workspace: string; id?: string };
			"/[workspace]/admin": { workspace: string; id?: string };
			"/[workspace]/admin/cases": { workspace: string };
			"/[workspace]/admin/profile": { workspace: string };
			"/[workspace]/admin/projects": { workspace: string; id?: string };
			"/[workspace]/admin/projects/[id]": { workspace: string; id: string };
			"/[workspace]/admin/services": { workspace: string };
			"/[workspace]/admin/settings": { workspace: string };
			"/[workspace]/admin/support": { workspace: string };
			"/[workspace]/admin/users": { workspace: string; id?: string };
			"/[workspace]/admin/users/[id]": { workspace: string; id: string };
			"/[workspace]/api": { workspace: string };
			"/[workspace]/auth": { workspace: string };
			"/[workspace]/auth/login": { workspace: string };
			"/[workspace]/config": { workspace: string };
			"/[workspace]/dashboard": { workspace: string; id?: string };
			"/[workspace]/dashboard/api": { workspace: string };
			"/[workspace]/dashboard/api/files": { workspace: string };
			"/[workspace]/dashboard/contact": { workspace: string };
			"/[workspace]/dashboard/profile": { workspace: string };
			"/[workspace]/dashboard/projects": { workspace: string; id?: string };
			"/[workspace]/dashboard/projects/[id]": { workspace: string; id: string };
			"/[workspace]/dashboard/settings": { workspace: string };
			"/[workspace]/dashboard/support": { workspace: string };
			"/[workspace]/intake": { workspace: string };
			"/[workspace]/portal": { workspace: string };
			"/[workspace]/provider": { workspace: string };
			"/[workspace]/schedule": { workspace: string };
			"/[workspace]/tickets": { workspace: string }
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | `/api/auth/${string}` & {} | `/api/auth/${string}/` & {} | "/api/files" | "/api/files/" | "/api/public" | "/api/public/" | "/api/public/files" | "/api/public/files/" | "/api/users" | "/api/users/" | "/api/users/get-role" | "/api/users/get-role/" | "/api/users/sync" | "/api/users/sync/" | "/seed" | "/seed/" | `/${string}` & {} | `/${string}/` & {} | `/${string}/admin` & {} | `/${string}/admin/` & {} | `/${string}/admin/cases` & {} | `/${string}/admin/cases/` & {} | `/${string}/admin/profile` & {} | `/${string}/admin/profile/` & {} | `/${string}/admin/projects` & {} | `/${string}/admin/projects/` & {} | `/${string}/admin/projects/${string}` & {} | `/${string}/admin/projects/${string}/` & {} | `/${string}/admin/services` & {} | `/${string}/admin/services/` & {} | `/${string}/admin/settings` & {} | `/${string}/admin/settings/` & {} | `/${string}/admin/support` & {} | `/${string}/admin/support/` & {} | `/${string}/admin/users` & {} | `/${string}/admin/users/` & {} | `/${string}/admin/users/${string}` & {} | `/${string}/admin/users/${string}/` & {} | `/${string}/api` & {} | `/${string}/api/` & {} | `/${string}/auth` & {} | `/${string}/auth/` & {} | `/${string}/auth/login` & {} | `/${string}/auth/login/` & {} | `/${string}/config` & {} | `/${string}/config/` & {} | `/${string}/dashboard` & {} | `/${string}/dashboard/` & {} | `/${string}/dashboard/api` & {} | `/${string}/dashboard/api/` & {} | `/${string}/dashboard/api/files` & {} | `/${string}/dashboard/api/files/` & {} | `/${string}/dashboard/contact` & {} | `/${string}/dashboard/contact/` & {} | `/${string}/dashboard/profile` & {} | `/${string}/dashboard/profile/` & {} | `/${string}/dashboard/projects` & {} | `/${string}/dashboard/projects/` & {} | `/${string}/dashboard/projects/${string}` & {} | `/${string}/dashboard/projects/${string}/` & {} | `/${string}/dashboard/settings` & {} | `/${string}/dashboard/settings/` & {} | `/${string}/dashboard/support` & {} | `/${string}/dashboard/support/` & {} | `/${string}/intake` & {} | `/${string}/intake/` & {} | `/${string}/portal` & {} | `/${string}/portal/` & {} | `/${string}/provider` & {} | `/${string}/provider/` & {} | `/${string}/schedule` & {} | `/${string}/schedule/` & {} | `/${string}/tickets` & {} | `/${string}/tickets/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}