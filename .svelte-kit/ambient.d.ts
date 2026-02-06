
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
	export const ELECTRON_RUN_AS_NODE: string;
	export const APP_REGION: string;
	export const COMMAND_MODE: string;
	export const ELECTRON_FORCE_IS_PACKAGED: string;
	export const HOME: string;
	export const HOMEBREW_CELLAR: string;
	export const HOMEBREW_PREFIX: string;
	export const HOMEBREW_REPOSITORY: string;
	export const ICUBE_APP_VERSION: string;
	export const ICUBE_BUILD_TIME: string;
	export const ICUBE_BUILD_VERSION: string;
	export const ICUBE_CODEMAIN_SESSION: string;
	export const ICUBE_ELECTRON_PATH: string;
	export const ICUBE_ENABLE_MARSCODE_NLS: string;
	export const ICUBE_IS_ELECTRON: string;
	export const ICUBE_MACHINE_ID: string;
	export const ICUBE_MARSCODE_VERSION: string;
	export const ICUBE_PRODUCT_PROVIDER: string;
	export const ICUBE_PROVIDER: string;
	export const ICUBE_PROXY_HOST: string;
	export const ICUBE_QUALITY: string;
	export const ICUBE_USE_IPV6: string;
	export const ICUBE_VSCODE_VERSION: string;
	export const INFOPATH: string;
	export const LANG: string;
	export const LOGNAME: string;
	export const MallocNanoZone: string;
	export const NVM_BIN: string;
	export const NVM_CD_FLAGS: string;
	export const NVM_DIR: string;
	export const NVM_INC: string;
	export const OLDPWD: string;
	export const OSLogRateLimit: string;
	export const PATH: string;
	export const PNPM_HOME: string;
	export const PWD: string;
	export const SHELL: string;
	export const SHLVL: string;
	export const SSH_AUTH_SOCK: string;
	export const TMPDIR: string;
	export const TRAE_CONFIG_CHANNEL: string;
	export const USER: string;
	export const VSCODE_BUILTIN_EXTENSIONS_PATH: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const VSCODE_CWD: string;
	export const VSCODE_ENV_PREPEND: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const VSCODE_EXTENSIONS_PATH: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const VSCODE_IPC_HOOK: string;
	export const VSCODE_NLS_CONFIG: string;
	export const VSCODE_PID: string;
	export const VSCODE_RUN_IN_ELECTRON: string;
	export const XPC_FLAGS: string;
	export const XPC_SERVICE_NAME: string;
	export const _: string;
	export const __CFBundleIdentifier: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const isArchMatched: string;
	export const ELECTRON_NO_ASAR: string;
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
		ELECTRON_RUN_AS_NODE: string;
		APP_REGION: string;
		COMMAND_MODE: string;
		ELECTRON_FORCE_IS_PACKAGED: string;
		HOME: string;
		HOMEBREW_CELLAR: string;
		HOMEBREW_PREFIX: string;
		HOMEBREW_REPOSITORY: string;
		ICUBE_APP_VERSION: string;
		ICUBE_BUILD_TIME: string;
		ICUBE_BUILD_VERSION: string;
		ICUBE_CODEMAIN_SESSION: string;
		ICUBE_ELECTRON_PATH: string;
		ICUBE_ENABLE_MARSCODE_NLS: string;
		ICUBE_IS_ELECTRON: string;
		ICUBE_MACHINE_ID: string;
		ICUBE_MARSCODE_VERSION: string;
		ICUBE_PRODUCT_PROVIDER: string;
		ICUBE_PROVIDER: string;
		ICUBE_PROXY_HOST: string;
		ICUBE_QUALITY: string;
		ICUBE_USE_IPV6: string;
		ICUBE_VSCODE_VERSION: string;
		INFOPATH: string;
		LANG: string;
		LOGNAME: string;
		MallocNanoZone: string;
		NVM_BIN: string;
		NVM_CD_FLAGS: string;
		NVM_DIR: string;
		NVM_INC: string;
		OLDPWD: string;
		OSLogRateLimit: string;
		PATH: string;
		PNPM_HOME: string;
		PWD: string;
		SHELL: string;
		SHLVL: string;
		SSH_AUTH_SOCK: string;
		TMPDIR: string;
		TRAE_CONFIG_CHANNEL: string;
		USER: string;
		VSCODE_BUILTIN_EXTENSIONS_PATH: string;
		VSCODE_CODE_CACHE_PATH: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		VSCODE_CWD: string;
		VSCODE_ENV_PREPEND: string;
		VSCODE_ESM_ENTRYPOINT: string;
		VSCODE_EXTENSIONS_PATH: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		VSCODE_IPC_HOOK: string;
		VSCODE_NLS_CONFIG: string;
		VSCODE_PID: string;
		VSCODE_RUN_IN_ELECTRON: string;
		XPC_FLAGS: string;
		XPC_SERVICE_NAME: string;
		_: string;
		__CFBundleIdentifier: string;
		__CF_USER_TEXT_ENCODING: string;
		isArchMatched: string;
		ELECTRON_NO_ASAR: string;
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
