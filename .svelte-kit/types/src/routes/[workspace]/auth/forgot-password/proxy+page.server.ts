// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env } from '$env/dynamic/private';

const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || env.VITE_NEON_AUTH_URL || process.env.VITE_NEON_AUTH_URL;

export const actions = {
	default: async ({ request, params }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString()?.trim();
		let redirectTo = formData.get('redirectTo')?.toString()?.trim();
		if (!redirectTo) {
			// En producción el request puede ser interno; usar origen público desde headers si existe.
			const forwardedHost = request.headers.get('x-forwarded-host');
			const forwardedProto = request.headers.get('x-forwarded-proto');
			if (forwardedHost && forwardedProto) {
				redirectTo = `${forwardedProto}://${forwardedHost.split(',')[0].trim()}/${params.workspace}/auth/reset-password`;
			} else if (request.url) {
				try {
					const u = new URL(request.url);
					redirectTo = `${u.origin}/${params.workspace}/auth/reset-password`;
				} catch {
					// ignore
				}
			}
		}

		if (!email) {
			return fail(400, { error: 'Email requerido.', urlRejected: false, redirectUrl: null });
		}

		if (!AUTH_URL) {
			return fail(500, { error: 'Auth no configurado.', urlRejected: false, redirectUrl: null });
		}

		const redirectUrl = redirectTo || undefined;
		const origin = redirectUrl ? new URL(redirectUrl).origin : undefined;

		const body = JSON.stringify({ email, ...(redirectUrl && { redirectTo: redirectUrl }) });
		const baseUrl = AUTH_URL.replace(/\/$/, '');
		const targetUrl = `${baseUrl}/request-password-reset`;

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...(origin && { Origin: origin })
		};

		try {
			const res = await fetch(targetUrl, {
				method: 'POST',
				headers,
				body
			});

			const data = await res.json().catch(() => ({}));

			if (!res.ok) {
				const is403 =
					res.status === 403 ||
					(data?.message && String(data.message).toLowerCase().includes('redirect'));
				return fail(res.status, {
					error: data?.message || `Error ${res.status}`,
					urlRejected: is403,
					redirectUrl: redirectUrl || null
				});
			}

			return {
				success: true,
				message:
					'Si ese correo existe en nuestro sistema, recibirás un email con el enlace para restablecer tu contraseña.'
			};
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : 'Error de conexión';
			return fail(502, { error: message, urlRejected: false });
		}
	}
};
;null as any as Actions;