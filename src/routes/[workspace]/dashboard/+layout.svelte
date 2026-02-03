<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { User, LayoutDashboard, Briefcase, Ticket, Settings, LogOut, Mail, Shield, Bell, BellOff, Moon, Sun, Monitor, Languages, Check, ChevronRight, HelpCircle, Heart } from 'lucide-svelte';
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    import { currentLang, translations } from '$lib/i18n';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    $: t = translations[$currentLang];
    $: workspace = $page.params.workspace;
    $: path = $page.url.pathname;
    
    let clientRole = '';
    let theme: 'light' | 'dark' | 'system' = 'system';

    onMount(async () => {
        const { data: sessionData } = await authClient.getSession();
        if (sessionData?.user) {
             // @ts-ignore
             if (sessionData.user.role) clientRole = sessionData.user.role;
        } else {
             // If NO session client-side, redirect to login
             // This is the safety net since we removed server-side block
             goto(`/${workspace}`);
        }

        // Initialize theme
        if ('theme' in localStorage) {
            theme = localStorage.getItem('theme') as 'light' | 'dark';
        } else {
            theme = 'system';
        }
        applyTheme(theme);
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
    
    // Client Menu Items
    $: menuItems = [
        { href: `/${workspace}/dashboard`, label: t.dashboard.menu.overview, icon: LayoutDashboard },
        { href: `/${workspace}/dashboard/projects`, label: t.dashboard.menu.projects, icon: Briefcase },
        { href: `/${workspace}/dashboard/support`, label: t.dashboard.menu.support, icon: Ticket },
        { href: `/${workspace}/dashboard/settings`, label: t.dashboard.menu.settings, icon: Settings },
        { href: `/${workspace}/dashboard/contact`, label: t.dashboard.menu.contact, icon: Mail },
        ...( (data.user?.role === 'admin' || clientRole === 'admin') ? [{ href: `/${workspace}/admin`, label: t.dashboard.menu.admin_panel, icon: Shield }] : [])
    ];

    async function handleLogout() {
        await authClient.signOut();
        goto(`/${workspace}`);
    }

    let isProfileOpen = false;
    let isNotificationsOpen = false;
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
        isNotificationsOpen = false;
        isThemeMenuOpen = false;
        isLangMenuOpen = false;
    }

    function closeProfileMenu() {
        isProfileOpen = false;
        isThemeMenuOpen = false;
        isLangMenuOpen = false;
    }

    function closeNotificationsMenu() {
        isNotificationsOpen = false;
    }
</script>

<div class="flex h-screen bg-background">
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
                    class="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors {path === item.href || (item.href !== '/dashboard' && item.href !== `/${workspace}/dashboard` && path.startsWith(item.href)) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
                >
                    <item.icon class="w-4 h-4" />
                    {item.label}
                </a>
            {/each}
        </nav>

        <div class="p-4 border-t space-y-4">
            <a 
                href="mailto:support@allianzy.us" 
                class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-2"
            >
                <HelpCircle class="w-4 h-4" />
                {t.dashboard.footer.help_support}
            </a>
            <div class="text-xs text-muted-foreground px-2 space-y-1">
                <p>&copy; Allianzy. {t.dashboard.footer.rights}</p>
                <p class="flex items-center gap-1">
                    {t.dashboard.footer.made_with_love} <Heart class="w-3 h-3 text-red-500 fill-current" />
                </p>
            </div>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 bg-background border-b flex items-center justify-between px-8 shrink-0">
            <h1 class="text-lg font-semibold">Dashboard</h1>
            <div class="flex items-center gap-4">
                <!-- Notifications -->
                 <div class="relative" use:clickOutside on:click_outside={closeNotificationsMenu}>
                    <button 
                        on:click={() => isNotificationsOpen = !isNotificationsOpen}
                        class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <Bell class="w-4 h-4 text-muted-foreground" />
                    </button>

                    {#if isNotificationsOpen}
                        <div class="absolute right-0 mt-2 w-80 rounded-lg border bg-popover shadow-lg z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                            <div class="px-4 py-2 border-b">
                                <h3 class="font-semibold text-sm">{t.dashboard.header.notifications.title}</h3>
                            </div>
                            <div class="p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                                <BellOff class="w-8 h-8 mb-2 opacity-50" />
                                <p class="text-sm">{t.dashboard.header.notifications.empty}</p>
                            </div>
                        </div>
                    {/if}
                 </div>

                 <div class="relative" use:clickOutside on:click_outside={closeProfileMenu}>
                    <button 
                        on:click={() => isProfileOpen = !isProfileOpen}
                        class="w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden bg-muted"
                    >
                        {#if data.user?.image}
                            <img src={data.user.image} alt="Avatar" class="w-full h-full object-cover" />
                        {:else}
                            <User class="w-4 h-4 text-muted-foreground" />
                        {/if}
                    </button>
                    
                    {#if isProfileOpen}
                        <div class="absolute right-0 mt-2 w-64 rounded-lg border bg-popover shadow-lg z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                            <div class="px-4 py-2 border-b mb-2">
                                <p class="text-sm font-medium leading-none">{data.user?.firstName || data.user?.lastName ? `${data.user.firstName || ''} ${data.user.lastName || ''}` : 'Usuario'}</p>
                                <p class="text-xs text-muted-foreground mt-1">{data.user?.email || ''}</p>
                            </div>

                            <a 
                                href="/dashboard/profile" 
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
