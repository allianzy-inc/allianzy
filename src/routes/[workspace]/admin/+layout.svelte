<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { User, LayoutDashboard, Briefcase, Calendar, Ticket, Settings, LogOut, MessageSquare, Mail, Users, Package, Home, Moon, Sun, Monitor, Languages, Check, ChevronRight, BadgeDollarSign } from 'lucide-svelte';
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    import { currentLang, translations } from '$lib/i18n';

    import { financeRole } from '$lib/stores/finance-role.store';

    $: t = translations[$currentLang];
    $: workspace = $page.params.workspace;
    $: path = $page.url.pathname;
    
    // Mock RBAC visibility
    $: showFinance = ['admin', 'accountant', 'client_owner'].includes($financeRole);
    
    let theme: 'light' | 'dark' | 'system' = 'system';
    let user: any = null;

    onMount(async () => {
        console.log('[ADMIN-LAYOUT] Mounted. Path:', path);
        
        // Initialize theme
        if ('theme' in localStorage) {
            theme = localStorage.getItem('theme') as 'light' | 'dark';
        } else {
            theme = 'system';
        }
        applyTheme(theme);

        const { data: session } = await authClient.getSession();
        
        if (!session || !session.user) {
            console.log('Admin Layout: No session found, redirecting to login');
            goto(`/${workspace}/auth/login`);
            return;
        }

        user = session.user;
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

    function applyTheme(t: 'light' | 'dark' | 'system') {
        theme = t;
        if (t === 'system') {
            localStorage.removeItem('theme');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } else {
            localStorage.setItem('theme', t);
            if (t === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }
    
    $: menuItems = [
        { href: `/${workspace}/dashboard`, label: 'Vista Cliente', icon: Home },
        { href: `/${workspace}/admin`, label: 'Overview', icon: LayoutDashboard },
        { href: `/${workspace}/admin/users`, label: 'Usuarios', icon: Users },
        { href: `/${workspace}/admin/services`, label: 'Servicios', icon: Package },
        { href: `/${workspace}/admin/projects`, label: 'Proyectos', icon: Briefcase },
        ...(showFinance ? [{ href: `/${workspace}/admin/finance`, label: 'Finance', icon: BadgeDollarSign }] : []),
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
        // Force full reload to ensure server state is cleared
        window.location.href = `/${workspace}`;
    }

    let isProfileOpen = false;
    let isThemeMenuOpen = false;
    let isLangMenuOpen = false;

    function clickOutside(node: HTMLElement) {
        const handleClick = (event: MouseEvent) => {
            if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
                node.dispatchEvent(new CustomEvent('click_outside', { detail: node }));
            }
        };

        document.addEventListener('click', handleClick, true);

        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        };
    }

    function closeMenus() {
        isProfileOpen = false;
        isThemeMenuOpen = false;
        isLangMenuOpen = false;
    }

    function closeProfileMenu() {
        isProfileOpen = false;
        isThemeMenuOpen = false;
        isLangMenuOpen = false;
    }
</script>

<svelte:head>
    <title>Allianzy Inc - Admin</title>
</svelte:head>

<div class="flex h-screen bg-background text-foreground">
    <!-- Sidebar -->
    <aside class="w-64 bg-background border-r flex flex-col">
        <div class="p-6 border-b h-16 flex items-center justify-between">
            {#if workspace === 'allianzy'}
                <a href="/{workspace}/admin" class="block">
                    <img src={logoLight} alt="Allianzy" class="h-8 dark:hidden" />
                    <img src={logoDark} alt="Allianzy" class="h-8 hidden dark:block" />
                </a>
            {:else}
                <h2 class="text-lg font-bold tracking-tight uppercase truncate">{workspace}</h2>
            {/if}
            <span class="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded ml-2">ADMIN</span>
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
                 <div class="relative" use:clickOutside on:click_outside={closeProfileMenu}>
                    <button 
                        on:click={() => isProfileOpen = !isProfileOpen}
                        class="w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden bg-muted"
                    >
                        {#if user?.image}
                            <img src={user.image} alt="Avatar" class="w-full h-full object-cover" />
                        {:else}
                            <User class="w-4 h-4 text-muted-foreground" />
                        {/if}
                    </button>
                    
                    {#if isProfileOpen}
                        <div class="absolute right-0 mt-2 w-64 rounded-lg border bg-popover shadow-lg z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                            <div class="px-4 py-2 border-b mb-2">
                                <p class="text-sm font-medium leading-none">{user?.firstName || user?.lastName ? `${user.firstName || ''} ${user.lastName || ''}` : 'Administrador'}</p>
                                <p class="text-xs text-muted-foreground mt-1">{user?.email || ''}</p>
                            </div>

                            <a 
                                href="/{workspace}/admin/profile" 
                                class="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                on:click={closeMenus}
                            >
                                <User class="w-4 h-4 mr-2" />
                                {t.dashboard.header.profile.account}
                            </a>

                            <!-- Theme Submenu -->
                            <div class="relative">
                                <button 
                                    class="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                    on:click|stopPropagation={() => isThemeMenuOpen = !isThemeMenuOpen}
                                >
                                    <div class="flex items-center">
                                        {#if theme === 'light'}
                                            <Sun class="w-4 h-4 mr-2" />
                                        {:else if theme === 'dark'}
                                            <Moon class="w-4 h-4 mr-2" />
                                        {:else}
                                            <Monitor class="w-4 h-4 mr-2" />
                                        {/if}
                                        {t.dashboard.header.profile.theme.title}
                                    </div>
                                    <ChevronRight class="w-4 h-4 transition-transform {isThemeMenuOpen ? 'rotate-90' : ''}" />
                                </button>
                                {#if isThemeMenuOpen}
                                    <div class="bg-muted/30 py-1">
                                        <button 
                                            class="w-full flex items-center px-8 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                            on:click={() => applyTheme('light')}
                                        >
                                            <Sun class="w-4 h-4 mr-2 opacity-70" />
                                            {t.dashboard.header.profile.theme.light}
                                            {#if theme === 'light'} <Check class="w-3 h-3 ml-auto text-primary" /> {/if}
                                        </button>
                                        <button 
                                            class="w-full flex items-center px-8 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                            on:click={() => applyTheme('dark')}
                                        >
                                            <Moon class="w-4 h-4 mr-2 opacity-70" />
                                            {t.dashboard.header.profile.theme.dark}
                                            {#if theme === 'dark'} <Check class="w-3 h-3 ml-auto text-primary" /> {/if}
                                        </button>
                                        <button 
                                            class="w-full flex items-center px-8 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                            on:click={() => applyTheme('system')}
                                        >
                                            <Monitor class="w-4 h-4 mr-2 opacity-70" />
                                            {t.dashboard.header.profile.theme.system}
                                            {#if theme === 'system'} <Check class="w-3 h-3 ml-auto text-primary" /> {/if}
                                        </button>
                                    </div>
                                {/if}
                            </div>

                            <!-- Language Submenu -->
                            <div class="relative">
                                <button 
                                    class="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                    on:click|stopPropagation={() => isLangMenuOpen = !isLangMenuOpen}
                                >
                                    <div class="flex items-center">
                                        <Languages class="w-4 h-4 mr-2" />
                                        {t.dashboard.header.profile.language.title}
                                    </div>
                                    <ChevronRight class="w-4 h-4 transition-transform {isLangMenuOpen ? 'rotate-90' : ''}" />
                                </button>
                                {#if isLangMenuOpen}
                                    <div class="bg-muted/30 py-1">
                                        <button 
                                            class="w-full flex items-center px-8 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                            on:click={() => $currentLang = 'en'}
                                        >
                                            <span class="w-4 mr-2 text-center text-[10px] font-bold">EN</span>
                                            {t.dashboard.header.profile.language.en}
                                            {#if $currentLang === 'en'} <Check class="w-3 h-3 ml-auto text-primary" /> {/if}
                                        </button>
                                        <button 
                                            class="w-full flex items-center px-8 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                            on:click={() => $currentLang = 'es'}
                                        >
                                            <span class="w-4 mr-2 text-center text-[10px] font-bold">ES</span>
                                            {t.dashboard.header.profile.language.es}
                                            {#if $currentLang === 'es'} <Check class="w-3 h-3 ml-auto text-primary" /> {/if}
                                        </button>
                                    </div>
                                {/if}
                            </div>

                            <div class="border-t mt-2 pt-2">
                                <button 
                                    on:click={handleLogout} 
                                    class="w-full flex items-center px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 text-red-500 transition-colors"
                                >
                                    <LogOut class="w-4 h-4 mr-2" />
                                    {t.dashboard.header.profile.logout}
                                </button>
                            </div>
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