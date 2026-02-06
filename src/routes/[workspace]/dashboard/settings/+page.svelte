<script lang="ts">
    import { enhance, applyAction, deserialize } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { fade, slide } from 'svelte/transition';
    import { Pencil, Plus, Upload, Building2, Users, FileText, ShieldCheck, Mail, Globe, MapPin, Calendar, Clock, Link as LinkIcon, Trash2, Loader2, Check } from 'lucide-svelte';
    import { currentLang, translations } from '$lib/i18n';
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
        avatarUrl: string | null | undefined;
    }

    let activeTab = 'organization'; // organization, users, compliance

    // Use reactive statements to update when data changes
    $: organization = (data.company as unknown as Company) || {};
    $: usersList = (data.companyUsers as CompanyUser[]) || [];
    
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

    const getFullName = (u: CompanyUser) => {
        if (!u.firstName && !u.lastName) return 'N/A';
        return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    };

    async function saveField(name: string, value: any) {
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
        logoPreview = null;
        if (logoInput) logoInput.value = ''; // Reset file input
        saveField('deleteLogo', 'true');
        isDeleteLogoModalOpen = false;
    }

    function addAddress() {
        if (newAddress.address) {
            const updatedAddresses = [...addresses, { ...newAddress }];
            addresses = updatedAddresses;
            saveField('addresses', updatedAddresses);
            newAddress = { label: '', address: '', city: '', country: '', state: '', postalCode: '' };
            isAddingAddress = false;
        }
    }

    function removeAddress(index: number) {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        addresses = updatedAddresses;
        saveField('addresses', updatedAddresses);
    }

    function addLink() {
        if (newLink.title && newLink.url) {
            const updatedLinks = [...companyLinks, { ...newLink }];
            companyLinks = updatedLinks;
            saveField('links', updatedLinks);
            newLink = { title: '', url: '' };
            isAddingLink = false;
        }
    }

    function removeLink(index: number) {
        const updatedLinks = companyLinks.filter((_, i) => i !== index);
        companyLinks = updatedLinks;
        saveField('links', updatedLinks);
    }

    function addDoc() {
        if (newDoc.type && newDoc.value) {
            const updatedDocs = [...documents, { ...newDoc }];
            documents = updatedDocs;
            saveField('documents', updatedDocs);
            newDoc = { type: '', value: '' };
            isAddingDoc = false;
        }
    }

    function removeDoc(index: number) {
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
    <div class="flex gap-2 border-b pb-4 overflow-x-auto">
        <button 
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
            {activeTab === 'organization' ? 'bg-background shadow-sm border text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
            on:click={() => activeTab = 'organization'}
        >
            <Building2 class="w-4 h-4" />
            {t.dashboard.page.settings.tabs?.organization || 'Business'}
        </button>
        <button 
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
            {activeTab === 'users' ? 'bg-background shadow-sm border text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
            on:click={() => activeTab = 'users'}
        >
            <Users class="w-4 h-4" />
            {t.dashboard.page.settings.tabs?.users || 'Users & Permissions'}
        </button>
        <button 
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
            {activeTab === 'compliance' ? 'bg-background shadow-sm border text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
            on:click={() => activeTab = 'compliance'}
        >
            <ShieldCheck class="w-4 h-4" />
            {t.dashboard.page.settings.tabs?.compliance || 'Compliance'}
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
                        <div class="flex items-center gap-6">
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
                                {#if (logoPreview || organization?.logo) && !saving['logo']}
                                    <button 
                                        type="button"
                                        on:click={deleteLogo}
                                        class="absolute top-0 right-0 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        title={t.dashboard.page.settings.organization.details.logo.delete_confirm?.delete || "Delete Logo"}
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                {/if}
                                <button 
                                    type="button"
                                    on:click={() => logoInput.click()}
                                    class="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-sm"
                                    disabled={saving['logo']}
                                >
                                    <Upload class="w-4 h-4" />
                                </button>
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
                                <p class="text-sm text-muted-foreground">{t.dashboard.page.settings.organization.details.logo?.desc || 'Upload your company logo. Recommended size 400x400px.'}</p>
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
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                                    class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                                <div class="flex items-center gap-3">
                                    <div class="font-medium text-sm px-2 py-0.5 bg-background border rounded">{doc.type}</div>
                                    <span class="text-sm font-mono">{doc.value}</span>
                                </div>
                                <button 
                                    type="button"
                                    class="text-muted-foreground hover:text-destructive transition-colors p-1"
                                    on:click={() => removeDoc(i)}
                                >
                                    <Trash2 class="w-4 h-4" />
                                </button>
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
                        {:else}
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
                                <button 
                                    type="button"
                                    class="text-muted-foreground hover:text-destructive transition-colors p-1"
                                    on:click={() => removeAddress(i)}
                                >
                                    <Trash2 class="w-4 h-4" />
                                </button>
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
                        {:else}
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
                                <button 
                                    type="button"
                                    class="text-muted-foreground hover:text-destructive transition-colors p-1"
                                    on:click={() => removeLink(i)}
                                >
                                    <Trash2 class="w-4 h-4" />
                                </button>
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
                        {:else}
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
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-semibold">{t.dashboard.page.settings.users?.title || 'Users & Permissions'}</h2>
                    <p class="text-sm text-muted-foreground">{t.dashboard.page.settings.users?.subtitle || 'Manage users and their roles within the organization.'}</p>
                </div>
                <button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 gap-2">
                    <Plus class="w-4 h-4" />
                    {t.dashboard.page.settings.users?.add_button || 'Add User'}
                </button>
            </div>

            <div class="rounded-md border bg-card">
                <div class="relative w-full overflow-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="text-muted-foreground bg-muted/50 font-medium">
                            <tr>
                                <th class="h-12 px-4 align-middle">{t.dashboard.page.settings.users.table?.name || 'Name'}</th>
                                <th class="h-12 px-4 align-middle">{t.dashboard.page.settings.users.table?.email || 'Email'}</th>
                                <th class="h-12 px-4 align-middle">{t.dashboard.page.settings.users.table?.role || 'Role'}</th>
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
                                        <span class="inline-flex items-center gap-1.5">
                                            <span class="relative flex h-2 w-2">
                                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            {t.dashboard.page.settings.users.table?.active || 'Active'}
                                        </span>
                                    </td>
                                    <td class="p-4 align-middle text-right">
                                        <button class="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground">
                                            <Pencil class="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    
    {:else}
        <div in:fade class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Globe class="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 class="text-lg font-semibold">{t.dashboard.page.settings.compliance?.coming_soon || 'Coming Soon'}</h3>
            <p class="text-muted-foreground mt-2 max-w-sm">
                {t.dashboard.page.settings.compliance?.desc || 'This section is currently under development. Check back later for updates.'}
            </p>
        </div>
    {/if}
</div>