<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold tracking-tight">Proyectos</h2>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90">
            Nuevo Proyecto
        </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#if data.projects.length === 0}
            <div class="col-span-full text-center p-12 border-2 border-dashed rounded-lg">
                <p class="text-muted-foreground">No hay proyectos activos en este workspace.</p>
            </div>
        {:else}
            {#each data.projects as project}
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <div class="p-6 flex flex-col space-y-1.5">
                        <h3 class="font-semibold leading-none tracking-tight">{project.name}</h3>
                        <p class="text-sm text-muted-foreground line-clamp-2">{project.description || 'Sin descripción'}</p>
                    </div>
                    <div class="p-6 pt-0 mt-4">
                        <div class="flex items-center justify-between text-sm mb-2">
                            <span class="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium">
                                {project.status}
                            </span>
                            {#if project.endDate}
                                <span class="text-muted-foreground text-xs">
                                    {new Date(project.endDate).toLocaleDateString()}
                                </span>
                            {/if}
                        </div>
                        {#if project.serviceName}
                             <div class="text-xs text-muted-foreground font-medium">
                                {project.serviceName}
                             </div>
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
