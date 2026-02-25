<script lang="ts">
    import { CreditCard, Download, Calendar, ExternalLink, Eye, History, Repeat } from 'lucide-svelte';
    import { currentLang, translations } from '$lib/i18n';
    import { enhance } from '$app/forms';
    import DocumentPreviewModal from '$lib/components/DocumentPreviewModal.svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    type BillingTab = 'historial' | 'suscripciones';
    let activeTab: BillingTab = 'historial';

    $: t = translations[$currentLang];
    $: payments = data.payments ?? [];
    $: subscriptions = data.subscriptions ?? [];

    let isPreviewModalOpen = false;
    let previewFile = { title: '', url: null as string | null };

    function openPreview(title: string, url: string | null) {
        if (!url) return;
        previewFile = { title, url };
        isPreviewModalOpen = true;
    }

    function closePreview() {
        isPreviewModalOpen = false;
        previewFile = { title: '', url: null };
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    }

    function getStatusLabel(status: string) {
         const map: Record<string, string> = {
            'paid': 'Pagado',
            'pending': 'Pendiente',
            'overdue': 'Vencido'
         };
         return map[status] || status;
    }
</script>

<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h2 class="text-2xl font-bold tracking-tight">{t.dashboard.page.billing.title}</h2>
            <p class="text-muted-foreground">{t.dashboard.page.billing.subtitle}</p>
        </div>
    </div>

    <div class="border-b border-border">
        <nav class="flex gap-6" aria-label="Facturación">
            <button
                type="button"
                class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-2 {activeTab === 'historial' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}"
                on:click={() => (activeTab = 'historial')}
            >
                <History class="w-4 h-4" />
                Historial
            </button>
            <button
                type="button"
                class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-2 {activeTab === 'suscripciones' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}"
                on:click={() => (activeTab = 'suscripciones')}
            >
                <Repeat class="w-4 h-4" />
                Suscripciones vigentes
            </button>
        </nav>
    </div>

    {#if activeTab === 'historial'}
    <div class="rounded-md border bg-card">
        <div class="p-6">
            {#if payments.length === 0}
                <div class="text-center py-12">
                    <CreditCard class="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 class="text-lg font-medium">No hay pagos registrados</h3>
                    <p class="text-muted-foreground mt-1">Aún no tienes historial de pagos o facturas pendientes.</p>
                </div>
            {:else}
                <!-- Desktop Table View -->
                <div class="hidden md:block relative w-full overflow-auto">
                    <table class="w-full caption-bottom text-sm text-left">
                        <thead class="[&_tr]:border-b">
                            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Concepto</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Proyecto / Servicio</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Monto</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Vencimiento</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="[&_tr:last-child]:border-0">
                            {#each payments as payment}
                                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td class="p-4 align-middle font-medium">{payment.title}</td>
                                    <td class="p-4 align-middle">
                                        <div class="flex flex-col">
                                            <span>{payment.projectName}</span>
                                            {#if payment.serviceName}
                                                <span class="text-xs text-muted-foreground">{payment.serviceName}</span>
                                            {/if}
                                        </div>
                                    </td>
                                    <td class="p-4 align-middle font-mono">{payment.amount}</td>
                                    <td class="p-4 align-middle">
                                        {#if payment.dueDate}
                                            <div class="flex items-center gap-2">
                                                <Calendar class="h-3 w-3 text-muted-foreground" />
                                                {new Date(payment.dueDate).toLocaleDateString()}
                                            </div>
                                        {:else}
                                            -
                                        {/if}
                                    </td>
                                    <td class="p-4 align-middle">
                                        <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 {getStatusColor(payment.status || 'pending')}">
                                            {getStatusLabel(payment.status || 'pending')}
                                        </span>
                                    </td>
                                    <td class="p-4 align-middle text-right">
                                        {#if payment.documentUrl}
                                            <button 
                                                on:click={() => openPreview(payment.title, payment.documentUrl)}
                                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                                title="Ver comprobante"
                                            >
                                                <Eye class="h-4 w-4" />
                                                <span class="sr-only">Ver comprobante</span>
                                            </button>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <!-- Mobile Card View -->
                <div class="md:hidden space-y-4">
                    {#each payments as payment}
                        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
                            <div class="flex justify-between items-start gap-4">
                                <div class="space-y-1">
                                    <h4 class="font-semibold leading-none tracking-tight">{payment.title}</h4>
                                    <p class="text-sm text-muted-foreground">{payment.projectName}</p>
                                    {#if payment.serviceName}
                                        <p class="text-xs text-muted-foreground">{payment.serviceName}</p>
                                    {/if}
                                </div>
                                <div class="font-mono font-medium whitespace-nowrap">
                                    {payment.amount}
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between pt-2 border-t">
                                <div class="space-y-2">
                                    {#if payment.dueDate}
                                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar class="h-3 w-3" />
                                            {new Date(payment.dueDate).toLocaleDateString()}
                                        </div>
                                    {/if}
                                    <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors {getStatusColor(payment.status || 'pending')}">
                                        {getStatusLabel(payment.status || 'pending')}
                                    </span>
                                </div>

                                {#if payment.documentUrl}
                                    <button 
                                        on:click={() => openPreview(payment.title, payment.documentUrl)}
                                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9"
                                        title="Ver comprobante"
                                    >
                                        <Eye class="h-4 w-4" />
                                        <span class="sr-only">Ver comprobante</span>
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
    {:else}
    <div class="rounded-md border bg-card">
        <div class="p-6">
            {#if subscriptions.length === 0}
                <div class="text-center py-12">
                    <Repeat class="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 class="text-lg font-medium">No hay suscripciones vigentes</h3>
                    <p class="text-muted-foreground mt-1">No tienes servicios activos asociados a tus proyectos.</p>
                </div>
            {:else}
                <div class="hidden md:block relative w-full overflow-auto">
                    <table class="w-full caption-bottom text-sm text-left">
                        <thead class="[&_tr]:border-b">
                            <tr class="border-b transition-colors hover:bg-muted/50">
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Servicio</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Proyecto</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Precio</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Renovación</th>
                                <th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th>
                            </tr>
                        </thead>
                        <tbody class="[&_tr:last-child]:border-0">
                            {#each subscriptions as sub}
                                <tr class="border-b transition-colors hover:bg-muted/50">
                                    <td class="p-4 align-middle font-medium">{sub.serviceName}</td>
                                    <td class="p-4 align-middle">{sub.projectName}</td>
                                    <td class="p-4 align-middle font-mono">{sub.price ?? '—'}</td>
                                    <td class="p-4 align-middle">
                                        {#if sub.renewalDate}
                                            <div class="flex items-center gap-2">
                                                <Calendar class="h-3 w-3 text-muted-foreground" />
                                                {sub.renewalDate}
                                            </div>
                                        {:else}
                                            —
                                        {/if}
                                    </td>
                                    <td class="p-4 align-middle">
                                        <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                            Activo
                                        </span>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <div class="md:hidden space-y-4">
                    {#each subscriptions as sub}
                        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2">
                            <div class="font-semibold">{sub.serviceName}</div>
                            <p class="text-sm text-muted-foreground">{sub.projectName}</p>
                            <div class="flex justify-between items-center pt-2 border-t">
                                <span class="font-mono text-sm">{sub.price ?? '—'}</span>
                                <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">Activo</span>
                            </div>
                            {#if sub.renewalDate}
                                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar class="h-3 w-3" />
                                    Renovación: {sub.renewalDate}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
    {/if}

    <DocumentPreviewModal 
        isOpen={isPreviewModalOpen} 
        title={previewFile.title} 
        fileUrl={previewFile.url} 
        onClose={closePreview} 
    />
</div>
