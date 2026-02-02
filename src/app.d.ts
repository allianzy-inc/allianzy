// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			allowedWorkspace: string;
			user?: {
				id: string;
				email: string;
				name?: string;
				role?: string;
				image?: string;
			};
			session?: {
				id: string;
				userId: string;
				expiresAt: Date;
				ipAddress?: string;
				userAgent?: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
