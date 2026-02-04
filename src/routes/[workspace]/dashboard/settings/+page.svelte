<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Pencil, Plus, Upload, Building2, Users, FileText, ShieldCheck, Mail, Globe, MapPin, Calendar, Clock, CreditCard } from 'lucide-svelte';
    import { currentLang, translations } from '$lib/i18n';
    import type { PageData } from './$types';

    export let data: PageData;
    $: t = translations[$currentLang];
    
    interface Address {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
        officeName?: string;
    }

    interface RegistrationDetails {
        acn?: string;
        abn?: string;
        ndisRegistration?: string;
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
        address: Address | unknown;
        registrationDetails: RegistrationDetails | unknown;
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
    $: address = (organization.address as Address) || {};
    $: registrationDetails = (organization.registrationDetails as RegistrationDetails) || {};

    const getFullName = (u: CompanyUser) => {
        if (!u.firstName && !u.lastName) return 'N/A';
        return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    };
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-bold tracking-tight">{t.dashboard.page.settings.title}</h2>
            <p class="text-muted-foreground">{t.dashboard.page.settings.subtitle}</p>
        </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b pb-4 overflow-x-auto">
        <button 
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
            {activeTab === 'organization' ? 'bg-background shadow-sm border text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
            on:click={() => activeTab = 'organization'}
        >
            <Building2 class="w-4 h-4" />
            Business
        </button>
        <button 
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
            {activeTab === 'users' ? 'bg-background shadow-sm border text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
            on:click={() => activeTab = 'users'}
        >
            <Users class="w-4 h-4" />
            User & Permissions
        </button>
        <button 
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
            {activeTab === 'compliance' ? 'bg-background shadow-sm border text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
            on:click={() => activeTab = 'compliance'}
        >
            <ShieldCheck class="w-4 h-4" />
            Compliance
        </button>
    </div>

    <!-- Content -->
    {#if activeTab === 'organization'}
        <div in:fade class="space-y-6">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Business Details</h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Business Card -->
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6 space-y-6">
                        <div class="flex items-start justify-between">
                            <div class="flex gap-4">
                                <div class="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center">
                                    {#if organization.logo}
                                        <img src={organization.logo} alt="Logo" class="w-full h-full object-cover rounded-lg" />
                                    {:else}
                                        <div class="w-6 h-6 rounded-full border-2 border-dashed border-white/50 animate-spin-slow"></div>
                                    {/if}
                                </div>
                                <div>
                                    <h3 class="font-semibold text-lg">{organization.name || 'Unnamed Company'}</h3>
                                    <p class="text-sm text-muted-foreground">{organization.description || 'No description'}</p>
                                </div>
                            </div>
                            <button class="p-2 hover:bg-accent rounded-full transition-colors">
                                <Pencil class="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>

                        <div class="space-y-4">
                            <h4 class="font-medium text-sm">Personal Information</h4>
                            <div class="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Phone</span>
                                    <span class="text-sm font-medium flex items-center gap-1">
                                        {organization.phone || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Added Date</span>
                                    <span class="text-sm font-medium flex items-center gap-1">
                                        <Calendar class="w-3 h-3" /> {organization.createdAt ? new Date(organization.createdAt).toLocaleDateString() : '-'}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Region</span>
                                    <span class="text-sm font-medium">{organization.region || '-'}</span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Email address</span>
                                    <span class="text-sm font-medium flex items-center gap-1">
                                        <Mail class="w-3 h-3" /> {organization.email || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">NDIS Registration</span>
                                    <span class="text-sm font-medium flex items-center gap-1">
                                        <FileText class="w-3 h-3" /> {registrationDetails.ndisRegistration || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">ACN</span>
                                    <span class="text-sm font-medium">{registrationDetails.acn || '-'}</span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Website</span>
                                    <span class="text-sm font-medium flex items-center gap-1">
                                        <Globe class="w-3 h-3" /> {organization.website || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Timezone</span>
                                    <span class="text-sm font-medium flex items-center gap-1">
                                        <Clock class="w-3 h-3" /> {organization.timezone || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">ABN</span>
                                    <span class="text-sm font-medium">{registrationDetails.abn || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Business Address Card -->
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm h-fit">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="font-semibold">Business Address</h3>
                            <button class="p-2 hover:bg-accent rounded-full transition-colors">
                                <Pencil class="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>

                        <div class="rounded-lg bg-muted/30 p-4">
                            <h4 class="font-medium text-sm mb-4">Address</h4>
                            <div class="grid grid-cols-2 gap-y-4 gap-x-8">
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Country</span>
                                    <span class="text-sm font-medium">{address.country || '-'}</span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Street</span>
                                    <span class="text-sm font-medium">{address.street || '-'}</span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">City</span>
                                    <span class="text-sm font-medium">{address.city || '-'}</span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Office Name</span>
                                    <span class="text-sm font-medium">{address.officeName || '-'}</span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">State</span>
                                    <span class="text-sm font-medium">{address.state || '-'}</span>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground block mb-1">Postal Code</span>
                                    <span class="text-sm font-medium">{address.postalCode || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    {:else if activeTab === 'users'}
        <div in:fade class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-semibold">Users & Permissions</h2>
                    <p class="text-sm text-muted-foreground">Manage users and their roles within the organization.</p>
                </div>
                <button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 gap-2">
                    <Plus class="w-4 h-4" />
                    Add User
                </button>
            </div>

            <div class="rounded-md border bg-card">
                <div class="relative w-full overflow-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="text-muted-foreground bg-muted/50 font-medium">
                            <tr>
                                <th class="h-12 px-4 align-middle">Name</th>
                                <th class="h-12 px-4 align-middle">Email</th>
                                <th class="h-12 px-4 align-middle">Role</th>
                                <th class="h-12 px-4 align-middle">Status</th>
                                <th class="h-12 px-4 align-middle text-right">Actions</th>
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
                                            Active
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
            <h3 class="text-lg font-semibold">Coming Soon</h3>
            <p class="text-muted-foreground mt-2 max-w-sm">
                This section is currently under development. Check back later for updates.
            </p>
        </div>
    {/if}
</div>
