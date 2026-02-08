<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { 
        Wallet, Calendar, Filter, Plus, ChevronRight, 
        LayoutDashboard, CreditCard, FileText, PieChart, Users, Tags, ArrowRight
    } from 'lucide-svelte';
    import { financeRole, canViewFinance } from '$lib/stores/finance-role.store';
    import { financeService } from '$lib/services/finance.service';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    // Initialize mock data
    onMount(() => {
        financeService.initMockData();
    });

    $: workspace = $page.params.workspace;
    $: path = $page.url.pathname;
    
    // URL Params Sync
    $: searchParams = $page.url.searchParams;
    $: period = searchParams.get('period') || 'month';
    $: currency = searchParams.get('currency') || 'USD';

    function updateFilter(key: string, value: string) {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        goto(url.toString(), { keepFocus: true, noScroll: true });
    }

    // Sub-navigation items
    $: navItems = [
        { href: `/${workspace}/admin/finance`, label: 'Overview', icon: LayoutDashboard, exact: true },
        { href: `/${workspace}/admin/finance/transactions`, label: 'Transactions', icon: CreditCard },
        { href: `/${workspace}/admin/finance/recurring`, label: 'Recurring', icon: Calendar },
        { href: `/${workspace}/admin/finance/obligations`, label: 'Obligations', icon: FileText },
        { href: `/${workspace}/admin/finance/forecast`, label: 'Forecast', icon: PieChart },
        { href: `/${workspace}/admin/finance/vendors`, label: 'Vendors', icon: Users },
        { href: `/${workspace}/admin/finance/categories`, label: 'Categories', icon: Tags },
    ];

    // Quick Add Drawer State
    let isQuickAddOpen = false;
    let activeDrawer: 'transaction' | 'recurring' | 'obligation' | null = null;

    function openQuickAdd() {
        isQuickAddOpen = !isQuickAddOpen;
    }

    function openDrawer(type: 'transaction' | 'recurring' | 'obligation') {
        activeDrawer = type;
        isQuickAddOpen = false;
    }

    function closeDrawer() {
        activeDrawer = null;
    }
</script>

