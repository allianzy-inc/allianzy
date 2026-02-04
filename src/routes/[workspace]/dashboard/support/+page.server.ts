import { db } from '$lib/server/db';
import { cases, projects, services, users, caseComments, workspaces } from '$lib/server/schema';
import { eq, desc, or, and, sql, asc, isNull } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { uploadFile, getSignedUrlForFile } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals, url, params }) => {
    const userId = Number(locals.user?.id);

    if (!userId || isNaN(userId)) {
        return { tickets: [], projectsList: [], selectedCaseComments: [] };
    }

    // 1. Fetch user's tickets
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

    // 2. Fetch user's projects for the dropdown
    const projectsList = await db.select({
        id: projects.id,
        name: projects.name,
        serviceName: services.name
    })
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
                files: caseComments.files
            })
            .from(caseComments)
            .where(eq(caseComments.caseId, Number(selectedCaseId)))
            .orderBy(asc(caseComments.createdAt));

            selectedCaseComments = await Promise.all(rawComments.map(async (c) => {
                 let files = c.files as any[];
                 if (files && Array.isArray(files)) {
                     files = await Promise.all(files.map(async (f) => ({
                         ...f,
                         url: await getSignedUrlForFile(f.url, params.workspace)
                     })));
                 }
                 return { ...c, files };
            }));
        }
    }

    return {
        tickets,
        projectsList,
        selectedCaseComments,
        user: locals.user
    };
};

export const actions: Actions = {
    createCase: async ({ request, locals, params }) => {
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
            // Get workspaceId from project
            const project = await db.select({ serviceId: projects.serviceId }).from(projects).where(eq(projects.id, projectId)).limit(1);
            let workspaceId: number | null = null;
            if (project.length > 0 && project[0].serviceId) {
                const service = await db.select({ workspaceId: services.workspaceId }).from(services).where(eq(services.id, project[0].serviceId)).limit(1);
                if (service.length > 0) workspaceId = service[0].workspaceId;
            }

            await db.insert(cases).values({
                projectId,
                title,
                description,
                content: description || '',
                priority,
                status,
                files: uploadedFiles
            });
            return { success: true };
        } catch (err) {
            console.error('Error creating case:', err);
            return fail(500, { message: 'Failed to create case' });
        }
    },

    addCaseComment: async ({ request, locals }) => {
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
