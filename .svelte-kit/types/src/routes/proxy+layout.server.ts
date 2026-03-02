// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = async ({ url }: Parameters<LayoutServerLoad>[0]) => {
    // Enlace de restablecer contraseña: si llegan a la raíz con ?token=, llevar al formulario de reset (workspace por defecto: allianzy).
    const token = url.searchParams.get('token');
    if (token && (url.pathname === '/' || url.pathname === '')) {
        const search = url.searchParams.toString();
        throw redirect(302, `/allianzy/auth/reset-password${search ? `?${search}` : ''}`);
    }
    return {};
};