{#if !canViewFinance($financeRole)}
    <div class="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-background text-center p-8">
        <div class="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 text-red-600 dark:text-red-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h1 class="text-2xl font-bold mb-2">Access Denied</h1>
        <p class="text-muted-foreground max-w-md">
            You do not have permission to view the Finance module. 
            Please contact your administrator if you believe this is a mistake.
        </p>
    </div>
{:else}
    <div class="flex flex-col h-full bg-background min-h-[calc(100vh-4rem)]">
        <!-- Finance Topbar -->
        <div class="border-b bg-card px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
            <div class="flex items-center gap-2 text-muted-foreground">
                <Wallet class="w-5 h-5" />
                <span class="font-semibold text-foreground">Finance</span>
                <ChevronRight class="w-4 h-4" />
                <span class="text-sm font-medium">
                    {navItems.find(i => i.exact ? path === i.href : path.startsWith(i.href))?.label || 'Overview'}
                </span>
            </div>
            
            <div class="flex items-center gap-3 flex-wrap">
                <!-- Period Filter -->
                <div class="flex items-center bg-background border rounded-md px-2 py-1.5 shadow-sm">
                    <Calendar class="w-4 h-4 mr-2 text-muted-foreground" />
                    <select 
                        value={period} 
                        on:change={(e) => updateFilter('period', e.currentTarget.value)}
                        class="bg-transparent text-sm border-none focus:ring-0 cursor-pointer outline-none min-w-[100px]"
                    >
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>

                <!-- Currency Filter -->
                <div class="flex items-center bg-background border rounded-md px-2 py-1.5 shadow-sm">
                    <span class="text-xs font-bold text-muted-foreground mr-2">CUR</span>
                    <select 
                        value={currency} 
                        on:change={(e) => updateFilter('currency', e.currentTarget.value)}
                        class="bg-transparent text-sm border-none focus:ring-0 cursor-pointer outline-none min-w-[60px]"
                    >
                        <option value="USD">USD</option>
                        <option value="UYU">UYU</option>
                        <option value="ARS">ARS</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                    </select>
                </div>

                <!-- Quick Add -->
                <div class="relative">
                    <button 
                        class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
                        on:click={openQuickAdd}
                    >
                        <Plus class="w-4 h-4" />
                        Quick Add
                    </button>
                    
                    {#if isQuickAddOpen}
                        <div class="absolute right-0 top-full mt-2 w-56 bg-card border rounded-md shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2">
                            <button on:click={() => goto(`/${workspace}/admin/finance/transactions?action=new`)} class="w-full text-left px-4 py-2.5 hover:bg-muted text-sm flex items-center gap-2">
                                <CreditCard class="w-4 h-4 text-muted-foreground" /> New Transaction
                            </button>
                            <button on:click={() => openDrawer('recurring')} class="w-full text-left px-4 py-2.5 hover:bg-muted text-sm flex items-center gap-2">
                                <Calendar class="w-4 h-4 text-muted-foreground" /> New Recurring Payment
                            </button>
                            <button on:click={() => openDrawer('obligation')} class="w-full text-left px-4 py-2.5 hover:bg-muted text-sm flex items-center gap-2">
                                <FileText class="w-4 h-4 text-muted-foreground" /> New Obligation
                            </button>
                        </div>
                        
                        <!-- Backdrop for dropdown -->
                        <div class="fixed inset-0 z-40" on:click={() => isQuickAddOpen = false}></div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Sub Navigation -->
        <div class="border-b bg-muted/30 px-6 py-1 overflow-x-auto">
            <div class="flex items-center gap-1 min-w-max">
                {#each navItems as item}
                    <a 
                        href={item.href}
                        class="px-3 py-2 text-sm font-medium rounded-md transition-colors border-b-2 border-transparent hover:text-primary {
                            (item.exact ? path === item.href : path.startsWith(item.href)) 
                            ? 'text-primary border-primary bg-primary/5' 
                            : 'text-muted-foreground'
                        }"
                    >
                        <span class="flex items-center gap-2">
                            <item.icon class="w-4 h-4" />
                            {item.label}
                        </span>
                    </a>
                {/each}
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 p-6 overflow-auto">
            <slot />
        </div>
    </div>

    <!-- Right-side Drawer (Shared) -->
    {#if activeDrawer}
        <div class="fixed inset-0 z-50 flex justify-end">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" on:click={closeDrawer} transition:fade={{ duration: 200 }}></div>
            
            <!-- Drawer Content -->
            <div class="relative w-full max-w-md bg-card h-full border-l shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold">
                        {#if activeDrawer === 'transaction'}New Transaction
                        {:else if activeDrawer === 'recurring'}New Recurring Payment
                        {:else if activeDrawer === 'obligation'}New Obligation
                        {/if}
                    </h2>
                    <button on:click={closeDrawer} class="p-2 hover:bg-muted rounded-full">
                        <Plus class="w-5 h-5 rotate-45" />
                    </button>
                </div>
                
                <!-- Placeholder Form Content -->
                <div class="space-y-4">
                    <div class="p-4 border rounded-md bg-muted/50 text-center text-sm text-muted-foreground">
                        <p>Form for <strong>{activeDrawer}</strong> creation goes here.</p>
                        <p class="mt-2">This is a shared drawer component from the layout.</p>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Name / Description</label>
                        <input type="text" class="w-full p-2 border rounded-md bg-background" placeholder="Enter details..." />
                    </div>
                    
                    <div class="pt-4 flex justify-end gap-3">
                        <button on:click={closeDrawer} class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md">Cancel</button>
                        <button on:click={closeDrawer} class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md">Save Item</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/if}

<style>
    /* Custom scrollbar for horizontal nav */
    ::-webkit-scrollbar {
        height: 4px;
        width: 4px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.1);
        border-radius: 4px;
    }
</style>