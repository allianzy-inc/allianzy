// @ts-nocheck
import { db } from '$lib/server/db';
import { companies, userCompanies, users, workspaces, projects, notifications } from '$lib/server/schema';
import { eq, and, or, inArray } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getSignedUrlForFile, uploadFile } from '$lib/server/storage';
import { sendEmail } from '$lib/server/email';

export const load = async ({ params, url }: Parameters<PageServerLoad>[0]) => {
    const detailIdParam = url.searchParams.get('detail');
    let detailRequested = false;
    let selectedCompanyDetail: (typeof companies.$inferSelect & { logo?: string | null }) | null = null;
    let detailCompanyUsers: Array<{ id?: number; firstName?: string | null; lastName?: string | null; email?: string; role?: string | null; status?: string | null; permissions?: any }> = [];
    let detailCompanyProjects: Array<{ id: number; name: string }> = [];

    let allCompanies: typeof companies.$inferSelect[] = [];
    try {
        allCompanies = await db.select().from(companies).orderBy(companies.name);
    } catch (e) {
        console.error('Error loading companies list:', e);
    }

    if (detailIdParam && allCompanies.length > 0) {
        const id = parseInt(detailIdParam, 10);
        if (!Number.isNaN(id)) {
            detailRequested = true;
            const company = allCompanies.find((c) => c.id === id) ?? null;
            if (company) {
                let signedLogo: string | null = null;
                const logoInput = company.logo != null && typeof company.logo === 'string' ? company.logo : null;
                if (logoInput) {
                    try {
                        const signed = getSignedUrlForFile(logoInput, params.workspace);
                        signedLogo = signed ?? logoInput;
                    } catch (e) {
                        console.error('Error signing logo url', e);
                        signedLogo = logoInput;
                    }
                }
                selectedCompanyDetail = { ...company, logo: signedLogo ?? logoInput };
                try {
                    const userLinks = await db.query.userCompanies.findMany({
                        where: eq(userCompanies.companyId, id),
                        with: { user: true }
                    });
                    detailCompanyUsers = userLinks.map((link) => ({
                        id: link.user?.id,
                        firstName: link.user?.firstName,
                        lastName: link.user?.lastName,
                        email: link.user?.email,
                        role: link.role,
                        status: link.status,
                        permissions: link.permissions
                    }));
                    const companyUserIds = userLinks.map((l) => l.userId).filter((uid): uid is number => uid != null);
                    if (companyUserIds.length > 0) {
                        const projs = await db.select({ id: projects.id, name: projects.name }).from(projects).where(inArray(projects.clientId, companyUserIds));
                        detailCompanyProjects = projs;
                    }
                } catch (err) {
                    console.error('Error loading company detail (users/projects):', err);
                }
            }
        } else {
            detailRequested = !!detailIdParam;
        }
    } else if (detailIdParam) {
        detailRequested = true;
    }

    try {

        const countsByCompany = await db
            .select({
                companyId: userCompanies.companyId,
                count: sql<number>`count(*)::int`
            })
            .from(userCompanies)
            .groupBy(userCompanies.companyId);

        const countMap = new Map(countsByCompany.map((r) => [r.companyId, r.count]));

        const companiesWithCount = allCompanies.map((company) => ({
            ...company,
            usersCount: countMap.get(company.id) ?? 0
        }));

        const ownerLinks = await db
            .select({
                companyId: userCompanies.companyId,
                userId: userCompanies.userId,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName
            })
            .from(userCompanies)
            .innerJoin(users, eq(userCompanies.userId, users.id))
            .where(eq(userCompanies.role, 'owner'));

        const adminLinks = await db
            .select({
                companyId: userCompanies.companyId,
                userId: userCompanies.userId,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName
            })
            .from(userCompanies)
            .innerJoin(users, eq(userCompanies.userId, users.id))
            .where(eq(userCompanies.role, 'admin'));

        const ownerByCompanyId = new Map<
            number,
            { id: number; email: string; firstName: string | null; lastName: string | null }
        >();
        for (const link of ownerLinks) {
            if (link.companyId != null && link.userId != null && !ownerByCompanyId.has(link.companyId)) {
                ownerByCompanyId.set(link.companyId, {
                    id: link.userId,
                    email: link.email,
                    firstName: link.firstName,
                    lastName: link.lastName
                });
            }
        }
        for (const link of adminLinks) {
            if (link.companyId != null && link.userId != null && !ownerByCompanyId.has(link.companyId)) {
                ownerByCompanyId.set(link.companyId, {
                    id: link.userId,
                    email: link.email,
                    firstName: link.firstName,
                    lastName: link.lastName
                });
            }
        }

        let usersList: { id: number; email: string; firstName: string | null; lastName: string | null }[] = [];
        try {
            const ws = await db.select({ id: workspaces.id }).from(workspaces).where(eq(workspaces.slug, params.workspace)).limit(1);
            if (ws.length > 0) {
                usersList = await db
                    .select({ id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName })
                    .from(users)
                    .where(eq(users.workspaceId, ws[0].id))
                    .orderBy(users.email);
            } else {
                usersList = await db
                    .select({ id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName })
                    .from(users)
                    .orderBy(users.email);
            }
        } catch (_) {
            usersList = await db
                .select({ id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName })
                .from(users)
                .orderBy(users.email);
        }

        return {
            companies: companiesWithCount,
            usersList,
            ownerByCompanyId: Object.fromEntries(ownerByCompanyId),
            detailRequested,
            selectedCompanyDetail,
            detailCompanyUsers,
            detailCompanyProjects
        };
    } catch (error) {
        console.error('Error fetching companies list:', error);
        const hadDetailParam = !!url.searchParams.get('detail');
        return {
            companies: [],
            usersList: [],
            ownerByCompanyId: {},
            detailRequested: hadDetailParam,
            selectedCompanyDetail,
            detailCompanyUsers,
            detailCompanyProjects
        };
    }
};

