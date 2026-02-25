<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { 
        User, Mail, Phone, MapPin, Briefcase, 
        CreditCard, Folder, MessageSquare, Save, Plus, Trash2, ArrowLeft, Link 
    } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    $: user = data.user;
    $: projects = data.projects;
    $: payments = data.payments;
    $: cases = data.cases;
    $: userCompaniesList = data.userCompaniesList ?? [];

    let activeTab = 'general';
    let formPersonal = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'client',
        avatarUrl: ''
    };
    let formNotes = '';
    let lastSyncedUserId = 0;
    let identification: { type: string, value: string }[] = [];
    let addresses: { label: string, address: string, city: string, country: string }[] = [];
    let companyLinks: { title: string, url: string }[] = [];

    $: userIdNum = user ? Number(user.id) : 0;
    $: if (user && userIdNum && userIdNum !== lastSyncedUserId) {
        lastSyncedUserId = userIdNum;
        formPersonal = {
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
            role: user.role ?? 'client',
            avatarUrl: user.avatarUrl ?? ''
        };
        formNotes = user.notes ?? '';
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
                {activeTab === 'companies' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                on:click={() => activeTab = 'companies'}
            >
                Empresas ({userCompaniesList.length})
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
            <form
                action="?/updateUser"
                method="POST"
                use:enhance={({ result }) => {
                    if (result.type === 'success' && result.data?.user) {
                        const u = result.data.user as { id?: number; firstName?: string | null; lastName?: string | null; email?: string | null; phone?: string | null; role?: string | null; avatarUrl?: string | null; notes?: string | null; addresses?: unknown; companyLinks?: unknown; identification?: unknown };
                        if (u.id) lastSyncedUserId = Number(u.id);
                        formPersonal = {
                            firstName: u.firstName ?? '',
                            lastName: u.lastName ?? '',
                            email: u.email ?? '',
                            phone: u.phone ?? '',
                            role: u.role ?? 'client',
                            avatarUrl: u.avatarUrl ?? ''
                        };
                        formNotes = u.notes ?? '';
                        identification = (u.identification as { type: string; value: string }[]) || [];
                        addresses = (u.addresses as { label: string; address: string; city: string; country: string }[]) || [];
                        companyLinks = (u.companyLinks as { title: string; url: string }[]) || [];
                    }
                }}
                class="space-y-8 max-w-4xl"
            >
                <!-- Personal Info -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <User class="w-5 h-5" /> Información Personal
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Nombre</label>
                            <input type="text" name="firstName" bind:value={formPersonal.firstName} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Apellido</label>
                            <input type="text" name="lastName" bind:value={formPersonal.lastName} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Email</label>
                            <input type="email" name="email" bind:value={formPersonal.email} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Teléfono</label>
                            <input type="text" name="phone" bind:value={formPersonal.phone} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" placeholder="+1234567890" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Rol</label>
                            <select name="role" bind:value={formPersonal.role} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground">
                                <option value="staff">Staff</option>
                                <option value="client">Cliente</option>
                                <option value="provider">Proveedor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div class="space-y-2 col-span-2">
                            <label class="text-sm font-medium">Avatar URL</label>
                            <input type="text" name="avatarUrl" bind:value={formPersonal.avatarUrl} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" placeholder="https://..." />
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
                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" 
                                            placeholder="Etiqueta"
                                        />
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-xs text-muted-foreground">Dirección</label>
                                        <input 
                                            type="text" 
                                            bind:value={addr.address} 
                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" 
                                            placeholder="Calle 123"
                                        />
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-xs text-muted-foreground">Ciudad</label>
                                        <input 
                                            type="text" 
                                            bind:value={addr.city} 
                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" 
                                            placeholder="Ciudad"
                                        />
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-xs text-muted-foreground">País</label>
                                        <input 
                                            type="text" 
                                            bind:value={addr.country} 
                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" 
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

                <!-- Enlaces de Interés (perfil usuario) -->
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
                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" 
                                            placeholder="Web, LinkedIn..."
                                        />
                                    </div>
                                    <div class="flex-[2] space-y-1">
                                        <label class="text-xs text-muted-foreground">URL</label>
                                        <input 
                                            type="text" 
                                            bind:value={link.url} 
                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" 
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        on:click={() => removeCompanyLink(i)}
                                        class="p-2 text-destructive hover:bg-destructive/10 rounded-md mb-[1px]"
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
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" 
                                        placeholder="Tipo de documento"
                                    />
                                </div>
                                <div class="flex-[2] space-y-1">
                                    <label class="text-xs text-muted-foreground">Número / Valor</label>
                                    <input 
                                        type="text" 
                                        bind:value={doc.value} 
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" 
                                        placeholder="Número de documento"
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    on:click={() => removeDocument(i)}
                                    class="p-2 text-destructive hover:bg-destructive/10 rounded-md mb-[1px]"
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
                        bind:value={formNotes}
                        rows="4" 
                        class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none"
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

        {:else if activeTab === 'companies'}
            <div class="space-y-4 max-w-4xl">
                <p class="text-sm text-muted-foreground">
                    Empresas en las que este usuario figura como dueño, administrador o miembro.
                </p>
                <div class="rounded-md border bg-card">
                    <table class="w-full text-sm text-left">
                        <thead class="text-muted-foreground bg-muted/50 font-medium">
                            <tr>
                                <th class="p-4">Empresa</th>
                                <th class="p-4">Rol en la empresa</th>
                                <th class="p-4">Estado</th>
                                <th class="p-4">Principal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if userCompaniesList.length === 0}
                                <tr>
                                    <td colspan="4" class="p-8 text-center text-muted-foreground">
                                        No está asociado a ninguna empresa.
                                    </td>
                                </tr>
                            {:else}
                                {#each userCompaniesList as uc}
                                    <tr class="border-t hover:bg-muted/50 transition-colors">
                                        <td class="p-4 font-medium">
                                            <a href="/{$page.params.workspace}/admin/companies?detail={uc.companyId}" class="hover:underline text-primary">
                                                {uc.companyName}
                                            </a>
                                        </td>
                                        <td class="p-4">
                                            <span class="capitalize px-2 py-1 rounded-full text-xs font-medium
                                                {uc.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                                                 uc.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                 'bg-slate-100 text-slate-700'}">
                                                {uc.role === 'owner' ? 'Dueño' : uc.role === 'admin' ? 'Administrador' : 'Miembro'}
                                            </span>
                                        </td>
                                        <td class="p-4 capitalize">{uc.status === 'active' ? 'Activo' : uc.status}</td>
                                        <td class="p-4">{uc.isPrimary ? 'Sí' : '—'}</td>
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>

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