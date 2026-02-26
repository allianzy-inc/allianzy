<script lang="ts">
    import { Building2, Search, Filter, Plus, Pencil, User, X, MapPin, Link as LinkIcon, FileText, Upload, Trash2, Loader2, Users, CreditCard } from 'lucide-svelte';
    import AddressLocationFields from '$lib/components/AddressLocationFields.svelte';
    import { fade } from 'svelte/transition';
    import { portal } from '$lib/actions/portal';
    import PhoneInput from '$lib/components/PhoneInput.svelte';
    import { normalizedCountries } from 'svelte-tel-input';
    import { slide } from 'svelte/transition';

    $: countriesSorted = [...normalizedCountries].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    import { page } from '$app/stores';
    import { enhance, applyAction, deserialize } from '$app/forms';
    import { invalidateAll, goto } from '$app/navigation';
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

    $: companies = data.companies ?? [];
    $: usersList = data.usersList ?? [];
    $: ownerByCompanyId = data.ownerByCompanyId ?? {};
    $: detailRequested = data.detailRequested ?? false;
    $: selectedCompanyDetail = data.selectedCompanyDetail ?? null;
    $: detailCompanyUsers = data.detailCompanyUsers ?? [];
    $: detailCompanyProjects = data.detailCompanyProjects ?? [];

    let detailTab: 'organization' | 'users' = 'organization';

    let isDrawerOpen = false;
    let editingCompany: (typeof companies)[number] | null = null;
    let isSubmittingCompany = false;

    $: isEdit = editingCompany != null;

    let formName = '';
    let formDescription = '';
    let formEmail = '';
    let formPhone = '';
    let formWebsite = '';
    let formRegion = '';

    let adminSearch = '';
    let selectedAdmin: { id: number; email: string; firstName: string | null; lastName: string | null } | null = null;
    let showAdminDropdown = false;

    $: filteredUsers = adminSearch.trim()
        ? usersList.filter(
              (u) =>
                  u.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
                  (u.firstName?.toLowerCase().includes(adminSearch.toLowerCase())) ||
                  (u.lastName?.toLowerCase().includes(adminSearch.toLowerCase())) ||
                  `${(u.firstName ?? '')} ${u.lastName ?? ''}`.toLowerCase().trim().includes(adminSearch.toLowerCase())
          )
        : usersList;

    function openDrawer(company?: (typeof companies)[number]) {
        editingCompany = company ?? null;
        formName = company?.name ?? '';
        formDescription = company?.description ?? '';
        formEmail = company?.email ?? '';
        formPhone = company?.phone ?? '';
        formWebsite = company?.website ?? '';
        formRegion = company?.region ?? '';
        const currentOwner = company ? ownerByCompanyId[company.id] : null;
        selectedAdmin = currentOwner ? { id: currentOwner.id, email: currentOwner.email, firstName: currentOwner.firstName, lastName: currentOwner.lastName } : null;
        adminSearch = '';
        showAdminDropdown = false;
        isDrawerOpen = true;
    }

    function closeDrawer() {
        isDrawerOpen = false;
        editingCompany = null;
        selectedAdmin = null;
    }

    function selectAdmin(user: { id: number; email: string; firstName: string | null; lastName: string | null }) {
        selectedAdmin = user;
        adminSearch = '';
        showAdminDropdown = false;
    }

    function clearAdmin() {
        selectedAdmin = null;
    }

    // Volver al listado: /admin/companies sin query (solo empresas)
    function closeDetailPanel() {
        goto(`/${$page.params.workspace}/admin/companies`, { replaceState: true });
    }
    // URL del listado de empresas (sin ?detail=)
    $: companiesListUrl = `/${$page.params.workspace}/admin/companies`;

    $: detailAddresses = selectedCompanyDetail ? ((selectedCompanyDetail.addresses as any[]) || []) : [];
    $: detailLinks = selectedCompanyDetail ? ((selectedCompanyDetail.links as any[]) || []) : [];
    $: detailDocuments = selectedCompanyDetail ? ((selectedCompanyDetail.documents as any[]) || []) : [];

    let detailSaving: Record<string, boolean> = {};
    let detailSaveMessage: string | null = null;
    let detailNewAddress = { label: '', address: '', city: '', country: '', state: '', postalCode: '' };
    let detailNewLink = { title: '', url: '' };
    let detailNewDoc = { type: '', value: '' };
    let detailIsAddingAddress = false;
    let editingDetailAddressIndex: number | null = null;
    let detailIsAddingLink = false;
    let detailIsAddingDoc = false;
    let detailLogoInput: HTMLInputElement;
    let detailLogoPreview: string | null = null;

    $: if (selectedCompanyDetail) {
        detailLogoPreview = selectedCompanyDetail.logo || null;
    }

    async function saveDetailField(name: string, value: unknown) {
        if (!selectedCompanyDetail) return;
        detailSaving[name] = true;
        detailSaving = detailSaving;
        const formData = new FormData();
        formData.append('company_id', String(selectedCompanyDetail.id));
        if (name === 'documents' || name === 'links' || name === 'addresses') {
            formData.append(name, JSON.stringify(value));
        } else if (value instanceof File) {
            formData.append(name, value);
        } else {
            formData.append(name, String(value));
        }
        try {
            const response = await fetch('?/updateCompanyDetail', { method: 'POST', body: formData });
            const result = deserialize(await response.text());
            if (result.type === 'success') {
                detailSaveMessage = 'Guardado';
                setTimeout(() => (detailSaveMessage = null), 2000);
                await invalidateAll();
            }
            applyAction(result);
        } catch (e) {
            console.error(e);
        } finally {
            detailSaving[name] = false;
            detailSaving = detailSaving;
        }
    }

    function detailHandleLogoChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            detailLogoPreview = URL.createObjectURL(file);
            saveDetailField('logo', file);
        }
    }

    function detailDeleteLogo() {
        detailLogoPreview = null;
        if (detailLogoInput) detailLogoInput.value = '';
        saveDetailField('deleteLogo', 'true');
    }

    async function detailAddAddress() {
        const next =
            editingDetailAddressIndex !== null
                ? detailAddresses.map((a, idx) => (idx === editingDetailAddressIndex ? { ...detailNewAddress } : a))
                : [...detailAddresses, { ...detailNewAddress }];
        await saveDetailField('addresses', next);
        detailNewAddress = { label: '', address: '', city: '', country: '', state: '', postalCode: '' };
        detailIsAddingAddress = false;
        editingDetailAddressIndex = null;
    }
    function startEditDetailAddress(i: number) {
        const a = detailAddresses[i];
        detailNewAddress = {
            label: a.label ?? '',
            address: a.address ?? '',
            city: a.city ?? '',
            country: a.country ?? '',
            state: a.state ?? '',
            postalCode: a.postalCode ?? ''
        };
        editingDetailAddressIndex = i;
        detailIsAddingAddress = true;
    }
    function detailRemoveAddress(i: number) {
        saveDetailField('addresses', detailAddresses.filter((_, idx) => idx !== i));
    }
    async function detailAddLink() {
        const next = [...detailLinks, { title: detailNewLink.title, url: detailNewLink.url }];
        await saveDetailField('links', next);
        detailNewLink = { title: '', url: '' };
        detailIsAddingLink = false;
    }
    function detailRemoveLink(i: number) {
        saveDetailField('links', detailLinks.filter((_, idx) => idx !== i));
    }
    async function detailAddDoc() {
        const next = [...detailDocuments, { type: detailNewDoc.type, value: detailNewDoc.value }];
        await saveDetailField('documents', next);
        detailNewDoc = { type: '', value: '' };
        detailIsAddingDoc = false;
    }
    function detailRemoveDoc(i: number) {
        saveDetailField('documents', detailDocuments.filter((_, idx) => idx !== i));
    }

    // Detail panel: Usuarios y Permisos (copy of client settings)
    type DetailCompanyUser = { id?: number; firstName?: string | null; lastName?: string | null; email?: string; role?: string | null; status?: string | null; permissions?: any };
    type DetailProjectPermission = { projectId: number; projectName: string; enabled: boolean; permissions: { requirements: boolean; requests: boolean; process: boolean; payments: boolean; support: boolean; proposals: boolean } };
    let isDetailUserDrawerOpen = false;
    let selectedDetailUser: DetailCompanyUser | null = null;
    let detailUserForm = { id: '', firstName: '', lastName: '', email: '', role: 'member' as string, status: 'active' as string, projectPermissions: [] as DetailProjectPermission[] };
    let isSavingDetailUser = false;
    let inviteEmailCheck: { exists: boolean; firstName?: string; lastName?: string } | null = null;
    let lastCheckedEmail = '';
    let isCheckingEmail = false;

    function getDetailUserFullName(u: DetailCompanyUser) {
        if (!u.firstName && !u.lastName) return '(Invitado)';
        return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    }
    function getDetailUserProjectNames(u: DetailCompanyUser) {
        const perms = u.permissions || {};
        return detailCompanyProjects.filter((p) => perms[p.id]).map((p) => p.name);
    }
    function openDetailUserDrawer(user: DetailCompanyUser | null = null) {
        selectedDetailUser = user;
        if (user) {
            const userPerms = user.permissions || {};
            detailUserForm = {
                id: String(user.id ?? ''),
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                email: user.email ?? '',
                role: (user.role as string) ?? 'member',
                status: user.status ?? 'active',
                projectPermissions: detailCompanyProjects.map((p) => {
                    const projectPerms = userPerms[p.id] || [];
                    return {
                        projectId: p.id,
                        projectName: p.name,
                        enabled: !!userPerms[p.id],
                        permissions: {
                            requirements: projectPerms.includes('requirements'),
                            requests: projectPerms.includes('requests'),
                            process: projectPerms.includes('process'),
                            payments: projectPerms.includes('payments'),
                            support: projectPerms.includes('support'),
                            proposals: projectPerms.includes('proposals')
                        }
                    };
                })
            };
            } else {
            inviteEmailCheck = null;
            lastCheckedEmail = '';
            detailUserForm = {
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                role: 'member',
                status: 'active',
                projectPermissions: detailCompanyProjects.map((p) => ({
                    projectId: p.id,
                    projectName: p.name,
                    enabled: false,
                    permissions: { requirements: false, requests: false, process: false, payments: false, support: false, proposals: false }
                }))
            };
        }
        isDetailUserDrawerOpen = true;
    }
    function closeDetailUserDrawer() {
        isDetailUserDrawerOpen = false;
        inviteEmailCheck = null;
        lastCheckedEmail = '';
    }

    async function checkInviteEmail() {
        const email = detailUserForm.email?.trim()?.toLowerCase() ?? '';
        if (!email) {
            inviteEmailCheck = null;
            return;
        }
        if (email === lastCheckedEmail) return;
        isCheckingEmail = true;
        inviteEmailCheck = null;
        try {
            const formData = new FormData();
            formData.append('email', email);
            const res = await fetch('?/checkUserByEmail', { method: 'POST', body: formData });
            const result = deserialize(await res.text());
            if (result.type === 'success' && result.data?.checkEmail) {
                lastCheckedEmail = email;
                inviteEmailCheck = {
                    exists: !!result.data.exists,
                    firstName: result.data.firstName ?? '',
                    lastName: result.data.lastName ?? ''
                };
            }
        } catch (e) {
            console.error(e);
        } finally {
            isCheckingEmail = false;
        }
    }

    $: if (detailUserForm.email?.trim()?.toLowerCase() !== lastCheckedEmail && !detailUserForm.id) {
        inviteEmailCheck = null;
    }
    $: isDetailFormValid = (() => {
        if (!detailUserForm.id) return false;
        const enabled = detailUserForm.projectPermissions.filter((p) => p.enabled);
        if (enabled.length === 0) return false;
        return enabled.every((p) => p.permissions.requirements || p.permissions.requests || p.permissions.process || p.permissions.payments || p.permissions.support || p.permissions.proposals);
    })();
    $: isDetailInviteFormValid = (() => {
        if (detailUserForm.id) return false;
        if (!detailUserForm.email?.trim()) return false;
        const enabled = detailUserForm.projectPermissions.filter((p) => p.enabled);
        if (enabled.length === 0) return detailCompanyProjects.length === 0;
        return enabled.every((p) => p.permissions.requirements || p.permissions.requests || p.permissions.process || p.permissions.payments || p.permissions.support || p.permissions.proposals);
    })();
    async function submitDetailInvite() {
        if (!selectedCompanyDetail) return;
        isSavingDetailUser = true;
        const formData = new FormData();
        formData.append('company_id', String(selectedCompanyDetail.id));
        formData.append('email', detailUserForm.email.trim());
        formData.append('firstName', detailUserForm.firstName);
        formData.append('lastName', detailUserForm.lastName);
        formData.append('role', detailUserForm.role);
        const permissions: Record<number, string[]> = {};
        detailUserForm.projectPermissions.forEach((p) => {
            if (p.enabled) {
                const perms = [];
                if (p.permissions.requirements) perms.push('requirements');
                if (p.permissions.requests) perms.push('requests');
                if (p.permissions.process) perms.push('process');
                if (p.permissions.payments) perms.push('payments');
                if (p.permissions.support) perms.push('support');
                if (p.permissions.proposals) perms.push('proposals');
                permissions[p.projectId] = perms;
            }
        });
        formData.append('permissions', JSON.stringify(permissions));
        try {
            const res = await fetch('?/inviteCompanyUser', { method: 'POST', body: formData });
            const result = deserialize(await res.text());
            applyAction(result);
            if (result.type === 'success') {
                await invalidateAll();
                closeDetailUserDrawer();
            }
        } catch (e) {
            console.error(e);
        } finally {
            isSavingDetailUser = false;
        }
    }
    async function submitDetailUser() {
        if (!selectedCompanyDetail) return;
        isSavingDetailUser = true;
        const formData = new FormData();
        formData.append('company_id', String(selectedCompanyDetail.id));
        formData.append('id', detailUserForm.id);
        formData.append('status', detailUserForm.status);
        const permissions: Record<number, string[]> = {};
        detailUserForm.projectPermissions.forEach((p) => {
            if (p.enabled) {
                const perms = [];
                if (p.permissions.requirements) perms.push('requirements');
                if (p.permissions.requests) perms.push('requests');
                if (p.permissions.process) perms.push('process');
                if (p.permissions.payments) perms.push('payments');
                if (p.permissions.support) perms.push('support');
                if (p.permissions.proposals) perms.push('proposals');
                permissions[p.projectId] = perms;
            }
        });
        formData.append('permissions', JSON.stringify(permissions));
        try {
            const res = await fetch('?/saveCompanyUser', { method: 'POST', body: formData });
            const result = deserialize(await res.text());
            applyAction(result);
            if (result.type === 'success') {
                await invalidateAll();
                closeDetailUserDrawer();
            }
        } catch (e) {
            console.error(e);
        } finally {
            isSavingDetailUser = false;
        }
    }
