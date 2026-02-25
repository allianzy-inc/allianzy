// @ts-nocheck
import { db } from '$lib/server/db';
import { cases, projects, services, users, caseComments, workspaces, userCompanies, notifications } from '$lib/server/schema';
import { eq, desc, or, and, sql, asc, isNull, inArray } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { uploadFile, getSignedUrlForFile } from '$lib/server/storage';
import { sendEmail } from '$lib/server/email';
import { env } from '$env/dynamic/private';

export const load = async ({ locals, url, params }: Parameters<PageServerLoad>[0]) => {
    const userId = Number(locals.user?.id);

    if (!userId || isNaN(userId)) {
        return { tickets: [], projectsList: [], selectedCaseComments: [] };
    }

    // 0. Fetch permissions
    let allowedProjectIds: number[] = [];
    if (locals.user?.companyId) {
        const userCompany = await db.query.userCompanies.findFirst({
            where: and(
                eq(userCompanies.userId, userId),
                eq(userCompanies.companyId, locals.user.companyId)
            )
        });

        if (userCompany && userCompany.permissions) {
            const perms = userCompany.permissions as Record<string, string[]>;
            for (const [pid, pList] of Object.entries(perms)) {
                if (Array.isArray(pList) && pList.includes('support')) {
                    allowedProjectIds.push(Number(pid));
                }
            }
        }
    }

    const companyId = locals.user?.companyId ?? null;
    const sameCompanyFilter = companyId ? or(eq(projects.companyId, companyId), isNull(projects.companyId)) : undefined;

    const ticketConditions: any[] = [
        companyId ? and(eq(projects.clientId, userId), sameCompanyFilter) : eq(projects.clientId, userId),
        companyId
            ? and(eq(workspaces.slug, params.workspace), eq(services.clientId, userId), isNull(projects.clientId), sameCompanyFilter)
            : and(eq(workspaces.slug, params.workspace), eq(services.clientId, userId), isNull(projects.clientId))
    ];
    if (allowedProjectIds.length > 0) {
        ticketConditions.push(companyId ? and(inArray(projects.id, allowedProjectIds), sameCompanyFilter) : inArray(projects.id, allowedProjectIds));
    }

    // 1. Fetch user's tickets (solo de la empresa seleccionada)
    const rawTickets = await db.select({
        id: cases.id,
        title: cases.title,
        description: cases.description,
        status: cases.status,
        priority: cases.priority,
        createdAt: cases.createdAt,
        files: cases.files,
        projectName: projects.name,
        serviceName: services.name,
        projectId: projects.id
    })
    .from(cases)
    .innerJoin(projects, eq(cases.projectId, projects.id))
    .leftJoin(services, eq(projects.serviceId, services.id))
    .leftJoin(workspaces, eq(services.workspaceId, workspaces.id))
    .where(or(...ticketConditions))
    .orderBy(desc(cases.createdAt));

    const tickets = await Promise.all(rawTickets.map(async (t) => {
        let files = t.files as any[];
        if (files && Array.isArray(files)) {
            files = await Promise.all(files.map(async (f) => {
                const newUrl = await getSignedUrlForFile(f.url, params.workspace);
                return { ...f, url: newUrl };
            }));
        }
        return { ...t, files };
    }));

    const projectConditions: any[] = [
        companyId ? and(eq(projects.clientId, userId), sameCompanyFilter) : eq(projects.clientId, userId),
        companyId
            ? and(eq(workspaces.slug, params.workspace), eq(services.clientId, userId), isNull(projects.clientId), sameCompanyFilter)
            : and(eq(workspaces.slug, params.workspace), eq(services.clientId, userId), isNull(projects.clientId))
    ];
    if (allowedProjectIds.length > 0) {
        projectConditions.push(companyId ? and(inArray(projects.id, allowedProjectIds), sameCompanyFilter) : inArray(projects.id, allowedProjectIds));
    }

    // 2. Fetch user's projects for the dropdown (solo de la empresa seleccionada)
    const projectsList = await db.select({
        id: projects.id,
        name: projects.name,
        serviceName: services.name
    })
    .from(projects)
    .leftJoin(services, eq(projects.serviceId, services.id))
    .leftJoin(workspaces, eq(services.workspaceId, workspaces.id))
    .where(or(...projectConditions))
    .orderBy(desc(projects.createdAt));

    // 3. Fetch comments for selected case
    let selectedCaseComments: any[] = [];
    const selectedCaseId = url.searchParams.get('caseId');
    if (selectedCaseId) {
        // Verify access to the case
        const caseExists = tickets.find(t => t.id === Number(selectedCaseId));
        
        if (caseExists) {
            const rawComments = await db.select({
                id: caseComments.id,
                content: caseComments.content,
                createdAt: caseComments.createdAt,
                authorName: caseComments.authorName,
                subject: caseComments.subject,
                userId: caseComments.userId,
                authorRole: users.role,
                companyRole: sql<string>`(SELECT role FROM ${userCompanies} WHERE ${userCompanies.userId} = ${users.id} LIMIT 1)`,
                files: caseComments.files
            })
            .from(caseComments)
            .leftJoin(users, eq(caseComments.userId, users.id))
            .where(eq(caseComments.caseId, Number(selectedCaseId)))
            .orderBy(asc(caseComments.createdAt));

            selectedCaseComments = rawComments.map((c) => {
                 let files = c.files as any[];
                 if (files && Array.isArray(files)) {
                     files = files.map((f) => ({
                         ...f,
                         url: getSignedUrlForFile(f.url, params.workspace)
                     }));
                 }
                 return { ...c, files };
            });
        }
    }

    return {
        tickets,
        projectsList,
        selectedCaseComments,
        user: locals.user
    };
};

