<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { 
        User, Mail, Phone, MapPin, Building, Briefcase, 
        CreditCard, Folder, MessageSquare, Save, Plus, Trash2, ArrowLeft, Link 
    } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    $: user = data.user;
    $: projects = data.projects;
    $: payments = data.payments;
    $: cases = data.cases;

    let activeTab = 'general';
    let identification: { type: string, value: string }[] = [];
    let addresses: { label: string, address: string, city: string, country: string }[] = [];
    let companyLinks: { title: string, url: string }[] = [];

    $: if (user) {
        identification = (user.identification as { type: string, value: string }[]) || [];
        addresses = (user.addresses as { label: string, address: string, city: string, country: string }[]) || [];
        companyLinks = (user.companyLinks as { title: string, url: string }[]) || [];
    }

    function addDocument() {
        identification = [...identification, { type: '', value: '' }];
    }

    function removeDocument(index: number) {
        identification = identification.filter((_, i) => i !== index);
    }

    function addAddress() {
        addresses = [...addresses, { label: '', address: '', city: '', country: '' }];
    }

    function removeAddress(index: number) {
        addresses = addresses.filter((_, i) => i !== index);
    }

    function addCompanyLink() {
        companyLinks = [...companyLinks, { title: '', url: '' }];
    }

    function removeCompanyLink(index: number) {
        companyLinks = companyLinks.filter((_, i) => i !== index);
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
        <a href="/{$page.params.workspace}/admin/users" class="p-2 hover:bg-accent rounded-full">
            <ArrowLeft class="w-5 h-5" />
        </a>
        <div class="flex-1">
            <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
                {#if user.avatarUrl}
                    <img src={user.avatarUrl} alt="{user.firstName} {user.lastName}" class="w-10 h-10 rounded-full object-cover" />
                {:else}
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User class="w-5 h-5 text-primary" />
                    </div>
                {/if}
                {user.firstName} {user.lastName}
            </h2>
            <p class="text-muted-foreground ml-14">{user.email}</p>
        </div>
        <div class="flex items-center gap-2">
            <span class="capitalize px-3 py-1 rounded-full text-sm font-medium 
                {user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                 user.role === 'staff' ? 'bg-blue-100 text-blue-700' : 
                 'bg-green-100 text-green-700'}">
                {user.role}
            </span>
        </div>
    </div>

    <!-- Tabs -->
    <div class="border-b">
        <nav class="flex gap-4">
            <button 
                class="px-4 py-2 border-b-2 font-medium text-sm transition-colors
                {activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                on:click={() => activeTab = 'general'}
            >
                Información General
            </button>
            <button 
                class="px-4 py-2 border-b-2 font-medium text-sm transition-colors
                {activeTab === 'projects' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                on:click={() => activeTab = 'projects'}
            >
                Proyectos ({projects.length})
            </button>
            <button 
                class="px-4 py-2 border-b-2 font-medium text-sm transition-colors
                {activeTab === 'payments' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                on:click={() => activeTab = 'payments'}
            >
                Pagos ({payments.length})
            </button>
            <button 
                class="px-4 py-2 border-b-2 font-medium text-sm transition-colors
                {activeTab === 'support' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                on:click={() => activeTab = 'support'}
            >
                Soporte ({cases.length})
            </button>
        </nav>
    </div>

    <!-- Content -->
    <div class="mt-6">
        {#if activeTab === 'general'}
            <form action="?/updateUser" method="POST" use:enhance class="space-y-8 max-w-4xl">
                <!-- Personal Info -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <User class="w-5 h-5" /> Información Personal
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Nombre</label>
                            <input type="text" name="firstName" value={user.firstName || ''} class="w-full p-2 border rounded-md" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Apellido</label>
                            <input type="text" name="lastName" value={user.lastName || ''} class="w-full p-2 border rounded-md" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Email</label>
                            <input type="email" name="email" value={user.email} class="w-full p-2 border rounded-md" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Teléfono</label>
                            <input type="text" name="phone" value={user.phone || ''} class="w-full p-2 border rounded-md" placeholder="+1234567890" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Rol</label>
                            <select name="role" value={user.role} class="w-full p-2 border rounded-md">
                                <option value="staff">Staff</option>
                                <option value="client">Cliente</option>
                                <option value="provider">Proveedor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div class="space-y-2 col-span-2">
                            <label class="text-sm font-medium">Avatar URL</label>
                            <input type="text" name="avatarUrl" value={user.avatarUrl || ''} class="w-full p-2 border rounded-md" placeholder="https://..." />
                        </div>
                    </div>
                </div>

                <!-- Addresses -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <MapPin class="w-5 h-5" /> Direcciones
                    </h3>
                    <input type="hidden" name="addresses" value={JSON.stringify(addresses)} />
                    
                    <div class="space-y-4">
                        {#each addresses as addr, i}
                            <div class="p-4 border rounded-md space-y-3 relative bg-card">
                                <button 
                                    type="button" 
                                    on:click={() => removeAddress(i)}
                                    class="absolute top-4 right-4 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 class="w-5 h-5" />
                                </button>
                                
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label class="text-xs text-muted-foreground">Etiqueta (e.g., Casa, Oficina)</label>
                                        <input 
                                            type="text" 
                                            bind:value={addr.label} 
                                            class="w-full p-2 border rounded-md" 
                                            placeholder="Etiqueta"
                                        />
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-xs text-muted-foreground">Dirección</label>
                                        <input 
                                            type="text" 
                                            bind:value={addr.address} 
                                            class="w-full p-2 border rounded-md" 
                                            placeholder="Calle 123"
                                        />
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-xs text-muted-foreground">Ciudad</label>
                                        <input 
                                            type="text" 
                                            bind:value={addr.city} 
                                            class="w-full p-2 border rounded-md" 
                                            placeholder="Ciudad"
                                        />
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-xs text-muted-foreground">País</label>
                                        <input 
                                            type="text" 
                                            bind:value={addr.country} 
                                            class="w-full p-2 border rounded-md" 
                                            placeholder="País"
                                        />
                                    </div>
                                </div>
                            </div>
                        {/each}
                        
                        <button 
                            type="button" 
                            on:click={addAddress}
                            class="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Plus class="w-4 h-4" /> Agregar Dirección
                        </button>
                    </div>
                </div>

                <!-- Company -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <Building class="w-5 h-5" /> Empresa
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Nombre de la Empresa</label>
                            <input type="text" name="company" value={user.company || ''} class="w-full p-2 border rounded-md" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Cargo / Rol</label>
                            <input type="text" name="jobTitle" value={user.jobTitle || ''} class="w-full p-2 border rounded-md" />
                        </div>
                    </div>

                    <!-- Company Links -->
                    <div class="space-y-2 pt-2">
                        <label class="text-sm font-medium flex items-center gap-2">
                            <Link class="w-4 h-4" /> Enlaces de Interés
                        </label>
                        <input type="hidden" name="companyLinks" value={JSON.stringify(companyLinks)} />
                        
                        <div class="space-y-3">
                            {#each companyLinks as link, i}
                                <div class="flex items-end gap-3">
                                    <div class="flex-1 space-y-1">
                                        <label class="text-xs text-muted-foreground">Título</label>
                                        <input 
                                            type="text" 
                                            bind:value={link.title} 
                                            class="w-full p-2 border rounded-md" 
                                            placeholder="Web, LinkedIn..."
                                        />
                                    </div>
                                    <div class="flex-[2] space-y-1">
                                        <label class="text-xs text-muted-foreground">URL</label>
                                        <input 
                                            type="text" 
                                            bind:value={link.url} 
                                            class="w-full p-2 border rounded-md" 
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        on:click={() => removeCompanyLink(i)}
                                        class="p-2 text-red-500 hover:bg-red-50 rounded-md mb-[1px]"
                                    >
                                        <Trash2 class="w-5 h-5" />
                                    </button>
                                </div>
                            {/each}
                            
                            <button 
                                type="button" 
                                on:click={addCompanyLink}
                                class="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                            >
                                <Plus class="w-4 h-4" /> Agregar Enlace
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Identification Documents -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <CreditCard class="w-5 h-5" /> Documentación
                    </h3>
                    <input type="hidden" name="identification" value={JSON.stringify(identification)} />
                    
                    <div class="space-y-3">
                        {#each identification as doc, i}
                            <div class="flex items-end gap-3">
                                <div class="flex-1 space-y-1">
                                    <label class="text-xs text-muted-foreground">Tipo (e.g., DNI, Pasaporte)</label>
                                    <input 
                                        type="text" 
                                        bind:value={doc.type} 
                                        class="w-full p-2 border rounded-md" 
                                        placeholder="Tipo de documento"
                                    />
                                </div>
                                <div class="flex-[2] space-y-1">
                                    <label class="text-xs text-muted-foreground">Número / Valor</label>
                                    <input 
                                        type="text" 
                                        bind:value={doc.value} 
                                        class="w-full p-2 border rounded-md" 
                                        placeholder="Número de documento"
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    on:click={() => removeDocument(i)}
                                    class="p-2 text-red-500 hover:bg-red-50 rounded-md mb-[1px]"
                                >
                                    <Trash2 class="w-5 h-5" />
                                </button>
                            </div>
                        {/each}
                        
                        <button 
                            type="button" 
                            on:click={addDocument}
                            class="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                        >
                            <Plus class="w-4 h-4" /> Agregar Documento
                        </button>
                    </div>
                </div>

                <!-- Notes -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <MessageSquare class="w-5 h-5" /> Notas Adicionales
                    </h3>
                    <textarea 
                        name="notes" 
                        value={user.notes || ''} 
                        rows="4" 
                        class="w-full p-2 border rounded-md"
                        placeholder="Notas internas sobre el cliente..."
                    ></textarea>
                </div>

                <div class="pt-4">
                    <button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 flex items-center gap-2">
                        <Save class="w-4 h-4" />
                        Guardar Cambios
                    </button>
                </div>
            </form>

        {:else if activeTab === 'projects'}
            <div class="rounded-md border bg-card">
                <table class="w-full text-sm text-left">
                    <thead class="text-muted-foreground bg-muted/50 font-medium">
                        <tr>
                            <th class="p-4">Proyecto</th>
                            <th class="p-4">Servicio</th>
                            <th class="p-4">Proveedor</th>
                            <th class="p-4">Inicio</th>
                            <th class="p-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if projects.length === 0}
                            <tr>
                                <td colspan="5" class="p-8 text-center text-muted-foreground">
                                    No hay proyectos asociados.
                                </td>
                            </tr>
                        {:else}
                            {#each projects as project}
                                <tr class="border-t hover:bg-muted/50 transition-colors">
                                    <td class="p-4 font-medium">
                                        <a href="/{$page.params.workspace}/admin/projects/{project.id}" class="hover:underline text-primary">
                                            {project.name}
                                        </a>
                                    </td>
                                    <td class="p-4">{project.serviceName}</td>
                                    <td class="p-4">{project.provider}</td>
                                    <td class="p-4">{project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}</td>
                                    <td class="p-4">
                                        <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {project.status}
                                        </span>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>

        {:else if activeTab === 'payments'}
            <div class="rounded-md border bg-card">
                <table class="w-full text-sm text-left">
                    <thead class="text-muted-foreground bg-muted/50 font-medium">
                        <tr>
                            <th class="p-4">Concepto</th>
                            <th class="p-4">Proyecto</th>
                            <th class="p-4">Monto</th>
                            <th class="p-4">Vencimiento</th>
                            <th class="p-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if payments.length === 0}
                            <tr>
                                <td colspan="5" class="p-8 text-center text-muted-foreground">
                                    No hay pagos registrados.
                                </td>
                            </tr>
                        {:else}
                            {#each payments as payment}
                                <tr class="border-t hover:bg-muted/50 transition-colors">
                                    <td class="p-4 font-medium">{payment.title}</td>
                                    <td class="p-4">{payment.projectName}</td>
                                    <td class="p-4 font-mono">{payment.amount}</td>
                                    <td class="p-4">{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : '-'}</td>
                                    <td class="p-4">
                                        <span class="capitalize px-2 py-1 rounded-full text-xs font-medium 
                                            {payment.status === 'paid' ? 'bg-green-100 text-green-700' : 
                                             payment.status === 'overdue' ? 'bg-red-100 text-red-700' : 
                                             'bg-yellow-100 text-yellow-700'}">
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>

        {:else if activeTab === 'support'}
            <div class="rounded-md border bg-card">
                <table class="w-full text-sm text-left">
                    <thead class="text-muted-foreground bg-muted/50 font-medium">
                        <tr>
                            <th class="p-4">Caso</th>
                            <th class="p-4">Proyecto</th>
                            <th class="p-4">Prioridad</th>
                            <th class="p-4">Fecha</th>
                            <th class="p-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if cases.length === 0}
                            <tr>
                                <td colspan="5" class="p-8 text-center text-muted-foreground">
                                    No hay casos de soporte.
                                </td>
                            </tr>
                        {:else}
                            {#each cases as kase}
                                <tr class="border-t hover:bg-muted/50 transition-colors">
                                    <td class="p-4 font-medium">{kase.title}</td>
                                    <td class="p-4">{kase.projectName}</td>
                                    <td class="p-4">
                                        <span class="capitalize px-2 py-1 rounded-full text-xs font-medium 
                                            {kase.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                             kase.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                             'bg-blue-100 text-blue-700'}">
                                            {kase.priority}
                                        </span>
                                    </td>
                                    <td class="p-4">{new Date(kase.createdAt).toLocaleDateString()}</td>
                                    <td class="p-4">
                                        <span class="capitalize px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {kase.status}
                                        </span>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>