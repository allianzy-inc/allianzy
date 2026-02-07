<script lang="ts">
    import { enhance, applyAction, deserialize } from '$app/forms';
    import { page } from '$app/stores';
    import { invalidateAll } from '$app/navigation';
    import { User, MapPin, Link as LinkIcon, Plus, Trash2, Upload, FileText, Loader2, Check } from 'lucide-svelte';
    import type { PageData } from './$types';
    import { fade, slide } from 'svelte/transition';
    import { currentLang, translations } from '$lib/i18n';

    export let data: PageData;
    
    // Local state initialized from server data
    $: profile = data.profile as any;
    $: t = translations[$currentLang];
    
    // Dynamic Lists State
    let addresses: any[] = [];
    let companyLinks: any[] = [];
    let identification: any[] = [];
    
    // Sync local state with server data when it changes
    $: if (profile) {
        addresses = (profile.addresses as any[]) || [];
        companyLinks = (profile.companyLinks as any[]) || (profile.company_links as any[]) || [];
        identification = (profile.identification as any[]) || [];
    }

    // Temporary state for new items
    let newAddress = { label: '', address: '', city: '', country: '', state: '', postalCode: '' };
    let newLink = { title: '', url: '' };
    let newId = { type: '', value: '' };
    
    let isAddingAddress = false;
    let isAddingLink = false;
    let isAddingId = false;

    // File input references
    let avatarInput: HTMLInputElement;
    let avatarPreview: string | null = null;

    // Loading states
    let saving: Record<string, boolean> = {};
    let saveMessage: string | null = null;

    async function saveField(name: string, value: any) {
        saving[name] = true;
        saving = saving; // trigger reactivity
        
        const formData = new FormData();
        
        if (name === 'identification' || name === 'links' || name === 'addresses') {
            formData.append(name, JSON.stringify(value));
        } else if (value instanceof File) {
             formData.append(name, value);
        } else {
            formData.append(name, value);
        }

        try {
            const response = await fetch('?/updateProfile', {
                method: 'POST',
                body: formData
            });

            const result = deserialize(await response.text());
            
            if (result.type === 'success') {
                saveMessage = t.dashboard.page.profile.saved;
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

    function handleAvatarChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            avatarPreview = URL.createObjectURL(file);
            saveField('avatar', file);
        }
    }

    let isDeleteAvatarModalOpen = false;

    function deleteAvatar() {
        isDeleteAvatarModalOpen = true;
    }

    function confirmDeleteAvatar() {
        avatarPreview = null;
        if (avatarInput) avatarInput.value = ''; // Reset file input
        saveField('deleteAvatar', 'true');
        isDeleteAvatarModalOpen = false;
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

    function addId() {
        if (newId.type && newId.value) {
            const updatedIds = [...identification, { ...newId }];
            identification = updatedIds;
            saveField('identification', updatedIds);
            newId = { type: '', value: '' };
            isAddingId = false;
        }
    }

    function removeId(index: number) {
        const updatedIds = identification.filter((_, i) => i !== index);
        identification = updatedIds;
        saveField('identification', updatedIds);
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-bold tracking-tight">{t.dashboard.page.profile.title}</h2>
            <p class="text-muted-foreground">{t.dashboard.page.profile.subtitle}</p>
            <!-- Delete Avatar Modal -->
    {#if isDeleteAvatarModalOpen}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" transition:fade>
            <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
                <div class="flex flex-col space-y-1.5 text-center sm:text-left">
                    <h2 class="text-lg font-semibold leading-none tracking-tight">{t.dashboard.page.profile.personal_info.avatar.delete_confirm.title}</h2>
                    <p class="text-sm text-muted-foreground">
                        {t.dashboard.page.profile.personal_info.avatar.delete_confirm.desc}
                    </p>
                </div>
                <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <button 
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
                        on:click={() => isDeleteAvatarModalOpen = false}
                    >
                        {t.dashboard.page.profile.personal_info.avatar.delete_confirm.cancel}
                    </button>
                    <button 
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
                        on:click={confirmDeleteAvatar}
                    >
                        {t.dashboard.page.profile.personal_info.avatar.delete_confirm.delete}
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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column: Personal Info & Documents -->
        <div class="space-y-6">
            <!-- Personal Information Card -->
            <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <User class="w-5 h-5 text-primary" />
                        {t.dashboard.page.profile.personal_info.title}
                    </h3>
                </div>
                <div class="p-6 space-y-8">
                    <!-- Avatar Upload -->
                    <div class="flex items-center gap-6">
                        <div class="relative group">
                            <div class="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
                                {#if avatarPreview || profile?.avatarUrl || profile?.avatar_url}
                                    <img 
                                        src={avatarPreview || profile?.avatarUrl || profile?.avatar_url} 
                                        alt="Profile" 
                                        class="w-full h-full object-cover"
                                    />
                                {:else}
                                    <User class="w-10 h-10 text-muted-foreground" />
                                {/if}
                                
                                {#if saving['avatar']}
                                    <div class="absolute inset-0 bg-background/50 flex items-center justify-center">
                                        <Loader2 class="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                {/if}
                            </div>
                            {#if (avatarPreview || profile?.avatarUrl || profile?.avatar_url) && !saving['avatar']}
                                <button 
                                    type="button"
                                    on:click={deleteAvatar}
                                    class="absolute top-0 right-0 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    title={t.dashboard.page.profile.personal_info.avatar.delete_tooltip}
                                >
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            {/if}
                            <button 
                                type="button"
                                on:click={() => avatarInput.click()}
                                class="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-sm"
                                disabled={saving['avatar']}
                            >
                                <Upload class="w-4 h-4" />
                            </button>
                            <input 
                                type="file" 
                                name="avatar" 
                                accept="image/*" 
                                class="hidden" 
                                bind:this={avatarInput}
                                on:change={handleAvatarChange}
                            />
                        </div>
                        <div class="flex-1">
                            <h4 class="font-medium">{t.dashboard.page.profile.personal_info.avatar.label}</h4>
                            <p class="text-sm text-muted-foreground">{t.dashboard.page.profile.personal_info.avatar.desc}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-sm font-medium flex items-center justify-between">
                                {t.dashboard.page.profile.personal_info.name}
                                {#if saving['firstName']}
                                    <Loader2 class="w-3 h-3 animate-spin text-muted-foreground" />
                                {/if}
                            </label>
                            <input 
                                type="text" 
                                value={profile?.firstName || profile?.first_name || ''} 
                                on:change={(e) => saveField('firstName', e.currentTarget.value)}
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium flex items-center justify-between">
                                {t.dashboard.page.profile.personal_info.lastname}
                                {#if saving['lastName']}
                                    <Loader2 class="w-3 h-3 animate-spin text-muted-foreground" />
                                {/if}
                            </label>
                            <input 
                                type="text" 
                                value={profile?.lastName || profile?.last_name || ''} 
                                on:change={(e) => saveField('lastName', e.currentTarget.value)}
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">{t.dashboard.page.profile.personal_info.email}</label>
                            <input 
                                type="email" 
                                value={profile?.email || ''} 
                                disabled 
                                class="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-70 cursor-not-allowed"
                            />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium flex items-center justify-between">
                                {t.dashboard.page.profile.personal_info.phone}
                                {#if saving['phone']}
                                    <Loader2 class="w-3 h-3 animate-spin text-muted-foreground" />
                                {/if}
                            </label>
                            <input 
                                type="tel" 
                                value={profile?.phone || ''} 
                                on:change={(e) => saveField('phone', e.currentTarget.value)}
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Documents / Identification Section -->
            <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div class="p-6 border-b flex items-center justify-between">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <FileText class="w-5 h-5 text-primary" />
                        {t.dashboard.page.profile.documents.title}
                        {#if saving['identification']}
                            <Loader2 class="w-4 h-4 animate-spin text-muted-foreground ml-2" />
                        {/if}
                    </h3>
                </div>
                <div class="p-6 space-y-4">
                    {#each identification as id, i}
                        <div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30" transition:slide>
                            <div class="flex items-center gap-3">
                                <div class="font-medium text-sm px-2 py-0.5 bg-background border rounded">{id.type}</div>
                                <span class="text-sm font-mono">{id.value}</span>
                            </div>
                            <button 
                                type="button"
                                class="text-muted-foreground hover:text-destructive transition-colors p-1"
                                on:click={() => removeId(i)}
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    {/each}

                    {#if isAddingId}
                        <div class="border rounded-lg p-4 space-y-4 bg-muted/30" transition:slide>
                            <div class="grid grid-cols-3 gap-2">
                                <input 
                                    type="text" 
                                    placeholder={t.dashboard.page.profile.documents.form.type}
                                    class="col-span-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newId.type}
                                />
                                <input 
                                    type="text" 
                                    placeholder={t.dashboard.page.profile.documents.form.value}
                                    class="col-span-2 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newId.value}
                                />
                            </div>
                            <div class="flex justify-end gap-2">
                                <button 
                                    class="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-md"
                                    on:click={() => isAddingId = false}
                                >
                                    {t.dashboard.page.profile.documents.form.cancel}
                                </button>
                                <button 
                                    class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                    on:click={addId}
                                >
                                    {t.dashboard.page.profile.documents.form.save}
                                </button>
                            </div>
                        </div>
                    {:else}
                        <button 
                            class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            on:click={() => isAddingId = true}
                        >
                            <Plus class="w-4 h-4" />
                            {t.dashboard.page.profile.documents.add_button}
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
                        {t.dashboard.page.profile.addresses.title}
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
                            <input 
                                type="text" 
                                placeholder={t.dashboard.page.profile.addresses.form.label}
                                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                bind:value={newAddress.label}
                            />
                            <input 
                                type="text" 
                                placeholder={t.dashboard.page.profile.addresses.form.address}
                                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                bind:value={newAddress.address}
                            />
                            <div class="grid grid-cols-2 gap-2">
                                <input 
                                    type="text" 
                                    placeholder={t.dashboard.page.profile.addresses.form.city}
                                    class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newAddress.city}
                                />
                                <input 
                                    type="text" 
                                    placeholder={t.dashboard.page.profile.addresses.form.state}
                                    class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newAddress.state}
                                />
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <input 
                                    type="text" 
                                    placeholder={t.dashboard.page.profile.addresses.form.postal_code}
                                    class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newAddress.postalCode}
                                />
                                <input 
                                    type="text" 
                                    placeholder={t.dashboard.page.profile.addresses.form.country}
                                    class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newAddress.country}
                                />
                            </div>
                            <div class="flex justify-end gap-2">
                                <button 
                                    class="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-md"
                                    on:click={() => isAddingAddress = false}
                                >
                                    {t.dashboard.page.profile.addresses.form.cancel}
                                </button>
                                <button 
                                    class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                    on:click={addAddress}
                                >
                                    {t.dashboard.page.profile.addresses.form.save}
                                </button>
                            </div>
                        </div>
                    {:else}
                        <button 
                            class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            on:click={() => isAddingAddress = true}
                        >
                            <Plus class="w-4 h-4" />
                            {t.dashboard.page.profile.addresses.add_button}
                        </button>
                    {/if}
                </div>
            </div>

            <!-- Links Section (Repurposed from Company Links) -->
            <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div class="p-6 border-b flex items-center justify-between">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <LinkIcon class="w-5 h-5 text-primary" />
                        {t.dashboard.page.profile.links.title}
                        {#if saving['links']}
                            <Loader2 class="w-4 h-4 animate-spin text-muted-foreground ml-2" />
                        {/if}
                    </h3>
                </div>
                <div class="p-6 space-y-4">
                    {#each companyLinks as link, i}
                        <div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30" transition:slide>
                            <div class="flex items-center gap-3 overflow-hidden">
                                <div class="font-medium text-sm whitespace-nowrap">{link.title}</div>
                                <div class="text-sm text-muted-foreground truncate">{link.url}</div>
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
                            <div class="grid grid-cols-3 gap-2">
                                <input 
                                    type="text" 
                                    placeholder={t.dashboard.page.profile.links.form.title}
                                    class="col-span-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newLink.title}
                                />
                                <input 
                                    type="url" 
                                    placeholder={t.dashboard.page.profile.links.form.url}
                                    class="col-span-2 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    bind:value={newLink.url}
                                />
                            </div>
                            <div class="flex justify-end gap-2">
                                <button 
                                    class="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-md"
                                    on:click={() => isAddingLink = false}
                                >
                                    {t.dashboard.page.profile.links.form.cancel}
                                </button>
                                <button 
                                    class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                    on:click={addLink}
                                >
                                    {t.dashboard.page.profile.links.form.save}
                                </button>
                            </div>
                        </div>
                    {:else}
                        <button 
                            class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            on:click={() => isAddingLink = true}
                        >
                            <Plus class="w-4 h-4" />
                            {t.dashboard.page.profile.links.add_button}
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>