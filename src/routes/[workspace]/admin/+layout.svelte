<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { User, LayoutDashboard, Briefcase, Calendar, Ticket, Settings, LogOut, MessageSquare, Mail, Users, Package, Home } from 'lucide-svelte';
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';

    $: workspace = $page.params.workspace;
    $: path = $page.url.pathname;

    onMount(async () => {
        console.log('[ADMIN-LAYOUT] Mounted. Path:', path);
        const { data: session } = await authClient.getSession();
        
        if (!session || !session.user) {
            console.log('Admin Layout: No session found, redirecting to login');
            goto(`/${workspace}/auth/login`);
            return;
        }

        console.log('Admin Layout: Verifying role for', session.user.email);

        // Verify admin role
        try {
            const roleResponse = await fetch('/api/users/get-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: session.user.email })
            });
            
            if (roleResponse.ok) {
                const { role } = await roleResponse.json();
                console.log('Admin Layout: User role is', role);
                if (role !== 'admin') {
                    console.warn('Admin Layout: Access denied for role', role);
                    // Redirect non-admins to client dashboard
                    goto(`/${workspace}/dashboard`);
                } else {
                    console.log('Admin Layout: Access granted');
                }
            } else {
                const errorText = await roleResponse.text();
                console.error('Admin Layout: Failed to fetch role', roleResponse.status, errorText);
                goto(`/${workspace}/dashboard`);
            }
        } catch (error) {
            console.error('Role verification failed:', error);
            goto(`/${workspace}/dashboard`);
        }
    });
    
    $: menuItems = [
        { href: `/${workspace}/dashboard`, label: 'Vista Cliente', icon: Home },
        { href: `/${workspace}/admin`, label: 'Overview', icon: LayoutDashboard },
        { href: `/${workspace}/admin/users`, label: 'Usuarios', icon: Users },
        { href: `/${workspace}/admin/services`, label: 'Servicios', icon: Package },
        { href: `/${workspace}/admin/projects`, label: 'Proyectos', icon: Briefcase },
        { href: `/${workspace}/admin/support`, label: 'Soporte', icon: Ticket },
        { href: `/${workspace}/admin/settings`, label: 'Configuraciones', icon: Settings },
    ];

    function clearAllCookies() {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = (eqPos > -1 ? cookie.slice(0, eqPos) : cookie).trim();
            if (!name) continue;
            document.cookie = `${name}=; Max-Age=0; path=/;`;
        }
    }

    async function handleLogout() {
        try {
            await authClient.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
        clearAllCookies();
        goto(`/${workspace}`);
    }

    let isProfileOpen = false;
</script>

<svelte:head>
    <title>Allianzy Inc</title>
</svelte:head>

<div class="flex h-screen bg-gray-50/50">
    <!-- Sidebar -->
    <aside class="w-64 bg-background border-r flex flex-col">
        <div class="p-6 border-b h-16 flex items-center justify-between">
            <h2 class="text-lg font-bold tracking-tight uppercase truncate">{workspace}</h2>
            <span class="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">ADMIN</span>
        </div>
        <nav class="flex-1 p-4 space-y-1">
            {#each menuItems as item}
                <a 
                    href={item.href}
                    class="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors {path === item.href || (item.href !== `/${workspace}/admin` && path.startsWith(item.href)) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
                >
                    <item.icon class="w-4 h-4" />
                    {item.label}
                </a>
            {/each}
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 bg-background border-b flex items-center justify-between px-8 shrink-0">
            <h1 class="text-lg font-semibold">Admin Dashboard</h1>
            <div class="flex items-center gap-4">
                 <div class="relative">
                    <button 
                        on:click={() => isProfileOpen = !isProfileOpen}
                        class="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <User class="w-4 h-4 text-muted-foreground" />
                    </button>
                    
                    {#if isProfileOpen}
                        <div class="absolute right-0 mt-2 w-48 rounded-md border bg-popover shadow-md z-50 py-1">
                            <a href="/admin/profile" class="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
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
