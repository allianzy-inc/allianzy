
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
	export const _ZO_DOCTOR: string;
	export const NVM_INC: string;
	export const GOMODCACHE: string;
	export const PUPPETEER_CACHE_DIR: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const NODE: string;
	export const DENO_DIR: string;
	export const INIT_CWD: string;
	export const NVM_CD_FLAGS: string;
	export const GEM_HOME: string;
	export const TERM: string;
	export const SHELL: string;
	export const VSCODE_PROCESS_TITLE: string;
	export const TMPDIR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const npm_config_global_prefix: string;
	export const VOLTA_HOME: string;
	export const PIP_CACHE_DIR: string;
	export const MallocNanoZone: string;
	export const CURSOR_TRACE_ID: string;
	export const COLOR: string;
	export const NO_COLOR: string;
	export const npm_config_noproxy: string;
	export const npm_config_local_prefix: string;
	export const PNPM_HOME: string;
	export const USER: string;
	export const NX_CACHE_DIRECTORY: string;
	export const NVM_DIR: string;
	export const CYPRESS_CACHE_FOLDER: string;
	export const COMMAND_MODE: string;
	export const CCACHE_DIR: string;
	export const npm_config_globalconfig: string;
	export const YARN_CACHE_FOLDER: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const BUN_INSTALL_CACHE_DIR: string;
	export const HOMEBREW_CACHE: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const npm_config_devdir: string;
	export const PATH: string;
	export const CURSOR_SANDBOX: string;
	export const CARGO_HOME: string;
	export const npm_package_json: string;
	export const _: string;
	export const npm_config_userconfig: string;
	export const npm_config_init_module: string;
	export const __CFBundleIdentifier: string;
	export const npm_command: string;
	export const PWD: string;
	export const CP_HOME_DIR: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const npm_lifecycle_event: string;
	export const EDITOR: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const npm_package_name: string;
	export const LANG: string;
	export const CURSOR_AGENT: string;
	export const CONDA_PKGS_DIRS: string;
	export const npm_config_npm_version: string;
	export const XPC_FLAGS: string;
	export const PLAYWRIGHT_BROWSERS_PATH: string;
	export const CURSOR_EXTENSION_HOST_ROLE: string;
	export const PIPX_HOME: string;
	export const FORCE_COLOR: string;
	export const npm_config_node_gyp: string;
	export const npm_package_version: string;
	export const XPC_SERVICE_NAME: string;
	export const SHLVL: string;
	export const HOME: string;
	export const GRADLE_USER_HOME: string;
	export const VSCODE_NLS_CONFIG: string;
	export const CI: string;
	export const HOMEBREW_PREFIX: string;
	export const RUSTUP_HOME: string;
	export const PNPM_STORE_PATH: string;
	export const BUNDLE_PATH: string;
	export const TURBO_CACHE_DIR: string;
	export const NUGET_PACKAGES: string;
	export const NPM_CONFIG_CACHE: string;
	export const LOGNAME: string;
	export const npm_lifecycle_script: string;
	export const GOCACHE: string;
	export const VSCODE_IPC_HOOK: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const NVM_BIN: string;
	export const npm_config_user_agent: string;
	export const VSCODE_PID: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const OSLogRateLimit: string;
	export const POETRY_CACHE_DIR: string;
	export const COMPOSER_HOME: string;
	export const VSCODE_CWD: string;
	export const UV_CACHE_DIR: string;
	export const npm_node_execpath: string;
	export const npm_config_prefix: string;
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
		_ZO_DOCTOR: string;
		NVM_INC: string;
		GOMODCACHE: string;
		PUPPETEER_CACHE_DIR: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		NODE: string;
		DENO_DIR: string;
		INIT_CWD: string;
		NVM_CD_FLAGS: string;
		GEM_HOME: string;
		TERM: string;
		SHELL: string;
		VSCODE_PROCESS_TITLE: string;
		TMPDIR: string;
		HOMEBREW_REPOSITORY: string;
		npm_config_global_prefix: string;
		VOLTA_HOME: string;
		PIP_CACHE_DIR: string;
		MallocNanoZone: string;
		CURSOR_TRACE_ID: string;
		COLOR: string;
		NO_COLOR: string;
		npm_config_noproxy: string;
		npm_config_local_prefix: string;
		PNPM_HOME: string;
		USER: string;
		NX_CACHE_DIRECTORY: string;
		NVM_DIR: string;
		CYPRESS_CACHE_FOLDER: string;
		COMMAND_MODE: string;
		CCACHE_DIR: string;
		npm_config_globalconfig: string;
		YARN_CACHE_FOLDER: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		BUN_INSTALL_CACHE_DIR: string;
		HOMEBREW_CACHE: string;
		ELECTRON_RUN_AS_NODE: string;
		npm_config_devdir: string;
		PATH: string;
		CURSOR_SANDBOX: string;
		CARGO_HOME: string;
		npm_package_json: string;
		_: string;
		npm_config_userconfig: string;
		npm_config_init_module: string;
		__CFBundleIdentifier: string;
		npm_command: string;
		PWD: string;
		CP_HOME_DIR: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		npm_lifecycle_event: string;
		EDITOR: string;
		VSCODE_ESM_ENTRYPOINT: string;
		npm_package_name: string;
		LANG: string;
		CURSOR_AGENT: string;
		CONDA_PKGS_DIRS: string;
		npm_config_npm_version: string;
		XPC_FLAGS: string;
		PLAYWRIGHT_BROWSERS_PATH: string;
		CURSOR_EXTENSION_HOST_ROLE: string;
		PIPX_HOME: string;
		FORCE_COLOR: string;
		npm_config_node_gyp: string;
		npm_package_version: string;
		XPC_SERVICE_NAME: string;
		SHLVL: string;
		HOME: string;
		GRADLE_USER_HOME: string;
		VSCODE_NLS_CONFIG: string;
		CI: string;
		HOMEBREW_PREFIX: string;
		RUSTUP_HOME: string;
		PNPM_STORE_PATH: string;
		BUNDLE_PATH: string;
		TURBO_CACHE_DIR: string;
		NUGET_PACKAGES: string;
		NPM_CONFIG_CACHE: string;
		LOGNAME: string;
		npm_lifecycle_script: string;
		GOCACHE: string;
		VSCODE_IPC_HOOK: string;
		VSCODE_CODE_CACHE_PATH: string;
		NVM_BIN: string;
		npm_config_user_agent: string;
		VSCODE_PID: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		OSLogRateLimit: string;
		POETRY_CACHE_DIR: string;
		COMPOSER_HOME: string;
		VSCODE_CWD: string;
		UV_CACHE_DIR: string;
		npm_node_execpath: string;
		npm_config_prefix: string;
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
