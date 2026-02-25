// @ts-nocheck
import { db } from '$lib/server/db';
import { users, projects, services, cases, payments, userCompanies } from '$lib/server/schema';
import { eq, desc, or } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
    console.log('Loading user detail for ID:', params.id);
    const userId = Number(params.id);

    if (isNaN(userId)) {
        console.error('Invalid user ID:', params.id);
        throw error(400, 'Invalid user ID');
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    if (!user) {
        console.error('User not found:', userId);
        throw error(404, 'User not found');
    }

    // Fetch projects related to the user (via direct link or services)
    const userProjects = await db.select({
        id: projects.id,
        name: projects.name,
        status: projects.status,
        provider: projects.provider,
        startDate: projects.startDate,
        serviceName: services.name
    })
    .from(projects)
    .leftJoin(services, eq(projects.serviceId, services.id))
    .where(or(
        eq(projects.clientId, userId),
        eq(services.clientId, userId)
    ))
    .orderBy(desc(projects.createdAt));

    // Fetch payments related to the user's projects
    const userPayments = await db.select({
        id: payments.id,
        title: payments.title,
        amount: payments.amount,
        status: payments.status,
        dueDate: payments.dueDate,
        projectName: projects.name
    })
    .from(payments)
    .innerJoin(projects, eq(payments.projectId, projects.id))
    .leftJoin(services, eq(projects.serviceId, services.id))
    .where(or(
        eq(projects.clientId, userId),
        eq(services.clientId, userId)
    ))
    .orderBy(desc(payments.dueDate));

    // Fetch support cases related to the user's projects
    const userCases = await db.select({
        id: cases.id,
        title: cases.title,
        status: cases.status,
        priority: cases.priority,
        createdAt: cases.createdAt,
        projectName: projects.name
    })
    .from(cases)
    .innerJoin(projects, eq(cases.projectId, projects.id))
    .leftJoin(services, eq(projects.serviceId, services.id))
    .where(or(
        eq(projects.clientId, userId),
        eq(services.clientId, userId)
    ))
    .orderBy(desc(cases.createdAt));

    // Empresas en las que el usuario está (owner, admin, member)
    const userCompanyLinks = await db.query.userCompanies.findMany({
        where: eq(userCompanies.userId, userId),
        with: { company: { columns: { id: true, name: true } } }
    });
    const userCompaniesList = userCompanyLinks.map((uc) => ({
        linkId: uc.id,
        companyId: uc.companyId,
        companyName: uc.company?.name ?? '—',
        role: uc.role ?? 'member',
        status: uc.status ?? 'active',
        isPrimary: uc.isPrimary ?? false
    }));

    return {
        user,
        projects: userProjects,
        payments: userPayments,
        cases: userCases,
        userCompaniesList
    };
};

export const actions = {
    updateUser: async ({ request, params }: import('./$types').RequestEvent) => {
        const userId = Number(params.id);
        const formData = await request.formData();

        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { firstName: true, lastName: true, email: true, role: true, phone: true, avatarUrl: true, notes: true, company: true, jobTitle: true, addresses: true, companyLinks: true, identification: true }
        });
        if (!currentUser) return fail(404, { message: 'Usuario no encontrado' });

        const rawFirst = formData.get('firstName');
        const rawLast = formData.get('lastName');
        const rawEmail = formData.get('email');
        const rawPhone = formData.get('phone');
        const rawAvatar = formData.get('avatarUrl');
        const rawNotes = formData.get('notes');
        const role = (formData.get('role') as string) || currentUser.role;

        const trimmedFirst = typeof rawFirst === 'string' ? rawFirst.trim() : '';
        const trimmedLast = typeof rawLast === 'string' ? rawLast.trim() : '';
        const trimmedEmail = typeof rawEmail === 'string' ? rawEmail.trim() : '';
        const trimmedPhone = typeof rawPhone === 'string' ? rawPhone.trim() : '';

        const firstName = trimmedFirst !== '' ? trimmedFirst : (currentUser.firstName ?? '');
        const lastName = trimmedLast !== '' ? trimmedLast : (currentUser.lastName ?? '');
        const email = trimmedEmail !== '' ? trimmedEmail : (currentUser.email ?? '');
        const phone = trimmedPhone !== '' ? trimmedPhone : (currentUser.phone ?? '');
        const avatarUrl = typeof rawAvatar === 'string' ? rawAvatar.trim() : (currentUser.avatarUrl ?? '');
        const notes = typeof rawNotes === 'string' ? rawNotes.trim() : (currentUser.notes ?? '');

        const addressesJson = formData.get('addresses') as string;
        const companyLinksJson = formData.get('companyLinks') as string;
        const identificationJson = formData.get('identification') as string;
        const company = formData.get('company') as string | null;
        const jobTitle = formData.get('jobTitle') as string | null;

        let identification: unknown[] = [];
        try {
            if (identificationJson && identificationJson.trim() !== '') {
                identification = JSON.parse(identificationJson);
            } else {
                identification = Array.isArray(currentUser.identification) ? currentUser.identification : [];
            }
        } catch (e) {
            console.error('Error parsing identification JSON', e);
            identification = Array.isArray(currentUser.identification) ? currentUser.identification : [];
        }

        let addresses: unknown[] = [];
        try {
            if (addressesJson && addressesJson.trim() !== '') {
                addresses = JSON.parse(addressesJson);
            } else {
                addresses = Array.isArray(currentUser.addresses) ? currentUser.addresses : [];
            }
        } catch (e) {
            console.error('Error parsing addresses JSON', e);
            addresses = Array.isArray(currentUser.addresses) ? currentUser.addresses : [];
        }

        let companyLinks: unknown[] = [];
        try {
            if (companyLinksJson && companyLinksJson.trim() !== '') {
                companyLinks = JSON.parse(companyLinksJson);
            } else {
                companyLinks = Array.isArray(currentUser.companyLinks) ? currentUser.companyLinks : [];
            }
        } catch (e) {
            console.error('Error parsing companyLinks JSON', e);
            companyLinks = Array.isArray(currentUser.companyLinks) ? currentUser.companyLinks : [];
        }

        const updatePayload = {
            firstName,
            lastName,
            email,
            role,
            phone,
            avatarUrl: avatarUrl || null,
            notes: notes || null,
            addresses: addresses.length > 0 ? addresses : null,
            companyLinks: companyLinks.length > 0 ? companyLinks : null,
            identification: identification.length > 0 ? identification : null,
            company: company != null && String(company).trim() !== '' ? String(company).trim() : currentUser.company,
            jobTitle: jobTitle != null && String(jobTitle).trim() !== '' ? String(jobTitle).trim() : currentUser.jobTitle
        };

        try {
            await db.update(users)
                .set(updatePayload)
                .where(eq(users.id, userId));

            const updated = await db.query.users.findFirst({
                where: eq(users.id, userId),
                columns: { id: true, firstName: true, lastName: true, email: true, role: true, phone: true, avatarUrl: true, notes: true, addresses: true, companyLinks: true, identification: true }
            });
            return { success: true, user: updated ?? currentUser };
        } catch (err) {
            console.error('Error updating user:', err);
            return fail(500, { message: 'Failed to update user' });
        }
    }
};
;null as any as Actions;