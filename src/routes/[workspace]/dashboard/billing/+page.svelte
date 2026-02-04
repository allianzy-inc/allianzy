<script lang="ts">
    import { CreditCard, Download, Calendar, ExternalLink } from 'lucide-svelte';
    import { currentLang, translations } from '$lib/i18n';
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    export let data: PageData;
    
    $: t = translations[$currentLang];
    $: payments = data.payments;

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
        <form action="?/manageStripe" method="POST" use:enhance>
            <button 
                type="submit"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
                <ExternalLink class="mr-2 h-4 w-4" />
                {t.dashboard.menu.manage_stripe}
            </button>
        </form>
    </div>

    <div class="rounded-md border bg-card">
        <div class="p-6">
            {#if payments.length === 0}
                <div class="text-center py-12">
                    <CreditCard class="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 class="text-lg font-medium">No hay pagos registrados</h3>
                    <p class="text-muted-foreground mt-1">Aún no tienes historial de pagos o facturas pendientes.</p>
                </div>
            {:else}
                <div class="relative w-full overflow-auto">
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
                                            <a href={payment.documentUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                                                <Download class="h-4 w-4" />
                                                <span class="sr-only">Descargar comprobante</span>
                                            </a>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
    </div>
</div>
