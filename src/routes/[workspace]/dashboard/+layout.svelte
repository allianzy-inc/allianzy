<script lang="ts">
    import { page } from '$app/stores';
    import { User, LayoutDashboard, Briefcase, Ticket, Settings, LogOut, Mail } from 'lucide-svelte';
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import LanguageToggle from '$lib/components/LanguageToggle.svelte';

    $: workspace = $page.params.workspace;
    $: path = $page.url.pathname;
    
    // Client Menu Items
    const menuItems = [
        { href: `/dashboard`, label: 'Overview', icon: LayoutDashboard },
        { href: `/dashboard/projects`, label: 'Proyectos', icon: Briefcase },
        { href: `/dashboard/support`, label: 'Soporte', icon: Ticket },
        { href: `/dashboard/settings`, label: 'Configuraciones', icon: Settings },
        { href: `/dashboard/contact`, label: 'Contactar', icon: Mail },
    ];

    async function handleLogout() {
        await authClient.signOut();
        goto(`/${workspace}`);
    }

    let isProfileOpen = false;
</script>

<div class="flex h-screen bg-gray-50/50">
    <!-- Sidebar -->
    <aside class="w-64 bg-background border-r flex flex-col">
        <div class="p-6 border-b h-16 flex items-center">
            {#if workspace === 'allianzy'}
                <a href="/{workspace}" class="block">
                    <img src={logoLight} alt="Allianzy" class="h-8 dark:hidden" />
                    <img src={logoDark} alt="Allianzy" class="h-8 hidden dark:block" />
                </a>
            {:else}
                <h2 class="text-lg font-bold tracking-tight uppercase truncate">{workspace}</h2>
            {/if}
        </div>
        <nav class="flex-1 p-4 space-y-1">
            {#each menuItems as item}
                <a 
                    href={item.href}
                    class="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors {path === item.href || (item.href !== `/${workspace}/dashboard` && path.startsWith(item.href)) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
                >
                    <item.icon class="w-4 h-4" />
                    {item.label}
                </a>
            {/each}
        </nav>
        <div class="p-4 border-t">
             <button on:click={handleLogout} class="flex w-full items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md">
                <LogOut class="w-4 h-4" />
                Cerrar Sesión
             </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 bg-background border-b flex items-center justify-between px-8 shrink-0">
            <h1 class="text-lg font-semibold">Dashboard</h1>
            <div class="flex items-center gap-4">
                 <div class="relative">
                    <button 
                        on:click={() => isProfileOpen = !isProfileOpen}
                        class="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <User class="w-4 h-4 text-muted-foreground" />
                    </button>
                    
                    {#if isProfileOpen}
                        <div class="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-md z-50 py-1">
                            <div class="px-4 py-2 border-b flex items-center justify-between gap-2">
                                <ThemeToggle />
                                <LanguageToggle />
                            </div>
                            <a href="/dashboard/profile" class="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                                Perfil
                            </a>
                            <button on:click={handleLogout} class="block w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground text-red-500">
                                Cerrar Sesión
                            </button>
                        </div>
                    {/if}
                 </div>
            </div>
        </header>
        <div class="flex-1 overflow-y-auto p-8">
            <slot />
        </div>
    </main>
</div>
