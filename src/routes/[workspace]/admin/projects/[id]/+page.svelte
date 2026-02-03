<script lang="ts">
    import { ArrowLeft, CheckCircle2, Circle, Clock, MessageSquare, FileText, User, Calendar, Briefcase, AlertCircle, DollarSign, CreditCard, ExternalLink, Download, Pencil, Trash2, Plus, X, Eye, Inbox, Send, Paperclip } from 'lucide-svelte';
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import DocumentPreviewModal from '$lib/components/DocumentPreviewModal.svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount, tick } from 'svelte';

    export let data: PageData;

    $: ({ project, requirements, milestones, supportCases, proposals, payments, requests, selectedCaseComments, selectedRequestComments, selectedRequirementComments, selectedProposalComments } = data);
    $: allClients = data.allClients; // Destructure allClients
    $: allServices = data.allServices; // Destructure allServices

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

    // Scroll to bottom action for chat
    function scrollToBottom(node: HTMLElement, dependencies: any) {
        const scroll = () => node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
        scroll();

        return {
            update() {
                scroll();
            }
        };
    }

    onMount(() => {
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
    });

    function formatDate(date: Date | null) {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    }

    let activeTab = 'process'; // process, requirements, support, proposals, payments

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


    // Request Modal Logic
    let isRequestModalOpen = false;
    let editingRequest: any = null;
    let filesToKeep: any[] = [];
    
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
    const DEFAULT_SIGNATURE_TEXT = '--\nEquipo de Allianzy Inc\nSoporte Técnico\nwww.allianzy.com';
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

    function openCreateRequestModal() {
        editingRequest = null;
        filesToKeep = [];
        isRequestModalOpen = true;
    }

    function openEditRequestModal(req: any) {
        editingRequest = { ...req };
        filesToKeep = req.files ? [...req.files] : [];
        isRequestModalOpen = true;
    }

    function removeFileToKeep(index: number) {
        filesToKeep = filesToKeep.filter((_, i) => i !== index);
    }

    function closeRequestModal() {
        isRequestModalOpen = false;
        editingRequest = null;
        filesToKeep = [];
    }

    // Milestone Modal Logic
    let isMilestoneModalOpen = false;
    let editingMilestone: any = null;

    function openCreateMilestoneModal() {
        editingMilestone = null;
        isMilestoneModalOpen = true;
    }

    function openEditMilestoneModal(milestone: any) {
        editingMilestone = { ...milestone };
        isMilestoneModalOpen = true;
    }

    function closeMilestoneModal() {
        isMilestoneModalOpen = false;
        editingMilestone = null;
    }

    // Requirement Modal Logic
    let isRequirementModalOpen = false;
    let editingRequirement: any = null;
    let reqFilesToKeep: any[] = [];
    
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

    function openCreateRequirementModal() {
        editingRequirement = null;
        reqFilesToKeep = [];
        isRequirementModalOpen = true;
    }

    function openEditRequirementModal(req: any) {
        editingRequirement = { ...req };
        reqFilesToKeep = req.files ? [...req.files] : [];
        isRequirementModalOpen = true;
    }

    function removeReqFileToKeep(index: number) {
        reqFilesToKeep = reqFilesToKeep.filter((_, i) => i !== index);
    }

    function closeRequirementModal() {
        isRequirementModalOpen = false;
        editingRequirement = null;
        reqFilesToKeep = [];
    }

    // Proposal Modal Logic
    let isProposalModalOpen = false;
    let editingProposal: any = null;
    let propFilesToKeep: any[] = [];
    
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

    function openCreateProposalModal() {
        editingProposal = null;
        propFilesToKeep = [];
        isProposalModalOpen = true;
    }

    function openEditProposalModal(prop: any) {
        editingProposal = { ...prop };
        propFilesToKeep = prop.files ? [...prop.files] : [];
        isProposalModalOpen = true;
    }

    function removePropFileToKeep(index: number) {
        propFilesToKeep = propFilesToKeep.filter((_, i) => i !== index);
    }

    function closeProposalModal() {
        isProposalModalOpen = false;
        editingProposal = null;
        propFilesToKeep = [];
    }

    // Case Modal Logic
    let isCaseModalOpen = false;
    let editingCase: any = null;
    let caseFilesToKeep: any[] = [];
    
    // Case Details Logic
    let isCaseDetailsOpen = false;
    let selectedCase: any = null;
    // let chatContainer: HTMLElement; // Removed as we use action now

    function openCreateCaseModal() {
        editingCase = null;
        caseFilesToKeep = [];
        isCaseModalOpen = true;
    }

    function openEditCaseModal(c: any, e: Event) {
        if (e) e.stopPropagation();
        editingCase = { ...c };
        caseFilesToKeep = c.files ? [...c.files] : [];
        isCaseModalOpen = true;
    }

    function removeCaseFileToKeep(index: number) {
        caseFilesToKeep = caseFilesToKeep.filter((_, i) => i !== index);
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

    // Payment Modal Logic
    let isPaymentModalOpen = false;
    let editingPayment: any = null;

    function openCreatePaymentModal() {
        editingPayment = null;
        isPaymentModalOpen = true;
    }

    function openEditPaymentModal(payment: any) {
        editingPayment = { ...payment };
        isPaymentModalOpen = true;
    }

    function closePaymentModal() {
        isPaymentModalOpen = false;
        editingPayment = null;
    }

    // Edit Project Modal Logic
    let isEditProjectModalOpen = false;
    let selectedClientId: number | null = null;
    let projectLinks: { title: string; url: string }[] = [];

    function openEditProjectModal() {
        selectedClientId = project.clientId;
        projectLinks = project.links ? [...project.links] : [];
        isEditProjectModalOpen = true;
    }

    function addProjectLink() {
        projectLinks = [...projectLinks, { title: '', url: '' }];
    }

    function removeProjectLink(index: number) {
        projectLinks = projectLinks.filter((_, i) => i !== index);
    }

    function closeEditProjectModal() {
        isEditProjectModalOpen = false;
    }

    $: availableServices = data.allServices;
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
                <button on:click={openEditProjectModal} class="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted" title="Editar Proyecto">
                    <Pencil class="w-4 h-4" />
                </button>
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
                            <button 
                                on:click={openCreateMilestoneModal}
                                class="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                            >
                                <Plus class="w-3 h-3" /> Nueva Etapa
                            </button>
                        </div>

                        <div class="relative pl-8 border-l-2 border-muted space-y-8">
                            {#each milestones as step}
                                <div class="relative group">
                                    <div class="absolute -left-[41px] bg-background p-1">
                                        {#if step.status === 'completed'}
                                            <CheckCircle2 class="w-6 h-6 text-green-500" />
                                        {:else if step.status === 'in_progress'}
                                            <Circle class="w-6 h-6 text-blue-500 fill-blue-100" />
                                        {:else}
                                            <Circle class="w-6 h-6 text-muted-foreground" />
                                        {/if}

                                    </div>
                                    <div class="flex items-start justify-between">
                                        <div>
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
                                        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                on:click={() => openEditMilestoneModal(step)}
                                                class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                                title="Editar"
                                            >
                                                <Pencil class="w-4 h-4" />
                                            </button>
                                            <form action="?/deleteMilestone" method="POST" use:enhance>
                                                <input type="hidden" name="id" value={step.id} />
                                                <button 
                                                    type="submit"
                                                    class="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 class="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
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
                            <button 
                                on:click={openCreateRequestModal}
                                class="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                            >
                                <Plus class="w-3 h-3" /> Nueva Solicitud
                            </button>
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
                                        <p class="text-xs text-muted-foreground mt-1 whitespace-pre-line">{req.description || 'Sin descripción'}</p>
                                        <div class="flex items-center gap-4 mt-2 flex-wrap">
                                            <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar class="w-3 h-3" /> {formatDate(req.createdAt)}
                                            </span>
                                            {#if req.files && req.files.length > 0}
                                                <div class="flex flex-wrap gap-2">
                                                    {#each req.files as file}
                                                        <button 
                                                            on:click|stopPropagation={() => openPreview(file.name, file.url)} 
                                                            class="inline-flex items-center gap-1 text-xs text-primary hover:underline border px-2 py-0.5 rounded-md bg-background"
                                                        >
                                                            <Eye class="w-3 h-3" /> {file.name}
                                                        </button>
                                                    {/each}
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            on:click|stopPropagation={() => openEditRequestModal(req)}
                                            class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                            title="Editar"
                                        >
                                            <Pencil class="w-4 h-4" />
                                        </button>
                                        <form action="?/deleteRequest" method="POST" use:enhance on:click|stopPropagation>
                                            <input type="hidden" name="id" value={req.id} />
                                            <button 
                                                type="submit"
                                                class="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600"
                                                title="Eliminar"
                                            >
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>

                <!-- Requirements History -->
                {:else if activeTab === 'requirements'}
                    <div class="space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Historial de Requerimientos</h3>
                            <button 
                                on:click={openCreateRequirementModal}
                                class="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                            >
                                <Plus class="w-3 h-3" /> Nuevo Req
                            </button>
                        </div>
                        {#if requirements.length === 0}
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
                                        <p class="text-xs text-muted-foreground mt-1">{req.description || 'Sin descripción'}</p>
                                        <div class="flex items-center gap-4 mt-2">
                                            <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar class="w-3 h-3" /> {formatDate(req.createdAt)}
                                            </span>
                                            {#if req.files && req.files.length > 0}
                                                <div class="flex flex-wrap gap-2">
                                                    {#each req.files as file}
                                                        <button 
                                                            on:click|stopPropagation={() => openPreview(file.name, file.url)} 
                                                            class="inline-flex items-center gap-1 text-xs text-primary hover:underline border px-2 py-0.5 rounded-md bg-background"
                                                        >
                                                            <Eye class="w-3 h-3" /> {file.name}
                                                        </button>
                                                    {/each}
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            on:click|stopPropagation={() => openEditRequirementModal(req)}
                                            class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                            title="Editar"
                                        >
                                            <Pencil class="w-4 h-4" />
                                        </button>
                                        <form action="?/deleteRequirement" method="POST" use:enhance on:click|stopPropagation>
                                            <input type="hidden" name="id" value={req.id} />
                                            <button 
                                                type="submit"
                                                class="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600"
                                                title="Eliminar"
                                            >
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>

                <!-- Support History -->
                {:else if activeTab === 'support'}
                    <div class="space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Tickets de Soporte</h3>
                            <button 
                                on:click={openCreateCaseModal}
                                class="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                            >
                                <Plus class="w-3 h-3" /> Crear Ticket
                            </button>
                        </div>
                        {#if supportCases.length === 0}
                            <p class="text-muted-foreground text-sm">No hay tickets de soporte.</p>
                        {:else}
                            {#each supportCases as ticket}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div 
                                    class="group flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors cursor-pointer"
                                    on:click={() => openCaseDetails(ticket)}
                                >
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-medium text-sm flex items-center gap-2">
                                                {ticket.title}
                                            </h4>
                                            <span class="px-2 py-0.5 rounded text-[10px] capitalize border
                                                {ticket.status === 'open' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                 ticket.status === 'closed' ? 'bg-gray-100 text-gray-700 border-gray-200' : 
                                                 'bg-yellow-100 text-yellow-700 border-yellow-200'}">
                                                {ticket.status}
                                            </span>
                                            {#if ticket.priority === 'high'}
                                                <span class="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                                    <AlertCircle class="w-3 h-3" /> Alta
                                                </span>
                                            {/if}
                                        </div>
                                        <p class="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.description || 'Sin descripción'}</p>
                                        <div class="flex items-center gap-4 mt-2">
                                            <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar class="w-3 h-3" /> {formatDate(ticket.createdAt)}
                                            </span>
                                            {#if ticket.files && ticket.files.length > 0}
                                                <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Paperclip class="w-3 h-3" /> {ticket.files.length} archivos
                                                </span>
                                            {/if}
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            on:click={(e) => openEditCaseModal(ticket, e)}
                                            class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                            title="Editar"
                                        >
                                            <Pencil class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>

                <!-- Proposal History -->
                {:else if activeTab === 'proposals'}
                    <div class="space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Historial de Propuestas</h3>
                            <button 
                                on:click={openCreateProposalModal}
                                class="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                            >
                                <Plus class="w-3 h-3" /> Nueva Propuesta
                            </button>
                        </div>
                        {#if proposals.length === 0}
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
                                        <p class="text-xs text-muted-foreground mt-1">{prop.description || 'Sin descripción'}</p>
                                        <div class="flex items-center gap-4 mt-2">
                                            <span class="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar class="w-3 h-3" /> {formatDate(prop.createdAt)}
                                            </span>
                                            {#if prop.files && prop.files.length > 0}
                                                <div class="flex flex-wrap gap-2">
                                                    {#each prop.files as file}
                                                        <button on:click={() => openPreview(file.name, file.url)} class="inline-flex items-center gap-1 text-xs text-primary hover:underline border px-2 py-0.5 rounded-md bg-background">
                                                            <Eye class="w-3 h-3" /> {file.name}
                                                        </button>
                                                    {/each}
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            on:click={() => openEditProposalModal(prop)}
                                            class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                            title="Editar"
                                        >
                                            <Pencil class="w-4 h-4" />
                                        </button>
                                        <form action="?/deleteProposal" method="POST" use:enhance>
                                            <input type="hidden" name="id" value={prop.id} />
                                            <button 
                                                type="submit"
                                                class="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600"
                                                title="Eliminar"
                                            >
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>

                <!-- Payments -->
                {:else if activeTab === 'payments'}
                    <div class="space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Pagos y Facturación</h3>
                            <button on:click={openCreatePaymentModal} class="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                                <Plus class="w-4 h-4" /> Nuevo Pago
                            </button>
                        </div>
                        {#if payments.length === 0}
                            <div class="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                                <CreditCard class="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                <p class="text-muted-foreground text-sm mb-4">No hay pagos registrados para este proyecto.</p>
                                <button on:click={openCreatePaymentModal} class="text-sm text-primary hover:underline">
                                    Crear primer pago
                                </button>
                            </div>
                        {:else}
                            <div class="border rounded-lg overflow-hidden">
                                <table class="w-full text-sm">
                                    <thead class="bg-muted/50 text-left">
                                        <tr>
                                            <th class="p-3 font-medium">Concepto</th>
                                            <th class="p-3 font-medium">Fecha Venc.</th>
                                            <th class="p-3 font-medium">Monto</th>
                                            <th class="p-3 font-medium text-right">Estado</th>
                                            <th class="p-3 font-medium text-right w-[100px]">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y">
                                        {#each payments as pay}
                                            <tr class="hover:bg-muted/50 transition-colors">
                                                <td class="p-3">
                                                    <div class="font-medium flex items-center gap-2">
                                                        {pay.title}
                                                        {#if pay.documentUrl}
                                                            <button on:click={() => openPreview(pay.title, pay.documentUrl)} class="text-muted-foreground hover:text-primary" title="Ver documento">
                                                                <Eye class="w-3 h-3" />
                                                            </button>
                                                        {/if}
                                                    </div>
                                                    {#if pay.paidAt}
                                                        <div class="text-xs text-muted-foreground">Pagado el {formatDate(pay.paidAt)}</div>
                                                    {/if}
                                                </td>
                                                <td class="p-3 text-muted-foreground">{formatDate(pay.dueDate)}</td>
                                                <td class="p-3 font-medium">{pay.amount}</td>
                                                <td class="p-3 text-right">
                                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize
                                                        {pay.status === 'paid' ? 'bg-green-100 text-green-700' : 
                                                         pay.status === 'overdue' ? 'bg-red-100 text-red-700' : 
                                                         'bg-yellow-100 text-yellow-700'}">
                                                        {pay.status}
                                                    </span>
                                                </td>
                                                <td class="p-3 text-right">
                                                    <div class="flex items-center justify-end gap-2">
                                                        <button on:click={() => openEditPaymentModal(pay)} class="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Editar">
                                                            <Pencil class="w-4 h-4" />
                                                        </button>
                                                        <form action="?/deletePayment" method="POST" use:enhance>
                                                            <input type="hidden" name="id" value={pay.id} />
                                                            <button type="submit" class="p-1 text-muted-foreground hover:text-red-600 transition-colors" title="Eliminar">
                                                                <Trash2 class="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Right Column: Info Cards -->
        <div class="space-y-6">
            <!-- Client Card -->
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="p-6">
                    <h3 class="font-semibold flex items-center gap-2 mb-4">
                        <User class="w-4 h-4" /> Cliente
                    </h3>
                    <div class="space-y-3 text-sm">
                        <div>
                            <p class="text-muted-foreground text-xs">Nombre</p>
                            <p class="font-medium">{project.clientName}</p>
                        </div>
                        {#if project.clientCompany}
                        <div>
                            <p class="text-muted-foreground text-xs">Empresa</p>
                            <p class="font-medium">{project.clientCompany}</p>
                        </div>
                        {/if}
                        <div>
                            <p class="text-muted-foreground text-xs">Email</p>
                            <p class="font-medium">{project.clientEmail}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Project Info -->
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="p-6">
                    <h3 class="font-semibold flex items-center gap-2 mb-4">
                        <Briefcase class="w-4 h-4" /> Detalles
                    </h3>
                    <div class="space-y-3 text-sm">
                        <div>
                            <p class="text-muted-foreground text-xs">Servicio</p>
                            <p class="font-medium">{project.serviceName}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <p class="text-muted-foreground text-xs">Inicio</p>
                                <p class="font-medium">{formatDate(project.startDate)}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Project Links -->
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="p-6">
                    <h3 class="font-semibold flex items-center gap-2 mb-4">
                        <ExternalLink class="w-4 h-4" /> Enlaces
                    </h3>
                    {#if project.links && project.links.length > 0}
                        <div class="space-y-3 text-sm">
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

<!-- Milestone Modal -->
{#if isMilestoneModalOpen}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button on:click={closeMilestoneModal} class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X class="w-4 h-4" />
            </button>
            
            <h2 class="text-lg font-bold mb-4">
                {editingMilestone ? 'Editar Etapa' : 'Nueva Etapa'}
            </h2>
            
            <form 
                action={editingMilestone ? '?/updateMilestone' : '?/createMilestone'} 
                method="POST" 
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeMilestoneModal();
                            await invalidateAll();
                        } else {
                            await update();
                        }
                    };
                }}
                class="space-y-4"
            >
                {#if editingMilestone}
                    <input type="hidden" name="id" value={editingMilestone.id} />
                {/if}

                <div class="space-y-2">
                    <label for="title" class="text-sm font-medium">Título</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="title"
                        required
                        value={editingMilestone?.title || ''}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ej. Diseño UI/UX"
                    />
                </div>

                <div class="space-y-2">
                    <label for="order" class="text-sm font-medium">Orden</label>
                    <input 
                        type="number" 
                        name="order" 
                        id="order"
                        required
                        value={editingMilestone?.order || (milestones.length + 1)}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {#if editingMilestone}
                    <div class="space-y-2">
                        <label for="status" class="text-sm font-medium">Estado</label>
                        <select 
                            name="status" 
                            id="status"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingMilestone.status}
                        >
                            <option value="pending">Pendiente</option>
                            <option value="in_progress">En Curso</option>
                            <option value="completed">Completado</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label for="completedDate" class="text-sm font-medium">Fecha y Hora de Finalización</label>
                        <div class="flex gap-2">
                            <input 
                                type="date" 
                                name="completedDate" 
                                id="completedDate"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={editingMilestone.completedAt ? new Date(editingMilestone.completedAt).toISOString().split('T')[0] : ''}
                            />
                            <input 
                                type="time" 
                                name="completedTime" 
                                id="completedTime"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={editingMilestone.completedAt ? new Date(editingMilestone.completedAt).toTimeString().split(' ')[0].slice(0, 5) : ''}
                            />
                        </div>
                    </div>
                {/if}

                <div class="flex justify-end gap-2 mt-6">
                    <button type="button" on:click={closeMilestoneModal} class="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        {editingMilestone ? 'Guardar Cambios' : 'Crear Etapa'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Case Modal -->
{#if isCaseModalOpen}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button on:click={closeCaseModal} class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X class="w-4 h-4" />
            </button>
            
            <h2 class="text-lg font-bold mb-4">
                {editingCase ? 'Editar Ticket' : 'Nuevo Ticket de Soporte'}
            </h2>
            
            <form 
                action={editingCase ? '?/updateCase' : '?/createCase'} 
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
                {#if editingCase}
                    <input type="hidden" name="id" value={editingCase.id} />
                {/if}

                <div class="space-y-2">
                    <label for="case-title" class="text-sm font-medium">Título</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="case-title"
                        required
                        value={editingCase?.title || ''}
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
                    >{editingCase?.description || ''}</textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label for="case-priority" class="text-sm font-medium">Prioridad</label>
                        <select 
                            name="priority" 
                            id="case-priority"
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingCase?.priority || 'medium'}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label for="case-status" class="text-sm font-medium">Estado</label>
                        <select 
                            name="status" 
                            id="case-status"
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingCase?.status || 'open'}
                        >
                            <option value="open">Abierto</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="closed">Cerrado</option>
                        </select>
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
                    
                    <input type="hidden" name="existingFiles" value={JSON.stringify(caseFilesToKeep)} />
                    
                    {#if caseFilesToKeep.length > 0}
                        <div class="mt-2 space-y-2">
                            <p class="text-xs font-medium text-muted-foreground">Archivos existentes:</p>
                            <div class="flex flex-wrap gap-2">
                                {#each caseFilesToKeep as file, i}
                                    <div class="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded text-xs border">
                                        <span class="max-w-[200px] truncate" title={file.name}>{file.name}</span>
                                        <button type="button" on:click={() => removeCaseFileToKeep(i)} class="text-muted-foreground hover:text-red-500">
                                            <X class="w-3 h-3" />
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
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
                        {editingCase ? 'Guardar Cambios' : 'Crear Ticket'}
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

            <!-- Chat Area (Email Thread Style) -->
            <div 
                class="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50" 
                use:scrollToBottom={selectedCaseComments}
            >
                {#if !selectedCaseComments || selectedCaseComments.length === 0}
                    <div class="text-center py-10 text-muted-foreground text-sm">
                        <MessageSquare class="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>No hay mensajes aún.</p>
                    </div>
                {:else}
                    {#each selectedCaseComments as comment}
                        {@const isAdmin = comment.authorName === 'Admin'}
                        <div class="border rounded-lg bg-white shadow-sm overflow-hidden {isAdmin ? 'border-primary/20' : ''}">
                            <!-- Email Header -->
                            <div class="{isAdmin ? 'bg-primary/5' : 'bg-muted/10'} px-4 py-3 border-b">
                                <div class="flex justify-between items-center mb-2">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full {isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs">
                                            {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {comment.authorName || 'Usuario'}
                                                {#if isAdmin}
                                                    <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">Yo</span>
                                                {/if}
                                            </span>
                                            <span class="text-[10px] text-muted-foreground">Para: {isAdmin ? 'Usuario' : 'Soporte'}</span>
                                        </div>
                                    </div>
                                    <span class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                                </div>
                                {#if comment.subject}
                                    <div class="text-xs font-medium text-foreground/90 pl-10">
                                        Asunto: {comment.subject}
                                    </div>
                                {/if}
                            </div>
                            
                            <!-- Email Body -->
                            <div class="p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans">
                                {comment.content}
                            </div>
                            
                            <!-- Attachments -->
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

            <!-- Input Area (Email Reply Style) -->
            <div class="p-4 bg-background border-t">
                <form 
                    action="?/addCaseComment" 
                    method="POST" 
                    enctype="multipart/form-data"
                    use:enhance={({ formData }) => {
                        // Remove any existing 'files' entries from the input
                        formData.delete('files');
                        // Append our managed files
                        commentFiles.forEach(file => {
                            formData.append('files', file);
                        });
                        
                        // Combine body and signature
                        formData.set('content', commentContent + '\n\n' + signatureContent);

                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                commentFiles = []; // Clear files on success
                                commentContent = ''; // Reset body
                            }
                            await update();
                        };
                    }}
                    class="flex flex-col gap-3"
                >
                    <input type="hidden" name="caseId" value={selectedCase.id} />
                    
                    <!-- File Previews -->
                    {#if commentFiles.length > 0}
                        <div class="flex flex-wrap gap-2 p-2 bg-muted/20 rounded-md border border-dashed">
                            {#each commentFiles as file, i}
                                <div class="flex items-center gap-2 text-xs bg-background border px-2 py-1 rounded shadow-sm">
                                    <Paperclip class="w-3 h-3 text-muted-foreground" />
                                    <span class="max-w-[150px] truncate" title={file.name}>{file.name}</span>
                                    <button 
                                        type="button" 
                                        on:click={() => removeCommentFile(i)}
                                        class="text-muted-foreground hover:text-destructive p-0.5 rounded-full hover:bg-muted"
                                    >
                                        <X class="w-3 h-3" />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <div class="border rounded-md bg-background overflow-hidden">
                        <!-- Email Composition Header -->
                        <div class="bg-muted/10 border-b px-3 py-2 space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-medium text-muted-foreground w-12">Asunto:</span>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    value={selectedCase.title} 
                                    class="flex-1 text-sm bg-transparent border-none focus:outline-none p-0 placeholder:text-muted-foreground"
                                    placeholder="Asunto"
                                />
                            </div>
                        </div>

                        <!-- Email Body -->
                        <textarea 
                            name="content" 
                            rows="6" 
                            required
                            bind:value={commentContent}
                            class="w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none resize-none font-sans leading-relaxed"
                            placeholder="Escribe tu mensaje..."
                        ></textarea>
                        
                        <!-- Signature -->
                        <div class="bg-muted/5 border-t px-3 py-2">
                             <div class="flex justify-between items-center mb-1">
                                <label class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Firma</label>
                             </div>
                             <textarea 
                                bind:value={signatureContent}
                                rows="4"
                                class="w-full bg-transparent text-xs text-muted-foreground border-none resize-none focus:outline-none p-0 font-sans"
                                placeholder="Firma..."
                            ></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <button 
                                type="button"
                                on:click={() => commentFileInput.click()}
                                class="cursor-pointer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 hover:bg-muted rounded-md transition-colors border border-transparent hover:border-input" 
                                title="Adjuntar archivo"
                            >
                                <Paperclip class="w-4 h-4" />
                                <span>Adjuntar archivos</span>
                            </button>
                            <input 
                                type="file" 
                                bind:this={commentFileInput}
                                on:change={handleCommentFileSelect}
                                multiple 
                                class="hidden" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 gap-2"
                        >
                            <Send class="w-4 h-4" /> Responder
                        </button>
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

            <!-- Chat Area (Email Thread Style) -->
            <div 
                class="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50" 
                use:scrollToBottom={selectedRequestComments}
            >
                {#if !selectedRequestComments || selectedRequestComments.length === 0}
                    <div class="text-center py-10 text-muted-foreground text-sm">
                        <MessageSquare class="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>No hay mensajes aún.</p>
                    </div>
                {:else}
                    {#each selectedRequestComments as comment}
                        {@const isAdmin = comment.authorName === 'Admin'}
                        <div class="border rounded-lg bg-white shadow-sm overflow-hidden {isAdmin ? 'border-primary/20' : ''}">
                            <!-- Email Header -->
                            <div class="{isAdmin ? 'bg-primary/5' : 'bg-muted/10'} px-4 py-3 border-b">
                                <div class="flex justify-between items-center mb-2">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full {isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs">
                                            {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {comment.authorName || 'Usuario'}
                                                {#if isAdmin}
                                                    <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">Yo</span>
                                                {/if}
                                            </span>
                                            <span class="text-[10px] text-muted-foreground">Para: {isAdmin ? 'Usuario' : 'Soporte'}</span>
                                        </div>
                                    </div>
                                    <span class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                                </div>
                                {#if comment.subject}
                                    <div class="text-xs font-medium text-foreground/90 pl-10">
                                        Asunto: {comment.subject}
                                    </div>
                                {/if}
                            </div>
                            
                            <!-- Email Body -->
                            <div class="p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans">
                                {comment.content}
                            </div>
                            
                            <!-- Attachments -->
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

            <!-- Input Area (Email Reply Style) -->
            <div class="p-4 bg-background border-t">
                <form 
                    action="?/addRequestComment" 
                    method="POST" 
                    enctype="multipart/form-data"
                    use:enhance={({ formData }) => {
                        // Remove any existing 'files' entries from the input
                        formData.delete('files');
                        // Append our managed files
                        commentFiles.forEach(file => {
                            formData.append('files', file);
                        });
                        
                        // Combine body and signature
                        formData.set('content', commentContent + '\n\n' + signatureContent);

                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                commentFiles = []; // Clear files on success
                                commentContent = ''; // Reset body
                            }
                            await update();
                        };
                    }}
                    class="flex flex-col gap-3"
                >
                    <input type="hidden" name="requestId" value={selectedRequest.id} />
                    
                    <!-- File Previews -->
                    {#if commentFiles.length > 0}
                        <div class="flex flex-wrap gap-2 p-2 bg-muted/20 rounded-md border border-dashed">
                            {#each commentFiles as file, i}
                                <div class="flex items-center gap-2 text-xs bg-background border px-2 py-1 rounded shadow-sm">
                                    <Paperclip class="w-3 h-3 text-muted-foreground" />
                                    <span class="max-w-[150px] truncate" title={file.name}>{file.name}</span>
                                    <button 
                                        type="button" 
                                        on:click={() => removeCommentFile(i)}
                                        class="text-muted-foreground hover:text-destructive p-0.5 rounded-full hover:bg-muted"
                                    >
                                        <X class="w-3 h-3" />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <div class="border rounded-md bg-background overflow-hidden">
                        <!-- Email Composition Header -->
                        <div class="bg-muted/10 border-b px-3 py-2 space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-medium text-muted-foreground w-12">Asunto:</span>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    value={selectedRequest.title} 
                                    class="flex-1 text-sm bg-transparent border-none focus:outline-none p-0 placeholder:text-muted-foreground"
                                    placeholder="Asunto"
                                />
                            </div>
                        </div>

                        <!-- Email Body -->
                        <textarea 
                            name="content" 
                            rows="6" 
                            required
                            bind:value={commentContent}
                            class="w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none resize-none font-sans leading-relaxed"
                            placeholder="Escribe tu mensaje..."
                        ></textarea>
                        
                        <!-- Signature -->
                        <div class="bg-muted/5 border-t px-3 py-2">
                             <div class="flex justify-between items-center mb-1">
                                <label class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Firma</label>
                             </div>
                             <textarea 
                                bind:value={signatureContent}
                                rows="4"
                                class="w-full bg-transparent text-xs text-muted-foreground border-none resize-none focus:outline-none p-0 font-sans"
                                placeholder="Firma..."
                            ></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <button 
                                type="button"
                                on:click={() => commentFileInput.click()}
                                class="cursor-pointer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 hover:bg-muted rounded-md transition-colors border border-transparent hover:border-input" 
                                title="Adjuntar archivo"
                            >
                                <Paperclip class="w-4 h-4" />
                                <span>Adjuntar archivos</span>
                            </button>
                            <input 
                                type="file" 
                                bind:this={commentFileInput}
                                on:change={handleCommentFileSelect}
                                multiple 
                                class="hidden" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 gap-2"
                        >
                            <Send class="w-4 h-4" /> Responder
                        </button>
                    </div>
                </form>
            </div>
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

            <!-- Chat Area (Email Thread Style) -->
            <div 
                class="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50" 
                use:scrollToBottom={selectedRequirementComments}
            >
                {#if !selectedRequirementComments || selectedRequirementComments.length === 0}
                    <div class="text-center py-10 text-muted-foreground text-sm">
                        <MessageSquare class="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>No hay mensajes aún.</p>
                    </div>
                {:else}
                    {#each selectedRequirementComments as comment}
                        {@const isAdmin = comment.authorName === 'Admin'}
                        <div class="border rounded-lg bg-white shadow-sm overflow-hidden {isAdmin ? 'border-primary/20' : ''}">
                            <!-- Email Header -->
                            <div class="{isAdmin ? 'bg-primary/5' : 'bg-muted/10'} px-4 py-3 border-b">
                                <div class="flex justify-between items-center mb-2">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full {isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs">
                                            {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {comment.authorName || 'Usuario'}
                                                {#if isAdmin}
                                                    <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">Yo</span>
                                                {/if}
                                            </span>
                                            <span class="text-[10px] text-muted-foreground">Para: {isAdmin ? 'Usuario' : 'Soporte'}</span>
                                        </div>
                                    </div>
                                    <span class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                                </div>
                                {#if comment.subject}
                                    <div class="text-xs font-medium text-foreground/90 pl-10">
                                        Asunto: {comment.subject}
                                    </div>
                                {/if}
                            </div>
                            
                            <!-- Email Body -->
                            <div class="p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans">
                                {comment.content}
                            </div>
                            
                            <!-- Attachments -->
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

            <!-- Input Area (Email Reply Style) -->
            <div class="p-4 bg-background border-t">
                <form 
                    action="?/addRequirementComment" 
                    method="POST" 
                    enctype="multipart/form-data"
                    use:enhance={({ formData }) => {
                        // Remove any existing 'files' entries from the input
                        formData.delete('files');
                        // Append our managed files
                        commentFiles.forEach(file => {
                            formData.append('files', file);
                        });
                        
                        // Combine body and signature
                        formData.set('content', commentContent + '\n\n' + signatureContent);

                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                commentFiles = []; // Clear files on success
                                commentContent = ''; // Reset body
                            }
                            await update();
                        };
                    }}
                    class="flex flex-col gap-3"
                >
                    <input type="hidden" name="requirementId" value={selectedRequirement.id} />
                    
                    <!-- File Previews -->
                    {#if commentFiles.length > 0}
                        <div class="flex flex-wrap gap-2 p-2 bg-muted/20 rounded-md border border-dashed">
                            {#each commentFiles as file, i}
                                <div class="flex items-center gap-2 text-xs bg-background border px-2 py-1 rounded shadow-sm">
                                    <Paperclip class="w-3 h-3 text-muted-foreground" />
                                    <span class="max-w-[150px] truncate" title={file.name}>{file.name}</span>
                                    <button 
                                        type="button" 
                                        on:click={() => removeCommentFile(i)}
                                        class="text-muted-foreground hover:text-destructive p-0.5 rounded-full hover:bg-muted"
                                    >
                                        <X class="w-3 h-3" />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <div class="border rounded-md bg-background overflow-hidden">
                        <!-- Email Composition Header -->
                        <div class="bg-muted/10 border-b px-3 py-2 space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-medium text-muted-foreground w-12">Asunto:</span>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    value={selectedRequirement.title} 
                                    class="flex-1 text-sm bg-transparent border-none focus:outline-none p-0 placeholder:text-muted-foreground"
                                    placeholder="Asunto"
                                />
                            </div>
                        </div>

                        <!-- Email Body -->
                        <textarea 
                            name="content" 
                            rows="6" 
                            required
                            bind:value={commentContent}
                            class="w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none resize-none font-sans leading-relaxed"
                            placeholder="Escribe tu mensaje..."
                        ></textarea>
                        
                        <!-- Signature -->
                        <div class="bg-muted/5 border-t px-3 py-2">
                             <div class="flex justify-between items-center mb-1">
                                <label class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Firma</label>
                             </div>
                             <textarea 
                                bind:value={signatureContent}
                                rows="4"
                                class="w-full bg-transparent text-xs text-muted-foreground border-none resize-none focus:outline-none p-0 font-sans"
                                placeholder="Firma..."
                            ></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <button 
                                type="button"
                                on:click={() => commentFileInput.click()}
                                class="cursor-pointer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 hover:bg-muted rounded-md transition-colors border border-transparent hover:border-input" 
                                title="Adjuntar archivo"
                            >
                                <Paperclip class="w-4 h-4" />
                                <span>Adjuntar archivos</span>
                            </button>
                            <input 
                                type="file" 
                                bind:this={commentFileInput}
                                on:change={handleCommentFileSelect}
                                multiple 
                                class="hidden" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 gap-2"
                        >
                            <Send class="w-4 h-4" /> Responder
                        </button>
                    </div>
                </form>
            </div>
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
                    {selectedProposal.description || 'Sin descripción'}
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

            <!-- Chat Area (Email Thread Style) -->
            <div 
                class="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50" 
                use:scrollToBottom={selectedProposalComments}
            >
                {#if !selectedProposalComments || selectedProposalComments.length === 0}
                    <div class="text-center py-10 text-muted-foreground text-sm">
                        <MessageSquare class="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>No hay mensajes aún.</p>
                    </div>
                {:else}
                    {#each selectedProposalComments as comment}
                        {@const isAdmin = comment.authorName === 'Admin'}
                        <div class="border rounded-lg bg-white shadow-sm overflow-hidden {isAdmin ? 'border-primary/20' : ''}">
                            <!-- Email Header -->
                            <div class="{isAdmin ? 'bg-primary/5' : 'bg-muted/10'} px-4 py-3 border-b">
                                <div class="flex justify-between items-center mb-2">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full {isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-bold text-xs">
                                            {(comment.authorName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {comment.authorName || 'Usuario'}
                                                {#if isAdmin}
                                                    <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">Yo</span>
                                                {/if}
                                            </span>
                                            <span class="text-[10px] text-muted-foreground">Para: {isAdmin ? 'Usuario' : 'Soporte'}</span>
                                        </div>
                                    </div>
                                    <span class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                                </div>
                                {#if comment.subject}
                                    <div class="text-xs font-medium text-foreground/90 pl-10">
                                        Asunto: {comment.subject}
                                    </div>
                                {/if}
                            </div>
                            
                            <!-- Email Body -->
                            <div class="p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans">
                                {comment.content}
                            </div>
                            
                            <!-- Attachments -->
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

            <!-- Input Area (Email Reply Style) -->
            <div class="p-4 bg-background border-t">
                <form 
                    action="?/addProposalComment" 
                    method="POST" 
                    enctype="multipart/form-data"
                    use:enhance={({ formData }) => {
                        // Remove any existing 'files' entries from the input
                        formData.delete('files');
                        // Append our managed files
                        commentFiles.forEach(file => {
                            formData.append('files', file);
                        });
                        
                        // Combine body and signature
                        formData.set('content', commentContent + '\n\n' + signatureContent);

                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                commentFiles = []; // Clear files on success
                                commentContent = ''; // Reset body
                            }
                            await update();
                        };
                    }}
                    class="flex flex-col gap-3"
                >
                    <input type="hidden" name="proposalId" value={selectedProposal.id} />
                    
                    <!-- File Previews -->
                    {#if commentFiles.length > 0}
                        <div class="flex flex-wrap gap-2 p-2 bg-muted/20 rounded-md border border-dashed">
                            {#each commentFiles as file, i}
                                <div class="flex items-center gap-2 text-xs bg-background border px-2 py-1 rounded shadow-sm">
                                    <Paperclip class="w-3 h-3 text-muted-foreground" />
                                    <span class="max-w-[150px] truncate" title={file.name}>{file.name}</span>
                                    <button 
                                        type="button" 
                                        on:click={() => removeCommentFile(i)}
                                        class="text-muted-foreground hover:text-destructive p-0.5 rounded-full hover:bg-muted"
                                    >
                                        <X class="w-3 h-3" />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <div class="border rounded-md bg-background overflow-hidden">
                        <!-- Email Composition Header -->
                        <div class="bg-muted/10 border-b px-3 py-2 space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-medium text-muted-foreground w-12">Asunto:</span>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    value={selectedProposal.title} 
                                    class="flex-1 text-sm bg-transparent border-none focus:outline-none p-0 placeholder:text-muted-foreground"
                                    placeholder="Asunto"
                                />
                            </div>
                        </div>

                        <!-- Email Body -->
                        <textarea 
                            name="content" 
                            rows="6" 
                            required
                            bind:value={commentContent}
                            class="w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none resize-none font-sans leading-relaxed"
                            placeholder="Escribe tu mensaje..."
                        ></textarea>
                        
                        <!-- Signature -->
                        <div class="bg-muted/5 border-t px-3 py-2">
                             <div class="flex justify-between items-center mb-1">
                                <label class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Firma</label>
                             </div>
                             <textarea 
                                bind:value={signatureContent}
                                rows="4"
                                class="w-full bg-transparent text-xs text-muted-foreground border-none resize-none focus:outline-none p-0 font-sans"
                                placeholder="Firma..."
                            ></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <button 
                                type="button"
                                on:click={() => commentFileInput.click()}
                                class="cursor-pointer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 hover:bg-muted rounded-md transition-colors border border-transparent hover:border-input" 
                                title="Adjuntar archivo"
                            >
                                <Paperclip class="w-4 h-4" />
                                <span>Adjuntar archivos</span>
                            </button>
                            <input 
                                type="file" 
                                bind:this={commentFileInput}
                                on:change={handleCommentFileSelect}
                                multiple 
                                class="hidden" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 gap-2"
                        >
                            <Send class="w-4 h-4" /> Responder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}

<DocumentPreviewModal
    isOpen={isPreviewModalOpen}
    title={previewFile.title}
    fileUrl={previewFile.url}
    onClose={closePreview}
/>

<!-- Edit Project Modal -->
{#if isEditProjectModalOpen}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button on:click={closeEditProjectModal} class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X class="w-4 h-4" />
            </button>
            
            <h2 class="text-lg font-bold mb-4">Editar Proyecto</h2>
            
            <form 
                action="?/updateProject" 
                method="POST" 
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeEditProjectModal();
                        }
                        await update();
                    };
                }}
                class="space-y-4"
            >
                <div class="space-y-2">
                    <label for="edit-name" class="text-sm font-medium">Nombre del Proyecto</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="edit-name"
                        required
                        value={project.name}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div class="space-y-2">
                    <label for="edit-startDate" class="text-sm font-medium">Fecha y Hora de Inicio</label>
                    <div class="flex gap-2">
                        <input 
                            type="date" 
                            name="startDate" 
                            id="edit-startDate"
                            required
                            value={project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''}
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <input 
                            type="time" 
                            name="startTime" 
                            id="edit-startTime"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={project.startDate ? new Date(project.startDate).toISOString().split('T')[1].slice(0, 5) : ''}
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="edit-status" class="text-sm font-medium">Estado</label>
                    <select 
                        name="status" 
                        id="edit-status"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={project.status}
                    >
                        <option value="Pending">Pendiente</option>
                        <option value="In Progress">En Curso</option>
                        <option value="Completed">Completado</option>
                        <option value="On Hold">En Espera</option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label for="edit-provider" class="text-sm font-medium">Proveedor del Servicio</label>
                    <select 
                        name="provider" 
                        id="edit-provider"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={project.provider || 'Allianzy'}
                    >
                        <option value="Allianzy">Allianzy</option>
                        <option value="Beltrix">Beltrix</option>
                        <option value="Provider">Proveedor</option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label for="edit-client" class="text-sm font-medium">Cliente</label>
                    <select 
                        name="clientId"
                        id="edit-client"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        bind:value={selectedClientId}
                    >
                        {#each allClients as client}
                            <option value={client.id}>
                                {[client.firstName, client.lastName].filter(Boolean).join(' ') || 'Sin Nombre'} 
                                {client.company ? `| ${client.company}` : ''}
                            </option>
                        {/each}
                    </select>
                </div>

                <div class="space-y-2">
                    <label for="edit-service" class="text-sm font-medium">Servicio (Suscripción)</label>
                    <select 
                        name="serviceId" 
                        id="edit-service"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={project.serviceId}
                    >
                        {#if availableServices.length === 0}
                            <option value="" disabled>No hay servicios disponibles para este cliente</option>
                        {:else}
                            {#each availableServices as service}
                                <option value={service.id}>{service.name} ({service.status})</option>
                            {/each}
                        {/if}
                    </select>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium">Enlaces del Proyecto</label>
                    <input type="hidden" name="links" value={JSON.stringify(projectLinks)} />
                    
                    <div class="space-y-2">
                        {#each projectLinks as link, index}
                            <div class="flex gap-2 items-start">
                                <div class="grid grid-cols-2 gap-2 flex-1">
                                    <input 
                                        type="text" 
                                        placeholder="Título (ej. GitHub)"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        bind:value={link.title}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="URL (https://...)"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        bind:value={link.url}
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    on:click={() => removeProjectLink(index)}
                                    class="p-2 text-muted-foreground hover:text-red-600 transition-colors mt-0.5"
                                    title="Eliminar enlace"
                                >
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        {/each}
                        <button 
                            type="button" 
                            on:click={addProjectLink}
                            class="text-xs flex items-center gap-1 text-primary hover:underline mt-2"
                        >
                            <Plus class="w-3 h-3" /> Agregar Enlace
                        </button>
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <button type="button" on:click={closeEditProjectModal} class="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Payment Modal -->
{#if isPaymentModalOpen}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button on:click={closePaymentModal} class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X class="w-4 h-4" />
            </button>
            
            <h2 class="text-lg font-bold mb-4">
                {editingPayment ? 'Editar Pago' : 'Nuevo Pago'}
            </h2>
            
            <form 
                action={editingPayment ? '?/updatePayment' : '?/createPayment'} 
                method="POST" 
                enctype="multipart/form-data"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closePaymentModal();
                        }
                        await update();
                    };
                }}
                class="space-y-4"
            >
                {#if editingPayment}
                    <input type="hidden" name="id" value={editingPayment.id} />
                {/if}

                <div class="space-y-2">
                    <label for="pay-title" class="text-sm font-medium">Concepto</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="pay-title"
                        required
                        value={editingPayment?.title || ''}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ej. Anticipo 50%"
                    />
                </div>

                <div class="space-y-2">
                    <label for="pay-file" class="text-sm font-medium">Comprobante / Factura (Opcional)</label>
                    <input 
                        type="file" 
                        name="file" 
                        id="pay-file"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {#if editingPayment?.documentUrl}
                        <p class="text-xs text-muted-foreground">
                            Archivo actual: <a href={editingPayment.documentUrl} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Ver documento</a>. Si subes uno nuevo, se reemplazará.
                        </p>
                    {/if}
                </div>

                <div class="space-y-2">
                    <label for="pay-amount" class="text-sm font-medium">Monto</label>
                    <input 
                        type="text" 
                        name="amount" 
                        id="pay-amount"
                        required
                        value={editingPayment?.amount || ''}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="$0.00"
                    />
                </div>

                <div class="space-y-2">
                    <label for="pay-dueDate" class="text-sm font-medium">Fecha de Vencimiento</label>
                    <input 
                        type="date" 
                        name="dueDate" 
                        id="pay-dueDate"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editingPayment?.dueDate ? new Date(editingPayment.dueDate).toISOString().split('T')[0] : ''}
                    />
                </div>

                <div class="space-y-2">
                    <label for="pay-status" class="text-sm font-medium">Estado</label>
                    <select 
                        name="status" 
                        id="pay-status"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editingPayment?.status || 'pending'}
                    >
                        <option value="pending">Pendiente</option>
                        <option value="paid">Pagado</option>
                        <option value="overdue">Vencido</option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label for="pay-paidAt" class="text-sm font-medium">Fecha de Pago</label>
                    <input 
                        type="date" 
                        name="paidAt" 
                        id="pay-paidAt"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editingPayment?.paidAt ? new Date(editingPayment.paidAt).toISOString().split('T')[0] : ''}
                    />
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <button type="button" on:click={closePaymentModal} class="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        {editingPayment ? 'Guardar Cambios' : 'Crear Pago'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Requirement Modal -->
{#if isRequirementModalOpen}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button on:click={closeRequirementModal} class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X class="w-4 h-4" />
            </button>
            
            <h2 class="text-lg font-bold mb-4">
                {editingRequirement ? 'Editar Requerimiento' : 'Nuevo Requerimiento'}
            </h2>
            
            <form 
                action={editingRequirement ? '?/updateRequirement' : '?/createRequirement'} 
                method="POST" 
                enctype="multipart/form-data"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeRequirementModal();
                            await invalidateAll();
                        } else {
                            await update();
                        }
                    };
                }}
                class="space-y-4"
            >
                {#if editingRequirement}
                    <input type="hidden" name="id" value={editingRequirement.id} />
                {/if}

                <div class="space-y-2">
                    <label for="req-title" class="text-sm font-medium">Título</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="req-title"
                        required
                        value={editingRequirement?.title || ''}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ej. Brief de Diseño"
                    />
                </div>

                <div class="space-y-2">
                    <label for="req-description" class="text-sm font-medium">Descripción</label>
                    <textarea 
                        name="description" 
                        id="req-description"
                        rows="3"
                        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Descripción del requerimiento..."
                    >{editingRequirement?.description || ''}</textarea>
                </div>

                <div class="space-y-2">
                    <label for="req-files" class="text-sm font-medium">Archivos</label>
                    <input 
                        type="file" 
                        name="files" 
                        id="req-files"
                        multiple
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    
                    <input type="hidden" name="existingFiles" value={JSON.stringify(reqFilesToKeep)} />
                    
                    {#if reqFilesToKeep.length > 0}
                        <div class="mt-2 space-y-2">
                            <p class="text-xs font-medium text-muted-foreground">Archivos existentes:</p>
                            <div class="flex flex-wrap gap-2">
                                {#each reqFilesToKeep as file, i}
                                    <div class="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded text-xs border">
                                        <span class="max-w-[200px] truncate" title={file.name}>{file.name}</span>
                                        <button type="button" on:click={() => removeReqFileToKeep(i)} class="text-muted-foreground hover:text-red-500">
                                            <X class="w-3 h-3" />
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

                <div class="space-y-2">
                    <label for="reqDate" class="text-sm font-medium">Fecha y Hora</label>
                    <div class="flex gap-2">
                        <input 
                            type="date" 
                            name="reqDate" 
                            id="reqDate"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingRequirement?.createdAt ? new Date(editingRequirement.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        />
                        <input 
                            type="time" 
                            name="reqTime" 
                            id="reqTime"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingRequirement?.createdAt ? new Date(editingRequirement.createdAt).toTimeString().split(' ')[0].slice(0, 5) : new Date().toTimeString().split(' ')[0].slice(0, 5)}
                        />
                    </div>
                </div>

                {#if editingRequirement}
                    <div class="space-y-2">
                        <label for="req-status" class="text-sm font-medium">Estado</label>
                        <select 
                            name="status" 
                            id="req-status"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingRequirement.status}
                        >
                            <option value="pending">Pendiente</option>
                            <option value="approved">Aprobado</option>
                            <option value="rejected">Rechazado</option>
                        </select>
                    </div>
                {/if}

                <div class="flex justify-end gap-2 mt-6">
                    <button type="button" on:click={closeRequirementModal} class="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        {editingRequirement ? 'Guardar Cambios' : 'Crear Requerimiento'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Proposal Modal -->
{#if isProposalModalOpen}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button on:click={closeProposalModal} class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X class="w-4 h-4" />
            </button>
            
            <h2 class="text-lg font-bold mb-4">
                {editingProposal ? 'Editar Propuesta' : 'Nueva Propuesta'}
            </h2>
            
            <form 
                action={editingProposal ? '?/updateProposal' : '?/createProposal'} 
                method="POST" 
                enctype="multipart/form-data"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeProposalModal();
                            await invalidateAll();
                        } else {
                            await update();
                        }
                    };
                }}
                class="space-y-4"
            >
                {#if editingProposal}
                    <input type="hidden" name="id" value={editingProposal.id} />
                {/if}

                <div class="space-y-2">
                    <label for="prop-title" class="text-sm font-medium">Título</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="prop-title"
                        required
                        value={editingProposal?.title || ''}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ej. Propuesta de Diseño"
                    />
                </div>

                <div class="space-y-2">
                    <label for="prop-description" class="text-sm font-medium">Descripción</label>
                    <textarea 
                        name="description" 
                        id="prop-description"
                        rows="3"
                        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Descripción de la propuesta..."
                    >{editingProposal?.description || ''}</textarea>
                </div>

                <div class="space-y-2">
                    <label for="prop-files" class="text-sm font-medium">Archivos</label>
                    <input 
                        type="file" 
                        name="files" 
                        id="prop-files"
                        multiple
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    
                    <input type="hidden" name="existingFiles" value={JSON.stringify(propFilesToKeep)} />
                    
                    {#if propFilesToKeep.length > 0}
                        <div class="mt-2 space-y-2">
                            <p class="text-xs font-medium text-muted-foreground">Archivos existentes:</p>
                            <div class="flex flex-wrap gap-2">
                                {#each propFilesToKeep as file, i}
                                    <div class="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded text-xs border">
                                        <span class="max-w-[200px] truncate" title={file.name}>{file.name}</span>
                                        <button type="button" on:click={() => removePropFileToKeep(i)} class="text-muted-foreground hover:text-red-500">
                                            <X class="w-3 h-3" />
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

                <div class="space-y-2">
                    <label for="propDate" class="text-sm font-medium">Fecha y Hora</label>
                    <div class="flex gap-2">
                        <input 
                            type="date" 
                            name="propDate" 
                            id="propDate"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingProposal?.createdAt ? new Date(editingProposal.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        />
                        <input 
                            type="time" 
                            name="propTime" 
                            id="propTime"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingProposal?.createdAt ? new Date(editingProposal.createdAt).toTimeString().split(' ')[0].slice(0, 5) : new Date().toTimeString().split(' ')[0].slice(0, 5)}
                        />
                    </div>
                </div>

                {#if editingProposal}
                    <div class="space-y-2">
                        <label for="prop-status" class="text-sm font-medium">Estado</label>
                        <select 
                            name="status" 
                            id="prop-status"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingProposal.status}
                        >
                            <option value="pending">Pendiente</option>
                            <option value="approved">Aprobado</option>
                            <option value="rejected">Rechazado</option>
                        </select>
                    </div>
                {/if}

                <div class="flex justify-end gap-2 mt-6">
                    <button type="button" on:click={closeProposalModal} class="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        {editingProposal ? 'Guardar Cambios' : 'Crear Propuesta'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
<!-- Request Modal -->
{#if isRequestModalOpen}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button on:click={closeRequestModal} class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X class="w-4 h-4" />
            </button>
            
            <h2 class="text-lg font-bold mb-4">
                {editingRequest ? 'Editar Solicitud' : 'Nueva Solicitud'}
            </h2>
            
            <form 
                action={editingRequest ? '?/updateRequest' : '?/createRequest'} 
                method="POST" 
                enctype="multipart/form-data"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeRequestModal();
                            await invalidateAll();
                        } else {
                            await update();
                        }
                    };
                }}
                class="space-y-4"
            >
                {#if editingRequest}
                    <input type="hidden" name="id" value={editingRequest.id} />
                {/if}

                <div class="space-y-2">
                    <label for="title" class="text-sm font-medium">Título</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="title"
                        required
                        value={editingRequest?.title || ''}
                        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ej: Logo en SVG"
                    />
                </div>

                <div class="space-y-2">
                    <label for="description" class="text-sm font-medium">Descripción / Nota</label>
                    <textarea 
                        name="description" 
                        id="description"
                        rows="4"
                        class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Detalles adicionales, enlaces, etc."
                    >{editingRequest?.description || ''}</textarea>
                </div>

                <div class="space-y-2">
                    <label for="reqDate" class="text-sm font-medium">Fecha y Hora de Creación</label>
                    <div class="flex gap-2">
                        <input 
                            type="date" 
                            name="reqDate" 
                            id="reqDate"
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingRequest?.createdAt ? new Date(editingRequest.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        />
                        <input 
                            type="time" 
                            name="reqTime" 
                            id="reqTime"
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingRequest?.createdAt ? new Date(editingRequest.createdAt).toTimeString().split(' ')[0].slice(0, 5) : new Date().toTimeString().split(' ')[0].slice(0, 5)}
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="files" class="text-sm font-medium">Archivos</label>
                    <input 
                        type="file" 
                        name="files" 
                        id="files"
                        multiple
                        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    
                    {#if editingRequest}
                        <input type="hidden" name="existingFiles" value={JSON.stringify(filesToKeep)} />
                        {#if filesToKeep.length > 0}
                            <div class="text-xs text-muted-foreground mt-2">
                                <p class="font-medium mb-1">Archivos actuales:</p>
                                <ul class="space-y-1">
                                    {#each filesToKeep as file, i}
                                        <li class="flex items-center justify-between bg-muted/50 p-1 rounded hover:bg-muted transition-colors group">
                                            <button 
                                                type="button" 
                                                class="flex items-center gap-2 flex-1 min-w-0 text-left p-1"
                                                on:click={() => file.url && openPreview(file.name, file.url)}
                                                disabled={!file.url}
                                                title={file.url ? 'Ver archivo' : ''}
                                            >
                                                <span class="truncate text-sm {file.url ? 'text-primary hover:underline' : ''}">{file.name}</span>
                                                {#if file.url}
                                                    <Eye class="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                                {/if}
                                            </button>
                                            <button 
                                                type="button" 
                                                on:click={() => removeFileToKeep(i)}
                                                class="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                                title="Eliminar archivo"
                                            >
                                                <Trash2 class="w-3 h-3" />
                                            </button>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {:else}
                             <p class="text-xs text-muted-foreground mt-2 italic">Sin archivos adjuntos previos.</p>
                        {/if}
                    {/if}
                </div>

                {#if editingRequest}
                    <div class="space-y-2">
                        <label for="status" class="text-sm font-medium">Estado</label>
                        <select 
                            name="status" 
                            id="status"
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingRequest.status}
                        >
                            <option value="pending">Pendiente</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="completed">Completado</option>
                        </select>
                    </div>
                {/if}

                <div class="flex justify-end gap-2 pt-4">
                    <button 
                        type="button" 
                        on:click={closeRequestModal}
                        class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                    >
                        {editingRequest ? 'Guardar Cambios' : 'Crear Solicitud'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<DocumentPreviewModal
    isOpen={isPreviewModalOpen}
    title={previewFile.title}
    fileUrl={previewFile.url}
    onClose={closePreview}
/>