export const actions = {
    createCase: async ({ request, locals, params }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        let projectId = Number(formData.get('projectId'));
        let title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as string;
        const status = 'open';
        
        // Handle missing projectId: find first available project for user
        if (!projectId || isNaN(projectId)) {
             const userId = Number(locals.user?.id);
             if (userId) {
                const firstProject = await db.select({ id: projects.id })
                    .from(projects)
                    .leftJoin(services, eq(projects.serviceId, services.id))
                    .leftJoin(workspaces, eq(services.workspaceId, workspaces.id))
                    .where(or(
                        // 1. Direct Project Assignment
                        eq(projects.clientId, userId),
                
                        // 2. Service Fallback (Only if Project has NO specific client assigned)
                        and(
                            eq(workspaces.slug, params.workspace),
                            eq(services.clientId, userId),
                            isNull(projects.clientId)
                        )
                    ))
                    .orderBy(desc(projects.createdAt))
                    .limit(1);
                
                if (firstProject.length > 0) {
                    projectId = firstProject[0].id;
                }
             }
        }

        // Handle missing or generic title: generate from description
        if (!title || title === 'Nueva Solicitud') {
             // Generate title from first 50 chars of description
             if (description) {
                 title = description.substring(0, 50) + (description.length > 50 ? '...' : '');
             } else {
                 title = 'Nueva Solicitud de Soporte';
             }
        }
        
        const uploadedFiles = [];
        const files = formData.getAll('files') as File[];
        
        for (const file of files) {
            if (file.size > 0 && file.name && file.name !== 'undefined') {
                 const url = await uploadFile(file, 'cases');
                 uploadedFiles.push({
                     name: file.name,
                     url: url,
                     type: file.type
                 });
            }
        }

        if (!title || !projectId) {
            return fail(400, { message: 'Project is required. Please ensure you have at least one active project.' });
        }

        try {
            // Get workspace (id + slug) from project for notifications
            const projectRows = await db
                .select({
                    serviceId: projects.serviceId,
                    workspaceId: services.workspaceId,
                    workspaceSlug: workspaces.slug
                })
                .from(projects)
                .innerJoin(services, eq(projects.serviceId, services.id))
                .innerJoin(workspaces, eq(services.workspaceId, workspaces.id))
                .where(eq(projects.id, projectId))
                .limit(1);

            const [inserted] = await db
                .insert(cases)
                .values({
                    projectId,
                    title,
                    description,
                    content: description || '',
                    priority,
                    status,
                    files: uploadedFiles
                })
                .returning({ id: cases.id });

            const caseId = inserted?.id;

            // Notify admins by email when workspace is known
            if (projectRows.length > 0 && caseId) {
                const workspaceId = projectRows[0].workspaceId;
                const workspaceSlug = projectRows[0].workspaceSlug;
                if (workspaceId) {
                    const adminUsers = await db
                        .select({ id: users.id, email: users.email })
                        .from(users)
                        .where(and(eq(users.workspaceId, workspaceId), eq(users.role, 'admin')));
                    const adminEmails = adminUsers.map((u) => u.email).filter((e): e is string => !!e && e.length > 0);
                    const supportLink = `/${workspaceSlug}/admin/support?caseId=${caseId}`;
                    for (const admin of adminUsers) {
                        if (admin.id) {
                            await db.insert(notifications).values({
                                userId: admin.id,
                                title: 'Nueva consulta de soporte',
                                message: title,
                                type: 'info',
                                link: supportLink
                            });
                        }
                    }
                    if (adminEmails.length > 0) {
                        const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                        const baseUrl = (env.PUBLIC_APP_URL || env.APP_BASE_URL || '').replace(/\/$/, '');
                        const supportPath = `/${workspaceSlug}/admin/support?caseId=${caseId}`;
                        const projectPath = `/${workspaceSlug}/admin/projects/${projectId}`;
                        const supportLinkAbs = baseUrl ? `${baseUrl}${supportPath}` : supportPath;
                        const projectPathFull = `/${workspaceSlug}/admin/projects/${projectId}`;
                        const projectLink = baseUrl ? `${baseUrl}${projectPathFull}` : projectPathFull;
                        const subject = `Nueva consulta de soporte: ${title}`;
                        const safeTitle = escape(title);
                        const safeDesc = description ? escape(description.slice(0, 500)) + (description.length > 500 ? '…' : '') : '';
                        const html = `
                            <p>Un cliente ha creado una nueva consulta de soporte.</p>
                            <p><strong>Título:</strong> ${safeTitle}</p>
                            ${safeDesc ? `<p><strong>Descripción:</strong> ${safeDesc}</p>` : ''}
                            <p><strong>Prioridad:</strong> ${priority || 'medium'}</p>
                            <p>Accede al panel de administración para ver y responder el ticket:</p>
                            <p><a href="${supportLinkAbs}">Ver Soporte</a> · <a href="${projectLink}">Ver en el proyecto</a></p>
                        `;
                        await sendEmail({
                            to: adminEmails,
                            subject,
                            html
                        });
                    }
                }
            }

            return { success: true };
        } catch (err) {
            console.error('Error creating case:', err);
            return fail(500, { message: 'Failed to create case' });
        }
    },

    addCaseComment: async ({ request, locals }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const caseId = Number(formData.get('caseId'));
        const content = formData.get('content') as string;
        const subject = formData.get('subject') as string;
        
        const uploadedFiles = [];
        const files = formData.getAll('files') as File[];
        
        for (const file of files) {
            if (file.size > 0 && file.name && file.name !== 'undefined') {
                 const url = await uploadFile(file, 'cases');
                 uploadedFiles.push({
                     name: file.name,
                     url: url,
                     type: file.type
                 });
            }
        }
        
        if (!caseId || !content) {
            return fail(400, { message: 'Case ID and Content are required' });
        }

        const authorName = locals.user ? `${locals.user.firstName} ${locals.user.lastName}` : 'Client';
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
            return { success: true };
        } catch (err) {
            console.error('Error adding comment:', err);
            return fail(500, { message: 'Failed to add comment' });
        }
    }
};
;null as any as Actions;