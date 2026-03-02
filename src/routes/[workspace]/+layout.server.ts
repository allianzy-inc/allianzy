import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, params, locals }) => {
    // Si el usuario llega con ?token= (enlace de restablecer contraseña de Neon) pero a la raíz o al home del workspace,
    // redirigir a la página donde puede introducir la nueva contraseña.
    const token = url.searchParams.get('token');
    if (token) {
        const pathname = url.pathname.replace(/\/$/, '') || '/';
        const workspaceRoot = `/${params.workspace}`;
        const isWorkspaceRoot = pathname === workspaceRoot || pathname === '/';
        if (isWorkspaceRoot) {
            const search = url.searchParams.toString();
            throw redirect(302, `/${params.workspace}/auth/reset-password${search ? `?${search}` : ''}`);
        }
    }

    return {
        user: locals.user
    };
};
