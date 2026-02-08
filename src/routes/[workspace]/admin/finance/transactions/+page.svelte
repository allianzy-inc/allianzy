<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { fade, slide, fly } from 'svelte/transition';
    import { 
        Search, Filter, Plus, MoreHorizontal, ArrowUpDown, 
        FileText, Download, Trash2, Edit2, CheckCircle, AlertCircle, Clock
    } from 'lucide-svelte';
    import { financeService, type Transaction } from '$lib/services/finance.service';
    import { canEditFinance, financeRole } from '$lib/stores/finance-role.store';
    import { goto } from '$app/navigation';

    $: workspace = $page.params.workspace;
    $: canEdit = canEditFinance($financeRole);

    // --- State ---
    let transactions: Transaction[] = [];
    let loading = true;
    let searchQuery = '';
    let sortField: keyof Transaction = 'date';
    let sortDir: 'asc' | 'desc' = 'desc';
    let currentPage = 1;
    let itemsPerPage = 10;

    // --- Drawer State ---
    let isDrawerOpen = false;
    let editingTx: Transaction | null = null;
    let isSaving = false;

    // Form Data
    let formData = {
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        currency: 'USD',
        type: 'expense',
        categoryId: '',
        paymentMethod: 'bank',
        status: 'pending'
    };

    // --- Initialization ---
    onMount(async () => {
        await loadData();
        
        // Check for ?action=new
        const action = $page.url.searchParams.get('action');
        if (action === 'new' && canEdit) {
            openCreateDrawer();
        }
    });

    async function loadData() {
        loading = true;
        try {
            // In a real app, we'd pass server-side filters here
            transactions = await financeService.getTransactions();
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    }

    // --- Computed ---
    $: filteredTransactions = transactions
        .filter(t => {
            const search = searchQuery.toLowerCase();
            const matchesSearch = 
                (t.notes || '').toLowerCase().includes(search) || 
                t.amount.toString().includes(search) ||
                t.status.includes(search);
            return matchesSearch;
        })
        .sort((a, b) => {
            const fieldA = a[sortField];
            const fieldB = b[sortField];
            if (fieldA < fieldB) return sortDir === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    $: totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    $: paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- Actions ---
    function handleSort(field: keyof Transaction) {
        if (sortField === field) {
            sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            sortField = field;
            sortDir = 'asc'; // Default to asc for new field? or desc for date?
            if (field === 'date') sortDir = 'desc';
        }
    }

    function openCreateDrawer() {
        editingTx = null;
        formData = {
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: 0,
            currency: 'USD',
            type: 'expense',
            categoryId: '',
            paymentMethod: 'bank',
            status: 'pending'
        };
        isDrawerOpen = true;
        // Clear action param if present
        if ($page.url.searchParams.get('action')) {
            const url = new URL(window.location.href);
            url.searchParams.delete('action');
            goto(url.toString(), { replaceState: true, noScroll: true });
        }
    }

    function openEditDrawer(tx: Transaction) {
        editingTx = tx;
        formData = {
            date: tx.date.split('T')[0],
            description: tx.notes || '',
            amount: tx.amount,
            currency: tx.currency as string,
            type: tx.type as string,
            categoryId: tx.categoryId,
            paymentMethod: tx.paymentMethod as string,
            status: tx.status as string
        };
        isDrawerOpen = true;
    }

    function closeDrawer() {
        isDrawerOpen = false;
        editingTx = null;
    }

    async function handleSave() {
        if (!formData.description || !formData.amount) return; // Simple validation
        
        isSaving = true;
        try {
            const payload: any = {
                ...formData,
                date: new Date(formData.date).toISOString(),
                notes: formData.description
            };

            if (editingTx) {
                await financeService.updateTransaction(editingTx.id, payload);
            } else {
                await financeService.createTransaction({
                    ...payload,
                    orgId: 'org-1' // Mock org
                });
            }
            await loadData();
            closeDrawer();
        } catch (e) {
            console.error(e);
        } finally {
            isSaving = false;
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await financeService.deleteTransaction(id);
            await loadData();
        } catch (e) {
            console.error(e);
        }
    }

    // --- Helpers ---
    function getStatusColor(status: string) {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'reconciled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    }
</script>

<div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">Transactions</h1>
            <p class="text-muted-foreground text-sm">View and manage all financial transactions.</p>
        </div>
        {#if canEdit}
            <button 
                class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm font-medium"
                on:click={openCreateDrawer}
            >
                <Plus class="w-4 h-4" />
                Add Transaction
            </button>
        {/if}
    </div>

    <!-- Filters & Toolbar -->
    <div class="flex flex-col items-center justify-between bg-card p-4 rounded-lg border">
        <div class="relative w-full sm:w-72">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
                type="text" 
                placeholder="Search by description or amount..." 
                bind:value={searchQuery}
                class="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
        </div>
        <!-- Additional filters could go here -->
    </div>

    <!-- Table -->
    <div class="rounded-lg border bg-card overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                    <tr>
                        <th class="px-6 py-3 cursor-pointer hover:text-foreground" on:click={() => handleSort('date')}>
                            <div class="flex items-center gap-1">
                                Date
                                <ArrowUpDown class="w-3 h-3" />
                            </div>
                        </th>
                        <th class="px-6 py-3">Description</th>
                        <th class="px-6 py-3">Category</th>
                        <th class="px-6 py-3 cursor-pointer hover:text-foreground" on:click={() => handleSort('amount')}>
                            <div class="flex items-center gap-1">
                                Amount
                                <ArrowUpDown class="w-3 h-3" />
                            </div>
                        </th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    {#if loading}
                        {#each Array(5) as _}
                            <tr class="animate-pulse">
                                <td class="px-6 py-4"><div class="h-4 bg-muted rounded w-24"></div></td>
                                <td class="px-6 py-4"><div class="h-4 bg-muted rounded w-48"></div></td>
                                <td class="px-6 py-4"><div class="h-4 bg-muted rounded w-20"></div></td>
                                <td class="px-6 py-4"><div class="h-4 bg-muted rounded w-16"></div></td>
                                <td class="px-6 py-4"><div class="h-6 bg-muted rounded-full w-20"></div></td>
                                <td class="px-6 py-4"><div class="h-8 bg-muted rounded w-8 ml-auto"></div></td>
                            </tr>
                        {/each}
                    {:else if filteredTransactions.length === 0}
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center text-muted-foreground">
                                <div class="flex flex-col items-center justify-center gap-2">
                                    <FileText class="w-8 h-8 opacity-20" />
                                    <p>No transactions found matching your filters.</p>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        {#each paginatedTransactions as tx (tx.id)}
                            <tr class="hover:bg-muted/50 transition-colors group">
                                <td class="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                    {new Date(tx.date).toLocaleDateString()}
                                </td>
                                <td class="px-6 py-4 font-medium">
                                    {tx.notes || 'No description'}
                                    <div class="text-xs text-muted-foreground font-normal">{tx.type} • {tx.paymentMethod}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium">
                                        {tx.categoryId}
                                    </span>
                                </td>
                                <td class="px-6 py-4 font-mono font-medium">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: tx.currency }).format(tx.amount)}
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(tx.status)}">
                                        {tx.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    {#if canEdit}
                                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                class="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                                title="Edit"
                                                on:click={() => openEditDrawer(tx)}
                                            >
                                                <Edit2 class="w-4 h-4" />
                                            </button>
                                            <button 
                                                class="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-md text-muted-foreground transition-colors"
                                                title="Delete"
                                                on:click={() => handleDelete(tx.id)}
                                            >
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </div>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t bg-muted/20 flex items-center justify-between">
            <span class="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
            </span>
            <div class="flex items-center gap-2">
                <button 
                    class="px-3 py-1 text-xs border rounded-md hover:bg-muted disabled:opacity-50"
                    disabled={currentPage === 1}
                    on:click={() => currentPage--}
                >
                    Previous
                </button>
                <button 
                    class="px-3 py-1 text-xs border rounded-md hover:bg-muted disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    on:click={() => currentPage++}
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Drawer (Create/Edit) -->
{#if isDrawerOpen}
    <div class="fixed inset-0 z-50 flex justify-end">
        <!-- Backdrop -->
        <div 
            class="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            on:click={closeDrawer}
            transition:fade={{ duration: 200 }}
        ></div>
        
        <!-- Drawer Panel -->
        <div 
            class="relative w-full max-w-lg bg-card h-full border-l shadow-2xl flex flex-col"
            transition:fly={{ x: 100, duration: 300 }}
        >
            <div class="px-6 py-4 border-b flex items-center justify-between">
                <h2 class="text-lg font-bold">
                    {editingTx ? 'Edit Transaction' : 'New Transaction'}
                </h2>
                <button on:click={closeDrawer} class="p-2 hover:bg-muted rounded-full">
                    <Plus class="w-5 h-5 rotate-45" />
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Date</label>
                        <input type="date" bind:value={formData.date} class="w-full p-2 border rounded-md bg-background" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Status</label>
                        <select bind:value={formData.status} class="w-full p-2 border rounded-md bg-background">
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="reconciled">Reconciled</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium">Description</label>
                    <input type="text" bind:value={formData.description} class="w-full p-2 border rounded-md bg-background" placeholder="e.g. Website Hosting" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Amount</label>
                        <input type="number" bind:value={formData.amount} class="w-full p-2 border rounded-md bg-background" min="0" step="0.01" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Currency</label>
                        <select bind:value={formData.currency} class="w-full p-2 border rounded-md bg-background">
                            <option value="USD">USD</option>
                            <option value="UYU">UYU</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium">Category</label>
                    <!-- Mock categories since we don't have a dropdown wired to store yet for this snippet -->
                    <select bind:value={formData.categoryId} class="w-full p-2 border rounded-md bg-background">
                        <option value="">Select Category...</option>
                        <option value="c1">Client Payments</option>
                        <option value="c3">Contractors</option>
                        <option value="c4">Software Subscriptions</option>
                        <option value="c5">Hosting/VPS</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Type</label>
                        <div class="flex bg-muted rounded-md p-1">
                            <button 
                                class="flex-1 text-xs py-1.5 rounded-sm transition-colors {formData.type === 'income' ? 'bg-background shadow-sm font-medium' : 'hover:bg-background/50'}"
                                on:click={() => formData.type = 'income'}
                            >Income</button>
                            <button 
                                class="flex-1 text-xs py-1.5 rounded-sm transition-colors {formData.type === 'expense' ? 'bg-background shadow-sm font-medium' : 'hover:bg-background/50'}"
                                on:click={() => formData.type = 'expense'}
                            >Expense</button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Payment Method</label>
                        <select bind:value={formData.paymentMethod} class="w-full p-2 border rounded-md bg-background">
                            <option value="bank">Bank Transfer</option>
                            <option value="card">Credit Card</option>
                            <option value="wire">Wire</option>
                            <option value="cash">Cash</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="p-6 border-t bg-muted/10 flex justify-end gap-3">
                <button 
                    on:click={closeDrawer} 
                    class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button 
                    on:click={handleSave} 
                    class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                    disabled={isSaving}
                >
                    {#if isSaving}
                        <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                    {:else}
                        Save Transaction
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}