</script>

<div class="space-y-6">
    {#if !detailRequested}
    <!-- Listado de empresas: solo cuando la URL no tiene ?detail= -->
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Empresas</h2>
            <p class="text-muted-foreground">Listado de empresas registradas en la plataforma.</p>
        </div>
        <button
            type="button"
            on:click={() => openDrawer()}
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2"
        >
            <Plus class="w-4 h-4" />
            Agregar empresa
        </button>
    </div>

    <div class="flex items-center gap-4">
        <div class="relative flex-1 max-w-sm">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
                type="text"
                placeholder="Buscar empresas..."
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
                    <th class="p-4">Web</th>
                    <th class="p-4">Región</th>
                    <th class="p-4">Usuarios</th>
                    <th class="p-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each companies as company}
                    {@const detailUrl = `${companiesListUrl}?detail=${company.id}`}
                    {@const billingUrl = `/${$page.params.workspace}/admin/billing/${company.id}`}
                    <tr class="border-t hover:bg-muted/50 transition-colors cursor-pointer">
                        <td class="p-4 font-medium">
                            <a href={detailUrl} class="block text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded">
                                {company.name}
                            </a>
                        </td>
                        <td class="p-4 text-muted-foreground">
                            <a href={detailUrl} class="block">
                                {#if company.email}
                                    <span class="hover:underline text-primary">{company.email}</span>
                                {:else}
                                    —
                                {/if}
                            </a>
                        </td>
                        <td class="p-4 text-muted-foreground">
                            <a href={detailUrl} class="block">
                                {#if company.website}
                                    <span class="hover:underline text-primary truncate max-w-[180px] block">{company.website}</span>
                                {:else}
                                    —
                                {/if}
                            </a>
                        </td>
                        <td class="p-4 text-muted-foreground">
                            <a href={detailUrl} class="block">{company.region ?? '—'}</a>
                        </td>
                        <td class="p-4">
                            <a href={detailUrl} class="block">
                                <span class="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                    {company.usersCount}
                                </span>
                            </a>
                        </td>
                        <td class="p-4 text-right">
                            <a
                                href={billingUrl}
                                class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <CreditCard class="w-4 h-4" />
                                Ver facturación
                            </a>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    {#if companies.length === 0}
        <div class="rounded-md border border-dashed bg-muted/30 p-12 text-center text-muted-foreground">
            <Building2 class="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p class="font-medium">No hay empresas registradas</p>
            <p class="text-sm mt-1">Agregá una empresa con el botón superior.</p>
        </div>
    {/if}
    {/if}

    <!-- Vista tipo Configuraciones: se muestra cuando la URL tiene ?detail=id -->
    {#if detailRequested}
        <div in:slide out:slide class="space-y-6">
            <!-- Header: Configuraciones + subtítulo -->
            <div class="flex items-center justify-between">
                <div>
                    <button
                        type="button"
                        on:click={closeDetailPanel}
                        class="text-sm text-muted-foreground hover:text-foreground mb-1 block"
                    >
                        ← Volver al listado de empresas
                    </button>
                    <h2 class="text-2xl font-bold tracking-tight">Configuraciones</h2>
                    <p class="text-muted-foreground">Gestiona tu cuenta y preferencias.</p>
                </div>
                <div class="flex items-center gap-2">
                    {#if detailSaveMessage}
                        <span class="text-sm text-green-600">{detailSaveMessage}</span>
                    {/if}
                    {#if selectedCompanyDetail}
                        <span class="text-sm text-muted-foreground">{selectedCompanyDetail.name}</span>
                    {/if}
                </div>
            </div>

            <!-- Tabs: Negocio | Usuarios y Permisos -->
            <div class="flex border-b overflow-x-auto">
                <button
                    class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap {detailTab === 'organization' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                    on:click={() => (detailTab = 'organization')}
                >
                    <Building2 class="w-4 h-4" />
                    Negocio
                </button>
                <button
                    class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap {detailTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                    on:click={() => (detailTab = 'users')}
                >
                    <Users class="w-4 h-4" />
                    Usuarios y Permisos
                </button>
            </div>

            {#if !selectedCompanyDetail}
                <div class="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                    <Building2 class="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p class="font-medium">Empresa no encontrada</p>
                    <p class="text-sm mt-1">El ID solicitado no existe o no tienes acceso.</p>
                    <button
                        type="button"
                        on:click={closeDetailPanel}
                        class="mt-4 text-sm font-medium text-primary hover:underline"
                    >
                        ← Volver al listado de empresas
                    </button>
                </div>
            {:else if detailTab === 'organization'}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Detalles del negocio -->
                <div class="space-y-6">
                    <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-semibold flex items-center gap-2">
                                <Building2 class="w-5 h-5 text-primary" />
                                Detalles del Negocio
                            </h3>
                        </div>
                        <div class="p-6 space-y-8">
                            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                <div class="relative group">
                                    <div class="w-24 h-24 rounded-lg overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
                                        {#if detailLogoPreview || selectedCompanyDetail.logo}
                                            <img src={detailLogoPreview || selectedCompanyDetail.logo} alt="Logo" class="w-full h-full object-cover" />
                                        {:else}
                                            <Building2 class="w-10 h-10 text-muted-foreground" />
                                        {/if}
                                        {#if detailSaving['logo']}
                                            <div class="absolute inset-0 bg-background/50 flex items-center justify-center">
                                                <Loader2 class="w-6 h-6 animate-spin text-primary" />
                                            </div>
                                        {/if}
                                    </div>
                                    <button
                                        type="button"
                                        on:click={() => detailLogoInput?.click()}
                                        class="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90"
                                        disabled={!!detailSaving['logo']}
                                    >
                                        <Upload class="w-4 h-4" />
                                    </button>
                                    {#if (detailLogoPreview || selectedCompanyDetail.logo) && !detailSaving['logo']}
                                        <button type="button" on:click={detailDeleteLogo} class="absolute top-0 right-0 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90">
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    {/if}
                                    <input type="file" accept="image/*" class="hidden" bind:this={detailLogoInput} on:change={detailHandleLogoChange} />
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-medium">Logo de la Empresa</h4>
                                    <p class="text-sm text-muted-foreground">Sube el logo de tu empresa. Tamaño recomendado 400x400px.</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 gap-6">
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Nombre de la Empresa</label>
                                    <input
                                        type="text"
                                        value={selectedCompanyDetail.name ?? ''}
                                        on:change={(e) => saveDetailField('name', e.currentTarget.value)}
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            value={selectedCompanyDetail.email ?? ''}
                                            on:change={(e) => saveDetailField('email', e.currentTarget.value)}
                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium">Número de Teléfono</label>
                                        <PhoneInput
                                            id="detail-company-phone"
                                            name={null}
                                            value={selectedCompanyDetail.phone ?? ''}
                                            placeholder="Ej. 9 11 1234-5678"
                                            defaultCountry="AR"
                                            onblur={(v) => saveDetailField('phone', v)}
                                        />
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium">Página web</label>
                                        <input
                                            type="url"
                                            value={selectedCompanyDetail.website ?? ''}
                                            on:change={(e) => saveDetailField('website', e.currentTarget.value)}
                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                                            placeholder="https://"
                                        />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium">País / Región</label>
                                        <select
                                            value={selectedCompanyDetail.region ?? ''}
                                            on:change={(e) => saveDetailField('region', e.currentTarget.value)}
                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                                        >
                                            <option value="">Seleccionar país</option>
                                            {#if selectedCompanyDetail.region && !countriesSorted.find((c) => c.name === selectedCompanyDetail.region)}
                                                <option value={selectedCompanyDetail.region}>{selectedCompanyDetail.region}</option>
                                            {/if}
                                            {#each countriesSorted as country (country.id)}
                                                <option value={country.name}>{country.name}</option>
                                            {/each}
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Descripción</label>
                                    <textarea
                                        value={selectedCompanyDetail.description ?? ''}
                                        on:change={(e) => saveDetailField('description', e.currentTarget.value)}
                                        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Breve descripción"
                                    ></textarea>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Límite de miembros</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Sin límite"
                                        value={selectedCompanyDetail.memberLimit ?? ''}
                                        on:blur={(e) => saveDetailField('member_limit', e.currentTarget.value)}
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                    <p class="text-xs text-muted-foreground">Incluye dueño, administradores y miembros. Vacío = sin límite.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Derecha: Direcciones, Enlaces Importantes, Documentos (como en cliente) -->
                <div class="space-y-6">
                    <div class="rounded-xl border bg-card shadow-sm">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-semibold flex items-center gap-2">
                                <MapPin class="w-5 h-5 text-primary" />
                                Direcciones
                            </h3>
                        </div>
                        <div class="p-6 space-y-4">
                            {#each detailAddresses as addr, i}
                                <div class="flex justify-between items-start p-3 rounded-lg border bg-muted/30" transition:slide>
                                    <div>
                                        <div class="font-medium text-sm">{addr.label}</div>
                                        <div class="text-xs text-muted-foreground">{addr.address} {#if addr.city}{addr.city}{/if}</div>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <button type="button" class="text-muted-foreground hover:text-foreground p-1" on:click={() => startEditDetailAddress(i)} title="Editar">
                                            <Pencil class="w-4 h-4" />
                                        </button>
                                        <button type="button" class="text-muted-foreground hover:text-destructive p-1" on:click={() => detailRemoveAddress(i)}>
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            {/each}
                            {#if detailIsAddingAddress}
                                <div class="border rounded-lg p-4 space-y-4 bg-muted/30">
                                    <input type="text" placeholder="Etiqueta (ej. Sucursal Central)" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" bind:value={detailNewAddress.label} />
                                    <input type="text" placeholder="Dirección" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" bind:value={detailNewAddress.address} />
                                    <AddressLocationFields
                                        bind:country={detailNewAddress.country}
                                        bind:state={detailNewAddress.state}
                                        bind:city={detailNewAddress.city}
                                    />
                                    <div class="space-y-1.5">
                                        <label for="detail-addr-postal" class="text-sm font-medium">Código Postal</label>
                                        <input id="detail-addr-postal" type="text" placeholder="Código Postal" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" bind:value={detailNewAddress.postalCode} />
                                    </div>
                                    <div class="flex gap-2">
                                        <button type="button" class="px-3 py-1.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md" on:click={() => { detailIsAddingAddress = false; editingDetailAddressIndex = null; }} disabled={detailSaving['addresses']}>Cancelar</button>
                                        <button type="button" class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70 disabled:pointer-events-none inline-flex items-center gap-2" on:click={detailAddAddress} disabled={detailSaving['addresses']}>
                                            {#if detailSaving['addresses']}<Loader2 class="w-4 h-4 animate-spin" />Guardando...{:else}Guardar{/if}
                                        </button>
                                    </div>
                                </div>
                            {:else}
                                <button type="button" class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80" on:click={() => { editingDetailAddressIndex = null; detailNewAddress = { label: '', address: '', city: '', country: '', state: '', postalCode: '' }; detailIsAddingAddress = true; }}>
                                    <Plus class="w-4 h-4" /> Agregar Dirección
                                </button>
                            {/if}
                        </div>
                    </div>
                    <div class="rounded-xl border bg-card shadow-sm">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-semibold flex items-center gap-2">
                                <LinkIcon class="w-5 h-5 text-primary" />
                                Enlaces Importantes
                            </h3>
                        </div>
                        <div class="p-6 space-y-4">
                            {#each detailLinks as link, i}
                                <div class="flex justify-between items-center p-3 rounded-lg border bg-muted/30" transition:slide>
                                    <div>
                                        <div class="font-medium text-sm">{link.title}</div>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" class="text-xs text-primary truncate block">{link.url}</a>
                                    </div>
                                    <button type="button" class="text-muted-foreground hover:text-destructive p-1" on:click={() => detailRemoveLink(i)}>
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            {/each}
                            {#if detailIsAddingLink}
                                <div class="border rounded-lg p-3 space-y-2 bg-muted/30">
                                    <input type="text" placeholder="Título" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground" bind:value={detailNewLink.title} />
                                    <input type="url" placeholder="URL" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground" bind:value={detailNewLink.url} />
                                    <div class="flex gap-2">
                                        <button type="button" class="px-3 py-1.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md" on:click={() => (detailIsAddingLink = false)} disabled={detailSaving['links']}>Cancelar</button>
                                        <button type="button" class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70 disabled:pointer-events-none inline-flex items-center gap-2" on:click={detailAddLink} disabled={detailSaving['links']}>
                                            {#if detailSaving['links']}<Loader2 class="w-4 h-4 animate-spin" />Guardando...{:else}Guardar{/if}
                                        </button>
                                    </div>
                                </div>
                            {:else}
                                <button type="button" class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80" on:click={() => (detailIsAddingLink = true)}>
                                    <Plus class="w-4 h-4" /> Agregar Enlace
                                </button>
                            {/if}
                        </div>
                    </div>
                    <div class="rounded-xl border bg-card shadow-sm">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-semibold flex items-center gap-2">
                                <FileText class="w-5 h-5 text-primary" />
                                Documentos e IDs
                            </h3>
                        </div>
                        <div class="p-6 space-y-4">
                            {#each detailDocuments as doc, i}
                                <div class="flex justify-between items-center p-3 rounded-lg border bg-muted/30" transition:slide>
                                    <div class="flex gap-2 items-center">
                                        <span class="text-xs font-medium px-2 py-0.5 bg-muted rounded">{doc.type}</span>
                                        <span class="text-sm font-mono">{doc.value}</span>
                                    </div>
                                    <button type="button" class="text-muted-foreground hover:text-destructive p-1" on:click={() => detailRemoveDoc(i)}>
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            {/each}
                            {#if detailIsAddingDoc}
                                <div class="border rounded-lg p-3 space-y-2 bg-muted/30">
                                    <input type="text" placeholder="Tipo (ej. ABN)" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground" bind:value={detailNewDoc.type} />
                                    <input type="text" placeholder="Valor" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground" bind:value={detailNewDoc.value} />
                                    <div class="flex gap-2">
                                        <button type="button" class="px-3 py-1.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md" on:click={() => (detailIsAddingDoc = false)} disabled={detailSaving['documents']}>Cancelar</button>
                                        <button type="button" class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70 disabled:pointer-events-none inline-flex items-center gap-2" on:click={detailAddDoc} disabled={detailSaving['documents']}>
                                            {#if detailSaving['documents']}<Loader2 class="w-4 h-4 animate-spin" />Guardando...{:else}Guardar{/if}
                                        </button>
                                    </div>
                                </div>
                            {:else}
                                <button type="button" class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80" on:click={() => (detailIsAddingDoc = true)}>
                                    <Plus class="w-4 h-4" /> Agregar Documento
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
            {:else}
            <!-- Pestaña Usuarios y Permisos (vista copiada del cliente) -->
            <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto" in:fade out:fade>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-semibold">Usuarios y Permisos</h2>
                        <p class="text-sm text-muted-foreground">Gestiona usuarios y sus roles dentro de la organización.</p>
                    </div>
                    <button
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 h-9 px-4 py-2 gap-2"
                        on:click={() => openDetailUserDrawer(null)}
                    >
                        <Plus class="w-4 h-4" />
                        Agregar Usuario
                    </button>
                </div>
                <div class="rounded-md border bg-card">
                    <div class="relative w-full overflow-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="text-muted-foreground bg-muted/50 font-medium">
                                <tr>
                                    <th class="h-12 px-4 align-middle">Nombre</th>
                                    <th class="h-12 px-4 align-middle">Correo</th>
                                    <th class="h-12 px-4 align-middle">Rol</th>
                                    <th class="h-12 px-4 align-middle">Proyectos</th>
                                    <th class="h-12 px-4 align-middle">Estado</th>
                                    <th class="h-12 px-4 align-middle text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each detailCompanyUsers as user}
                                    <tr class="border-b transition-colors hover:bg-muted/50">
                                        <td class="p-4 align-middle font-medium">{getDetailUserFullName(user)}</td>
                                        <td class="p-4 align-middle">{user.email ?? '—'}</td>
                                        <td class="p-4 align-middle">
                                            <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">{user.role ?? '—'}</span>
                                        </td>
                                        <td class="p-4 align-middle">
                                            {#each getDetailUserProjectNames(user) as projectName}
                                                <span class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary mr-1 mb-1">{projectName}</span>
                                            {/each}
                                            {#if getDetailUserProjectNames(user).length === 0}
                                                <span class="text-muted-foreground text-xs">-</span>
                                            {/if}
                                        </td>
                                        <td class="p-4 align-middle">
                                            {#if user.status === 'active'}
                                                <span class="inline-flex items-center gap-1.5">
                                                    <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                                                    Activo
                                                </span>
                                            {:else if user.status === 'pending'}
                                                <span class="inline-flex items-center gap-1.5">
                                                    <span class="relative flex h-2 w-2 rounded-full h-2 w-2 bg-yellow-500"></span>
                                                    Pendiente
                                                </span>
                                            {:else}
                                                <span class="inline-flex items-center gap-1.5">
                                                    <span class="relative flex h-2 w-2 rounded-full bg-red-500"></span>
                                                    Inactivo
                                                </span>
                                            {/if}
                                        </td>
                                        <td class="p-4 align-middle text-right">
                                            <button type="button" class="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground" on:click={() => openDetailUserDrawer(user)}>
                                                <Pencil class="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
                {#if detailCompanyUsers.length === 0}
                    <div class="rounded-md border border-dashed bg-muted/30 p-8 text-center text-muted-foreground text-sm">
                        No hay usuarios en esta empresa. Usa "Agregar Usuario" para invitar (próximamente).
                    </div>
                {/if}
            </div>
            {/if}
        </div>
    {/if}
</div>

<!-- Drawer: Editar usuario de la empresa (vista copiada del cliente) -->
{#if isDetailUserDrawerOpen}
    <div use:portal class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-end" on:click={closeDetailUserDrawer} role="button" tabindex="0" on:keydown={(e) => e.key === 'Escape' && closeDetailUserDrawer()}>
        <div class="bg-card h-full w-full max-w-lg border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" on:click|stopPropagation role="presentation">
            <div class="p-6 border-b flex items-center justify-between bg-card z-10">
                <h2 class="text-lg font-semibold">{detailUserForm.id ? 'Editar usuario' : 'Agregar usuario'}</h2>
                <button on:click={closeDetailUserDrawer} class="text-muted-foreground hover:text-foreground"><X class="w-5 h-5" /></button>
            </div>
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                {#if form?.inviteUser && form?.message && !form?.success}
                    <div class="rounded-md bg-destructive/10 text-destructive px-4 py-3 text-sm">{form.message}</div>
                {/if}
                {#if detailUserForm.id}
                    <div class="bg-muted/30 p-4 rounded-lg space-y-1">
                        <h3 class="font-medium text-lg">{detailUserForm.firstName} {detailUserForm.lastName} {#if !detailUserForm.firstName && !detailUserForm.lastName}<span class="text-muted-foreground italic">(Invitado)</span>{/if}</h3>
                        <p class="text-sm text-muted-foreground">{detailUserForm.email}</p>
                    </div>
                    <div class="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <label class="text-sm font-medium">Usuario activo</label>
                            <p class="text-xs text-muted-foreground">Desactivar para impedir el acceso.</p>
                        </div>
                        <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary" checked={detailUserForm.status === 'active'} on:change={(e) => (detailUserForm.status = e.currentTarget.checked ? 'active' : 'inactive')} />
                    </div>
                {:else}
                    <p class="text-sm text-muted-foreground">Invita a un usuario a la empresa. Indica su correo, rol y permisos por proyecto.</p>
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <label for="invite-email" class="text-sm font-medium">Correo electrónico *</label>
                            <input
                                id="invite-email"
                                type="email"
                                bind:value={detailUserForm.email}
                                on:blur={checkInviteEmail}
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="usuario@ejemplo.com"
                            />
                            {#if isCheckingEmail}
                                <p class="text-xs text-muted-foreground flex items-center gap-1"><span class="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> Verificando...</p>
                            {/if}
                            {#if inviteEmailCheck?.exists}
                                <div class="rounded-md bg-muted/50 border border-border p-3 text-sm text-muted-foreground">
                                    <p class="font-medium text-foreground">Usuario ya registrado.</p>
                                    <p>Se agregará a la empresa con el rol seleccionado. No es necesario editar nombre ni apellido.</p>
                                    {#if (inviteEmailCheck.firstName || inviteEmailCheck.lastName)}
                                        <p class="mt-1 text-xs">Nombre en la plataforma: {[inviteEmailCheck.firstName, inviteEmailCheck.lastName].filter(Boolean).join(' ') || '—'}</p>
                                    {/if}
                                </div>
                            {:else if inviteEmailCheck && !inviteEmailCheck.exists && detailUserForm.email?.trim()}
                                <p class="text-xs text-muted-foreground">Usuario nuevo. Completa nombre y apellido (opcional) para la invitación.</p>
                            {/if}
                        </div>
                        {#if !inviteEmailCheck?.exists}
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label for="invite-firstName" class="text-sm font-medium">Nombre</label>
                                <input id="invite-firstName" type="text" bind:value={detailUserForm.firstName} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Opcional (para invitación)" />
                            </div>
                            <div class="space-y-2">
                                <label for="invite-lastName" class="text-sm font-medium">Apellido</label>
                                <input id="invite-lastName" type="text" bind:value={detailUserForm.lastName} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Opcional (para invitación)" />
                            </div>
                        </div>
                        {/if}
                        <div class="space-y-2">
                            <label for="invite-role" class="text-sm font-medium">Rol en la empresa</label>
                            <select id="invite-role" bind:value={detailUserForm.role} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="member">Miembro</option>
                                <option value="admin">Administrador</option>
                                <option value="owner">Propietario</option>
                            </select>
                        </div>
                    </div>
                {/if}
                <div class="space-y-4 pt-4 border-t">
                    <div>
                        <h3 class="font-medium">Permisos</h3>
                        <p class="text-sm text-muted-foreground">Configura acceso y permisos por proyecto.</p>
                    </div>
                    <div class="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                        {#each detailUserForm.projectPermissions as project}
                            <div class="rounded-lg border p-4 space-y-4">
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" id="detail-project-{project.projectId}" bind:checked={project.enabled} class="h-4 w-4 rounded border-gray-300 text-primary" />
                                    <label for="detail-project-{project.projectId}" class="text-sm font-semibold cursor-pointer">{project.projectName}</label>
                                </div>
                                {#if project.enabled}
                                    <div class="pl-6 grid grid-cols-1 gap-3 sm:grid-cols-2" transition:slide>
                                        <div class="flex items-center space-x-2"><input type="checkbox" id="detail-perm-{project.projectId}-proc" bind:checked={project.permissions.process} class="h-4 w-4 rounded border-gray-300 text-primary" /><label for="detail-perm-{project.projectId}-proc" class="text-sm cursor-pointer">Process</label></div>
                                        <div class="flex items-center space-x-2"><input type="checkbox" id="detail-perm-{project.projectId}-reqs" bind:checked={project.permissions.requests} class="h-4 w-4 rounded border-gray-300 text-primary" /><label for="detail-perm-{project.projectId}-reqs" class="text-sm cursor-pointer">Requests</label></div>
                                        <div class="flex items-center space-x-2"><input type="checkbox" id="detail-perm-{project.projectId}-req" bind:checked={project.permissions.requirements} class="h-4 w-4 rounded border-gray-300 text-primary" /><label for="detail-perm-{project.projectId}-req" class="text-sm cursor-pointer">Requirements</label></div>
                                        <div class="flex items-center space-x-2"><input type="checkbox" id="detail-perm-{project.projectId}-supp" bind:checked={project.permissions.support} class="h-4 w-4 rounded border-gray-300 text-primary" /><label for="detail-perm-{project.projectId}-supp" class="text-sm cursor-pointer">Support</label></div>
                                        <div class="flex items-center space-x-2"><input type="checkbox" id="detail-perm-{project.projectId}-prop" bind:checked={project.permissions.proposals} class="h-4 w-4 rounded border-gray-300 text-primary" /><label for="detail-perm-{project.projectId}-prop" class="text-sm cursor-pointer">Proposals</label></div>
                                        <div class="flex items-center space-x-2"><input type="checkbox" id="detail-perm-{project.projectId}-pay" bind:checked={project.permissions.payments} class="h-4 w-4 rounded border-gray-300 text-primary" /><label for="detail-perm-{project.projectId}-pay" class="text-sm cursor-pointer">Payments</label></div>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                        {#if detailUserForm.projectPermissions.length === 0}
                            <p class="text-center py-4 text-muted-foreground text-sm">No hay proyectos para asignar.</p>
                        {/if}
                    </div>
                </div>
            </div>
            <div class="p-6 border-t bg-muted/10 flex justify-end gap-2">
                <button class="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent" type="button" on:click={closeDetailUserDrawer} disabled={isSavingDetailUser}>Cancelar</button>
                {#if detailUserForm.id}
                    <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2" on:click={submitDetailUser} disabled={!isDetailFormValid || isSavingDetailUser}>
                        {#if isSavingDetailUser}<Loader2 class="w-4 h-4 animate-spin" />{/if}
                        Guardar
                    </button>
                {:else}
                    <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2" on:click={submitDetailInvite} disabled={!isDetailInviteFormValid || isSavingDetailUser}>
                        {#if isSavingDetailUser}<Loader2 class="w-4 h-4 animate-spin" />{/if}
                        Invitar
                    </button>
                {/if}
            </div>
        </div>
    </div>
{/if}

<!-- Drawer derecha: Crear / Editar empresa -->
{#if isDrawerOpen}
    <div
        class="fixed inset-0 z-50 flex justify-end"
        role="presentation"
    >
        <div
            class="absolute inset-0 bg-background/80 backdrop-blur-sm"
            on:click={closeDrawer}
            on:keydown={(e) => e.key === 'Escape' && closeDrawer()}
            role="button"
            tabindex="-1"
        ></div>
        <div
            class="relative w-full max-w-lg bg-card h-full border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            on:click|stopPropagation
            role="dialog"
            aria-label={isEdit ? 'Editar empresa' : 'Agregar empresa'}
        >
            <div class="px-6 py-4 border-b flex items-center justify-between shrink-0">
                <h2 class="text-lg font-bold">
                    {isEdit ? 'Editar empresa' : 'Agregar empresa'}
                </h2>
                <button
                    type="button"
                    on:click={closeDrawer}
                    class="p-2 hover:bg-muted rounded-full"
                    aria-label="Cerrar"
                >
                    <Plus class="w-5 h-5 rotate-45" />
                </button>
            </div>

            <form
                method="post"
                action={isEdit ? '?/updateCompany' : '?/createCompany'}
                use:enhance={() => {
                    isSubmittingCompany = true;
                    return async ({ result, update }) => {
                        try {
                            if (result.type === 'success') {
                                closeDrawer();
                            }
                            await update();
                            if (result.type === 'success') {
                                await invalidateAll();
                            }
                        } finally {
                            isSubmittingCompany = false;
                        }
                    };
                }}
                class="flex flex-col flex-1 min-h-0"
            >
                {#if isEdit}
                    <input type="hidden" name="company_id" value={editingCompany?.id} />
                {/if}

                <div class="flex-1 overflow-y-auto p-6 space-y-4">
                    {#if form?.error}
                        <div class="rounded-md bg-destructive/10 text-destructive px-4 py-3 text-sm">
                            {form.error}
                        </div>
                    {/if}

                    <div class="space-y-2">
                        <label for="company-name" class="text-sm font-medium">Nombre *</label>
                        <input
                            id="company-name"
                            name="name"
                            type="text"
                            bind:value={formName}
                            required
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Ej. Allianzy Inc"
                        />
                    </div>

                    <div class="space-y-2">
                        <label for="company-description" class="text-sm font-medium">Descripción</label>
                        <textarea
                            id="company-description"
                            name="description"
                            bind:value={formDescription}
                            rows="2"
                            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                            placeholder="Breve descripción"
                        ></textarea>
                    </div>

                    <div class="space-y-2">
                        <label for="company-email" class="text-sm font-medium">Email</label>
                        <input
                            id="company-email"
                            name="email"
                            type="email"
                            bind:value={formEmail}
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="contacto@empresa.com"
                        />
                    </div>

                    <div class="space-y-2">
                        <label for="company-phone" class="text-sm font-medium">Teléfono</label>
                        <PhoneInput
                            id="company-phone"
                            name="phone"
                            value={formPhone}
                            placeholder="Ej. 9 11 1234-5678"
                            defaultCountry="AR"
                        />
                    </div>

                    <div class="space-y-2">
                        <label for="company-website" class="text-sm font-medium">Sitio web</label>
                        <input
                            id="company-website"
                            name="website"
                            type="url"
                            bind:value={formWebsite}
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="https://..."
                        />
                    </div>

                    <div class="space-y-2">
                        <label for="company-region" class="text-sm font-medium">País / Región</label>
                        <select
                            id="company-region"
                            name="region"
                            bind:value={formRegion}
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="">Seleccionar país</option>
                            {#if formRegion && !countriesSorted.find((c) => c.name === formRegion)}
                                <option value={formRegion}>{formRegion}</option>
                            {/if}
                            {#each countriesSorted as country (country.id)}
                                <option value={country.name}>{country.name}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium">Dueño de la empresa</label>
                        <p class="text-xs text-muted-foreground">{isEdit ? 'Dueño actual o elige otro usuario como dueño.' : 'Busca y selecciona el usuario que será dueño de la empresa.'}</p>
                            {#if selectedAdmin}
                                <div class="flex items-center gap-2 p-3 rounded-md border bg-muted/30">
                                    <User class="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span class="text-sm font-medium truncate">
                                        {((selectedAdmin.firstName || '') + ' ' + (selectedAdmin.lastName || '')).trim() || selectedAdmin.email}
                                    </span>
                                    <span class="text-xs text-muted-foreground truncate">({selectedAdmin.email})</span>
                                    <button
                                        type="button"
                                        on:click={clearAdmin}
                                        class="ml-auto p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
                                        title="Quitar"
                                    >
                                        <X class="w-4 h-4" />
                                    </button>
                                </div>
                                <input type="hidden" name="adminUserId" value={selectedAdmin.id} />
                            {:else}
                                <div class="relative">
                                    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <input
                                        type="text"
                                        bind:value={adminSearch}
                                        on:focus={() => (showAdminDropdown = true)}
                                        on:blur={() => setTimeout(() => (showAdminDropdown = false), 200)}
                                        class="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="Buscar por nombre o email..."
                                    />
                                    {#if showAdminDropdown}
                                        <div class="absolute z-10 w-full mt-1 rounded-md border bg-popover shadow-lg max-h-48 overflow-y-auto">
                                            {#if filteredUsers.length === 0}
                                                <p class="p-3 text-sm text-muted-foreground">No se encontraron usuarios.</p>
                                            {:else}
                                                {#each filteredUsers as user}
                                                    <button
                                                        type="button"
                                                        on:click={() => selectAdmin(user)}
                                                        class="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                                                    >
                                                        <User class="w-4 h-4 text-muted-foreground shrink-0" />
                                                        <span class="truncate">{((user.firstName || '') + ' ' + (user.lastName || '')).trim() || user.email}</span>
                                                        <span class="text-xs text-muted-foreground truncate ml-auto">{user.email}</span>
                                                    </button>
                                                {/each}
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                    </div>
                </div>

                <div class="p-6 border-t bg-muted/10 flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        on:click={closeDrawer}
                        class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                        disabled={isSubmittingCompany}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        disabled={isSubmittingCompany}
                    >
                        {#if isSubmittingCompany}<Loader2 class="w-4 h-4 animate-spin" />{/if}
                        {isEdit ? 'Guardar cambios' : 'Crear empresa'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
