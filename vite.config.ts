import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['allianzy.com', 'beltrix.com', 'beltrix.agency', 'www.allianzy.com', 'www.beltrix.com', 'www.beltrix.agency']
	},
	// svelte-tel-input: evita error de sourcemap en build (Rollup no resuelve ubicación original)
	ssr: {
		noExternal: ['svelte-tel-input']
	},
	optimizeDeps: {
		include: ['svelte-tel-input']
	}
});
