<script lang="ts">
    import { Package, Plus, MoreVertical, Search } from 'lucide-svelte';

    let services = [
        { id: 1, name: 'Desarrollo Web Premium', category: 'Engineering', price: '$5,000+', status: 'Active' },
        { id: 2, name: 'Consultoría DevOps', category: 'Consulting', price: '$200/hr', status: 'Active' },
        { id: 3, name: 'Branding & Identidad', category: 'Design', price: '$3,000+', status: 'Active' },
    ];
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Servicios</h2>
            <p class="text-muted-foreground">Catálogo de servicios disponibles.</p>
        </div>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2">
            <Plus class="w-4 h-4" />
            Nuevo Servicio
        </button>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each services as service}
            <div class="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div class="p-6 flex flex-col space-y-1.5">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                            {service.category}
                        </span>
                        <button class="text-muted-foreground hover:text-foreground">
                            <MoreVertical class="w-4 h-4" />
                        </button>
                    </div>
                    <h3 class="font-semibold text-lg leading-none tracking-tight mt-2">{service.name}</h3>
                    <p class="text-2xl font-bold mt-2">{service.price}</p>
                </div>
                <div class="p-6 pt-0 mt-2">
                    <div class="flex items-center justify-between text-sm">
                        <span class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-green-500"></span>
                            {service.status}
                        </span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>