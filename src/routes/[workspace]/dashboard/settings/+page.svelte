<script lang="ts">
    import { enhance, applyAction, deserialize } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { fade, slide } from 'svelte/transition';
    import { Pencil, Plus, Upload, Building2, Users, FileText, ShieldCheck, Mail, Globe, MapPin, Calendar, Clock, Link as LinkIcon, Trash2, Loader2, Check, X } from 'lucide-svelte';
    import { currentLang, translations } from '$lib/i18n';
    import { portal } from '$lib/actions/portal';
    import type { PageData } from './$types';

    export let data: PageData;
    $: t = translations[$currentLang];
    
    interface Address {
        label?: string;
        address?: string;
        city?: string;
        country?: string;
        state?: string;
        postalCode?: string;
    }

    interface Company {
        id: number;
        name: string;
        description: string | null;
        logo: string | null;
        phone: string | null;
        email: string | null;
        website: string | null;
        region: string | null;
        timezone: string | null;
        addresses: Address[] | unknown;
        links: any[] | unknown;
        documents: any[] | unknown;
        createdAt: Date | string | null;
    }

    interface CompanyUser {
        id: number | undefined;
        firstName: string | null | undefined;
        lastName: string | null | undefined;
        email: string | undefined;
        role: string | null;
        status: string | null | undefined;
        avatarUrl: string | null | undefined;
        permissions: any;
    }

    let activeTab = 'organization'; // organization, users, compliance

    // Use reactive statements to update when data changes
    $: organization = (data.company as unknown as Company) || {};
    $: usersList = (data.companyUsers as CompanyUser[]) || [];
    $: companyProjects = (data.companyProjects as any[]) || [];
    $: currentUser = data.currentUser;
    $: currentUserRole = data.companyUsers?.find(u => u.id?.toString() === currentUser?.id?.toString())?.role;
    $: isMember = currentUserRole === 'member';
    
    // Dynamic Lists State
    let addresses: any[] = [];
    let companyLinks: any[] = [];
    let documents: any[] = [];
    
    // Sync local state with server data when it changes
    $: if (organization) {
        addresses = (organization.addresses as any[]) || [];
        // If legacy address exists and new addresses is empty, maybe we should show it? 
        // For now, let's just stick to the new field.
        
        companyLinks = (organization.links as any[]) || [];
        documents = (organization.documents as any[]) || [];
    }

    // Temporary state for new items
    let newAddress = { label: '', address: '', city: '', country: '', state: '', postalCode: '' };
    let newLink = { title: '', url: '' };
    let newDoc = { type: '', value: '' };
    
    let isAddingAddress = false;
    let isAddingLink = false;
    let isAddingDoc = false;

    // File input references
    let logoInput: HTMLInputElement;
    let logoPreview: string | null = null;

    // Loading states
    let saving: Record<string, boolean> = {};
    let saveMessage: string | null = null;
    let isSavingUser = false;
    let isDeletingUser = false;
    let isDeleteUserModalOpen = false;

    const getFullName = (u: CompanyUser) => {
        if (!u.firstName && !u.lastName) return `(${t.dashboard.page.settings.users.table?.guest || 'Guest'})`;
        return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    };

    const getUserProjectNames = (u: CompanyUser) => {
        if (!u.permissions) return [];
        const projectIds = Object.keys(u.permissions);
        if (projectIds.length === 0) return [];
        
        return projectIds.map(pid => {
            const project = companyProjects.find(p => p.id.toString() === pid);
            return project ? project.name : null;
        }).filter(name => name !== null);
    };

    async function saveField(name: string, value: any) {
        if (isMember) return;
        saving[name] = true;
        saving = saving; // trigger reactivity
        
        const formData = new FormData();
        
        if (name === 'documents' || name === 'links' || name === 'addresses') {
            formData.append(name, JSON.stringify(value));
        } else if (value instanceof File) {
             formData.append(name, value);
        } else {
            formData.append(name, value);
        }

        try {
            const response = await fetch('?/updateCompany', {
                method: 'POST',
                body: formData
            });
            
            const result = deserialize(await response.text());
            
            if (result.type === 'success') {
                saveMessage = t.dashboard.page.profile?.saved || 'Saved successfully';
                setTimeout(() => saveMessage = null, 2000);
                await invalidateAll();
            }
            applyAction(result);
        } catch (e) {
            console.error(e);
        } finally {
            saving[name] = false;
            saving = saving;
        }
    }

    function handleLogoChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            logoPreview = URL.createObjectURL(file);
            saveField('logo', file);
        }
    }

    let isDeleteLogoModalOpen = false;

    function deleteLogo() {
        isDeleteLogoModalOpen = true;
    }

    function confirmDeleteLogo() {
        if (isMember) return;
        logoPreview = null;
        if (logoInput) logoInput.value = ''; // Reset file input
        saveField('deleteLogo', 'true');
        isDeleteLogoModalOpen = false;
    }

    // User Drawer State
    let isUserDrawerOpen = false;
    let selectedUser: CompanyUser | null = null;
    
    interface ProjectPermission {
        projectId: number;
        projectName: string;
        enabled: boolean;
        permissions: {
            requirements: boolean;
            requests: boolean;
            process: boolean;
            payments: boolean;
            support: boolean;
            proposals: boolean;
        };
    }

    let userForm = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        status: 'active',
        projectPermissions: [] as ProjectPermission[]
    };

    function openUserDrawer(user: CompanyUser | null = null) {
        if (user) {
            selectedUser = user;
            const userPerms = user.permissions || {};
            
            userForm = {
                id: user.id?.toString() || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                status: user.status || 'active',
                projectPermissions: companyProjects.map((p: any) => {
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
            selectedUser = null;
            userForm = {
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                status: 'active',
                projectPermissions: companyProjects.map((p: any) => ({
                    projectId: p.id,
                    projectName: p.name,
                    enabled: false,
                    permissions: {
                        requirements: false,
                        requests: false,
                        process: false,
                        payments: false,
                        support: false,
                        proposals: false
                    }
                }))
            };
        }
        isUserDrawerOpen = true;
    }

    function closeUserDrawer() {
        isUserDrawerOpen = false;
    }
    
    $: isFormValid = (() => {
        // 1. Basic validation (email required for new users)
        if (!userForm.id && !userForm.email) return false;

        // 2. Permission validation
        // Must have at least one project enabled
        const enabledProjects = userForm.projectPermissions.filter(p => p.enabled);
        if (enabledProjects.length === 0) return false;

        // 3. For every enabled project, at least one permission must be true
        return enabledProjects.every(p => {
            const perms = p.permissions;
            return perms.requirements || perms.requests || perms.process || 
                   perms.payments || perms.support || perms.proposals;
        });
    })();

    async function submitUser() {
        if (isMember) return;
        isSavingUser = true;
        const formData = new FormData();
        if (userForm.id) formData.append('id', userForm.id);
        formData.append('firstName', userForm.firstName);
        formData.append('lastName', userForm.lastName);
        formData.append('email', userForm.email);
        formData.append('status', userForm.status);
        
        const permissions: Record<number, string[]> = {};
        userForm.projectPermissions.forEach(p => {
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
            const response = await fetch('?/saveUser', {
                method: 'POST',
                body: formData
            });
            const result = deserialize(await response.text());
            
            if (result.type === 'success') {
                saveMessage = t.dashboard.page.profile?.saved || 'Saved successfully';
                setTimeout(() => saveMessage = null, 2000);
                closeUserDrawer();
                await invalidateAll();
            }
            applyAction(result);
        } catch (e) {
            console.error(e);
        } finally {
            isSavingUser = false;
        }
    }

    async function deleteUser() {
        isDeleteUserModalOpen = true;
    }

    async function confirmDeleteUser() {
        if (isMember) return;
        isDeletingUser = true;
        const formData = new FormData();
        formData.append('id', userForm.id);
        
        try {
            const response = await fetch('?/deleteUser', {
                method: 'POST',
                body: formData
            });
            const result = deserialize(await response.text());
            
            if (result.type === 'success') {
                // Optimistically remove from list to ensure immediate UI update
                usersList = usersList.filter(u => u.id?.toString() !== userForm.id);
                
                saveMessage = t.dashboard.page.profile?.saved || 'Deleted successfully';
                setTimeout(() => saveMessage = null, 2000);
                isDeleteUserModalOpen = false;
                closeUserDrawer();
                await invalidateAll();
            } else if (result.type === 'failure') {
                alert(result.data?.message || 'Error deleting user');
            } else {
                alert('Error deleting user');
            }
            applyAction(result);
        } catch (e) {
            console.error(e);
            alert('An unexpected error occurred');
        } finally {
            isDeletingUser = false;
            isDeleteUserModalOpen = false;
        }
    }

    function addAddress() {
        if (isMember) return;
        if (newAddress.address) {
            const updatedAddresses = [...addresses, { ...newAddress }];
            addresses = updatedAddresses;
            saveField('addresses', updatedAddresses);
            newAddress = { label: '', address: '', city: '', country: '', state: '', postalCode: '' };
            isAddingAddress = false;
        }
    }

    function removeAddress(index: number) {
        if (isMember) return;
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        addresses = updatedAddresses;
        saveField('addresses', updatedAddresses);
    }

    function addLink() {
        if (isMember) return;
        if (newLink.title && newLink.url) {
            const updatedLinks = [...companyLinks, { ...newLink }];
            companyLinks = updatedLinks;
            saveField('links', updatedLinks);
            newLink = { title: '', url: '' };
            isAddingLink = false;
        }
    }

    function removeLink(index: number) {
        if (isMember) return;
        const updatedLinks = companyLinks.filter((_, i) => i !== index);
        companyLinks = updatedLinks;
        saveField('links', updatedLinks);
    }

    function addDoc() {
        if (isMember) return;
        if (newDoc.type && newDoc.value) {
            const updatedDocs = [...documents, { ...newDoc }];
            documents = updatedDocs;
            saveField('documents', updatedDocs);
            newDoc = { type: '', value: '' };
            isAddingDoc = false;
        }
    }

    function removeDoc(index: number) {
        if (isMember) return;
        const updatedDocs = documents.filter((_, i) => i !== index);
        documents = updatedDocs;
        saveField('documents', updatedDocs);
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-bold tracking-tight">{t.dashboard.page.settings.title}</h2>
            <p class="text-muted-foreground">{t.dashboard.page.settings.subtitle}</p>
            <!-- Delete Logo Modal -->
            {#if isDeleteLogoModalOpen}
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" transition:fade>
                    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
                        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
                            <h2 class="text-lg font-semibold leading-none tracking-tight">{t.dashboard.page.settings.organization.details.logo.delete_confirm?.title || 'Delete Logo'}</h2>
                            <p class="text-sm text-muted-foreground">
                                {t.dashboard.page.settings.organization.details.logo.delete_confirm?.desc || 'Are you sure you want to delete the company logo? This action cannot be undone.'}
                            </p>
                        </div>
                        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                            <button 
                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
                                on:click={() => isDeleteLogoModalOpen = false}
                            >
                                {t.dashboard.page.settings.organization.details.logo.delete_confirm?.cancel || 'Cancel'}
                            </button>
                            <button 
                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
                                on:click={confirmDeleteLogo}
                            >
                                {t.dashboard.page.settings.organization.details.logo.delete_confirm?.delete || 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
        {#if saveMessage}
            <div class="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium" transition:fade>
                <Check class="w-4 h-4" />
                {saveMessage}
            </div>
        {/if}
    </div>

    <!-- Tabs -->
    <div class="flex border-b overflow-x-auto">
        <button 
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
            {activeTab === 'organization' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
            on:click={() => activeTab = 'organization'}
        >
            <Building2 class="w-4 h-4" />
            {t.dashboard.page.settings.tabs?.organization || 'Business'}
        </button>
        <button 
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
            {activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
            on:click={() => activeTab = 'users'}
        >
            <Users class="w-4 h-4" />
            {t.dashboard.page.settings.tabs?.users || 'Users & Permissions'}
        </button>
    </div>

    <!-- Content -->
    {#if activeTab === 'organization'}
        <div in:fade class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column: Company Info & Documents -->
            <div class="space-y-6">
                <!-- Company Information Card -->
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6 border-b">
                        <h3 class="text-lg font-semibold flex items-center gap-2">
                            <Building2 class="w-5 h-5 text-primary" />
                            {t.dashboard.page.settings.organization.details?.title || 'Business Details'}
                        </h3>
                    </div>
                    <div class="p-6 space-y-8">
                        <!-- Logo Upload -->
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <div class="relative group">
                                <div class="w-24 h-24 rounded-lg overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
                                    {#if logoPreview || organization?.logo}
                                        <img 
                                            src={logoPreview || organization?.logo} 
                                            alt="Logo" 
                                            class="w-full h-full object-cover"
                                        />
                                    {:else}
                                        <Building2 class="w-10 h-10 text-muted-foreground" />
                                    {/if}
                                    
                                    {#if saving['logo']}
                                        <div class="absolute inset-0 bg-background/50 flex items-center justify-center">
                                            <Loader2 class="w-6 h-6 animate-spin text-primary" />
                                        </div>
                                    {/if}
                                </div>
                                {#if (logoPreview || organization?.logo) && !saving['logo'] && !isMember}
                                    <button 
                                        type="button"
                                        on:click={deleteLogo}
                                        class="absolute top-0 right-0 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        title={t.dashboard.page.settings.organization.details.logo.delete_confirm?.delete || "Delete Logo"}
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                {/if}
                                {#if !isMember}
                                    <button 
                                        type="button"
                                        on:click={() => logoInput.click()}
                                        class="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={saving['logo']}
                                    >
                                        <Upload class="w-4 h-4" />
                                    </button>
                                {/if}
                                <input 
                                    type="file" 
                                    name="logo" 
                                    accept="image/*" 
                                    class="hidden" 
                                    bind:this={logoInput}
                                    on:change={handleLogoChange}
                                />
                            </div>
                            <div class="flex-1">
                                <h4 class="font-medium">{t.dashboard.page.settings.organization.details.logo?.label || 'Company Logo'}</h4>
                                {#if !isMember}
                                    <p class="text-sm text-muted-foreground">{t.dashboard.page.settings.organization.details.logo?.desc || 'Upload your company logo. Recommended size 400x400px.'}</p>
                                {/if}
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-6">
                            <div class="space-y-2">
                                <label class="text-sm font-medium flex items-center justify-between">
                                    {t.dashboard.page.settings.organization.details?.name || 'Company Name'}
                                    {#if saving['name']}
                                        <Loader2 class="w-3 h-3 animate-spin text-muted-foreground" />
                                    {/if}
                                </label>
                                <input 
                                    type="text" 
                                    value={organization?.name || ''} 
                                    on:change={(e) => saveField('name', e.currentTarget.value)}
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isMember}
                                />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="text-sm font-medium flex items-center justify-between">
                                        {t.dashboard.page.settings.organization.details?.email || 'Email Address'}
                                        {#if saving['email']}
                                            <Loader2 class="w-3 h-3 animate-spin text-muted-foreground" />
                                        {/if}
                                    </label>
                                    <input 
                                        type="email" 
                                        value={organization?.email || ''} 
                                        on:change={(e) => saveField('email', e.currentTarget.value)}
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isMember}
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-medium flex items-center justify-between">
                                        {t.dashboard.page.settings.organization.details?.phone || 'Phone Number'}
                                        {#if saving['phone']}
                                            <Loader2 class="w-3 h-3 animate-spin text-muted-foreground" />
                                        {/if}
                                    </label>
                                    <input 
                                        type="tel" 
                                        value={organization?.phone || ''} 
                                        on:change={(e) => saveField('phone', e.currentTarget.value)}
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isMember}
                                    />
                                </div>
                            </div>
                             <div class="space-y-2">
                                <label class="text-sm font-medium flex items-center justify-between">
                                    {t.dashboard.page.settings.organization.details?.description || 'Description'}
                                    {#if saving['description']}
                                        <Loader2 class="w-3 h-3 animate-spin text-muted-foreground" />
                                    {/if}
                                </label>
                                <textarea 
                                    value={organization?.description || ''} 
                                    on:change={(e) => saveField('description', e.currentTarget.value)}
                                    class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isMember}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Documents / Identification Section -->
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6 border-b flex items-center justify-between">
                        <h3 class="text-lg font-semibold flex items-center gap-2">
                            <FileText class="w-5 h-5 text-primary" />
                            {t.dashboard.page.settings.organization.documents?.title || 'Documents & IDs'}
                            {#if saving['documents']}
                                <Loader2 class="w-4 h-4 animate-spin text-muted-foreground ml-2" />
                            {/if}
                        </h3>
                    </div>
                    <div class="p-6 space-y-4">
                        {#each documents as doc, i}
                            <div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30" transition:slide>
                                <div class="flex items-center gap-3 min-w-0 flex-1 mr-2">
                                    <div class="font-medium text-sm px-2 py-0.5 bg-background border rounded shrink-0">{doc.type}</div>
                                    <span class="text-sm font-mono truncate">{doc.value}</span>
                                </div>
                                {#if !isMember}
                                    <button 
                                        type="button"
                                        class="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
                                        on:click={() => removeDoc(i)}
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                {/if}
                            </div>
                        {/each}

                        {#if isAddingDoc}
                            <div class="border rounded-lg p-4 space-y-4 bg-muted/30" transition:slide>
                                <div class="grid grid-cols-3 gap-2">
                                    <input 
                                        type="text" 
                                        placeholder={t.dashboard.page.settings.organization.documents.form?.type || "Type (e.g. ABN)"}
                                        class="col-span-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        bind:value={newDoc.type}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder={t.dashboard.page.settings.organization.documents.form?.value || "Value"}
                                        class="col-span-2 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        bind:value={newDoc.value}
                                    />
                                </div>
                                <div class="flex justify-end gap-2">
                                    <button 
                                        class="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-md"
                                        on:click={() => isAddingDoc = false}
                                    >
                                        {t.dashboard.page.settings.organization.documents.form?.cancel || "Cancel"}
                                    </button>
                                    <button 
                                        class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                        on:click={addDoc}
                                    >
                                        {t.dashboard.page.settings.organization.documents.form?.save || "Save"}
                                    </button>
                                </div>
                            </div>
                        {:else if !isMember}
                            <button 
                                class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                on:click={() => isAddingDoc = true}
                            >
                                <Plus class="w-4 h-4" />
                                {t.dashboard.page.settings.organization.documents?.add_button || 'Add Document'}
                            </button>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Right Column: Addresses & Links -->
            <div class="space-y-6">
                <!-- Addresses Section -->
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6 border-b flex items-center justify-between">
                        <h3 class="text-lg font-semibold flex items-center gap-2">
                            <MapPin class="w-5 h-5 text-primary" />
                            {t.dashboard.page.settings.organization.addresses?.title || 'Addresses'}
                            {#if saving['addresses']}
                                <Loader2 class="w-4 h-4 animate-spin text-muted-foreground ml-2" />
                            {/if}
                        </h3>
                    </div>
                    <div class="p-6 space-y-4">
                        {#each addresses as address, i}
                            <div class="flex items-start justify-between p-4 rounded-lg border bg-muted/30" transition:slide>
                                <div>
                                    <div class="font-medium">{address.label}</div>
                                    <div class="text-sm text-muted-foreground mt-1">
                                        {address.address}
                                        {#if address.city || address.state || address.postalCode || address.country}
                                            <br />
                                            {[
                                                [address.city, address.state, address.postalCode].filter(Boolean).join(' '),
                                                address.country
                                            ].filter(Boolean).join(', ')}
                                        {/if}
                                    </div>
                                </div>
                                {#if !isMember}
                                    <button 
                                        type="button"
                                        class="text-muted-foreground hover:text-destructive transition-colors p-1"
                                        on:click={() => removeAddress(i)}
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                {/if}
                            </div>
                        {/each}

                        {#if isAddingAddress}
                            <div class="border rounded-lg p-4 space-y-4 bg-muted/30" transition:slide>
                                <div class="space-y-3">
                                    <input 
                                        type="text" 
                                        placeholder={t.dashboard.page.settings.organization.addresses.form?.label || "Label (e.g. HQ)"}
                                        class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        bind:value={newAddress.label}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder={t.dashboard.page.settings.organization.addresses.form?.address || "Address"}
                                        class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        bind:value={newAddress.address}
                                    />
                                    <div class="grid grid-cols-2 gap-2">
                                        <input 
                                            type="text" 
                                            placeholder={t.dashboard.page.settings.organization.addresses.form?.city || "City"}
                                            class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                            bind:value={newAddress.city}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder={t.dashboard.page.settings.organization.addresses.form?.state || "State"}
                                            class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                            bind:value={newAddress.state}
                                        />
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <input 
                                            type="text" 
                                            placeholder={t.dashboard.page.settings.organization.addresses.form?.postal_code || "Postal Code"}
                                            class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                            bind:value={newAddress.postalCode}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder={t.dashboard.page.settings.organization.addresses.form?.country || "Country"}
                                            class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                            bind:value={newAddress.country}
                                        />
                                    </div>
                                </div>
                                <div class="flex justify-end gap-2">
                                    <button 
                                        class="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-md"
                                        on:click={() => isAddingAddress = false}
                                    >
                                        {t.dashboard.page.settings.organization.addresses.form?.cancel || "Cancel"}
                                    </button>
                                    <button 
                                        class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                        on:click={addAddress}
                                    >
                                        {t.dashboard.page.settings.organization.addresses.form?.save || "Save"}
                                    </button>
                                </div>
                            </div>
                        {:else if !isMember}
                            <button 
                                class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                on:click={() => isAddingAddress = true}
                            >
                                <Plus class="w-4 h-4" />
                                {t.dashboard.page.settings.organization.addresses?.add_button || 'Add Address'}
                            </button>
                        {/if}
                    </div>
                </div>

                <!-- Links Section -->
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6 border-b flex items-center justify-between">
                        <h3 class="text-lg font-semibold flex items-center gap-2">
                            <LinkIcon class="w-5 h-5 text-primary" />
                            {t.dashboard.page.settings.organization.links?.title || 'Important Links'}
                            {#if saving['links']}
                                <Loader2 class="w-4 h-4 animate-spin text-muted-foreground ml-2" />
                            {/if}
                        </h3>
                    </div>
                    <div class="p-6 space-y-4">
                        {#each companyLinks as link, i}
                            <div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30" transition:slide>
                                <div class="flex items-center gap-3 overflow-hidden">
                                    <div class="p-2 rounded-full bg-background border">
                                        <LinkIcon class="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div class="min-w-0">
                                        <div class="font-medium truncate">{link.title}</div>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" class="text-xs text-muted-foreground hover:text-primary truncate block">
                                            {link.url}
                                        </a>
                                </div>
                            </div>
                            {#if !isMember}
                                <button 
                                    type="button"
                                    class="text-muted-foreground hover:text-destructive transition-colors p-1"
                                    on:click={() => removeLink(i)}
                                >
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            {/if}
                        </div>
                    {/each}

                    {#if isAddingLink}
                        <div class="border rounded-lg p-4 space-y-4 bg-muted/30" transition:slide>
                            <div class="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder={t.dashboard.page.settings.organization.links.form?.title || "Title"}
                                    class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newLink.title}
                                />
                                <input 
                                    type="url" 
                                    placeholder={t.dashboard.page.settings.organization.links.form?.url || "URL (https://...)"}
                                    class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newLink.url}
                                />
                            </div>
                            <div class="flex justify-end gap-2">
                                <button 
                                    class="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-md"
                                    on:click={() => isAddingLink = false}
                                >
                                    {t.dashboard.page.settings.organization.links.form?.cancel || "Cancel"}
                                </button>
                                <button 
                                    class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                    on:click={addLink}
                                >
                                    {t.dashboard.page.settings.organization.links.form?.save || "Save"}
                                </button>
                            </div>
                        </div>
                    {:else if !isMember}
                        <button 
                            class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            on:click={() => isAddingLink = true}
                        >
                            <Plus class="w-4 h-4" />
                            {t.dashboard.page.settings.organization.links?.add_button || 'Add Link'}
                        </button>
                    {/if}
                    </div>
                </div>
            </div>
        </div>

    {:else if activeTab === 'users'}
        <div in:fade class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-lg font-semibold">{t.dashboard.page.settings.users?.title || 'Users & Permissions'}</h2>
                    <p class="text-sm text-muted-foreground">{t.dashboard.page.settings.users?.subtitle || 'Manage users and their roles within the organization.'}</p>
                </div>
                {#if !isMember}
                    <button 
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 gap-2 w-full sm:w-auto"
                        on:click={() => openUserDrawer()}
                    >
                        <Plus class="w-4 h-4" />
                        {t.dashboard.page.settings.users?.add_button || 'Add User'}
                    </button>
                {/if}
            </div>

            <!-- Mobile View (Cards) -->
            <div class="block md:hidden space-y-4">
                {#each usersList as user}
                    <div class="rounded-lg border bg-card p-4 space-y-4 shadow-sm">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="font-medium truncate">{getFullName(user)}</span>
                                    {#if user.status === 'active'}
                                        <span class="relative flex h-2 w-2 shrink-0">
                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                    {:else if user.status === 'pending'}
                                        <span class="relative flex h-2 w-2 shrink-0">
                                            <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                        </span>
                                    {:else if user.status === 'rejected'}
                                        <span class="relative flex h-2 w-2 shrink-0">
                                            <span class="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                                        </span>
                                    {:else}
                                        <span class="relative flex h-2 w-2 shrink-0">
                                            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    {/if}
                                </div>
                                <div class="text-sm text-muted-foreground truncate">{user.email}</div>
                            </div>
                            {#if user.id?.toString() !== currentUser?.id && !isMember}
                                <button 
                                    class="p-2 -mr-2 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground shrink-0"
                                    on:click={() => openUserDrawer(user)}
                                >
                                    <Pencil class="w-4 h-4" />
                                </button>
                            {/if}
                        </div>

                        <div class="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                            <div>
                                <span class="text-xs text-muted-foreground block mb-1">{t.dashboard.page.settings.users.table?.role || 'Role'}</span>
                                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                                    {user.role}
                                </div>
                            </div>
                            <div>
                                <span class="text-xs text-muted-foreground block mb-1">{t.dashboard.page.settings.users.table?.projects || 'Projects'}</span>
                                <div class="flex flex-wrap gap-1">
                                    {#each getUserProjectNames(user) as projectName}
                                        <div class="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors border-transparent bg-primary/10 text-primary">
                                            {projectName}
                                        </div>
                                    {/each}
                                    {#if getUserProjectNames(user).length === 0}
                                        <span class="text-muted-foreground text-xs">-</span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Desktop View (Table) -->
            <div class="hidden md:block rounded-md border bg-card">
                <div class="relative w-full overflow-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="text-muted-foreground bg-muted/50 font-medium">
                            <tr>
                                <th class="h-12 px-4 align-middle">{t.dashboard.page.settings.users.table?.name || 'Name'}</th>
                                <th class="h-12 px-4 align-middle">{t.dashboard.page.settings.users.table?.email || 'Email'}</th>
                                <th class="h-12 px-4 align-middle">{t.dashboard.page.settings.users.table?.role || 'Role'}</th>
                                <th class="h-12 px-4 align-middle">{t.dashboard.page.settings.users.table?.projects || 'Projects'}</th>
                                <th class="h-12 px-4 align-middle">{t.dashboard.page.settings.users.table?.status || 'Status'}</th>
                                <th class="h-12 px-4 align-middle text-right">{t.dashboard.page.settings.users.table?.actions || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each usersList as user}
                                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td class="p-4 align-middle font-medium">{getFullName(user)}</td>
                                    <td class="p-4 align-middle">{user.email}</td>
                                    <td class="p-4 align-middle">
                                        <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {user.role}
                                        </div>
                                    </td>
                                    <td class="p-4 align-middle">
                                        {#each getUserProjectNames(user) as projectName}
                                            <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary hover:bg-primary/20 mr-1 mb-1">
                                                {projectName}
                                            </div>
                                        {/each}
                                        {#if getUserProjectNames(user).length === 0}
                                            <span class="text-muted-foreground text-xs">-</span>
                                        {/if}
                                    </td>
                                    <td class="p-4 align-middle">
                                        {#if user.status === 'active'}
                                            <span class="inline-flex items-center gap-1.5">
                                                <span class="relative flex h-2 w-2">
                                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </span>
                                                {t.dashboard.page.settings.users.table?.active || 'Active'}
                                            </span>
                                        {:else if user.status === 'pending'}
                                            <span class="inline-flex items-center gap-1.5">
                                                <span class="relative flex h-2 w-2">
                                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                                </span>
                                                {t.dashboard.page.settings.users.table?.pending || 'Pending'}
                                            </span>
                                        {:else if user.status === 'rejected'}
                                            <span class="inline-flex items-center gap-1.5">
                                                <span class="relative flex h-2 w-2">
                                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                                                </span>
                                                {t.dashboard.page.settings.users.table?.rejected || 'Rejected'}
                                            </span>
                                        {:else}
                                            <span class="inline-flex items-center gap-1.5">
                                                <span class="relative flex h-2 w-2">
                                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                                {t.dashboard.page.settings.users.table?.inactive || 'Inactive'}
                                            </span>
                                        {/if}
                                    </td>
                                    <td class="p-4 align-middle text-right">
                                        {#if user.id?.toString() !== currentUser?.id && !isMember}
                                            <button 
                                                class="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                                on:click={() => openUserDrawer(user)}
                                            >
                                                <Pencil class="w-4 h-4" />
                                            </button>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- User Drawer -->
{#if isUserDrawerOpen}
    <div use:portal class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-end" on:click={closeUserDrawer} role="button" tabindex="0" on:keydown={(e) => e.key === 'Escape' && closeUserDrawer()}>
        <div class="bg-card h-full w-full max-w-lg border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" on:click|stopPropagation role="presentation">
            <!-- Header -->
            <div class="p-6 border-b flex items-center justify-between bg-card z-10">
                 <h2 class="text-lg font-semibold">
                    {selectedUser ? t.dashboard.page.settings.users.form?.title_edit || 'Edit User' : t.dashboard.page.settings.users.form?.title_add || 'Add User'}
                 </h2>
                 <button on:click={closeUserDrawer} class="text-muted-foreground hover:text-foreground">
                    <X class="w-5 h-5" />
                 </button>
            </div>
            
            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Basic Info -->
                <div class="space-y-4">
                     {#if userForm.id}
                        <!-- Edit Mode: Show Static Info -->
                        <div class="bg-muted/30 p-4 rounded-lg space-y-1 mb-6">
                            <h3 class="font-medium text-lg">
                                {userForm.firstName} {userForm.lastName}
                                {#if !userForm.firstName && !userForm.lastName}
                                    <span class="text-muted-foreground italic">({t.dashboard.page.settings.users.table?.guest || 'Guest'})</span>
                                {/if}
                            </h3>
                            <p class="text-sm text-muted-foreground">{userForm.email}</p>
                        </div>
                     {:else}
                        <!-- Add Mode: Show Email Input -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium">{t.dashboard.page.settings.users.form?.email || 'Email'}</label>
                            <input 
                                type="email" 
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50" 
                                bind:value={userForm.email} 
                                disabled={!!userForm.id || isMember}
                                required
                            />
                            {#if !userForm.email && saveMessage === 'validation_error'}
                                 <p class="text-sm text-destructive">Email is required</p>
                            {/if}
                        </div>
                     {/if}

                    <!-- Status Toggle - Only show when editing existing user -->
                    {#if userForm.id}
                    <div class="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div class="space-y-0.5">
                            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t.dashboard.page.settings.users.form?.active || 'User Enabled'}
                            </label>
                            <p class="text-xs text-muted-foreground">
                                {#if userForm.status === 'pending'}
                                    <span class="text-yellow-600 font-medium">
                                        {t.dashboard.page.settings.users.table?.pending || 'Pending Invitation Acceptance'}
                                    </span>
                                {:else}
                                    {t.dashboard.page.settings.users.form?.active_desc || 'Disable to prevent access.'}
                                {/if}
                            </p>
                        </div>
                        <div class="flex items-center">
                             <input 
                                type="checkbox" 
                                id="user-status" 
                                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                checked={userForm.status === 'active'}
                                on:change={(e) => userForm.status = e.currentTarget.checked ? 'active' : 'inactive'}
                                disabled={userForm.id === currentUser?.id?.toString() || isMember}
                            />
                        </div>
                    </div>
                    {/if}
                </div>

                <!-- Permissions -->
                <div class="space-y-4 pt-4 border-t">
                     <div>
                        <h3 class="font-medium">{t.dashboard.page.settings.users.form?.permissions?.title || 'Permissions'}</h3>
                        <p class="text-sm text-muted-foreground">{t.dashboard.page.settings.users.form?.permissions?.desc || 'Configure project access and permissions.'}</p>
                     </div>
                     
                     <div class="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                        {#each userForm.projectPermissions as project}
                            <div class="rounded-lg border p-4 space-y-4">
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" id="project-{project.projectId}" bind:checked={project.enabled} class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isMember} />
                                    <label for="project-{project.projectId}" class="text-sm font-semibold leading-none cursor-pointer">
                                        {project.projectName}
                                    </label>
                                </div>
                                
                                {#if project.enabled}
                                    <div class="pl-6 grid grid-cols-1 gap-3 sm:grid-cols-2" transition:slide>
                                        <div class="flex items-center space-x-2">
                                            <input type="checkbox" id="perm-{project.projectId}-proc" bind:checked={project.permissions.process} class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isMember} />
                                            <label for="perm-{project.projectId}-proc" class="text-sm leading-none cursor-pointer">
                                                {t.dashboard.page.settings.users.form?.permissions?.process || 'Process'}
                                            </label>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <input type="checkbox" id="perm-{project.projectId}-reqs" bind:checked={project.permissions.requests} class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isMember} />
                                            <label for="perm-{project.projectId}-reqs" class="text-sm leading-none cursor-pointer">
                                                {t.dashboard.page.settings.users.form?.permissions?.requests || 'Requests'}
                                            </label>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <input type="checkbox" id="perm-{project.projectId}-req" bind:checked={project.permissions.requirements} class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isMember} />
                                            <label for="perm-{project.projectId}-req" class="text-sm leading-none cursor-pointer">
                                                {t.dashboard.page.settings.users.form?.permissions?.requirements || 'Requirements'}
                                            </label>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <input type="checkbox" id="perm-{project.projectId}-supp" bind:checked={project.permissions.support} class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isMember} />
                                            <label for="perm-{project.projectId}-supp" class="text-sm leading-none cursor-pointer">
                                                {t.dashboard.page.settings.users.form?.permissions?.support || 'Support'}
                                            </label>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <input type="checkbox" id="perm-{project.projectId}-prop" bind:checked={project.permissions.proposals} class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isMember} />
                                            <label for="perm-{project.projectId}-prop" class="text-sm leading-none cursor-pointer">
                                                {t.dashboard.page.settings.users.form?.permissions?.proposals || 'Proposals'}
                                            </label>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <input type="checkbox" id="perm-{project.projectId}-pay" bind:checked={project.permissions.payments} class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isMember} />
                                            <label for="perm-{project.projectId}-pay" class="text-sm leading-none cursor-pointer">
                                                {t.dashboard.page.settings.users.form?.permissions?.payments || 'Payments'}
                                            </label>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                        
                        {#if userForm.projectPermissions.length === 0}
                            <div class="text-center py-4 text-muted-foreground text-sm">
                                {t.dashboard.page.settings.users.form?.permissions?.no_projects || 'No projects available to assign.'}
                            </div>
                        {/if}
                     </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t bg-muted/10 flex justify-between items-center gap-2">
                {#if userForm.id && currentUser && userForm.id !== currentUser.id?.toString() && !isMember}
                    <button 
                        class="px-4 py-2 text-sm font-medium border border-destructive text-destructive rounded-md hover:bg-destructive/10 flex items-center gap-2"
                        type="button"
                        on:click={deleteUser}
                        disabled={isSavingUser || isDeletingUser}
                    >
                        {#if isDeletingUser}
                            <Loader2 class="w-4 h-4 animate-spin" />
                        {/if}
                        {t.dashboard.page.settings.users.form?.delete_simple || 'Delete'}
                    </button>
                {:else}
                    <div></div>
                {/if}
                <div class="flex gap-2">
                    <button class="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent" type="button" on:click={closeUserDrawer} disabled={isSavingUser || isDeletingUser}>
                        {t.dashboard.page.settings.users.form?.cancel || 'Cancel'}
                    </button>
                    {#if !isMember}
                        <button 
                            class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                            on:click={submitUser}
                            disabled={!isFormValid || isSavingUser || isDeletingUser}
                        >
                            {#if isSavingUser}
                                <Loader2 class="w-4 h-4 animate-spin" />
                            {/if}
                            {userForm.id ? (t.dashboard.page.settings.users.form?.save_simple || 'Guardar') : 'Invitar'}
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Delete User Modal -->
{#if isDeleteUserModalOpen}
    <div class="fixed inset-0 z-[1000] flex items-center justify-center bg-background/80 backdrop-blur-sm" transition:fade>
        <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <div class="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 class="text-lg font-semibold leading-none tracking-tight">{t.dashboard.page.settings.users.form?.confirm_delete_title || 'Delete User'}</h2>
                <p class="text-sm text-muted-foreground">
                    {t.dashboard.page.settings.users.form?.confirm_delete || 'Are you sure you want to delete this user?'}
                </p>
            </div>
            <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <button 
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
                    on:click={() => isDeleteUserModalOpen = false}
                    disabled={isDeletingUser}
                >
                    {t.dashboard.page.settings.users.form?.cancel || 'Cancel'}
                </button>
                <button 
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
                    on:click={confirmDeleteUser}
                    disabled={isDeletingUser}
                >
                    {#if isDeletingUser}
                        <Loader2 class="w-4 h-4 animate-spin mr-2" />
                    {/if}
                    {t.dashboard.page.settings.users.form?.delete_simple || 'Delete'}
                </button>
            </div>
        </div>
    </div>
{/if}