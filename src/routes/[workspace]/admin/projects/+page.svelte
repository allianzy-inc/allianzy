<script lang="ts">
    export let data;
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold tracking-tight">Proyectos</h2>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90">
            Nuevo Proyecto
        </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <!-- Placeholder Project Cards -->
        {#each [1, 2, 3] as i}
            <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div class="p-6 flex flex-col space-y-1.5">
                    <h3 class="font-semibold leading-none tracking-tight">Proyecto {i}</h3>
                    <p class="text-sm text-muted-foreground">Descripción del proyecto {i}</p>
                </div>
                <div class="p-6 pt-0">
                    <div class="flex items-center justify-between text-sm">
                        <span class="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">En Progreso</span>
                        <span class="text-muted-foreground">Fecha de entrega: 20/10/2025</span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>