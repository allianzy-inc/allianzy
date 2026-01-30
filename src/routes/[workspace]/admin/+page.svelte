<script lang="ts">
    import { Users, Briefcase, DollarSign, Activity } from 'lucide-svelte';
</script>

<div class="space-y-6">
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="tracking-tight text-sm font-medium">Total Usuarios</h3>
                <Users class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold">1,234</div>
                <p class="text-xs text-muted-foreground">+20.1% del mes pasado</p>
            </div>
        </div>
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="tracking-tight text-sm font-medium">Proyectos Activos</h3>
                <Briefcase class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold">23</div>
                <p class="text-xs text-muted-foreground">+2 nuevos esta semana</p>
            </div>
        </div>
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="tracking-tight text-sm font-medium">Ingresos</h3>
                <DollarSign class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold">$45,231.89</div>
                <p class="text-xs text-muted-foreground">+15% del mes pasado</p>
            </div>
        </div>
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="tracking-tight text-sm font-medium">Actividad</h3>
                <Activity class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold">+573</div>
                <p class="text-xs text-muted-foreground">+201 desde la última hora</p>
            </div>
        </div>
    </div>
</div>