
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { companies, userCompanies } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { uploadFile, getSignedUrlForFile } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        throw redirect(303, '/');
    }

    const companyId = locals.user.companyId;
    let companyData = null;
    let companyUsers: Array<{
        id: number | undefined;
        firstName: string | null | undefined;
        lastName: string | null | undefined;
        email: string | undefined;
        role: string | null;
        avatarUrl: string | null | undefined;
    }> = [];

    if (companyId) {
        // Fetch company details
        companyData = await db.query.companies.findFirst({
            where: eq(companies.id, companyId)
        });

        if (companyData && companyData.logo) {
             try {
                companyData.logo = await getSignedUrlForFile(companyData.logo, params.workspace);
             } catch (e) {
                console.error('Error signing logo url', e);
             }
        }

        // Fetch users in this company
        const userLinks = await db.query.userCompanies.findMany({
            where: eq(userCompanies.companyId, companyId),
            with: {
                user: true
            }
        });

        companyUsers = userLinks.map(link => ({
            id: link.user?.id,
            firstName: link.user?.firstName,
            lastName: link.user?.lastName,
            email: link.user?.email,
            role: link.role,
            avatarUrl: link.user?.avatarUrl
        }));
    }

    return {
        company: companyData,
        companyUsers: companyUsers
    };
};

export const actions: Actions = {
    updateCompany: async ({ request, locals }) => {
        if (!locals.user || !locals.user.companyId) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const updateData: any = {};

        // Helper to conditionally add simple text fields
        const textFields = ['name', 'phone', 'email', 'website', 'description'];
        for (const field of textFields) {
            if (formData.has(field)) {
                updateData[field] = formData.get(field) as string;
            }
        }

        // Parse JSONs if present
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

        // Handle Logo Deletion
        const deleteLogo = formData.get('deleteLogo');
        if (deleteLogo === 'true') {
            updateData.logo = null;
        }

        // Handle File Uploads
        const logo = formData.get('logo') as File;
        if (logo && logo.size > 0 && logo.name && logo.name !== 'undefined') {
            try {
                const url = await uploadFile(logo, 'logos');
                updateData.logo = url;
            } catch (err) {
                console.error('Error uploading logo:', err);
                return fail(500, { message: 'Error uploading logo' });
            }
        }

        if (Object.keys(updateData).length === 0) {
            return { success: true, message: 'No se detectaron cambios' };
        }

        try {
            await db.update(companies)
                .set(updateData)
                .where(eq(companies.id, locals.user.companyId));
            
            return { success: true, message: 'Guardado correctamente' };
        } catch (err) {
            console.error('Error updating company:', err);
            return fail(500, { message: 'Error updating company' });
        }
    }
};
