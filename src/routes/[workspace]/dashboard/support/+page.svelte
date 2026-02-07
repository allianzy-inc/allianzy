<script lang="ts">
    import { MessageSquare, Calendar, X, Plus, Paperclip, Send, FileText, Download, Eye, Loader2, ChevronUp, ChevronDown, AlertCircle, ArrowDown } from 'lucide-svelte';
    import { currentLang, translations } from '$lib/i18n';
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount, tick, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    import DocumentPreviewModal from '$lib/components/DocumentPreviewModal.svelte';
    import { portal } from '$lib/actions/portal';

    export let data: PageData;
    $: t = translations[$currentLang];
    $: tickets = data.tickets;
    $: projectsList = data.projectsList;
    $: selectedCaseComments = data.selectedCaseComments;
    $: user = data.user;

    // Scroll to bottom logic
    let showScrollButton = false;
    let chatContainer: HTMLElement;

    const scrollChatToBottom = () => {
        if (chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
    };

    function scrollToBottom(node: HTMLElement, { dependency }: { dependency: any }) {
        let isAutoScrolling = false;
        
        const checkScroll = () => {
            if (isAutoScrolling) return;
            const { scrollTop, scrollHeight, clientHeight } = node;
            const distance = scrollHeight - scrollTop - clientHeight;
            showScrollButton = distance > 100;
        };

        const scroll = (behavior: ScrollBehavior = 'smooth') => {
            if (!showScrollButton) {
                isAutoScrolling = true;
                node.scrollTo({ top: node.scrollHeight, behavior });
                setTimeout(() => { isAutoScrolling = false; }, 500);
            }
        };
        
        showScrollButton = false;
        node.scrollTo({ top: node.scrollHeight, behavior: 'auto' });
        
        node.addEventListener('scroll', checkScroll);

        return {
            update({ dependency: newDep }: { dependency: any }) {
                scroll('smooth');
            },
            destroy() {
                node.removeEventListener('scroll', checkScroll);
            }
        };
    }

    // Polling for real-time updates
    let pollInterval: ReturnType<typeof setInterval>;

    function startPolling() {
        // Poll every 5 seconds
        pollInterval = setInterval(async () => {
            // Only invalidate if the window is focused to save resources
            if (document.visibilityState === 'visible') {
                await invalidateAll();
            }
        }, 5000);
    }

    function stopPolling() {
        if (pollInterval) clearInterval(pollInterval);
    }

    onMount(() => {
        startPolling();
        
        // Handle visibility changes to pause polling when tab is inactive
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Do an immediate update when returning to tab
                invalidateAll(); 
                // Ensure polling is running (might have been stopped if we implemented stop-on-blur)
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    });

    onDestroy(() => {
        stopPolling();
    });

    // State
    let isCreateModalOpen = false;
    let isSubmitting = false;
    let isTicketDetailsOpen = false;
    let isCaseDescriptionExpanded = false;
    let selectedTicket: any = null;
    let createFiles: File[] = [];
    let commentFiles: File[] = [];
    let commentContent = '';
    const DEFAULT_SIGNATURE_TEXT = '--\n' + (user ? `${user.firstName} ${user.lastName}\n${user.email}` : 'Cliente');
    let signatureContent = DEFAULT_SIGNATURE_TEXT;
    
    // Default values for hidden fields
    let defaultProjectId: number | string = '';
    
    $: if (projectsList && projectsList.length > 0) {
        defaultProjectId = projectsList[0].id;
    }

    // Document Preview
    let isPreviewModalOpen = false;
    let previewFile: { title: string; url: string | null } = { title: '', url: null };

    function openPreview(title: string, url: string | null) {
        if (!url) return;
        previewFile = { title, url };
        isPreviewModalOpen = true;
    }

    function closePreview() {
        isPreviewModalOpen = false;
        previewFile = { title: '', url: null };
    }

    // URL Sync
    $: {
        const caseId = $page.url.searchParams.get('caseId');
        if (caseId && tickets) {
            const foundTicket = tickets.find((t: any) => t.id == caseId);
            if (foundTicket) {
                selectedTicket = foundTicket;
                isTicketDetailsOpen = true;
            }
        } else {
            // Ensure modal is closed if no caseId (e.g. back button)
            isTicketDetailsOpen = false;
            selectedTicket = null;
        }
    }

    // Create Modal Functions
    function openCreateModal() {
        createFiles = [];
        isCreateModalOpen = true;
    }

    function closeCreateModal() {
        isCreateModalOpen = false;
        createFiles = [];
    }

    function handleCreateFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            createFiles = [...createFiles, ...Array.from(target.files)];
            target.value = ''; // Reset input
        }
    }

    function removeCreateFile(index: number) {
        createFiles = createFiles.filter((_, i) => i !== index);
    }

    // Ticket Details Functions
    function openTicketDetails(ticket: any) {
        selectedTicket = ticket;
        const url = new URL(window.location.href);
        url.searchParams.set('caseId', String(ticket.id));
        goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
        isTicketDetailsOpen = true;
        // Reset comment form
        commentContent = '';
        commentFiles = [];
        signatureContent = DEFAULT_SIGNATURE_TEXT;
    }

    function closeTicketDetails() {
        isTicketDetailsOpen = false;
        selectedTicket = null;
        const url = new URL(window.location.href);
        url.searchParams.delete('caseId');
        goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
    }

    // Comment Functions
    function handleCommentFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            commentFiles = [...commentFiles, ...Array.from(target.files)];
            target.value = ''; // Reset input
        }
    }

    function removeCommentFile(index: number) {
        commentFiles = commentFiles.filter((_, i) => i !== index);
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'closed': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    }

    function getStatusLabel(status: string) {
        const map: Record<string, string> = {
            'open': 'Abierto',
            'in_progress': 'En Progreso',
            'closed': 'Cerrado'
        };
        return map[status] || status;
    }

    function formatDate(date: string | Date | null) {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Helper to check for previewable files
    function isPreviewable(file: any) {
        if (file.type?.startsWith('image/') || file.type?.includes('pdf')) return true;
        const name = file.name?.toLowerCase() || '';
        return /\.(jpeg|jpg|png|gif|webp|pdf)$/i.test(name);
    }
</script>

<DocumentPreviewModal 
    isOpen={isPreviewModalOpen} 
    title={previewFile.title} 
    fileUrl={previewFile.url} 
    onClose={closePreview} 
/>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-bold tracking-tight">{t.dashboard.page.support.title}</h2>
            <p class="text-muted-foreground">{t.dashboard.page.support.subtitle}</p>
        </div>
        <button 
            class="bg-primary text-primary-foreground p-2 sm:px-4 sm:py-2 rounded-md hover:opacity-90 flex items-center gap-2"
            on:click={openCreateModal}
            aria-label="Nueva solicitud"
        >
            <Plus class="w-5 h-5 sm:w-4 sm:h-4" />
            <span class="hidden sm:inline">Nueva solicitud</span>
        </button>
    </div>

    <!-- Create Ticket Modal -->
    {#if isCreateModalOpen}
        <div use:portal class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4" on:click={closeCreateModal} role="button" tabindex="0" on:keydown={(e) => e.key === 'Escape' && closeCreateModal()}>
            <div class="bg-card border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" on:click|stopPropagation role="presentation">
                <div class="p-6 border-b flex items-center justify-between sticky top-0 bg-card z-10">
                    <h3 class="text-lg font-semibold">Nueva Solicitud</h3>
                    <button on:click={closeCreateModal} class="text-muted-foreground hover:text-foreground">
                        <X class="w-5 h-5" />
                    </button>
                </div>
                <div class="p-6">
                    <form 
                        method="POST" 
                        action="?/createCase" 
                        enctype="multipart/form-data" 
                        use:enhance={({ formData }) => {
                            isSubmitting = true;
                            formData.delete('files');
                            createFiles.forEach(file => {
                                formData.append('files', file);
                            });
                            return async ({ result, update }) => {
                                isSubmitting = false;
                                console.log('Create case result:', result);
                                if (result.type === 'success') {
                                    closeCreateModal();
                                    await invalidateAll();
                                    update();
                                } else if (result.type === 'failure') {
                                    // Show error to user (you might want a toast notification here, 
                                    // but for now let's just alert or log it to see what's wrong)
                                    alert('Error al crear la solicitud: ' + (result.data?.message || 'Error desconocido'));
                                } else if (result.type === 'error') {
                                    alert('Error del servidor al crear la solicitud. Por favor intenta de nuevo.');
                                }
                            };
                        }}
                        class="space-y-4"
                    >
                        <!-- Hidden Fields for Priority -->
                        <input type="hidden" name="priority" value="medium" />
                        <!-- We let the server generate the title or pass a default one here? 
                             The user said "datos debe ser simple". 
                             We will hide the title input and let the server handle it or pass a hidden one.
                             Let's pass a generic one that the server can override if description is present.
                        -->
                        <input type="hidden" name="title" value="Nueva Solicitud" />

                        <div class="space-y-2">
                            <label for="projectId" class="text-sm font-medium">Proyecto / Servicio</label>
                            {#if projectsList && projectsList.length > 0}
                                <select name="projectId" id="projectId" class="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" bind:value={defaultProjectId} required>
                                    {#each projectsList as project}
                                        <option value={project.id}>
                                            {project.name} 
                                            {#if project.serviceName && project.serviceName !== project.name}
                                                ({project.serviceName})
                                            {/if}
                                        </option>
                                    {/each}
                                </select>
                            {:else}
                                <div class="p-3 text-sm text-yellow-600 bg-yellow-50 rounded-md border border-yellow-200">
                                    No tienes proyectos activos para crear una solicitud.
                                </div>
                            {/if}
                        </div>

                        <div class="space-y-2">
                            <label for="description" class="text-sm font-medium">Descripción</label>
                            <textarea name="description" id="description" rows="5" class="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none" placeholder="Describe el problema con el mayor detalle posible..." required></textarea>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium">Adjuntar archivos</label>
                            <div class="flex items-center gap-2">
                                <label class="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-background hover:bg-accent transition-colors">
                                    <Paperclip class="w-4 h-4" />
                                    <span class="text-sm">Seleccionar archivos</span>
                                    <input type="file" name="files" multiple class="hidden" on:change={handleCreateFileSelect} />
                                </label>
                                <span class="text-xs text-muted-foreground">Máx. 10MB por archivo</span>
                            </div>
                            {#if createFiles.length > 0}
                                <div class="space-y-1 mt-2">
                                    {#each createFiles as file, i}
                                        <div class="flex items-center justify-between text-sm p-2 bg-muted/50 rounded border">
                                            <span class="truncate max-w-[300px]">{file.name}</span>
                                            <button type="button" on:click={() => removeCreateFile(i)} class="text-muted-foreground hover:text-destructive">
                                                <X class="w-4 h-4" />
                                            </button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <div class="pt-4 flex justify-end gap-2">
                            <button type="button" on:click={closeCreateModal} class="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>Cancelar</button>
                            <button type="submit" class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" disabled={isSubmitting}>
                                {#if isSubmitting}
                                    <Loader2 class="w-4 h-4 animate-spin" />
                                    Guardando...
                                {:else}
                                    Crear solicitud
                                {/if}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    {/if}

    <!-- Ticket Details Modal (Conversation) -->
    {#if isTicketDetailsOpen && selectedTicket}
        <div use:portal class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-end" on:click={closeTicketDetails} role="button" tabindex="0" on:keydown={(e) => e.key === 'Escape' && closeTicketDetails()}>
            <div class="bg-card h-full w-full max-w-2xl border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" on:click|stopPropagation role="presentation">
                <!-- Header -->
                <div class="p-6 border-b flex items-start justify-between bg-card z-10">
                    <div class="space-y-1">
                        <h3 class="text-xl font-bold">{selectedTicket.title}</h3>
                        <div class="text-sm text-muted-foreground flex flex-col gap-0.5">
                            <span>{selectedTicket.projectName} {#if selectedTicket.serviceName}({selectedTicket.serviceName}){/if}</span>
                            <div class="flex items-center gap-3">
                                <span class="flex items-center gap-1">
                                    <Calendar class="w-3 h-3" /> Created {formatDate(selectedTicket.createdAt)}
                                </span>
                                <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold {getStatusColor(selectedTicket.status || 'open')}">
                                    {getStatusLabel(selectedTicket.status || 'open')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button on:click={closeTicketDetails} class="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-full transition-colors">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Content -->
                <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <!-- Collapsible Ticket Description -->
                    <div class="border-b bg-card z-10 shadow-sm shrink-0">
                        <button 
                            class="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                            on:click={() => isCaseDescriptionExpanded = !isCaseDescriptionExpanded}
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
                            <div class="px-6 py-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                <div class="text-sm text-muted-foreground whitespace-pre-wrap">{selectedTicket.description || 'Sin descripción'}</div>
                                
                                {#if selectedTicket.files && selectedTicket.files.length > 0}
                                    <div class="flex flex-wrap gap-2 mt-4">
                                        {#each selectedTicket.files as file}
                                            <div class="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border text-sm group">
                                                <FileText class="w-4 h-4 text-muted-foreground" />
                                                <span class="truncate max-w-[150px]">{file.name}</span>
                                                <div class="flex items-center gap-1 ml-2">
                                                    {#if isPreviewable(file)}
                                                        <button 
                                                            class="p-1 hover:bg-background rounded-full transition-colors"
                                                            title="Vista previa"
                                                            on:click={() => openPreview(file.name, file.url)}
                                                        >
                                                            <Eye class="w-3 h-3" />
                                                        </button>
                                                    {/if}
                                                    <a 
                                                        href={file.url} 
                                                        download={file.name}
                                                        class="p-1 hover:bg-background rounded-full transition-colors"
                                                        title="Descargar"
                                                        target="_blank"
                                                    >
                                                        <Download class="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Chat Area -->
                    <div 
                        class="flex-1 overflow-y-auto p-4 space-y-4 relative bg-muted/5"
                        use:scrollToBottom={{ dependency: selectedCaseComments }}
                        bind:this={chatContainer}
                    >
                        {#if !selectedCaseComments || selectedCaseComments.length === 0}
                            <div class="text-center py-8 text-muted-foreground text-sm">
                                No hay mensajes aún. Inicia la conversación abajo.
                            </div>
                        {:else}
                            {#each selectedCaseComments as comment}
                                {@const isMe = comment.userId === (user ? parseInt(user.id) : -1)}
                                {@const isClient = ['client', 'owner', 'member', 'admin'].includes(comment.authorRole) || ['owner', 'member', 'admin'].includes(comment.companyRole)}
                                <div class="flex gap-3 {isClient ? 'flex-row-reverse' : ''}">
                                    <div class="w-8 h-8 rounded-full {isClient ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                                        {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div class="flex flex-col gap-1 max-w-[85%]">
                                        <div class="flex items-center gap-2 {isClient ? 'flex-row-reverse' : ''}">
                                            <span class="text-xs font-medium text-foreground">
                                                {comment.authorName || 'Usuario'}
                                                {#if isMe} (Yo){/if}
                                            </span>
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
                                                            {#if isPreviewable(file)}
                                                                <button 
                                                                    class="hover:text-primary"
                                                                    title="Vista previa"
                                                                    on:click={() => openPreview(file.name, file.url)}
                                                                >
                                                                    <Eye class="w-3 h-3" />
                                                                </button>
                                                            {/if}
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

                        <!-- Scroll Button -->
                        {#if showScrollButton}
                            <button 
                                class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:opacity-90 transition-opacity z-10"
                                on:click={scrollChatToBottom}
                                transition:fade
                            >
                                <ArrowDown class="w-4 h-4" />
                            </button>
                        {/if}
                    </div>
                </div>

                <!-- Footer (Reply Form) -->
                <div class="p-4 border-t bg-muted/10">
                    <form 
                        method="POST" 
                        action="?/addCaseComment" 
                        enctype="multipart/form-data" 
                        use:enhance={({ formData }) => {
                            formData.delete('files');
                            commentFiles.forEach(file => {
                                formData.append('files', file);
                            });
                            return async ({ result, update }) => {
                                if (result.type === 'success') {
                                    commentContent = '';
                                    commentFiles = [];
                                    signatureContent = DEFAULT_SIGNATURE_TEXT;
                                    await invalidateAll();
                                    await update();
                                }
                            };
                        }}
                        class="space-y-4"
                    >
                        <input type="hidden" name="caseId" value={selectedTicket.id} />
                        <input type="hidden" name="subject" value={selectedTicket.title} />

                        <div class="space-y-2">
                            <textarea 
                                name="content" 
                                rows="3" 
                                class="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                                placeholder="Escribe un comentario o respuesta..."
                                bind:value={commentContent}
                                required
                            ></textarea>
                            
                            <!-- Signature (Hidden from view but submitted, or visible if needed? 
                                 The memory says 'Signature block is removed' for client dashboard.
                                 'Only the message textarea and file upload button are visible to the client.'
                                 So I will append the signature in the server or hidden field? 
                                 Actually the memory says 'Submission concatenates body and signature'.
                                 So I should probably just let the user type. 
                                 Or maybe I should respect the memory: 'Signature block is removed'.
                                 So I won't show a signature field.
                            -->
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <label class="cursor-pointer inline-flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Adjuntar archivos">
                                    <Paperclip class="w-4 h-4" />
                                    <input type="file" name="files" multiple class="hidden" on:change={handleCommentFileSelect} />
                                </label>
                                {#if commentFiles.length > 0}
                                    <span class="text-xs text-muted-foreground">{commentFiles.length} archivo(s)</span>
                                {/if}
                            </div>
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
    {/if}

    <div class="rounded-md border bg-card">
        <div class="p-6">
            {#if tickets.length === 0}
                <div class="text-center py-12">
                    <MessageSquare class="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 class="text-lg font-medium">No hay tickets de soporte</h3>
                    <p class="text-muted-foreground mt-1">Aún no tienes tickets de soporte registrados.</p>
                </div>
            {:else}
                <!-- Desktop Table View -->
                <div class="hidden md:block relative w-full overflow-auto">
                    <table class="w-full caption-bottom text-sm text-left">
                        <thead class="[&_tr]:border-b">
                            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Título</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Proyecto / Servicio</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Fecha</th>
                            </tr>
                        </thead>
                        <tbody class="[&_tr:last-child]:border-0">
                            {#each tickets as ticket}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <tr 
                                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                                    on:click={() => openTicketDetails(ticket)}
                                >
                                    <td class="p-4 align-middle font-medium">{ticket.title}</td>
                                    <td class="p-4 align-middle">
                                        <div class="flex flex-col">
                                            <span>{ticket.projectName}</span>
                                            {#if ticket.serviceName}
                                                <span class="text-xs text-muted-foreground">{ticket.serviceName}</span>
                                            {/if}
                                        </div>
                                    </td>
                                    <td class="p-4 align-middle">
                                        <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors {getStatusColor(ticket.status || 'open')}">
                                            {getStatusLabel(ticket.status || 'open')}
                                        </span>
                                    </td>
                                    <td class="p-4 align-middle">
                                        {#if ticket.createdAt}
                                            <div class="flex items-center gap-2">
                                                <Calendar class="h-3 w-3 text-muted-foreground" />
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </div>
                                        {:else}
                                            -
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <!-- Mobile Card View -->
                <div class="grid gap-4 md:hidden">
                    {#each tickets as ticket}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div 
                            class="bg-card rounded-lg border p-4 space-y-3 cursor-pointer hover:bg-muted/50 transition-colors shadow-sm"
                            on:click={() => openTicketDetails(ticket)}
                        >
                            <div class="flex items-start justify-between gap-4">
                                <div class="space-y-1 overflow-hidden">
                                    <h3 class="font-medium leading-none truncate">{ticket.title}</h3>
                                    <div class="flex flex-col text-sm text-muted-foreground">
                                        <span class="truncate">{ticket.projectName}</span>
                                        {#if ticket.serviceName}
                                            <span class="text-xs opacity-80 truncate">{ticket.serviceName}</span>
                                        {/if}
                                    </div>
                                </div>
                                <span class="shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors {getStatusColor(ticket.status || 'open')}">
                                    {getStatusLabel(ticket.status || 'open')}
                                </span>
                            </div>
                            
                            <div class="flex items-center text-sm text-muted-foreground pt-2 border-t">
                                <Calendar class="mr-2 h-3 w-3" />
                                {#if ticket.createdAt}
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                {:else}
                                    -
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>