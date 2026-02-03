<script lang="ts">
    import { enhance } from '$app/forms';
    import { Plus, MoreVertical, Pencil, Trash2, ChevronDown, ChevronRight, Check, X } from 'lucide-svelte';
    import { slide } from 'svelte/transition';

    export let data;
    
    // UI State
    let expandedServices: Record<number, boolean> = {};
    let isServiceModalOpen = false;
    let isSubserviceModalOpen = false;
    let isDeleteModalOpen = false;

    // Form State
    let editingService: any = null;
    let editingSubservice: any = null;
    let parentServiceId: number | null = null;
    let deleteTarget: { type: 'service' | 'subservice', id: number, name: string } | null = null;

    // Toggle service expansion
    function toggleService(id: number) {
        expandedServices[id] = !expandedServices[id];
    }

    // Open Service Modal (Create/Edit)
    function openServiceModal(service: any = null) {
        editingService = service;
        isServiceModalOpen = true;
    }

    // Open Subservice Modal (Create/Edit)
    function openSubserviceModal(serviceId: number | null, subservice: any = null) {
        parentServiceId = serviceId;
        editingSubservice = subservice;
        isSubserviceModalOpen = true;
    }

    // Open Delete Confirmation
    function openDeleteModal(type: 'service' | 'subservice', item: any) {
        deleteTarget = { type, id: item.id, name: item.name };
        isDeleteModalOpen = true;
    }

    // Close Modals
    function closeModals() {
        isServiceModalOpen = false;
        isSubserviceModalOpen = false;
        isDeleteModalOpen = false;
        editingService = null;
        editingSubservice = null;
        parentServiceId = null;
        deleteTarget = null;
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Servicios y Subservicios</h2>
            <p class="text-muted-foreground">Gestiona el catálogo de servicios ofrecidos.</p>
        </div>
        <button 
            on:click={() => openServiceModal()}
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2 font-medium"
        >
            <Plus class="w-4 h-4" />
            Nuevo Servicio
        </button>
    </div>

    {#if data.services.length === 0}
        <div class="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
            <p class="text-muted-foreground">No hay servicios configurados.</p>
            <button 
                on:click={() => openServiceModal()}
                class="mt-4 text-primary font-medium hover:underline"
            >
                Crear el primer servicio
            </button>
        </div>
    {:else}
        <div class="space-y-4">
            {#each data.services as service}
                <div class="border rounded-xl bg-card overflow-hidden">
                    <!-- Service Header -->
                    <div class="p-4 flex items-center justify-between bg-muted/30">
                        <div class="flex items-center gap-4 flex-1">
                            <button 
                                on:click={() => toggleService(service.id)}
                                class="p-1 hover:bg-muted rounded-md transition-colors"
                            >
                                {#if expandedServices[service.id]}
                                    <ChevronDown class="w-5 h-5 text-muted-foreground" />
                                {:else}
                                    <ChevronRight class="w-5 h-5 text-muted-foreground" />
                                {/if}
                            </button>
                            <div>
                                <h3 class="font-semibold text-lg">{service.name}</h3>
                                <div class="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span>{service.price || 'Precio no definido'}</span>
                                    <span class="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                                    <span class="flex items-center gap-1">
                                        <span class={`w-2 h-2 rounded-full ${service.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        {service.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button 
                                on:click={() => openSubserviceModal(service.id)}
                                class="text-sm px-3 py-1.5 bg-background border rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                            >
                                <Plus class="w-3.5 h-3.5" />
                                Subservicio
                            </button>
                            <div class="h-4 w-px bg-border mx-1"></div>
                            <button 
                                on:click={() => openServiceModal(service)}
                                class="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                                title="Editar"
                            >
                                <Pencil class="w-4 h-4" />
                            </button>
                            <button 
                                on:click={() => openDeleteModal('service', service)}
                                class="p-2 text-red-500 hover:bg-red-50 rounded-md dark:hover:bg-red-900/20"
                                title="Eliminar"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <!-- Subservices List -->
                    {#if expandedServices[service.id]}
                        <div transition:slide class="border-t bg-muted/10">
                            {#if service.subservices.length === 0}
                                <div class="p-4 pl-14 text-sm text-muted-foreground italic">
                                    No hay subservicios. Añade uno para detallar este servicio.
                                </div>
                            {:else}
                                <div class="divide-y">
                                    {#each service.subservices as sub}
                                        <div class="p-3 pl-14 flex items-center justify-between hover:bg-muted/20 transition-colors group">
                                            <div>
                                                <p class="font-medium text-sm">{sub.name}</p>
                                                {#if sub.description}
                                                    <p class="text-xs text-muted-foreground">{sub.description}</p>
                                                {/if}
                                            </div>
                                            <div class="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span class="text-xs text-muted-foreground">{sub.price || '-'}</span>
                                                <div class="flex items-center gap-1">
                                                    <button 
                                                        on:click={() => openSubserviceModal(service.id, sub)}
                                                        class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                                                    >
                                                        <Pencil class="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        on:click={() => openDeleteModal('subservice', sub)}
                                                        class="p-1.5 text-red-500 hover:bg-red-50 rounded-md dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 class="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Service Modal -->
{#if isServiceModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div class="w-full max-w-md bg-card border rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold mb-4">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
            <form 
                method="POST" 
                action={editingService ? '?/updateService' : '?/createService'} 
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeModals();
                            await update();
                        } else {
                            console.error('Service form error:', result);
                            alert('Error al guardar el servicio. Por favor intente nuevamente.');
                        }
                    };
                }}
                class="space-y-4"
            >
                {#if editingService}
                    <input type="hidden" name="id" value={editingService.id} />
                {/if}
                
                <div class="space-y-2">
                    <label class="text-sm font-medium" for="name">Nombre</label>
                    <input 
                        type="text" 
                        name="name" 
                        required 
                        value={editingService?.name || ''}
                        class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                        placeholder="Ej. Desarrollo Web"
                    />
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium" for="description">Descripción</label>
                    <textarea 
                        name="description" 
                        rows="3"
                        class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                        placeholder="Breve descripción..."
                    >{editingService?.description || ''}</textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="price">Precio (Texto)</label>
                        <input 
                            type="text" 
                            name="price" 
                            value={editingService?.price || ''}
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                            placeholder="Ej. $1000+"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="status">Estado</label>
                        <select 
                            name="status" 
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                            value={editingService?.status || 'Active'}
                        >
                            <option value="Active">Activo</option>
                            <option value="Inactive">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" on:click={closeModals} class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90">
                        {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Subservice Modal -->
{#if isSubserviceModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div class="w-full max-w-md bg-card border rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold mb-4">{editingSubservice ? 'Editar Subservicio' : 'Nuevo Subservicio'}</h3>
            <form 
                method="POST" 
                action={editingSubservice ? '?/updateSubservice' : '?/createSubservice'} 
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeModals();
                            await update();
                        } else {
                            console.error('Subservice form error:', result);
                            alert('Error al guardar el subservicio. Por favor intente nuevamente.');
                        }
                    };
                }}
                class="space-y-4"
            >
                {#if editingSubservice}
                    <input type="hidden" name="id" value={editingSubservice.id} />
                {:else}
                    <input type="hidden" name="serviceId" value={parentServiceId} />
                {/if}
                
                <div class="space-y-2">
                    <label class="text-sm font-medium" for="name">Nombre</label>
                    <input 
                        type="text" 
                        name="name" 
                        required 
                        value={editingSubservice?.name || ''}
                        class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                        placeholder="Ej. Frontend Development"
                    />
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium" for="description">Descripción</label>
                    <textarea 
                        name="description" 
                        rows="2"
                        class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                        placeholder="Detalles..."
                    >{editingSubservice?.description || ''}</textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="price">Precio (Opcional)</label>
                        <input 
                            type="text" 
                            name="price" 
                            value={editingSubservice?.price || ''}
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                            placeholder="Ej. $50/hr"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="status">Estado</label>
                        <select 
                            name="status" 
                            class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary"
                            value={editingSubservice?.status || 'Active'}
                        >
                            <option value="Active">Activo</option>
                            <option value="Inactive">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" on:click={closeModals} class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90">
                        {editingSubservice ? 'Guardar Cambios' : 'Crear Subservicio'}
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
                <h3 class="text-xl font-bold">Confirmar eliminación</h3>
            </div>
            
            <p class="text-muted-foreground mb-6">
                ¿Estás seguro de que deseas eliminar el {deleteTarget.type === 'service' ? 'servicio' : 'subservicio'} 
                <span class="font-bold text-foreground">"{deleteTarget.name}"</span>?
                {#if deleteTarget.type === 'service'}
                    <br><span class="text-red-500 text-sm mt-2 block">Advertencia: Esto eliminará también todos sus subservicios asociados.</span>
                {/if}
            </p>

            <form 
                method="POST" 
                action={deleteTarget.type === 'service' ? '?/deleteService' : '?/deleteSubservice'}
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            closeModals();
                            await update();
                        } else {
                            console.error('Delete form error:', result);
                            alert('Error al eliminar. Por favor intente nuevamente.');
                        }
                    };
                }}
            >
                <input type="hidden" name="id" value={deleteTarget.id} />
                <div class="flex justify-end gap-3">
                    <button type="button" on:click={closeModals} class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600">
                        Eliminar
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
