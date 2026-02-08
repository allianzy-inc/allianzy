<script lang="ts">
    import { page } from '$app/stores';
    import { 
        CreditCard, Calendar, FileText, PieChart, Users, Tags, ArrowRight,
        TrendingUp, TrendingDown, DollarSign
    } from 'lucide-svelte';

    $: workspace = $page.params.workspace;

    $: modules = [
        { 
            title: 'Transactions', 
            description: 'Manage income, expenses, and transfers.', 
            icon: CreditCard, 
            href: `/${workspace}/admin/finance/transactions`,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        { 
            title: 'Recurring Payments', 
            description: 'Track subscriptions and repeat bills.', 
            icon: Calendar, 
            href: `/${workspace}/admin/finance/recurring`,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        { 
            title: 'Obligations', 
            description: 'Tax and compliance deadlines.', 
            icon: FileText, 
            href: `/${workspace}/admin/finance/obligations`,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        { 
            title: 'Budgets & Forecast', 
            description: 'Plan financial future and limits.', 
            icon: PieChart, 
            href: `/${workspace}/admin/finance/forecast`,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        { 
            title: 'Vendors', 
            description: 'Manage supplier details and contacts.', 
            icon: Users, 
            href: `/${workspace}/admin/finance/vendors`,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10'
        },
        { 
            title: 'Categories', 
            description: 'Organize financial data structure.', 
            icon: Tags, 
            href: `/${workspace}/admin/finance/categories`,
            color: 'text-pink-500',
            bg: 'bg-pink-500/10'
        },
    ];
</script>

<div class="space-y-8">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Financial Overview</h1>
        <p class="text-muted-foreground mt-2">Manage your organization's financial health, obligations, and planning.</p>
    </div>

    <!-- Quick Stats Row (Mock) -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="tracking-tight text-sm font-medium">Total Revenue</h3>
                <DollarSign class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="text-2xl font-bold">$45,231.89</div>
            <p class="text-xs text-muted-foreground flex items-center mt-1 text-emerald-500">
                <TrendingUp class="w-3 h-3 mr-1" /> +20.1% from last month
            </p>
        </div>
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="tracking-tight text-sm font-medium">Expenses</h3>
                <CreditCard class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="text-2xl font-bold">$12,345.00</div>
            <p class="text-xs text-muted-foreground flex items-center mt-1 text-red-500">
                <TrendingDown class="w-3 h-3 mr-1" /> +4.5% from last month
            </p>
        </div>
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="tracking-tight text-sm font-medium">Net Income</h3>
                <PieChart class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="text-2xl font-bold">$32,886.89</div>
            <p class="text-xs text-muted-foreground flex items-center mt-1 text-emerald-500">
                <TrendingUp class="w-3 h-3 mr-1" /> +12.3% from last month
            </p>
        </div>
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="tracking-tight text-sm font-medium">Pending Obligations</h3>
                <FileText class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="text-2xl font-bold">3</div>
            <p class="text-xs text-muted-foreground mt-1">
                2 due within 7 days
            </p>
        </div>
    </div>

    <!-- Modules Grid -->
    <div>
        <h2 class="text-xl font-semibold mb-4">Modules</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each modules as module}
                <a href={module.href} class="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                    <div class="flex items-center gap-4">
                        <div class="p-3 rounded-lg {module.bg} {module.color}">
                            <svelte:component this={module.icon} class="w-6 h-6" />
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold group-hover:text-primary transition-colors">{module.title}</h3>
                            <p class="text-sm text-muted-foreground line-clamp-2">{module.description}</p>
                        </div>
                        <ArrowRight class="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                </a>
            {/each}
        </div>
    </div>
</div>