<script lang="ts">
    import { onMount } from 'svelte';
    import { Users, MoreVertical, Search, Filter } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    
    $: users = data.users;
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Usuarios</h2>
            <p class="text-muted-foreground">Gestiona clientes, empleados y administradores.</p>
        </div>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2">
            <Users class="w-4 h-4" />
            Nuevo Usuario
        </button>
    </div>

    <div class="flex items-center gap-4">
        <div class="relative flex-1 max-w-sm">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
                type="text" 
                placeholder="Buscar usuarios..." 
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
                    <th class="p-4">Nombre</th>
                    <th class="p-4">Email</th>
                    <th class="p-4">Rol</th>
                    <th class="p-4">Estado</th>
                    <th class="p-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each users as user}
                    <tr class="border-t hover:bg-muted/50 transition-colors">
                        <td class="p-4 font-medium">{user.name}</td>
                        <td class="p-4">{user.email}</td>
                        <td class="p-4">
                            <span class="capitalize px-2 py-1 rounded-full text-xs font-medium 
                                {user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                 user.role === 'staff' ? 'bg-blue-100 text-blue-700' : 
                                 'bg-green-100 text-green-700'}">
                                {user.role}
                            </span>
                        </td>
                        <td class="p-4">
                            <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                {user.status}
                            </span>
                        </td>
                        <td class="p-4 text-right">
                            <button class="p-2 hover:bg-accent rounded-full">
                                <MoreVertical class="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>