export const actions = {
    createCompany: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const name = String(formData.get('name') ?? '').trim();
        if (!name) {
            return fail(400, { error: 'El nombre es obligatorio.', create: true });
        }
        const adminUserIdRaw = formData.get('adminUserId');
        const adminUserId = adminUserIdRaw ? Number(adminUserIdRaw) : undefined;
        try {
            const [created] = await db
                .insert(companies)
                .values({
                    name,
                    description: String(formData.get('description') ?? '').trim() || null,
                    email: String(formData.get('email') ?? '').trim() || null,
                    phone: String(formData.get('phone') ?? '').trim() || null,
                    website: String(formData.get('website') ?? '').trim() || null,
                    region: String(formData.get('region') ?? '').trim() || null
                })
                .returning({ id: companies.id });
            if (created?.id && adminUserId && !Number.isNaN(adminUserId)) {
                await db.insert(userCompanies).values({
                    userId: adminUserId,
                    companyId: created.id,
                    role: 'owner',
                    status: 'active',
                    isPrimary: true
                });
            }
            return { success: true, create: true };
        } catch (e) {
            console.error('Create company error:', e);
            return fail(500, { error: 'No se pudo crear la empresa.', create: true });
        }
    },

    updateCompany: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const idRaw = formData.get('company_id');
        const id = idRaw ? Number(idRaw) : NaN;
        if (!id || Number.isNaN(id)) {
            return fail(400, { error: 'ID de empresa inválido.', update: true });
        }
        const name = String(formData.get('name') ?? '').trim();
        if (!name) {
            return fail(400, { error: 'El nombre es obligatorio.', update: true });
        }
        const adminUserIdRaw = formData.get('adminUserId');
        const adminUserId = adminUserIdRaw ? Number(adminUserIdRaw) : undefined;
        try {
            await db
                .update(companies)
                .set({
                    name,
                    description: String(formData.get('description') ?? '').trim() || null,
                    email: String(formData.get('email') ?? '').trim() || null,
                    phone: String(formData.get('phone') ?? '').trim() || null,
                    website: String(formData.get('website') ?? '').trim() || null,
                    region: String(formData.get('region') ?? '').trim() || null,
                    updatedAt: new Date()
                })
                .where(eq(companies.id, id));

            if (adminUserId !== undefined && !Number.isNaN(adminUserId)) {
                await db.update(userCompanies).set({ role: 'member' }).where(and(eq(userCompanies.companyId, id), or(eq(userCompanies.role, 'owner'), eq(userCompanies.role, 'admin'))));
                const existing = await db
                    .select({ id: userCompanies.id })
                    .from(userCompanies)
                    .where(and(eq(userCompanies.companyId, id), eq(userCompanies.userId, adminUserId)))
                    .limit(1);
                if (existing.length > 0) {
                    await db.update(userCompanies).set({ role: 'owner', status: 'active', isPrimary: true }).where(eq(userCompanies.id, existing[0].id));
                } else {
                    await db.insert(userCompanies).values({
                        userId: adminUserId,
                        companyId: id,
                        role: 'owner',
                        status: 'active',
                        isPrimary: true
                    });
                }
            }

            return { success: true, update: true };
        } catch (e) {
            console.error('Update company error:', e);
            return fail(500, { error: 'No se pudo actualizar la empresa.', update: true });
        }
    },

    updateCompanyDetail: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const companyIdRaw = formData.get('company_id');
        const companyId = companyIdRaw ? Number(companyIdRaw) : NaN;
        if (!companyId || Number.isNaN(companyId)) {
            return fail(400, { message: 'ID de empresa inválido.', detail: true });
        }
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        const textFields = ['name', 'phone', 'email', 'website', 'description'];
        for (const field of textFields) {
            if (formData.has(field)) {
                updateData[field] = formData.get(field) as string;
            }
        }
        const memberLimitRaw = formData.get('member_limit');
        if (formData.has('member_limit')) {
            if (memberLimitRaw === '' || memberLimitRaw === null || memberLimitRaw === undefined) {
                updateData.memberLimit = null;
            } else {
                const n = parseInt(String(memberLimitRaw), 10);
                if (!Number.isNaN(n) && n >= 1) updateData.memberLimit = n;
            }
        }
        const documentsJson = formData.get('documents') as string;
        if (formData.has('documents') && documentsJson) {
            try {
                updateData.documents = JSON.parse(documentsJson);
            } catch (e) {
                console.error('Error parsing documents JSON', e);
            }
        }
        const linksJson = formData.get('links') as string;
        if (formData.has('links') && linksJson) {
            try {
                updateData.links = JSON.parse(linksJson);
            } catch (e) {
                console.error('Error parsing links JSON', e);
            }
        }
        const addressesJson = formData.get('addresses') as string;
        if (formData.has('addresses') && addressesJson) {
            try {
                updateData.addresses = JSON.parse(addressesJson);
            } catch (e) {
                console.error('Error parsing addresses JSON', e);
            }
        }
        if (formData.get('deleteLogo') === 'true') {
            updateData.logo = null;
        }
        const logo = formData.get('logo') as File;
        if (logo && logo.size > 0 && logo.name && logo.name !== 'undefined') {
            try {
                updateData.logo = await uploadFile(logo, 'logos');
            } catch (err) {
                console.error('Error uploading logo:', err);
                return fail(500, { message: 'Error subiendo logo', detail: true });
            }
        }
        if (Object.keys(updateData).length <= 1) {
            return { success: true, message: 'Sin cambios', detail: true };
        }
        // memberLimit can be the only change (besides updatedAt)
        try {
            await db.update(companies).set(updateData).where(eq(companies.id, companyId));
            return { success: true, message: 'Guardado correctamente', detail: true };
        } catch (err) {
            console.error('Error updating company detail:', err);
            return fail(500, { message: 'Error al actualizar la empresa', detail: true });
        }
    },
    saveCompanyUser: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const companyIdRaw = formData.get('company_id');
        const companyId = companyIdRaw ? Number(companyIdRaw) : NaN;
        const userIdRaw = formData.get('id');
        const userId = userIdRaw ? Number(userIdRaw) : NaN;
        const status = String(formData.get('status') || 'active');
        const permissionsJson = formData.get('permissions') as string;
        if (!companyId || Number.isNaN(companyId) || !userIdRaw || !userId || Number.isNaN(userId)) {
            return fail(400, { message: 'company_id e id de usuario son requeridos', saveUser: true });
        }
        let permissions: Record<string, string[]> = {};
        try {
            if (permissionsJson) permissions = JSON.parse(permissionsJson);
        } catch (e) {
            console.error('Error parsing permissions', e);
        }
        const hasValidPermissions = Object.values(permissions).some((p) => Array.isArray(p) && p.length > 0);
        if (!hasValidPermissions) {
            return fail(400, { message: 'Al menos un proyecto debe tener un permiso', saveUser: true });
        }
        const link = await db.query.userCompanies.findFirst({
            where: and(eq(userCompanies.companyId, companyId), eq(userCompanies.userId, userId))
        });
        if (!link) {
            return fail(404, { message: 'Usuario no encontrado en esta empresa', saveUser: true });
        }
        try {
            await db.update(userCompanies).set({ permissions, status }).where(eq(userCompanies.id, link.id));
            return { success: true, message: 'Usuario actualizado', saveUser: true };
        } catch (err) {
            console.error('Error updating company user:', err);
            return fail(500, { message: 'Error al actualizar usuario', saveUser: true });
        }
    },

    inviteCompanyUser: async ({ request, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const companyIdRaw = formData.get('company_id');
        const companyId = companyIdRaw ? Number(companyIdRaw) : NaN;
        const email = String(formData.get('email') ?? '').trim().toLowerCase();
        const firstName = String(formData.get('firstName') ?? '').trim() || null;
        const lastName = String(formData.get('lastName') ?? '').trim() || null;
        const role = String(formData.get('role') ?? 'member').trim();
        const permissionsJson = formData.get('permissions') as string;

        if (!companyId || Number.isNaN(companyId)) {
            return fail(400, { message: 'ID de empresa inválido.', inviteUser: true });
        }
        if (!email) {
            return fail(400, { message: 'El correo electrónico es obligatorio.', inviteUser: true });
        }
        const validRoles = ['owner', 'admin', 'member'];
        if (!validRoles.includes(role)) {
            return fail(400, { message: 'Rol no válido.', inviteUser: true });
        }

        let permissions: Record<string, string[]> = {};
        try {
            if (permissionsJson) permissions = JSON.parse(permissionsJson);
        } catch (e) {
            console.error('Error parsing permissions', e);
        }
        const hasValidPermissions = Object.keys(permissions).length === 0 || Object.values(permissions).some((p) => Array.isArray(p) && p.length > 0);
        if (!hasValidPermissions) {
            return fail(400, { message: 'Al menos un proyecto debe tener un permiso seleccionado.', inviteUser: true });
        }

        const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
        if (!company) {
            return fail(404, { message: 'Empresa no encontrada.', inviteUser: true });
        }
        const companyName = company.name ?? 'La empresa';

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        let targetUserId: number;

        if (existingUser) {
            targetUserId = existingUser.id;
            const existingLink = await db.query.userCompanies.findFirst({
                where: and(eq(userCompanies.companyId, companyId), eq(userCompanies.userId, targetUserId))
            });
            if (existingLink) {
                return fail(400, { message: 'Este usuario ya pertenece a la empresa.', inviteUser: true });
            }
            await db.insert(userCompanies).values({
                userId: targetUserId,
                companyId,
                role,
                status: 'pending',
                permissions
            });
            await db.insert(notifications).values({
                userId: targetUserId,
                title: 'Invitación recibida',
                message: `Has sido invitado a unirte a ${companyName}.`,
                type: 'invitation',
                link: `/${params.workspace}/dashboard`,
                metadata: { companyId, companyName, role }
            });
            try {
                await sendEmail({
                    to: email,
                    subject: `Te han añadido a ${companyName}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Bienvenido a ${companyName}</h2>
                            <p>Hola ${existingUser.firstName || 'there'},</p>
                            <p>Has sido añadido a <strong>${companyName}</strong> en Allianzy con el rol de <strong>${role}</strong>.</p>
                            <p>Puedes acceder al panel desde el siguiente enlace.</p>
                            <div style="margin: 30px 0;">
                                <a href="${new URL(request.url).origin}/${params.workspace}/dashboard" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">Ir al panel</a>
                            </div>
                        </div>
                    `
                });
            } catch (err) {
                console.error('Error sending email:', err);
            }
        } else {
            const [newUser] = await db
                .insert(users)
                .values({
                    firstName: firstName ?? '',
                    lastName: lastName ?? '',
                    email,
                    role: 'staff',
                    workspaceId: company.workspaceId ?? undefined
                })
                .returning();
            if (!newUser) return fail(500, { message: 'Error al crear el usuario.', inviteUser: true });
            targetUserId = newUser.id;

            await db.insert(userCompanies).values({
                userId: targetUserId,
                companyId,
                role,
                status: 'pending',
                permissions
            });
            await db.insert(notifications).values({
                userId: targetUserId,
                title: 'Invitación recibida',
                message: `Has sido invitado a unirte a ${companyName}.`,
                type: 'invitation',
                link: `/${params.workspace}/dashboard`,
                metadata: { companyId, companyName, role }
            });
            const inviteLink = `${new URL(request.url).origin}/${params.workspace}/auth/login?mode=register&email=${encodeURIComponent(email)}`;
            try {
                await sendEmail({
                    to: email,
                    subject: `Invitación para unirte a ${companyName}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Invitación a ${companyName}</h2>
                            <p>Hola ${firstName || 'there'},</p>
                            <p>Has sido invitado a unirte a <strong>${companyName}</strong> en Allianzy con el rol de <strong>${role}</strong>.</p>
                            <p>Haz clic en el botón para crear tu cuenta y acceder.</p>
                            <div style="margin: 30px 0;">
                                <a href="${inviteLink}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">Aceptar invitación</a>
                            </div>
                        </div>
                    `
                });
            } catch (err) {
                console.error('Error sending invitation email:', err);
            }
        }

        return { success: true, message: 'Invitación enviada correctamente', inviteUser: true };
    },

    checkUserByEmail: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const email = String(formData.get('email') ?? '').trim().toLowerCase();
        if (!email) {
            return { checkEmail: true, exists: false };
        }
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
            columns: { id: true, firstName: true, lastName: true }
        });
        if (!user) {
            return { checkEmail: true, exists: false };
        }
        return {
            checkEmail: true,
            exists: true,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? ''
        };
    }
};
;null as any as Actions;