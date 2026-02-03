import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { uploadFile, getSignedUrlForFile } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        throw redirect(303, `/${params.workspace}/auth/login`);
    }

    const userData = await db.query.users.findFirst({
        where: eq(users.id, parseInt(locals.user.id))
    });

    if (!userData) {
        throw redirect(303, `/${params.workspace}/auth/login`);
    }

    if (userData.avatarUrl) {
        userData.avatarUrl = await getSignedUrlForFile(userData.avatarUrl, params.workspace);
    }

    return {
        profile: userData
    };
};

export const actions: Actions = {
    updateProfile: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const updateData: any = {};

        // Helper to conditionally add simple text fields
        const textFields = ['firstName', 'lastName', 'phone', 'jobTitle', 'company'];
        for (const field of textFields) {
            if (formData.has(field)) {
                updateData[field] = formData.get(field) as string;
            }
        }

        // Parse JSONs if present
        const identificationJson = formData.get('identification') as string;
        if (formData.has('identification') && identificationJson) {
            try {
                updateData.identification = JSON.parse(identificationJson);
            } catch (e) {
                console.error('Error parsing identification JSON', e);
            }
        }

        const linksJson = formData.get('links') as string;
        if (formData.has('links') && linksJson) {
            try {
                updateData.companyLinks = JSON.parse(linksJson);
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

        // Handle Avatar Deletion
        const deleteAvatar = formData.get('deleteAvatar');
        if (deleteAvatar === 'true') {
            updateData.avatarUrl = null;
        }

        // Handle File Uploads
        const avatar = formData.get('avatar') as File;
        if (avatar && avatar.size > 0 && avatar.name && avatar.name !== 'undefined') {
            try {
                const url = await uploadFile(avatar, 'avatars');
                updateData.avatarUrl = url;
            } catch (err) {
                console.error('Error uploading avatar:', err);
                return fail(500, { message: 'Error uploading avatar' });
            }
        }

        const logo = formData.get('logo') as File;
        if (logo && logo.size > 0 && logo.name && logo.name !== 'undefined') {
            try {
                const url = await uploadFile(logo, 'logos');
                updateData.companyLogo = url;
            } catch (err) {
                console.error('Error uploading logo:', err);
                return fail(500, { message: 'Error uploading logo' });
            }
        }

        if (Object.keys(updateData).length === 0) {
            return { success: true, message: 'No se detectaron cambios' };
        }

        try {
            await db.update(users)
                .set(updateData)
                .where(eq(users.id, parseInt(locals.user.id)));
            
            return { success: true, message: 'Guardado correctamente' };
        } catch (err) {
            console.error('Error updating profile:', err);
            return fail(500, { message: 'Error updating profile' });
        }
    }
};
