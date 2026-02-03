<script lang="ts">
    import { Briefcase, MoreVertical, Search, Filter, Calendar, User, Package } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    
    $: projects = data.projects;

    function formatDate(date: Date | null) {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Proyectos</h2>
            <p class="text-muted-foreground">Gestiona los proyectos en curso y su estado.</p>
        </div>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2">
            <Briefcase class="w-4 h-4" />
            Nuevo Proyecto
        </button>
    </div>

    <div class="flex items-center gap-4">
        <div class="relative flex-1 max-w-sm">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
                type="text" 
                placeholder="Buscar proyectos..." 
                class="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
        </div>
        <button class="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent hover:text-accent-foreground">
            <Filter class="w-4 h-4" />
            Filtrar
        </button>
    </div>

    <div class="rounded-md border bg-card">
        <table class="w-full text-sm text-left">
            <thead class="text-muted-foreground bg-muted/50 font-medium">
                <tr>
                    <th class="p-4">Proyecto</th>
                    <th class="p-4">Cliente</th>
                    <th class="p-4">Servicio</th>
                    <th class="p-4">Fechas</th>
                    <th class="p-4">Estado</th>
                    <th class="p-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each projects as project}
                    <tr class="border-t hover:bg-muted/50 transition-colors">
                        <td class="p-4">
                            <a href="./projects/{project.id}" class="font-medium hover:underline hover:text-primary transition-colors block">
                                {project.name}
                            </a>
                            <div class="text-xs text-muted-foreground truncate max-w-[200px]">{project.description}</div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center gap-2">
                                <User class="w-3 h-3 text-muted-foreground" />
                                <div class="flex flex-col">
                                    <span class="font-medium">{project.clientName || 'Sin asignar'}</span>
                                    {#if project.clientCompany}
                                        <span class="text-xs text-muted-foreground font-semibold">{project.clientCompany}</span>
                                    {/if}
                                </div>
                            </div>
                            <div class="text-xs text-muted-foreground ml-5">{project.clientEmail}</div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center gap-2">
                                <Package class="w-3 h-3 text-muted-foreground" />
                                <span>{project.serviceName || '-'}</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar class="w-3 h-3" />
                                <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="px-2 py-1 rounded-full text-xs font-medium 
                                {project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                                 project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                 'bg-yellow-100 text-yellow-700'}">
                                {project.status}
                            </span>
                        </td>
                        <td class="p-4 text-right">
                            <button class="p-2 hover:bg-accent rounded-full">
                                <MoreVertical class="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                {/each}
                {#if projects.length === 0}
                    <tr>
                        <td colspan="6" class="p-8 text-center text-muted-foreground">
                            No hay proyectos registrados.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>