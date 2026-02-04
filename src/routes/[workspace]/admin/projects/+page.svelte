<script lang="ts">
    import { enhance, applyAction } from '$app/forms';
    import { Briefcase, MoreVertical, Search, Filter, Calendar, User, Package, Plus, X, Pencil, Trash2, Loader2 } from 'lucide-svelte';
    import type { PageData } from './$types';
    import { slide } from 'svelte/transition';

    export let data: PageData;
    
    $: projects = data.projects;
    $: clients = data.clients || [];
    $: services = data.services || [];

    // UI State
    let isModalOpen = false;
    let isDeleteModalOpen = false;
    let editingProject: any = null;
    let deleteTarget: any = null;
    let showActionsFor: number | null = null;
    let isDeleting = false;

    function formatDate(date: Date | null) {
        if (!date) return '-';
        // Format YYYY-MM-DD for input value
        return new Date(date).toISOString().split('T')[0];
    }

    function formatDisplayDate(date: Date | null) {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function openModal(project: any = null) {
        editingProject = project;
        isModalOpen = true;
        showActionsFor = null;
    }

    function closeModal() {
        isModalOpen = false;
        isDeleteModalOpen = false;
        editingProject = null;
        deleteTarget = null;
    }

    function openDeleteModal(project: any) {
        deleteTarget = project;
        isDeleteModalOpen = true;
        showActionsFor = null;
    }

    function toggleActions(id: number) {
        showActionsFor = showActionsFor === id ? null : id;
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Proyectos</h2>
            <p class="text-muted-foreground">Gestiona los proyectos en curso y su estado.</p>
        </div>
        <button 
            on:click={() => openModal()}
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2 font-medium"
        >
            <Plus class="w-4 h-4" />
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
                    <tr class="border-t hover:bg-muted/50 transition-colors relative">
                        <td class="p-4">
                            <a href="./projects/{project.id}" class="font-medium hover:underline hover:text-primary transition-colors block text-base">
                                {project.name}
                            </a>
                            <div class="text-xs text-muted-foreground truncate max-w-[200px] mt-1">{project.description || 'Sin descripción'}</div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User class="w-4 h-4" />
                                </div>
                                <div class="flex flex-col">
                                    <span class="font-medium text-foreground">{project.clientName || 'Sin asignar'}</span>
                                    {#if project.clientCompany}
                                        <span class="text-xs text-muted-foreground font-medium">{project.clientCompany}</span>
                                    {/if}
                                </div>
                            </div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center gap-2">
                                <Package class="w-4 h-4 text-muted-foreground" />
                                <span>{project.serviceName || '-'}</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar class="w-3.5 h-3.5" />
                                <span>{formatDisplayDate(project.startDate)} - {formatDisplayDate(project.endDate)}</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="px-2.5 py-1 rounded-full text-xs font-medium border
                                {project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                 project.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                 'bg-yellow-50 text-yellow-700 border-yellow-200'}">
                                {project.status}
                            </span>
                        </td>
                        <td class="p-4 text-right relative">
                            <button 
                                on:click={() => toggleActions(project.id)}
                                class="p-2 hover:bg-accent rounded-full transition-colors"
                            >
                                <MoreVertical class="w-4 h-4" />
                            </button>
                            
                            {#if showActionsFor === project.id}
                                <div 
                                    transition:slide={{ duration: 150 }}
                                    class="absolute right-12 top-2 z-10 bg-card border rounded-lg shadow-lg py-1 min-w-[140px] flex flex-col"
                                >
                                    <button 
                                        on:click={() => openModal(project)}
                                        class="px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                                    >
                                        <Pencil class="w-3.5 h-3.5" />
                                        Editar
                                    </button>
                                    <button 
                                        on:click={() => openDeleteModal(project)}
                                        class="px-4 py-2 text-left text-sm hover:bg-red-50 text-red-500 flex items-center gap-2"
                                    >
                                        <Trash2 class="w-3.5 h-3.5" />
                                        Eliminar
                                    </button>
                                </div>
                                <!-- Backdrop to close menu -->
                                <div class="fixed inset-0 z-0" on:click={() => showActionsFor = null}></div>
                            {/if}
                        </td>
                    </tr>
                {/each}
                {#if projects.length === 0}
                    <tr>
                        <td colspan="6" class="p-12 text-center border-t">
                            <div class="flex flex-col items-center justify-center text-muted-foreground">
                                <Briefcase class="w-10 h-10 mb-3 opacity-20" />
                                <p class="text-lg font-medium text-foreground">No hay proyectos</p>
                                <p class="text-sm">Comienza creando el primer proyecto para un cliente.</p>
                                <button 
                                    on:click={() => openModal()}
                                    class="mt-4 text-primary font-medium hover:underline"
                                >
                                    Crear Proyecto
                                </button>
                            </div>
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

<!-- Project Modal -->
{#if isModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="w-full max-w-lg bg-card border rounded-xl shadow-lg flex flex-col max-h-[90vh]">
            <div class="p-6 border-b flex items-center justify-between sticky top-0 bg-card rounded-t-xl z-10">
                <h3 class="text-xl font-bold">{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                <button on:click={closeModal} class="p-1 hover:bg-muted rounded-md">
                    <X class="w-5 h-5" />
                </button>
            </div>
            
            <form 
                method="POST" 
                action={editingProject ? '?/updateProject' : '?/createProject'} 
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeModal();
                            await update();
                        } else if (result.type === 'redirect') {
                            await applyAction(result);
                        } else {
                            console.error('Project form error:', result);
                            alert('Error al guardar el proyecto. Verifique los campos obligatorios.');
                        }
                    };
                }}
                class="p-6 space-y-4 overflow-y-auto"
            >
                {#if editingProject}
                    <input type="hidden" name="id" value={editingProject.id} />
                {/if}
                
                <div class="space-y-2">
                    <label class="text-sm font-medium" for="name">Nombre del Proyecto <span class="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        name="name" 
                        required 
                        value={editingProject?.name || ''}
                        class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                        placeholder="Ej. Rediseño Web 2024"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="clientId">Cliente <span class="text-red-500">*</span></label>
                        <select 
                            name="clientId" 
                            required
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                            value={editingProject?.clientId || ''}
                        >
                            <option value="" disabled selected>Seleccionar cliente...</option>
                            {#each clients as client}
                                <option value={client.id}>
                                    {client.firstName || ''} {client.lastName || ''} ({client.company || 'Sin empresa'})
                                </option>
                            {/each}
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="serviceId">Servicio <span class="text-red-500">*</span></label>
                        <select 
                            name="serviceId" 
                            required
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                            value={editingProject?.serviceId || ''}
                        >
                            <option value="" disabled selected>Seleccionar servicio...</option>
                            {#each services as service}
                                <option value={service.id}>{service.name}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="status">Estado</label>
                        <select 
                            name="status" 
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                            value={editingProject?.status || 'Pending'}
                        >
                            <option value="Pending">Pendiente</option>
                            <option value="In Progress">En Progreso</option>
                            <option value="Completed">Completado</option>
                            <option value="On Hold">En Espera</option>
                            <option value="Cancelled">Cancelado</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="provider">Proveedor</label>
                        <select 
                            name="provider" 
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                            value={editingProject?.provider || 'Allianzy'}
                        >
                            <option value="Allianzy">Allianzy</option>
                            <option value="Beltrix">Beltrix</option>
                            <option value="Provider">Externo</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="startDate">Fecha Inicio</label>
                        <input 
                            type="date" 
                            name="startDate" 
                            value={formatDate(editingProject?.startDate)}
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="endDate">Fecha Fin</label>
                        <input 
                            type="date" 
                            name="endDate" 
                            value={formatDate(editingProject?.endDate)}
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium" for="description">Descripción</label>
                    <textarea 
                        name="description" 
                        rows="3"
                        class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                        placeholder="Detalles del proyecto..."
                    >{editingProject?.description || ''}</textarea>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" on:click={closeModal} class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90">
                        {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Delete Modal -->
{#if isDeleteModalOpen && deleteTarget}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div class="w-full max-w-md bg-card border rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 text-red-500 mb-4">
                <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <Trash2 class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold">Eliminar Proyecto</h3>
            </div>
            
            <p class="text-muted-foreground mb-6">
                ¿Estás seguro de que deseas eliminar el proyecto <span class="font-bold text-foreground">"{deleteTarget.name}"</span>?
                <br>
                <span class="text-sm mt-2 block">Esta acción no se puede deshacer.</span>
            </p>

            <form 
                method="POST" 
                action="?/deleteProject"
                use:enhance={() => {
                    isDeleting = true;
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeModal();
                            await update();
                        } else {
                            alert('Error al eliminar el proyecto.');
                        }
                        isDeleting = false;
                    };
                }}
            >
                <input type="hidden" name="id" value={deleteTarget.id} />
                <div class="flex justify-end gap-3">
                    <button type="button" on:click={closeModal} disabled={isDeleting} class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isDeleting} class="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {#if isDeleting}
                            <Loader2 class="w-4 h-4 animate-spin" />
                            Eliminando...
                        {:else}
                            Eliminar Proyecto
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
