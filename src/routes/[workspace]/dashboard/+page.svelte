<script lang="ts">
    import { authClient } from '$lib/auth-client';
    import { onMount } from 'svelte';
    import { CheckCircle, Clock, AlertCircle } from 'lucide-svelte';
    import { page } from '$app/stores';

    const workspace = $page.params.workspace;
    let session: any = null;
    let loading = true;
    let userRole = 'client'; // Default to client as requested

    onMount(async () => {
        try {
            const { data } = await authClient.getSession();
            session = data?.session;
            if (data?.user) {
                // @ts-ignore
                if (data.user.role) userRole = data.user.role;
            }
        } catch (e) {
            console.error('Failed to get session', e);
        } finally {
            loading = false;
        }
    });

    export let data;
    
    // Use real data if available, otherwise fall back to mock
    $: clientServices = data.services?.length ? data.services : [
        { name: 'Website Maintenance', status: 'Active', renewal: '2023-11-01', price: '$500/mo' },
        { name: 'SEO Optimization', status: 'Pending Payment', renewal: '-', price: '$300/mo' }
    ];

    const quickActions = [
        { name: 'Book Meeting', href: `/${workspace}/schedule`, icon: 'Calendar' },
        { name: 'Open Ticket', href: `/${workspace}/tickets`, icon: 'MessageSquare' },
        { name: 'View Invoices', href: `/${workspace}/portal`, icon: 'FileText' }
    ];
</script>

{#if loading}
    <div class="flex items-center justify-center h-64">
        <p class="text-muted-foreground">Loading dashboard...</p>
    </div>
{:else}
    {#if userRole === 'client'}
        <!-- Client View -->
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Welcome back, {session?.user?.name || 'Client'}</h2>
                    <p class="text-muted-foreground">Here is an overview of your {workspace === 'allianzy' ? 'Allianzy' : 'Beltix'} services.</p>
                </div>
                <div class="flex gap-2">
                    <a href="/{workspace}/tickets/new" class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
                        New Request
                    </a>
                </div>
            </div>
            
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <!-- Services Status -->
                <div class="bg-card border rounded-lg p-6 shadow-sm col-span-2">
                    <h3 class="text-lg font-semibold mb-4">Your Services</h3>
                    <div class="space-y-4">
                        {#each clientServices as service}
                            <div class="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                                <div>
                                    <p class="font-medium">{service.name}</p>
                                    <p class="text-sm text-muted-foreground">{service.price}</p>
                                </div>
                                <div class="text-right">
                                    <span class="inline-block px-2 py-1 text-xs font-medium rounded-full {service.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                                        {service.status}
                                    </span>
                                    {#if service.status === 'Pending Payment'}
                                        <button class="block mt-2 text-xs text-primary font-medium hover:underline">Pay Now</button>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="bg-card border rounded-lg p-6 shadow-sm">
                     <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
                     <div class="grid gap-4">
                        {#each quickActions as action}
                            <a href={action.href} class="p-3 border rounded-md hover:bg-muted transition-colors flex items-center gap-3">
                                <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <!-- Simple icon placeholder -->
                                    <span class="text-xs font-bold">{action.name[0]}</span>
                                </div>
                                <span class="font-medium text-sm">{action.name}</span>
                            </a>
                        {/each}
                     </div>
                </div>
            </div>

            <!-- Recent Activity / Notifications -->
            <div class="bg-card rounded-lg border shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-6">Recent Activity</h3>
                <div class="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    <div class="relative">
                        <div class="absolute -left-[2.35rem] w-6 h-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                            <CheckCircle class="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                            <p class="text-sm font-medium">Project "Alpha" approved</p>
                            <p class="text-xs text-muted-foreground">Today, 10:00 AM</p>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="absolute -left-[2.35rem] w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                            <AlertCircle class="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                            <p class="text-sm font-medium">Ticket #1234 updated</p>
                            <p class="text-xs text-muted-foreground">Yesterday, 2:15 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <!-- Admin View (Original Content) -->
        <div class="space-y-8">
            <div class="flex items-center justify-between">
                 <h2 class="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
                 <span class="px-2 py-1 bg-zinc-100 rounded text-xs">Admin View</span>
            </div>
            <div class="grid gap-4 md:grid-cols-3">
                <div class="p-6 bg-card rounded-lg border shadow-sm">
                    <div class="flex items-center justify-between pb-2">
                        <h3 class="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                        <span class="text-2xl font-bold">$45,231.89</span>
                    </div>
                    <p class="text-xs text-muted-foreground">+20.1% from last month</p>
                </div>
                <div class="p-6 bg-card rounded-lg border shadow-sm">
                     <div class="flex items-center justify-between pb-2">
                        <h3 class="text-sm font-medium text-muted-foreground">Active Cases</h3>
                        <span class="text-2xl font-bold">12</span>
                    </div>
                     <p class="text-xs text-muted-foreground">+2 since last week</p>
                </div>
                <div class="p-6 bg-card rounded-lg border shadow-sm">
                     <div class="flex items-center justify-between pb-2">
                        <h3 class="text-sm font-medium text-muted-foreground">Pending Actions</h3>
                        <span class="text-2xl font-bold">4</span>
                    </div>
                     <p class="text-xs text-muted-foreground">Requires attention</p>
                </div>
            </div>
            
            <!-- Status Timeline -->
            <div class="bg-card rounded-lg border shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-6">Recent Activity</h3>
                <div class="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    <div class="relative">
                        <div class="absolute -left-[2.35rem] w-6 h-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                            <CheckCircle class="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                            <p class="text-sm font-medium">Project "Alpha" approved</p>
                            <p class="text-xs text-muted-foreground">Today, 10:00 AM</p>
                        </div>
                    </div>
                     <div class="relative">
                        <div class="absolute -left-[2.35rem] w-6 h-6 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center">
                            <Clock class="w-3 h-3 text-yellow-600" />
                        </div>
                        <div>
                            <p class="text-sm font-medium">New intake request received</p>
                            <p class="text-xs text-muted-foreground">Yesterday, 4:30 PM</p>
                        </div>
                    </div>
                     <div class="relative">
                        <div class="absolute -left-[2.35rem] w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                            <AlertCircle class="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                            <p class="text-sm font-medium">Provider assigned to "Beta"</p>
                            <p class="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/if}
