<script lang="ts">
    import { ArrowLeft, CheckCircle2, Circle, Clock, MessageSquare, FileText, User, Calendar, Briefcase, AlertCircle, DollarSign, CreditCard, ExternalLink, Download, Plus, X, Eye, Inbox, Send, Paperclip, ArrowDown } from 'lucide-svelte';
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import DocumentPreviewModal from '$lib/components/DocumentPreviewModal.svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount, tick, onDestroy } from 'svelte';

    export let data: PageData;

    $: ({ project, requirements, milestones, supportCases, proposals, payments, requests, selectedCaseComments, selectedRequestComments, selectedRequirementComments, selectedProposalComments, user } = data);

    // Polling for real-time updates
    let pollInterval: ReturnType<typeof setInterval>;

    function startPolling() {
        pollInterval = setInterval(async () => {
            if (document.visibilityState === 'visible') {
                await invalidateAll();
            }
        }, 5000);
    }

    function stopPolling() {
        if (pollInterval) clearInterval(pollInterval);
    }

    onDestroy(() => {
        stopPolling();
    });

    // Keep selectedCase in sync with latest data
    $: if (isCaseDetailsOpen && selectedCase && supportCases) {
        const found = supportCases.find((c: any) => c.id === selectedCase.id);
        if (found) {
            selectedCase = { ...found };
        }
    }

    // Keep selectedProposal in sync with latest data
    $: if (isProposalDetailsOpen && selectedProposal && proposals) {
        const found = proposals.find((p: any) => p.id === selectedProposal.id);
        if (found) {
            selectedProposal = { ...found };
        }
    }

    // Keep selectedRequest in sync with latest data
    $: if (isRequestDetailsOpen && selectedRequest && requests) {
        const found = requests.find((r: any) => r.id === selectedRequest.id);
        if (found) {
            selectedRequest = { ...found };
        }
    }

    // Keep selectedRequirement in sync with latest data
    $: if (isRequirementDetailsOpen && selectedRequirement && requirements) {
        const found = requirements.find((r: any) => r.id === selectedRequirement.id);
        if (found) {
            selectedRequirement = { ...found };
        }
    }

    let showScrollButton = false;
    let chatContainer: HTMLElement;

    const scrollChatToBottom = () => {
        if (chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
    };

    // Scroll to bottom action for chat
    function scrollToBottom(node: HTMLElement, { dependency }: { dependency: any }) {
        let isAutoScrolling = false;
        
        const checkScroll = () => {
            if (isAutoScrolling) return;
            const { scrollTop, scrollHeight, clientHeight } = node;
            const distance = scrollHeight - scrollTop - clientHeight;
            // Show button if user is more than 100px from bottom
            showScrollButton = distance > 100;
        };

        const scroll = (behavior: ScrollBehavior = 'smooth') => {
            // Only scroll if we are near the bottom (button hidden) or it's the first load
            // But for 'update', we rely on the previous state of showScrollButton
            // If button is visible (user scrolled up), do NOT scroll.
            // If button is hidden (user at bottom), DO scroll.
            
            if (!showScrollButton) {
                isAutoScrolling = true;
                node.scrollTo({ top: node.scrollHeight, behavior });
                setTimeout(() => { isAutoScrolling = false; }, 500);
            }
        };
        
        // Initial scroll
        showScrollButton = false; // Assume start at bottom
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

    onMount(() => {
        startPolling();
        
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                invalidateAll(); 
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        const caseId = $page.url.searchParams.get('caseId');
        if (caseId && supportCases) {
            const foundCase = supportCases.find((c: any) => c.id == caseId);
            if (foundCase) {
                selectedCase = foundCase;
                isCaseDetailsOpen = true;
            }
        }

        const requestId = $page.url.searchParams.get('requestId');
        if (requestId && requests) {
            const foundRequest = requests.find((r: any) => r.id == requestId);
            if (foundRequest) {
                selectedRequest = foundRequest;
                isRequestDetailsOpen = true;
            }
        }

        const requirementId = $page.url.searchParams.get('requirementId');
        if (requirementId && requirements) {
            const foundRequirement = requirements.find((r: any) => r.id == requirementId);
            if (foundRequirement) {
                selectedRequirement = foundRequirement;
                isRequirementDetailsOpen = true;
            }
        }

        const proposalId = $page.url.searchParams.get('proposalId');
        if (proposalId && proposals) {
            const foundProposal = proposals.find((p: any) => p.id == proposalId);
            if (foundProposal) {
                selectedProposal = foundProposal;
                isProposalDetailsOpen = true;
            }
        }

        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    });

    function formatDate(date: Date | null) {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    }

    let activeTab = 'process'; // process, requests, requirements, support, proposals, payments

    // Document Preview Modal Logic
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


    // Request Details Logic
    let isRequestDetailsOpen = false;
    let selectedRequest: any = null;

    function openRequestDetails(req: any) {
        selectedRequest = req;
        const url = new URL(window.location.href);
        url.searchParams.set('requestId', String(req.id));
        goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
        isRequestDetailsOpen = true;
    }

    function closeRequestDetails() {
        isRequestDetailsOpen = false;
        selectedRequest = null;
        const url = new URL(window.location.href);
        url.searchParams.delete('requestId');
        goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
    }

    // Comment Files Logic
    let commentFiles: File[] = [];
    let commentFileInput: HTMLInputElement;
    let commentContent = '';
    const DEFAULT_SIGNATURE_TEXT = '--\n' + (user ? `${user.firstName} ${user.lastName}\n${user.email}` : 'Cliente');
    let signatureContent = DEFAULT_SIGNATURE_TEXT;

    // Reset content when case opens
    $: if (isCaseDetailsOpen || isRequestDetailsOpen || isRequirementDetailsOpen || isProposalDetailsOpen) {
        if (!signatureContent) signatureContent = DEFAULT_SIGNATURE_TEXT;
    }

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

    // Requirement Details Logic
    let isRequirementDetailsOpen = false;
    let selectedRequirement: any = null;

    function openRequirementDetails(req: any) {
        selectedRequirement = req;
        const url = new URL(window.location.href);
        url.searchParams.set('requirementId', String(req.id));
        goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
        isRequirementDetailsOpen = true;
    }

    function closeRequirementDetails() {
        isRequirementDetailsOpen = false;
        selectedRequirement = null;
        const url = new URL(window.location.href);
        url.searchParams.delete('requirementId');
        goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
    }

    // Proposal Details Logic
    let isProposalDetailsOpen = false;
    let selectedProposal: any = null;

    function openProposalDetails(prop: any) {
        selectedProposal = prop;
        const url = new URL(window.location.href);
        url.searchParams.set('proposalId', String(prop.id));
        goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
        isProposalDetailsOpen = true;
    }

    function closeProposalDetails() {
        isProposalDetailsOpen = false;
        selectedProposal = null;
        const url = new URL(window.location.href);
        url.searchParams.delete('proposalId');
        goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
    }

    // Case Modal Logic
    let isCaseModalOpen = false;
    let editingCase: any = null;
    let caseFilesToKeep: any[] = [];
    
    // Case Details Logic
    let isCaseDetailsOpen = false;
    let selectedCase: any = null;

    function openCreateCaseModal() {
        editingCase = null;
        caseFilesToKeep = [];
        isCaseModalOpen = true;
    }

    function closeCaseModal() {
        isCaseModalOpen = false;
        editingCase = null;
        caseFilesToKeep = [];
    }

    function openCaseDetails(c: any) {
        selectedCase = c;
        const url = new URL($page.url);
        url.searchParams.set('caseId', c.id);
        goto(url, { keepFocus: true, noScroll: true });
        isCaseDetailsOpen = true;
    }

    function closeCaseDetails() {
        isCaseDetailsOpen = false;
        selectedCase = null;
        const url = new URL($page.url);
        url.searchParams.delete('caseId');
        goto(url, { keepFocus: true, noScroll: true });
    }

</script>

<div class="space-y-6 relative">
    <!-- Header -->
    <div class="flex items-center gap-4">
        <a href="../projects" class="p-2 hover:bg-accent rounded-full transition-colors">
            <ArrowLeft class="w-5 h-5" />
        </a>
        <div>
            <div class="flex items-center gap-2">
                <h1 class="text-2xl font-bold tracking-tight">{project.name}</h1>
            </div>
            <p class="text-muted-foreground flex items-center gap-2 text-sm">
                <span class="inline-flex items-center gap-1">
                    <User class="w-3 h-3" /> {project.clientName}
                    {#if project.clientCompany}
                        <span class="text-muted-foreground font-semibold">| {project.clientCompany}</span>
                    {/if}
                </span>
                <span>•</span>
                <span class="inline-flex items-center gap-1">
                    <Briefcase class="w-3 h-3" /> {project.serviceName}
                </span>
                <span>•</span>
                <span class="inline-flex items-center gap-1">
                    <span class="text-xs font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {project.provider || 'Allianzy'}
                    </span>
                </span>
            </p>
        </div>
        <div class="ml-auto flex gap-2">
            <span class="px-3 py-1 rounded-full text-sm font-medium 
                {project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                 project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                 'bg-yellow-100 text-yellow-700'}">
                {project.status}
            </span>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left Column: Main Content -->
        <div class="md:col-span-2 space-y-6">
            
            <!-- Tabs -->
            <div class="flex border-b overflow-x-auto">
                <button 
                    class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
                    {activeTab === 'process' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                    on:click={() => activeTab = 'process'}
                >
                    <Clock class="w-4 h-4" />
                    Proceso
                </button>
                <button 
                    class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
                    {activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                    on:click={() => activeTab = 'requests'}
                >
                    <Inbox class="w-4 h-4" />
                    Solicitudes
                </button>
                <button 
                    class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
                    {activeTab === 'requirements' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                    on:click={() => activeTab = 'requirements'}
                >
                    <FileText class="w-4 h-4" />
                    Requerimientos
                </button>
                <button 
                    class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
                    {activeTab === 'support' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                    on:click={() => activeTab = 'support'}
                >
                    <MessageSquare class="w-4 h-4" />
                    Soporte
                </button>
                <button 
                    class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
                    {activeTab === 'proposals' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                    on:click={() => activeTab = 'proposals'}
                >
                    <DollarSign class="w-4 h-4" />
                    Propuestas
                </button>
                <button 
                    class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
                    {activeTab === 'payments' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                    on:click={() => activeTab = 'payments'}
                >
                    <CreditCard class="w-4 h-4" />
                    Pagos
                </button>
            </div>

            <!-- Tab Content -->
            <div class="bg-card rounded-lg border p-6 min-h-[400px]">
                
                <!-- Implementation Process -->
                {#if activeTab === 'process'}
                    <div class="space-y-8">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="font-semibold">Etapas del Proyecto</h3>
                        </div>

                        <div class="space-y-0">
                            {#each milestones as step, i}
                                <div class="relative pl-10 pb-12 last:pb-0">
                                    {#if i !== milestones.length - 1}
                                        <div class="absolute left-[11px] top-0 bottom-0 w-[2px] bg-border"></div>
                                    {/if}
                                    <div class="absolute left-0 top-0 z-10 bg-background rounded-full flex items-center justify-center">
                                        {#if step.status === 'completed'}
                                            <CheckCircle2 class="w-6 h-6 text-green-500" />
                                        {:else if step.status === 'in_progress'}
                                            <Circle class="w-6 h-6 text-blue-500 fill-blue-100" />
                                        {:else}
                                            <Circle class="w-6 h-6 text-muted-foreground" />
                                        {/if}
                                    </div>
                                    <div class="pt-0.5">
                                        <h3 class="font-semibold text-base {step.status === 'pending' ? 'text-muted-foreground' : ''}">
                                            {step.title}
                                        </h3>
                                        {#if step.completedAt}
                                            <p class="text-xs text-muted-foreground mt-1">
                                                Completado el {formatDate(step.completedAt)}
                                            </p>
                                        {/if}
                                        {#if step.status === 'in_progress'}
                                            <span class="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                En curso
                                            </span>
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>

                <!-- Requests -->
                {:else if activeTab === 'requests'}
                    <div class="space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Solicitudes</h3>
                        </div>
                        {#if !requests || requests.length === 0}
                            <p class="text-muted-foreground text-sm">No hay solicitudes registradas.</p>
                        {:else}
                            {#each requests as req}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div 
                                    class="group flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors cursor-pointer"
                                    on:click={() => openRequestDetails(req)}
                                >
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-medium text-sm flex items-center gap-2">
                                                {req.title}
                                            </h4>
                                            <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                                                {req.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                 req.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                                                 'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                                                {req.status}
                                            </span>
                                        </div>
                                        <p class="text-xs text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                                        <div class="flex items-center gap-4 mt-2">
                                            <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar class="w-3 h-3" /> {formatDate(req.createdAt)}
                                            </span>
                                            {#if req.files && req.files.length > 0}
                                                <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Paperclip class="w-3 h-3" /> {req.files.length} archivos
                                                </span>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>

                <!-- Requirements -->
                {:else if activeTab === 'requirements'}
                    <div class="space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Requerimientos</h3>
                        </div>
                        {#if !requirements || requirements.length === 0}
                            <p class="text-muted-foreground text-sm">No hay requerimientos registrados.</p>
                        {:else}
                            {#each requirements as req}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div 
                                    class="group flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors cursor-pointer"
                                    on:click={() => openRequirementDetails(req)}
                                >
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-medium text-sm flex items-center gap-2">
                                                {req.title}
                                            </h4>
                                            <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                                                {req.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                 req.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                                                 'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                                                {req.status}
                                            </span>
                                        </div>
                                        <p class="text-xs text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                                        <div class="flex items-center gap-4 mt-2">
                                            <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar class="w-3 h-3" /> {formatDate(req.createdAt)}
                                            </span>
                                            {#if req.files && req.files.length > 0}
                                                <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Paperclip class="w-3 h-3" /> {req.files.length} archivos
                                                </span>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>

                <!-- Support Cases -->
                {:else if activeTab === 'support'}
                    <div class="space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Historial de soporte</h3>
                        </div>

                        {#if !supportCases || supportCases.length === 0}
                            <p class="text-muted-foreground text-sm">No hay tickets de soporte.</p>
                        {:else}
                            <div class="space-y-3">
                                {#each supportCases as c}
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <div 
                                        class="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer group"
                                        on:click={() => openCaseDetails(c)}
                                    >
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <h4 class="font-medium text-sm">{c.title}</h4>
                                                <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                                                    {c.status === 'open' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                     c.status === 'closed' ? 'bg-gray-100 text-gray-700 border-gray-200' : 
                                                     'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                                                    {c.status}
                                                </span>
                                            </div>
                                            <p class="text-xs text-muted-foreground mt-1 line-clamp-1">{c.description}</p>
                                            <div class="flex items-center gap-4 mt-2">
                                                {#if c.priority === 'high'}
                                                    <span class="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                                        <AlertCircle class="w-3 h-3" /> Alta Prioridad
                                                    </span>
                                                {/if}
                                                <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar class="w-3 h-3" /> {formatDate(c.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>

                <!-- Proposals -->
                {:else if activeTab === 'proposals'}
                    <div class="space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Propuestas</h3>
                        </div>
                        {#if !proposals || proposals.length === 0}
                            <p class="text-muted-foreground text-sm">No hay propuestas registradas.</p>
                        {:else}
                            {#each proposals as prop}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div 
                                    class="group flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors cursor-pointer"
                                    on:click={() => openProposalDetails(prop)}
                                >
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-medium text-sm flex items-center gap-2">
                                                {prop.title}
                                            </h4>
                                            <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                                                {prop.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                 prop.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                                                 'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                                                {prop.status}
                                            </span>
                                        </div>
                                        <p class="text-xs text-muted-foreground mt-1 line-clamp-2">{prop.description}</p>
                                        <div class="flex items-center gap-4 mt-2">
                                            <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar class="w-3 h-3" /> {formatDate(prop.createdAt)}
                                            </span>
                                            {#if prop.files && prop.files.length > 0}
                                                <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Paperclip class="w-3 h-3" /> {prop.files.length} archivos
                                                </span>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>

                <!-- Payments -->
                {:else if activeTab === 'payments'}
                    <div class="space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Pagos</h3>
                        </div>
                        {#if !payments || payments.length === 0}
                            <p class="text-muted-foreground text-sm">No hay pagos registrados.</p>
                        {:else}
                            <div class="space-y-3">
                                {#each payments as pay}
                                    <div class="flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2">
                                                <h4 class="font-medium text-sm flex items-center gap-2">
                                                    {pay.title}
                                                </h4>
                                                <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                                                    {pay.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                     pay.status === 'overdue' ? 'bg-red-100 text-red-700 border-red-200' : 
                                                     'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                                                    {pay.status}
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-4 mt-2">
                                                <span class="font-medium text-sm">{pay.amount}</span>
                                                <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar class="w-3 h-3" /> Vence: {formatDate(pay.dueDate)}
                                                </span>
                                                {#if pay.paidAt}
                                                    <span class="text-xs text-green-600 flex items-center gap-1">
                                                        <CheckCircle2 class="w-3 h-3" /> Pagado: {formatDate(pay.paidAt)}
                                                    </span>
                                                {/if}
                                            </div>
                                        </div>
                                        {#if pay.documentUrl}
                                            <button 
                                                on:click={() => openPreview(pay.title, pay.documentUrl)}
                                                class="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                                title="Ver comprobante"
                                            >
                                                <Eye class="w-4 h-4" />
                                            </button>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Right Column: Project Info -->
        <div class="space-y-6">
            <div class="bg-card rounded-lg border p-6 space-y-6">
                <div>
                    <h3 class="font-semibold mb-2">Detalles</h3>
                    <div class="space-y-3 text-sm">
                        <div>
                            <span class="text-muted-foreground block text-xs">Fecha de Inicio</span>
                            <span>{formatDate(project.startDate)}</span>
                        </div>
                        {#if project.endDate && (project.status === 'Completed' || project.status === 'completed')}
                            <div>
                                <span class="text-muted-foreground block text-xs">Fecha de Finalización</span>
                                <span>{formatDate(project.endDate)}</span>
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="pt-4 border-t">
                    <h3 class="font-semibold mb-2">Enlaces</h3>
                    {#if project.links && Array.isArray(project.links) && project.links.length > 0}
                        <div class="space-y-2">
                            {#each project.links as link}
                                <div>
                                    <p class="text-muted-foreground text-xs">{link.title}</p>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" class="font-medium text-primary hover:underline break-all flex items-center gap-1">
                                        {link.url} <ExternalLink class="w-3 h-3 flex-shrink-0" />
                                    </a>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="text-muted-foreground text-sm">No hay enlaces registrados.</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Case Modal -->
{#if isCaseModalOpen}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button on:click={closeCaseModal} class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X class="w-4 h-4" />
            </button>
            
            <h2 class="text-lg font-bold mb-4">
                Nuevo Ticket de Soporte
            </h2>
            
            <form 
                action="?/createCase" 
                method="POST" 
                enctype="multipart/form-data"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeCaseModal();
                            await invalidateAll();
                        } else {
                            await update();
                        }
                    };
                }}
                class="space-y-4"
            >
                <div class="space-y-2">
                    <label for="case-title" class="text-sm font-medium">Título</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="case-title"
                        required
                        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ej: Error en carga de imágenes"
                    />
                </div>

                <div class="space-y-2">
                    <label for="case-description" class="text-sm font-medium">Descripción</label>
                    <textarea 
                        name="description" 
                        id="case-description"
                        rows="4"
                        class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe el problema o solicitud..."
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label for="case-priority" class="text-sm font-medium">Prioridad</label>
                        <select 
                            name="priority" 
                            id="case-priority"
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="low">Baja</option>
                            <option value="medium" selected>Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label for="case-status" class="text-sm font-medium">Estado</label>
                        <select 
                            name="status" 
                            id="case-status"
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            disabled
                        >
                            <option value="open" selected>Abierto</option>
                        </select>
                        <input type="hidden" name="status" value="open" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="case-files" class="text-sm font-medium">Archivos</label>
                    <input 
                        type="file" 
                        name="files" 
                        id="case-files"
                        multiple
                        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div class="flex justify-end gap-2 pt-4">
                    <button 
                        type="button" 
                        on:click={closeCaseModal}
                        class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                    >
                        Crear Ticket
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Case Details (Chat) Modal -->
{#if isCaseDetailsOpen && selectedCase}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col relative overflow-hidden">
            <!-- Header -->
            <div class="p-4 border-b flex items-start justify-between bg-muted/20">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <h2 class="text-lg font-bold">{selectedCase.title}</h2>
                        <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                            {selectedCase.status === 'open' ? 'bg-green-100 text-green-700 border-green-200' : 
                             selectedCase.status === 'closed' ? 'bg-gray-100 text-gray-700 border-gray-200' : 
                             'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                            {selectedCase.status}
                        </span>
                    </div>
                    <p class="text-sm text-muted-foreground line-clamp-2">{selectedCase.description}</p>
                    <div class="flex items-center gap-4 mt-2">
                        {#if selectedCase.priority === 'high'}
                            <span class="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                <AlertCircle class="w-3 h-3" /> Alta Prioridad
                            </span>
                        {/if}
                        <span class="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar class="w-3 h-3" /> {formatDate(selectedCase.createdAt)}
                        </span>
                        {#if selectedCase.files && selectedCase.files.length > 0}
                            <div class="flex gap-2">
                                {#each selectedCase.files as file}
                                    <button 
                                        on:click={() => openPreview(file.name, file.url)} 
                                        class="flex items-center gap-1 text-[10px] bg-background border px-1.5 py-0.5 rounded hover:bg-accent transition-colors"
                                    >
                                        <Paperclip class="w-2.5 h-2.5" /> {file.name}
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
                <button on:click={closeCaseDetails} class="text-muted-foreground hover:text-foreground p-1">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <!-- Chat Area -->
            <div class="flex-1 relative min-h-0">
                <div 
                    class="absolute inset-0 overflow-y-auto p-4 space-y-4 bg-muted/10" 
                    use:scrollToBottom={{ dependency: selectedCaseComments }}
                    bind:this={chatContainer}
                >
                {#if !selectedCaseComments || selectedCaseComments.length === 0}
                    <div class="text-center py-10 text-muted-foreground text-sm">
                        <MessageSquare class="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>No hay mensajes aún.</p>
                    </div>
                {:else}
                    {#each selectedCaseComments as comment}
                        {@const isMe = comment.userId === (user ? parseInt(user.id) : -1)}
                        <div class="border rounded-lg bg-card shadow-sm overflow-hidden {isMe ? 'border-primary/20' : ''}">
                            <!-- Email Header -->
                            <div class="{isMe ? 'bg-primary/5' : 'bg-muted/10'} px-4 py-3 border-b">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full {isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs">
                                            {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {comment.authorName || 'Usuario'}
                                                {#if isMe}
                                                    <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">Yo</span>
                                                {/if}
                                            </span>
                                        </div>
                                    </div>
                                    <span class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                                </div>
                            </div>
                            
                            <!-- Email Body -->
                            <div class="p-4 text-sm whitespace-pre-wrap leading-relaxed">
                                {comment.content}
                            </div>

                            <!-- Attachments -->
                            {#if comment.files && comment.files.length > 0}
                                <div class="px-4 py-3 bg-muted/5 border-t flex gap-2 overflow-x-auto">
                                    {#each comment.files as file}
                                        <button 
                                            on:click={() => openPreview(file.name, file.url)} 
                                            class="flex items-center gap-2 text-xs bg-background border px-2 py-1.5 rounded-md hover:bg-accent transition-colors flex-shrink-0"
                                        >
                                            <Paperclip class="w-3 h-3 text-muted-foreground" />
                                            <span class="max-w-[150px] truncate">{file.name}</span>
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/each}
                {/if}
            </div>
            {#if showScrollButton}
                <button 
                    on:click={scrollChatToBottom}
                    class="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg hover:bg-background transition-all z-10 text-muted-foreground"
                    title="Ir al final"
                >
                    <ArrowDown class="w-5 h-5" />
                </button>
            {/if}
            </div>

            <!-- Reply Box -->
            <div class="p-4 border-t bg-background">
                <form 
                    action="?/addCaseComment" 
                    method="POST" 
                    enctype="multipart/form-data"
                    use:enhance={({ formData }) => {
                        // Append files from local state to formData
                        formData.delete('files'); // Clear existing empty/partial input
                        commentFiles.forEach((file) => {
                            formData.append('files', file);
                        });

                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                commentContent = '';
                                commentFiles = [];
                                await invalidateAll();
                            } else {
                                await update();
                            }
                        };
                    }}
                    class="space-y-4"
                >
                    <input type="hidden" name="caseId" value={selectedCase.id} />
                    
                    <div class="space-y-2">
                        <input 
                            type="hidden" 
                            name="subject" 
                            value={selectedCase.title}
                        />
                        
                        <div class="relative">
                            <textarea 
                                name="content" 
                                class="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                placeholder="Escribe tu respuesta..."
                                bind:value={commentContent}
                                required
                            ></textarea>
                        </div>

                        <!-- Actions Row -->
                        <div class="flex justify-between items-center pt-2">
                            <div class="flex items-center gap-2 flex-1 overflow-hidden">
                                <input 
                                    type="file" 
                                    name="files" 
                                    multiple 
                                    class="hidden" 
                                    bind:this={commentFileInput}
                                    on:change={handleCommentFileSelect}
                                />
                                <button 
                                    type="button" 
                                    on:click={() => commentFileInput.click()}
                                    class="text-xs flex items-center gap-1 px-2 py-1.5 rounded-md border hover:bg-accent transition-colors text-muted-foreground shrink-0"
                                >
                                    <Paperclip class="w-3 h-3" /> Adjuntar
                                </button>
                                
                                {#if commentFiles.length > 0}
                                    <div class="flex gap-2 overflow-x-auto no-scrollbar">
                                        {#each commentFiles as file, i}
                                            <div class="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md border shrink-0">
                                                <span class="max-w-[80px] truncate">{file.name}</span>
                                                <button type="button" on:click={() => removeCommentFile(i)} class="text-muted-foreground hover:text-red-500">
                                                    <X class="w-3 h-3" />
                                                </button>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>

                            <button 
                                type="submit" 
                                disabled={!commentContent.trim()}
                                class="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-2"
                            >
                                <Send class="w-3 h-3" /> Enviar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}

<!-- Request Details (Chat) Modal -->
{#if isRequestDetailsOpen && selectedRequest}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col relative overflow-hidden">
            <!-- Header -->
            <div class="p-4 border-b bg-muted/20 space-y-4">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h2 class="text-xl font-bold">{selectedRequest.title}</h2>
                            <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                                {selectedRequest.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 
                                 selectedRequest.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                                 'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                                {selectedRequest.status}
                            </span>
                        </div>
                        <span class="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar class="w-3 h-3" /> {formatDate(selectedRequest.createdAt)}
                        </span>
                    </div>
                    <button on:click={closeRequestDetails} class="text-muted-foreground hover:text-foreground p-1">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="bg-background/50 rounded-md p-3 border text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                    <h3 class="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Detalle de la Solicitud</h3>
                    {selectedRequest.description}
                </div>

                {#if selectedRequest.files && selectedRequest.files.length > 0}
                    <div>
                        <h3 class="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Archivos Adjuntos</h3>
                        <div class="flex flex-wrap gap-2">
                            {#each selectedRequest.files as file}
                                <button 
                                    on:click={() => openPreview(file.name, file.url)} 
                                    class="flex items-center gap-2 text-xs bg-background border px-3 py-2 rounded-md hover:bg-accent transition-colors group shadow-sm"
                                >
                                    <div class="bg-muted p-1 rounded group-hover:bg-muted/80">
                                        <Paperclip class="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <span class="font-medium text-foreground/90">{file.name}</span>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Chat Area -->
            <div class="flex-1 relative min-h-0">
                <div 
                    class="absolute inset-0 overflow-y-auto p-4 space-y-4 bg-muted/10" 
                    use:scrollToBottom={{ dependency: selectedRequestComments }}
                    bind:this={chatContainer}
                >
                {#if !selectedRequestComments || selectedRequestComments.length === 0}
                    <div class="text-center py-10 text-muted-foreground text-sm">
                        <MessageSquare class="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>No hay mensajes aún.</p>
                    </div>
                {:else}
                    {#each selectedRequestComments as comment}
                        {@const isMe = comment.userId === (user ? parseInt(user.id) : -1)}
                        <div class="border rounded-lg bg-card shadow-sm overflow-hidden {isMe ? 'border-primary/20' : ''}">
                            <div class="{isMe ? 'bg-primary/5' : 'bg-muted/10'} px-4 py-3 border-b">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full {isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs">
                                            {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {comment.authorName || 'Usuario'}
                                                {#if isMe}
                                                    <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">Yo</span>
                                                {/if}
                                            </span>
                                        </div>
                                    </div>
                                    <span class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                                </div>
                            </div>
                            
                            <div class="p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans">
                                {comment.content}
                            </div>
                            
                            {#if comment.files && comment.files.length > 0}
                                <div class="px-4 pb-4 pt-2">
                                    <div class="text-xs font-medium text-muted-foreground mb-2">Adjuntos ({comment.files.length}):</div>
                                    <div class="flex flex-wrap gap-2">
                                        {#each comment.files as file}
                                            <button 
                                                on:click={() => openPreview(file.name, file.url)}
                                                class="flex items-center gap-2 text-xs border bg-background hover:bg-accent px-3 py-2 rounded-md transition-colors group"
                                            >
                                                <div class="bg-muted p-1 rounded group-hover:bg-muted/80">
                                                    <Paperclip class="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <span class="text-foreground/90">{file.name}</span>
                                            </button>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/each}
                {/if}
            </div>
            {#if showScrollButton}
                <button 
                    on:click={scrollChatToBottom}
                    class="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg hover:bg-background transition-all z-10 text-muted-foreground"
                    title="Ir al final"
                >
                    <ArrowDown class="w-5 h-5" />
                </button>
            {/if}
            </div>

            <!-- Reply Box -->
            {#if selectedRequest.status !== 'completed' && selectedRequest.status !== 'pending'}
            <div class="p-4 bg-background border-t">
                <form 
                    action="?/addRequestComment" 
                    method="POST" 
                    enctype="multipart/form-data"
                    use:enhance={({ formData }) => {
                        // Append files from local state to formData
                        formData.delete('files'); // Clear existing empty/partial input
                        commentFiles.forEach((file) => {
                            formData.append('files', file);
                        });

                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                commentContent = '';
                                commentFiles = [];
                                await invalidateAll();
                            } else {
                                await update();
                            }
                        };
                    }}
                    class="space-y-4"
                >
                    <input type="hidden" name="requestId" value={selectedRequest.id} />
                    
                    <div class="space-y-2">
                        <input 
                            type="hidden" 
                            name="subject" 
                            value={selectedRequest.title}
                        />
                        
                        <div class="relative">
                            <textarea 
                                name="content" 
                                class="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                placeholder="Escribe tu respuesta..."
                                bind:value={commentContent}
                                required
                            ></textarea>
                        </div>

                        <!-- Actions Row -->
                        <div class="flex justify-between items-center pt-2">
                            <div class="flex items-center gap-2 flex-1 overflow-hidden">
                                <input 
                                    type="file" 
                                    name="files" 
                                    multiple 
                                    class="hidden" 
                                    bind:this={commentFileInput}
                                    on:change={handleCommentFileSelect}
                                />
                                <button 
                                    type="button" 
                                    on:click={() => commentFileInput.click()}
                                    class="text-xs flex items-center gap-1 px-2 py-1.5 rounded-md border hover:bg-accent transition-colors text-muted-foreground shrink-0"
                                >
                                    <Paperclip class="w-3 h-3" /> Adjuntar
                                </button>
                                
                                {#if commentFiles.length > 0}
                                    <div class="flex gap-2 overflow-x-auto no-scrollbar">
                                        {#each commentFiles as file, i}
                                            <div class="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md border shrink-0">
                                                <span class="max-w-[80px] truncate">{file.name}</span>
                                                <button type="button" on:click={() => removeCommentFile(i)} class="text-muted-foreground hover:text-red-500">
                                                    <X class="w-3 h-3" />
                                                </button>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>

                            <button 
                                type="submit" 
                                disabled={!commentContent.trim()}
                                class="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-2"
                            >
                                <Send class="w-3 h-3" /> Enviar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {/if}
        </div>
    </div>
{/if}

<!-- Requirement Details (Chat) Modal -->
{#if isRequirementDetailsOpen && selectedRequirement}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col relative overflow-hidden">
            <!-- Header -->
            <div class="p-4 border-b bg-muted/20 space-y-4">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h2 class="text-xl font-bold">{selectedRequirement.title}</h2>
                            <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                                {selectedRequirement.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 
                                 selectedRequirement.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                                 'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                                {selectedRequirement.status}
                            </span>
                        </div>
                        <span class="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar class="w-3 h-3" /> {formatDate(selectedRequirement.createdAt)}
                        </span>
                    </div>
                    <button on:click={closeRequirementDetails} class="text-muted-foreground hover:text-foreground p-1">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="bg-background/50 rounded-md p-3 border text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                    <h3 class="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Detalle del Requerimiento</h3>
                    {selectedRequirement.description}
                </div>

                {#if selectedRequirement.files && selectedRequirement.files.length > 0}
                    <div>
                        <h3 class="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Archivos Adjuntos</h3>
                        <div class="flex flex-wrap gap-2">
                            {#each selectedRequirement.files as file}
                                <button 
                                    on:click={() => openPreview(file.name, file.url)} 
                                    class="flex items-center gap-2 text-xs bg-background border px-3 py-2 rounded-md hover:bg-accent transition-colors group shadow-sm"
                                >
                                    <div class="bg-muted p-1 rounded group-hover:bg-muted/80">
                                        <Paperclip class="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <span class="font-medium text-foreground/90">{file.name}</span>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Chat Area -->
            <div class="flex-1 relative min-h-0">
                <div 
                    class="absolute inset-0 overflow-y-auto p-4 space-y-4 bg-muted/10" 
                    use:scrollToBottom={{ dependency: selectedRequirementComments }}
                    bind:this={chatContainer}
                >
                {#if !selectedRequirementComments || selectedRequirementComments.length === 0}
                    <div class="text-center py-10 text-muted-foreground text-sm">
                        <MessageSquare class="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>No hay mensajes aún.</p>
                    </div>
                {:else}
                    {#each selectedRequirementComments as comment}
                        {@const isMe = comment.userId === (user ? parseInt(user.id) : -1)}
                        <div class="border rounded-lg bg-card shadow-sm overflow-hidden {isMe ? 'border-primary/20' : ''}">
                            <div class="{isMe ? 'bg-primary/5' : 'bg-muted/10'} px-4 py-3 border-b">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full {isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs">
                                            {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {comment.authorName || 'Usuario'}
                                                {#if isMe}
                                                    <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">Yo</span>
                                                {/if}
                                            </span>
                                        </div>
                                    </div>
                                    <span class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                                </div>
                            </div>
                            
                            <div class="p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans">
                                {comment.content}
                            </div>
                            
                            {#if comment.files && comment.files.length > 0}
                                <div class="px-4 pb-4 pt-2">
                                    <div class="text-xs font-medium text-muted-foreground mb-2">Adjuntos ({comment.files.length}):</div>
                                    <div class="flex flex-wrap gap-2">
                                        {#each comment.files as file}
                                            <button 
                                                on:click={() => openPreview(file.name, file.url)}
                                                class="flex items-center gap-2 text-xs border bg-background hover:bg-accent px-3 py-2 rounded-md transition-colors group"
                                            >
                                                <div class="bg-muted p-1 rounded group-hover:bg-muted/80">
                                                    <Paperclip class="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <span class="text-foreground/90">{file.name}</span>
                                            </button>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/each}
                {/if}
            </div>
            {#if showScrollButton}
                <button 
                    on:click={scrollChatToBottom}
                    class="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg hover:bg-background transition-all z-10 text-muted-foreground"
                    title="Ir al final"
                >
                    <ArrowDown class="w-5 h-5" />
                </button>
            {/if}
            </div>

            <!-- Reply Box -->
            {#if selectedRequirement.status === 'pending'}
                <div class="p-4 bg-background border-t">
                    <form 
                        action="?/addRequirementComment" 
                        method="POST" 
                        enctype="multipart/form-data"
                        use:enhance={({ formData }) => {
                            // Append files from local state to formData
                            formData.delete('files'); // Clear existing empty/partial input
                            commentFiles.forEach((file) => {
                                formData.append('files', file);
                            });

                            return async ({ result, update }) => {
                                if (result.type === 'success') {
                                    commentContent = '';
                                    commentFiles = [];
                                    await invalidateAll();
                                } else {
                                    await update();
                                }
                            };
                        }}
                        class="space-y-4"
                    >
                        <input type="hidden" name="requirementId" value={selectedRequirement.id} />
                        
                        <div class="space-y-2">
                            <input 
                                type="hidden" 
                                name="subject" 
                                value={selectedRequirement.title}
                            />
                            
                            <div class="relative">
                                <textarea 
                                    name="content" 
                                    class="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    placeholder="Escribe tu respuesta..."
                                    bind:value={commentContent}
                                    required
                                ></textarea>
                            </div>

                            <!-- Actions Row -->
                            <div class="flex justify-between items-center pt-2">
                                <div class="flex items-center gap-2 flex-1 overflow-hidden">
                                    <input 
                                        type="file" 
                                        name="files" 
                                        multiple 
                                        class="hidden" 
                                        bind:this={commentFileInput}
                                        on:change={handleCommentFileSelect}
                                    />
                                    <button 
                                        type="button" 
                                        on:click={() => commentFileInput.click()}
                                        class="text-xs flex items-center gap-1 px-2 py-1.5 rounded-md border hover:bg-accent transition-colors text-muted-foreground shrink-0"
                                    >
                                        <Paperclip class="w-3 h-3" /> Adjuntar
                                    </button>
                                    
                                    {#if commentFiles.length > 0}
                                        <div class="flex gap-2 overflow-x-auto no-scrollbar">
                                            {#each commentFiles as file, i}
                                                <div class="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md border shrink-0">
                                                    <span class="max-w-[80px] truncate">{file.name}</span>
                                                    <button type="button" on:click={() => removeCommentFile(i)} class="text-muted-foreground hover:text-red-500">
                                                        <X class="w-3 h-3" />
                                                    </button>
                                                </div>
                                            {/each}
                                        </div>
                                    {/if}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={!commentContent.trim()}
                                    class="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-2"
                                >
                                    <Send class="w-3 h-3" /> Enviar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            {/if}
        </div>
    </div>
{/if}

<!-- Proposal Details (Chat) Modal -->
{#if isProposalDetailsOpen && selectedProposal}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col relative overflow-hidden">
            <!-- Header -->
            <div class="p-4 border-b bg-muted/20 space-y-4">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h2 class="text-xl font-bold">{selectedProposal.title}</h2>
                            <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                                {selectedProposal.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 
                                 selectedProposal.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                                 'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                                {selectedProposal.status}
                            </span>
                        </div>
                        <span class="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar class="w-3 h-3" /> {formatDate(selectedProposal.createdAt)}
                        </span>
                    </div>
                    <button on:click={closeProposalDetails} class="text-muted-foreground hover:text-foreground p-1">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="bg-background/50 rounded-md p-3 border text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                    <h3 class="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Detalle de la Propuesta</h3>
                    {selectedProposal.description}
                </div>

                {#if selectedProposal.files && selectedProposal.files.length > 0}
                    <div>
                        <h3 class="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Archivos Adjuntos</h3>
                        <div class="flex flex-wrap gap-2">
                            {#each selectedProposal.files as file}
                                <button 
                                    on:click={() => openPreview(file.name, file.url)} 
                                    class="flex items-center gap-2 text-xs bg-background border px-3 py-2 rounded-md hover:bg-accent transition-colors group shadow-sm"
                                >
                                    <div class="bg-muted p-1 rounded group-hover:bg-muted/80">
                                        <Paperclip class="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <span class="font-medium text-foreground/90">{file.name}</span>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Chat Area -->
            <div class="flex-1 relative min-h-0">
                <div 
                    class="absolute inset-0 overflow-y-auto p-4 space-y-6 bg-muted/10" 
                    use:scrollToBottom={{ dependency: selectedProposalComments }}
                    bind:this={chatContainer}
                >
                {#if !selectedProposalComments || selectedProposalComments.length === 0}
                    <div class="text-center py-10 text-muted-foreground text-sm">
                        <MessageSquare class="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>No hay mensajes aún.</p>
                    </div>
                {:else}
                    {#each selectedProposalComments as comment}
                        {@const isMe = comment.userId === (user ? parseInt(user.id) : -1)}
                        <div class="border rounded-lg bg-card shadow-sm overflow-hidden {isMe ? 'border-primary/20' : ''}">
                            <div class="{isMe ? 'bg-primary/5' : 'bg-muted/10'} px-4 py-3 border-b">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full {isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs">
                                            {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {comment.authorName || 'Usuario'}
                                                {#if isMe}
                                                    <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">Yo</span>
                                                {/if}
                                            </span>
                                        </div>
                                    </div>
                                    <span class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                                </div>
                            </div>
                            
                            <div class="p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans">
                                {comment.content}
                            </div>
                            
                            {#if comment.files && comment.files.length > 0}
                                <div class="px-4 pb-4 pt-2">
                                    <div class="text-xs font-medium text-muted-foreground mb-2">Adjuntos ({comment.files.length}):</div>
                                    <div class="flex flex-wrap gap-2">
                                        {#each comment.files as file}
                                            <button 
                                                on:click={() => openPreview(file.name, file.url)}
                                                class="flex items-center gap-2 text-xs border bg-background hover:bg-accent px-3 py-2 rounded-md transition-colors group"
                                            >
                                                <div class="bg-muted p-1 rounded group-hover:bg-muted/80">
                                                    <Paperclip class="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <span class="text-foreground/90">{file.name}</span>
                                            </button>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/each}
                {/if}
            </div>
            {#if showScrollButton}
                <button 
                    on:click={scrollChatToBottom}
                    class="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg hover:bg-background transition-all z-10 text-muted-foreground"
                    title="Ir al final"
                >
                    <ArrowDown class="w-5 h-5" />
                </button>
            {/if}
            </div>

            <!-- Reply Box -->
            <div class="p-4 bg-background border-t">
                <form 
                    action="?/addProposalComment" 
                    method="POST" 
                    enctype="multipart/form-data"
                    use:enhance={({ formData }) => {
                        // Append files from local state to formData
                        formData.delete('files'); // Clear existing empty/partial input
                        commentFiles.forEach((file) => {
                            formData.append('files', file);
                        });

                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                commentContent = '';
                                commentFiles = [];
                                await invalidateAll();
                            } else {
                                await update();
                            }
                        };
                    }}
                    class="space-y-4"
                >
                    <input type="hidden" name="proposalId" value={selectedProposal.id} />
                    
                    <div class="space-y-2">
                        <input 
                            type="hidden" 
                            name="subject" 
                            value={selectedProposal.title}
                        />
                        
                        <div class="relative">
                            <textarea 
                                name="content" 
                                class="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                placeholder="Escribe tu respuesta..."
                                bind:value={commentContent}
                                required
                            ></textarea>
                        </div>

                        <!-- File Attachments -->
                        <div class="flex items-center gap-2">
                            <input 
                                type="file" 
                                name="files" 
                                multiple 
                                class="hidden" 
                                bind:this={commentFileInput}
                                on:change={handleCommentFileSelect}
                            />
                            <button 
                                type="button" 
                                on:click={() => commentFileInput.click()}
                                class="text-xs flex items-center gap-1 px-2 py-1.5 rounded-md border hover:bg-accent transition-colors text-muted-foreground"
                            >
                                <Paperclip class="w-3 h-3" /> Adjuntar archivos
                            </button>
                            
                            {#if commentFiles.length > 0}
                                <div class="flex gap-2 overflow-x-auto">
                                    {#each commentFiles as file, i}
                                        <div class="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md border">
                                            <span class="max-w-[100px] truncate">{file.name}</span>
                                            <button type="button" on:click={() => removeCommentFile(i)} class="text-muted-foreground hover:text-red-500">
                                                <X class="w-3 h-3" />
                                            </button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={!commentContent.trim()}
                            class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send class="w-4 h-4" /> Enviar Respuesta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}

<!-- Document Preview Modal -->
<DocumentPreviewModal 
    isOpen={isPreviewModalOpen} 
    title={previewFile.title} 
    fileUrl={previewFile.url} 
    onClose={closePreview} 
/>
