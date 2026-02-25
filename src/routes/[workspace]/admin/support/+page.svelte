<script lang="ts">
    import { MessageSquare, ExternalLink, X, FileText, Paperclip, Send, Download, Eye, ChevronDown, ChevronUp } from 'lucide-svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { portal } from '$lib/actions/portal';
    import type { PageData } from './$types';

    export let data: PageData;

    $: workspace = $page.params.workspace;
    $: tickets = data.tickets ?? [];
    $: selectedCase = data.selectedCase ?? null;
    $: selectedCaseComments = data.selectedCaseComments ?? [];

    let isCaseDescriptionExpanded = false;
    let commentContent = '';
    let commentFiles: File[] = [];

    function openChat(ticket: { id: number }) {
        goto(`/${workspace}/admin/support?caseId=${ticket.id}`, { replaceState: true, noScroll: true });
    }

    function closeChat() {
        const url = new URL($page.url);
        url.searchParams.delete('caseId');
        goto(url.pathname + url.search, { replaceState: true, noScroll: true });
    }

    function formatDate(date: string | Date | null) {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function isPreviewable(file: { type?: string; name?: string }) {
        if (file.type?.startsWith('image/') || file.type?.includes('pdf')) return true;
        return /\.(jpeg|jpg|png|gif|webp|pdf)$/i.test(file.name || '');
    }

    function handleCommentFileSelect(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files) {
            commentFiles = [...commentFiles, ...Array.from(target.files)];
            target.value = '';
        }
    }

    function removeCommentFile(i: number) {
        commentFiles = commentFiles.filter((_, idx) => idx !== i);
    }

    function getStatusColor(status: string) {
        if (status === 'closed') return 'bg-muted text-muted-foreground';
        if (status === 'in_progress') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    }

    function getStatusLabel(status: string) {
        const map: Record<string, string> = { open: 'Abierto', in_progress: 'En progreso', closed: 'Cerrado' };
        return map[status] || status;
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold tracking-tight">Soporte</h2>
        <a
            href="/{workspace}/admin/projects"
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2"
        >
            <MessageSquare class="w-4 h-4" />
            Crear Ticket
        </a>
    </div>

    <div class="rounded-md border">
        <div class="p-4">
            <h3 class="font-medium mb-4">Tickets Recientes</h3>
            {#if tickets.length === 0}
                <p class="text-sm text-muted-foreground">No hay tickets recientes.</p>
            {:else}
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b text-left">
                                <th class="pb-2 pr-4 font-medium">Título</th>
                                <th class="pb-2 pr-4 font-medium">Cliente</th>
                                <th class="pb-2 pr-4 font-medium">Proyecto</th>
                                <th class="pb-2 pr-4 font-medium">Estado</th>
                                <th class="pb-2 pr-4 font-medium">Prioridad</th>
                                <th class="pb-2 font-medium">Fecha</th>
                                <th class="w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each tickets as ticket}
                                <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                                <tr
                                    class="border-b last:border-0 hover:bg-muted/50 cursor-pointer"
                                    on:click={() => openChat(ticket)}
                                >
                                    <td class="py-3 pr-4">{ticket.title}</td>
                                    <td class="py-3 pr-4">{ticket.clientName}</td>
                                    <td class="py-3 pr-4">{ticket.projectName ?? '—'}</td>
                                    <td class="py-3 pr-4">
                                        <span
                                            class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                                                {ticket.status === 'closed'
                                                ? 'bg-muted text-muted-foreground'
                                                : ticket.status === 'in_progress'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}"
                                        >
                                            {ticket.status === 'open'
                                                ? 'Abierto'
                                                : ticket.status === 'in_progress'
                                                    ? 'En progreso'
                                                    : ticket.status === 'closed'
                                                        ? 'Cerrado'
                                                        : ticket.status}
                                        </span>
                                    </td>
                                    <td class="py-3 pr-4">
                                        <span
                                            class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                                                {ticket.priority === 'high'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                : ticket.priority === 'medium'
                                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                                    : 'bg-muted text-muted-foreground'}"
                                        >
                                            {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Media' : ticket.priority === 'low' ? 'Baja' : ticket.priority}
                                        </span>
                                    </td>
                                    <td class="py-3 pr-4 text-muted-foreground">
                                        {ticket.createdAt
                                            ? new Date(ticket.createdAt).toLocaleDateString('es', {
                                                  day: '2-digit',
                                                  month: 'short',
                                                  year: 'numeric'
                                              })
                                            : '—'}
                                    </td>
                                    <td class="py-3" on:click|stopPropagation>
                                        <a
                                            href="/{workspace}/admin/projects/{ticket.projectId}"
                                            class="text-primary hover:underline inline-flex items-center gap-1"
                                            title="Ver en el proyecto"
                                        >
                                            <ExternalLink class="w-4 h-4" />
                                        </a>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
    </div>

    <!-- Chat modal (same as client) -->
    {#if selectedCase}
        <div
            use:portal
            class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-end"
            on:click={closeChat}
            role="button"
            tabindex="0"
            on:keydown={(e) => e.key === 'Escape' && closeChat()}
        >
            <div
                class="bg-card h-full w-full max-w-2xl border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden"
                on:click|stopPropagation
                role="presentation"
            >
                <div class="p-6 border-b flex items-start justify-between bg-card shrink-0">
                    <div class="space-y-1">
                        <h3 class="text-xl font-bold">{selectedCase.title}</h3>
                        <div class="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                            <span>{selectedCase.clientName} · {selectedCase.projectName ?? '—'}</span>
                            <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold {getStatusColor(selectedCase.status || 'open')}">
                                {getStatusLabel(selectedCase.status || 'open')}
                            </span>
                        </div>
                    </div>
                    <button type="button" on:click={closeChat} class="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-full transition-colors">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div class="border-b bg-card shadow-sm shrink-0">
                        <button
                            type="button"
                            class="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                            on:click={() => (isCaseDescriptionExpanded = !isCaseDescriptionExpanded)}
                        >
                            <div class="flex items-center gap-2 font-medium text-sm">
                                <FileText class="w-4 h-4" />
                                <span>Detalle del Caso</span>
                            </div>
                            {#if isCaseDescriptionExpanded}
                                <ChevronUp class="w-4 h-4 text-muted-foreground" />
                            {:else}
                                <ChevronDown class="w-4 h-4 text-muted-foreground" />
                            {/if}
                        </button>
                        {#if isCaseDescriptionExpanded}
                            <div class="px-6 py-6 space-y-3 border-t text-sm text-muted-foreground whitespace-pre-wrap">
                                {selectedCase.description || 'Sin descripción'}
                                {#if selectedCase.files && selectedCase.files.length > 0}
                                    <div class="flex flex-wrap gap-2 mt-4">
                                        {#each selectedCase.files as file}
                                            <div class="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border text-sm">
                                                <FileText class="w-4 h-4 text-muted-foreground" />
                                                <span class="truncate max-w-[150px]">{file.name}</span>
                                                <a href={file.url} download={file.name} target="_blank" class="hover:text-primary" title="Descargar">
                                                    <Download class="w-3 h-3" />
                                                </a>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                        {#if selectedCaseComments.length === 0}
                            <div class="text-center py-8 text-muted-foreground text-sm">No hay mensajes aún. Escribe una respuesta abajo.</div>
                        {:else}
                            {#each selectedCaseComments as comment}
                                {@const isClient = comment.authorRole === 'client' || comment.authorRole === 'owner' || comment.authorRole === 'member'}
                                <div class="flex gap-3 {isClient ? 'flex-row-reverse' : ''}">
                                    <div class="w-8 h-8 rounded-full {isClient ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                                        {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div class="flex flex-col gap-1 max-w-[85%]">
                                        <div class="flex items-center gap-2 {isClient ? 'flex-row-reverse' : ''}">
                                            <span class="text-xs font-medium text-foreground">{comment.authorName || 'Usuario'}</span>
                                            <span class="text-[10px] text-muted-foreground">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        <div class="rounded-lg p-3 text-sm shadow-sm border {isClient ? 'bg-primary/10 text-foreground border-primary/20' : 'bg-muted/40 text-foreground border-border'}">
                                            <div class="whitespace-pre-wrap leading-relaxed">{comment.content}</div>
                                            {#if comment.files && comment.files.length > 0}
                                                <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
                                                    {#each comment.files as file}
                                                        <div class="flex items-center gap-2 px-2 py-1 bg-background rounded border text-xs">
                                                            <FileText class="w-3 h-3 text-muted-foreground" />
                                                            <span class="truncate max-w-[120px]">{file.name}</span>
                                                            <a href={file.url} target="_blank" class="hover:text-primary" title="Descargar">
                                                                <Download class="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    {/each}
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>

                    <div class="p-4 border-t bg-muted/10 shrink-0">
                        <form
                            method="POST"
                            action="?/addCaseComment"
                            enctype="multipart/form-data"
                            use:enhance={({ formData }) => {
                                formData.delete('files');
                                commentFiles.forEach((f) => formData.append('files', f));
                                return async ({ result, update }) => {
                                    if (result.type === 'success') {
                                        commentContent = '';
                                        commentFiles = [];
                                        await invalidateAll();
                                        await update();
                                    }
                                };
                            }}
                            class="space-y-4"
                        >
                            <input type="hidden" name="caseId" value={selectedCase.id} />
                            <input type="hidden" name="subject" value={selectedCase.title} />
                            <div class="space-y-2">
                                <textarea
                                    name="content"
                                    rows="3"
                                    class="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                                    placeholder="Escribe una respuesta al cliente..."
                                    bind:value={commentContent}
                                    required
                                ></textarea>
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="cursor-pointer inline-flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Adjuntar archivos">
                                    <Paperclip class="w-4 h-4" />
                                    <input type="file" name="files" multiple class="hidden" on:change={handleCommentFileSelect} />
                                </label>
                                <button
                                    type="submit"
                                    class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 flex items-center gap-2"
                                    disabled={!commentContent.trim()}
                                >
                                    <Send class="w-4 h-4" />
                                    Enviar
                                </button>
                            </div>
                            {#if commentFiles.length > 0}
                                <div class="flex flex-wrap gap-2">
                                    {#each commentFiles as file, i}
                                        <div class="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded border">
                                            <span class="truncate max-w-[100px]">{file.name}</span>
                                            <button type="button" on:click={() => removeCommentFile(i)} class="hover:text-destructive">
                                                <X class="w-3 h-3" />
                                            </button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>