import { db } from '$lib/server/db';
import { cases, projects, services, users, workspaces, caseComments } from '$lib/server/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getSignedUrlForFile } from '$lib/server/storage';
import { uploadFile } from '$lib/server/storage';
import { notifications } from '$lib/server/schema';
import { sendSupportNotification } from '$lib/server/email';

export const load: PageServerLoad = async ({ params, url }) => {
    const rows = await db
        .select({
            id: cases.id,
            title: cases.title,
            description: cases.description,
            status: cases.status,
            priority: cases.priority,
            createdAt: cases.createdAt,
            projectId: cases.projectId,
            projectName: projects.name,
            clientFirstName: users.firstName,
            clientLastName: users.lastName,
            clientEmail: users.email
        })
        .from(cases)
        .innerJoin(projects, eq(cases.projectId, projects.id))
        .innerJoin(services, eq(projects.serviceId, services.id))
        .innerJoin(workspaces, eq(services.workspaceId, workspaces.id))
        .leftJoin(users, eq(projects.clientId, users.id))
        .where(eq(workspaces.slug, params.workspace))
        .orderBy(desc(cases.createdAt));

    const tickets = rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        status: r.status,
        priority: r.priority,
        createdAt: r.createdAt,
        projectId: r.projectId,
        projectName: r.projectName,
        clientName: [r.clientFirstName, r.clientLastName].filter(Boolean).join(' ').trim() || r.clientEmail || '—',
        clientEmail: r.clientEmail
    }));

    let selectedCase: (typeof tickets)[0] & { files?: any[] } | null = null;
    let selectedCaseComments: any[] = [];
    const selectedCaseId = url.searchParams.get('caseId');
    if (selectedCaseId) {
        const caseRow = tickets.find((t) => t.id === Number(selectedCaseId));
        if (caseRow) {
            selectedCase = { ...caseRow };
            const fullCase = await db.select({ files: cases.files }).from(cases).where(eq(cases.id, Number(selectedCaseId))).limit(1);
            if (fullCase.length > 0 && fullCase[0].files && Array.isArray(fullCase[0].files)) {
                const files = await Promise.all(
                    (fullCase[0].files as any[]).map(async (f) => ({ ...f, url: await getSignedUrlForFile(f.url, params.workspace) }))
                );
                selectedCase.files = files;
            } else {
                selectedCase.files = [];
            }
            const rawCommentsSimple = await db
                .select({
                    id: caseComments.id,
                    content: caseComments.content,
                    createdAt: caseComments.createdAt,
                    authorName: caseComments.authorName,
                    subject: caseComments.subject,
                    userId: caseComments.userId,
                    authorRole: users.role,
                    files: caseComments.files
                })
                .from(caseComments)
                .leftJoin(users, eq(caseComments.userId, users.id))
                .where(eq(caseComments.caseId, Number(selectedCaseId)))
                .orderBy(asc(caseComments.createdAt));
            selectedCaseComments = await Promise.all(
                rawCommentsSimple.map(async (c) => {
                    let files = c.files as any[];
                    if (files && Array.isArray(files)) {
                        files = await Promise.all(files.map(async (f) => ({ ...f, url: await getSignedUrlForFile(f.url, params.workspace) })));
                    }
                    return { ...c, companyRole: null, files: files ?? [] };
                })
            );
        }
    }

    return { tickets, selectedCase, selectedCaseComments };
};

export const actions: Actions = {
    addCaseComment: async ({ request, locals, params }) => {
        const formData = await request.formData();
        const caseId = Number(formData.get('caseId'));
        const content = formData.get('content') as string;
        const subject = formData.get('subject') as string;
        const uploadedFiles: any[] = [];
        const files = formData.getAll('files') as File[];
        for (const file of files) {
            if (file.size > 0 && file.name && file.name !== 'undefined') {
                const url = await uploadFile(file, 'cases');
                uploadedFiles.push({ name: file.name, url, type: file.type });
            }
        }
        if (!caseId || !content) {
            return fail(400, { message: 'Case ID and Content are required' });
        }
        const caseInWorkspace = await db
            .select({ id: cases.id })
            .from(cases)
            .innerJoin(projects, eq(cases.projectId, projects.id))
            .innerJoin(services, eq(projects.serviceId, services.id))
            .innerJoin(workspaces, eq(services.workspaceId, workspaces.id))
            .where(and(eq(cases.id, caseId), eq(workspaces.slug, params.workspace)))
            .limit(1);
        if (caseInWorkspace.length === 0) {
            return fail(404, { message: 'Case not found in this workspace' });
        }
        const authorName = locals.user ? `${locals.user.firstName || ''} ${locals.user.lastName || ''}`.trim() || 'Admin' : 'Admin';
        const userId = locals.user ? parseInt(locals.user.id) : null;
        try {
            await db.insert(caseComments).values({
                caseId,
                userId,
                authorName,
                subject,
                content,
                files: uploadedFiles
            });
            const caseRow = await db.select({ projectId: cases.projectId }).from(cases).where(eq(cases.id, caseId)).limit(1);
            if (caseRow.length > 0 && caseRow[0].projectId) {
                const proj = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, caseRow[0].projectId)).limit(1);
                if (proj.length > 0 && proj[0].clientId) {
                    await db.insert(notifications).values({
                        userId: proj[0].clientId,
                        title: 'Nuevo mensaje de soporte',
                        message: `Nuevo comentario en el ticket: ${subject || content.slice(0, 50)}`,
                        type: 'info',
                        link: `/${params.workspace}/dashboard/support?caseId=${caseId}`
                    });
                }
            }
            const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const safeContent = content ? escape(content.slice(0, 500)) + (content.length > 500 ? '…' : '') : '';
            await sendSupportNotification({
                subject: `[Admin Soporte] Nuevo mensaje en ticket #${caseId}: ${subject || 'Sin asunto'}`,
                html: `<p><strong>Admin</strong> ha respondido en el ticket #${caseId}.</p><p><strong>Asunto:</strong> ${subject ? escape(subject) : '—'}</p><p><strong>Mensaje:</strong></p><p>${safeContent}</p>`
            });
            return { success: true };
        } catch (err) {
            console.error('Error adding comment:', err);
            return fail(500, { message: 'Failed to add comment' });
        }
    }
};
