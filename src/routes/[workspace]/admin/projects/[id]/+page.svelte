<script lang="ts">
    import { ArrowLeft, CheckCircle2, Circle, Clock, MessageSquare, FileText, User, Calendar, Briefcase, AlertCircle, DollarSign, CreditCard, ExternalLink, Download, Pencil, Trash2, Plus, X, Eye } from 'lucide-svelte';
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import DocumentPreviewModal from '$lib/components/DocumentPreviewModal.svelte';

    export let data: PageData;

    $: ({ project, requirements, milestones, supportCases, proposals, payments } = data);
    $: allClients = data.allClients; // Destructure allClients
    $: allServices = data.allServices; // Destructure allServices

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

    function openCreateRequirementModal() {
        editingRequirement = null;
        isRequirementModalOpen = true;
    }

    function openEditRequirementModal(req: any) {
        editingRequirement = { ...req };
        isRequirementModalOpen = true;
    }

    function closeRequirementModal() {
        isRequirementModalOpen = false;
        editingRequirement = null;
    }

    // Proposal Modal Logic
    let isProposalModalOpen = false;
    let editingProposal: any = null;

    function openCreateProposalModal() {
        editingProposal = null;
        isProposalModalOpen = true;
    }

    function openEditProposalModal(prop: any) {
        editingProposal = { ...prop };
        isProposalModalOpen = true;
    }

    function closeProposalModal() {
        isProposalModalOpen = false;
        editingProposal = null;
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

    function openEditProjectModal() {
        selectedClientId = project.clientId;
        isEditProjectModalOpen = true;
    }

    function closeEditProjectModal() {
        isEditProjectModalOpen = false;
    }

    $: availableServices = data.allServices.filter(s => s.clientId === selectedClientId);
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
                <DocumentPreviewModal
        isOpen={isPreviewModalOpen}
        title={previewFile.title}
        fileUrl={previewFile.url}
        onClose={closePreview}
    />
</div>
            <p class="text-muted-foreground flex items-center gap-2 text-sm">
                <span class="inline-flex items-center gap-1">
                    <User class="w-3 h-3" /> {project.clientName}
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
                                <div class="group flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors">
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
                                            {#if req.documentUrl}
                                                <button on:click={() => openPreview(req.title, req.documentUrl)} class="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                                    <Eye class="w-3 h-3" /> Ver Documento
                                                </button>
                                            {/if}
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            on:click={() => openEditRequirementModal(req)}
                                            class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                            title="Editar"
                                        >
                                            <Pencil class="w-4 h-4" />
                                        </button>
                                        <form action="?/deleteRequirement" method="POST" use:enhance>
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
                            <button class="text-xs bg-secondary hover:bg-secondary/80 px-3 py-1 rounded-md transition-colors">
                                + Crear Ticket
                            </button>
                        </div>
                        {#if supportCases.length === 0}
                            <p class="text-muted-foreground text-sm">No hay tickets de soporte.</p>
                        {:else}
                            {#each supportCases as ticket}
                                <div class="p-4 border rounded-lg bg-background/50 hover:bg-accent/10 transition-colors">
                                    <div class="flex justify-between items-start">
                                        <h4 class="font-medium text-sm flex items-center gap-2">
                                            {ticket.title}
                                            {#if ticket.priority === 'high'}
                                                <AlertCircle class="w-3 h-3 text-red-500" />
                                            {/if}
                                        </h4>
                                        <span class="text-xs text-muted-foreground">{formatDate(ticket.createdAt)}</span>
                                    </div>
                                    <p class="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
                                    <div class="mt-3 flex gap-2">
                                        <span class="px-2 py-0.5 rounded text-[10px] border capitalize">
                                            {ticket.status}
                                        </span>
                                        <span class="px-2 py-0.5 rounded text-[10px] border capitalize">
                                            {ticket.priority} Priority
                                        </span>
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
                                <div class="group flex items-start justify-between p-4 border rounded-lg bg-background/50 hover:bg-accent/5 transition-colors">
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
                                            {#if prop.documentUrl}
                                                <button on:click={() => openPreview(prop.title, prop.documentUrl)} class="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                                    <Eye class="w-3 h-3" /> Ver Documento
                                                </button>
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
                        }
                        await update();
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
                        id="edit-client"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        bind:value={selectedClientId}
                    >
                        {#each allClients as client}
                            <option value={client.id}>{client.name} ({client.email})</option>
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
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeRequirementModal();
                        }
                        await update();
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
                    <label for="documentUrl" class="text-sm font-medium">Enlace (Google Drive)</label>
                    <input 
                        type="url" 
                        name="documentUrl" 
                        id="documentUrl"
                        value={editingRequirement?.documentUrl || ''}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="https://docs.google.com/..."
                    />
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
                        }
                        await update();
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
                    <label for="prop-file" class="text-sm font-medium">Subir Documento (Opcional)</label>
                    <input 
                        type="file" 
                        name="file" 
                        id="prop-file"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <p class="text-xs text-muted-foreground">Si subes un archivo, se reemplazará el enlace existente.</p>
                </div>

                <div class="space-y-2">
                    <label for="prop-documentUrl" class="text-sm font-medium">Enlace (o URL externa)</label>
                    <input 
                        type="url" 
                        name="documentUrl" 
                        id="prop-documentUrl"
                        value={editingProposal?.documentUrl || ''}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="https://docs.google.com/..."
                    />
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