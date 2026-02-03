<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold tracking-tight">Proyectos</h2>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#if data.projects.length === 0}
            <div class="col-span-full text-center p-12 border-2 border-dashed rounded-lg bg-muted/10">
                <p class="text-muted-foreground">No hay proyectos activos asignados a tu cuenta.</p>
            </div>
        {:else}
            {#each data.projects as project}
                <a href="/{data.workspace}/dashboard/projects/{project.id}" class="group block h-full">
                    <div class="h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-lg hover:border-primary/50 overflow-hidden flex flex-col">
                        <!-- Decorative Header / Image Placeholder -->
                        <div class="h-32 w-full bg-muted border-b relative overflow-hidden">
                            <img 
                                src="https://picsum.photos/seed/{project.id}/800/400" 
                                alt="Project Cover"
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                loading="lazy"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
                        </div>
                        
                        <div class="p-6 flex flex-col flex-grow space-y-4">
                            <div class="space-y-2">
                                <div class="flex items-start justify-between gap-2">
                                    <h3 class="font-bold text-xl leading-tight tracking-tight group-hover:text-primary transition-colors">{project.name}</h3>
                                </div>
                                <p class="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{project.description || 'Sin descripción disponible.'}</p>
                            </div>
                            
                            <div class="pt-4 mt-auto border-t flex items-center justify-between text-sm">
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</span>
                                    <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                                        {project.status === 'Active' || project.status === 'In Progress' ? 'border-transparent bg-green-500/15 text-green-700 dark:text-green-400' : 
                                         project.status === 'Pending' ? 'border-transparent bg-yellow-500/15 text-yellow-700 dark:text-yellow-400' : 
                                         'border-transparent bg-secondary text-secondary-foreground'}">
                                        {project.status}
                                    </span>
                                </div>

                                {#if project.endDate}
                                    <div class="flex flex-col gap-1 text-right">
                                        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Entrega</span>
                                        <span class="font-medium">
                                            {new Date(project.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                {/if}
                            </div>
                            
                            {#if project.serviceName}
                                <div class="text-xs text-muted-foreground font-medium pt-2 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                    {project.serviceName}
                                </div>
                            {/if}
                        </div>
                    </div>
                </a>
            {/each}
        {/if}
    </div>
</div>
