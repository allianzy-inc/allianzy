
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const VITE_NEON_AUTH_URL: string;
	export const DATABASE_URL: string;
	export const B2_APPLICATION_KEY_ID: string;
	export const B2_APPLICATION_KEY: string;
	export const B2_ENDPOINT: string;
	export const B2_REGION: string;
	export const B2_BUCKET_NAME: string;
	export const RESEND_API_KEY: string;
	export const STRIPE_SECRET_KEY: string;
	export const ALL_PROXY: string;
	export const BUNDLE_PATH: string;
	export const BUN_INSTALL_CACHE_DIR: string;
	export const CARGO_TARGET_DIR: string;
	export const CCACHE_DIR: string;
	export const COMMAND_MODE: string;
	export const COMPOSER_HOME: string;
	export const CONDA_PKGS_DIRS: string;
	export const CP_HOME_DIR: string;
	export const CURSOR_AGENT: string;
	export const CURSOR_EXTENSION_HOST_ROLE: string;
	export const CURSOR_SANDBOX: string;
	export const CURSOR_TRACE_ID: string;
	export const CYPRESS_CACHE_FOLDER: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const FORCE_COLOR: string;
	export const GEM_SPEC_CACHE: string;
	export const GIT_HTTPS_PROXY: string;
	export const GIT_HTTP_PROXY: string;
	export const GOCACHE: string;
	export const GOMODCACHE: string;
	export const GRADLE_USER_HOME: string;
	export const HOME: string;
	export const HOMEBREW_CACHE: string;
	export const HOMEBREW_CELLAR: string;
	export const HOMEBREW_PREFIX: string;
	export const HOMEBREW_REPOSITORY: string;
	export const HTTPS_PROXY: string;
	export const HTTP_PROXY: string;
	export const INFOPATH: string;
	export const LANG: string;
	export const LOGNAME: string;
	export const MallocNanoZone: string;
	export const NO_COLOR: string;
	export const NO_PROXY: string;
	export const NPM_CONFIG_CACHE: string;
	export const NUGET_PACKAGES: string;
	export const NVM_BIN: string;
	export const NVM_CD_FLAGS: string;
	export const NVM_DIR: string;
	export const NVM_INC: string;
	export const NX_CACHE_DIRECTORY: string;
	export const OLDPWD: string;
	export const OSLogRateLimit: string;
	export const PATH: string;
	export const PIP_CACHE_DIR: string;
	export const PLAYWRIGHT_BROWSERS_PATH: string;
	export const PNPM_HOME: string;
	export const PNPM_STORE_PATH: string;
	export const POETRY_CACHE_DIR: string;
	export const PUPPETEER_CACHE_DIR: string;
	export const PWD: string;
	export const SHELL: string;
	export const SHLVL: string;
	export const SOCKS5_PROXY: string;
	export const SOCKS_PROXY: string;
	export const SSH_AUTH_SOCK: string;
	export const TERM: string;
	export const TMPDIR: string;
	export const TURBO_CACHE_DIR: string;
	export const USER: string;
	export const UV_CACHE_DIR: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const VSCODE_CWD: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const VSCODE_IPC_HOOK: string;
	export const VSCODE_NLS_CONFIG: string;
	export const VSCODE_PID: string;
	export const VSCODE_PROCESS_TITLE: string;
	export const XPC_FLAGS: string;
	export const XPC_SERVICE_NAME: string;
	export const YARN_CACHE_FOLDER: string;
	export const _ZO_DOCTOR: string;
	export const __CFBundleIdentifier: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const __CURSOR_SANDBOX_ENV_RESTORE: string;
	export const all_proxy: string;
	export const http_proxy: string;
	export const https_proxy: string;
	export const no_proxy: string;
	export const npm_config_devdir: string;
	export const socks5_proxy: string;
	export const socks_proxy: string;
	export const CI: string;
	export const _: string;
	export const npm_command: string;
	export const PNPM_PACKAGE_NAME: string;
	export const npm_config_user_agent: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		VITE_NEON_AUTH_URL: string;
		DATABASE_URL: string;
		B2_APPLICATION_KEY_ID: string;
		B2_APPLICATION_KEY: string;
		B2_ENDPOINT: string;
		B2_REGION: string;
		B2_BUCKET_NAME: string;
		RESEND_API_KEY: string;
		STRIPE_SECRET_KEY: string;
		ALL_PROXY: string;
		BUNDLE_PATH: string;
		BUN_INSTALL_CACHE_DIR: string;
		CARGO_TARGET_DIR: string;
		CCACHE_DIR: string;
		COMMAND_MODE: string;
		COMPOSER_HOME: string;
		CONDA_PKGS_DIRS: string;
		CP_HOME_DIR: string;
		CURSOR_AGENT: string;
		CURSOR_EXTENSION_HOST_ROLE: string;
		CURSOR_SANDBOX: string;
		CURSOR_TRACE_ID: string;
		CYPRESS_CACHE_FOLDER: string;
		ELECTRON_RUN_AS_NODE: string;
		FORCE_COLOR: string;
		GEM_SPEC_CACHE: string;
		GIT_HTTPS_PROXY: string;
		GIT_HTTP_PROXY: string;
		GOCACHE: string;
		GOMODCACHE: string;
		GRADLE_USER_HOME: string;
		HOME: string;
		HOMEBREW_CACHE: string;
		HOMEBREW_CELLAR: string;
		HOMEBREW_PREFIX: string;
		HOMEBREW_REPOSITORY: string;
		HTTPS_PROXY: string;
		HTTP_PROXY: string;
		INFOPATH: string;
		LANG: string;
		LOGNAME: string;
		MallocNanoZone: string;
		NO_COLOR: string;
		NO_PROXY: string;
		NPM_CONFIG_CACHE: string;
		NUGET_PACKAGES: string;
		NVM_BIN: string;
		NVM_CD_FLAGS: string;
		NVM_DIR: string;
		NVM_INC: string;
		NX_CACHE_DIRECTORY: string;
		OLDPWD: string;
		OSLogRateLimit: string;
		PATH: string;
		PIP_CACHE_DIR: string;
		PLAYWRIGHT_BROWSERS_PATH: string;
		PNPM_HOME: string;
		PNPM_STORE_PATH: string;
		POETRY_CACHE_DIR: string;
		PUPPETEER_CACHE_DIR: string;
		PWD: string;
		SHELL: string;
		SHLVL: string;
		SOCKS5_PROXY: string;
		SOCKS_PROXY: string;
		SSH_AUTH_SOCK: string;
		TERM: string;
		TMPDIR: string;
		TURBO_CACHE_DIR: string;
		USER: string;
		UV_CACHE_DIR: string;
		VSCODE_CODE_CACHE_PATH: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		VSCODE_CWD: string;
		VSCODE_ESM_ENTRYPOINT: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		VSCODE_IPC_HOOK: string;
		VSCODE_NLS_CONFIG: string;
		VSCODE_PID: string;
		VSCODE_PROCESS_TITLE: string;
		XPC_FLAGS: string;
		XPC_SERVICE_NAME: string;
		YARN_CACHE_FOLDER: string;
		_ZO_DOCTOR: string;
		__CFBundleIdentifier: string;
		__CF_USER_TEXT_ENCODING: string;
		__CURSOR_SANDBOX_ENV_RESTORE: string;
		all_proxy: string;
		http_proxy: string;
		https_proxy: string;
		no_proxy: string;
		npm_config_devdir: string;
		socks5_proxy: string;
		socks_proxy: string;
		CI: string;
		_: string;
		npm_command: string;
		PNPM_PACKAGE_NAME: string;
		npm_config_user_agent: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
