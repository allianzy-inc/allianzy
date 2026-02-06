<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { User, LayoutDashboard, Briefcase, Ticket, Settings, LogOut, Shield, Bell, BellOff, Moon, Sun, Monitor, Languages, Check, ChevronRight, HelpCircle, Heart, CreditCard, ChevronsUpDown, Building, AlertTriangle, Trash, Menu, X } from 'lucide-svelte';
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    import { currentLang, translations } from '$lib/i18n';
    import { enhance } from '$app/forms';
    import { fade } from 'svelte/transition';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    $: t = translations[$currentLang];
    $: workspace = $page.params.workspace;
    $: path = $page.url.pathname;
    
    let clientRole = '';
    let theme: 'light' | 'dark' | 'system' = 'system';

    // Notifications Logic
    $: notifications = data.notifications || [];
    $: inboxNotifications = notifications.filter((n: any) => !n.archived);
    $: archivedNotifications = notifications.filter((n: any) => n.archived);
    $: unreadCount = inboxNotifications.filter((n: any) => !n.read).length;

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
        { href: `/${workspace}/dashboard/billing`, label: t.dashboard.menu.billing, icon: CreditCard },
        { href: `/${workspace}/dashboard/support`, label: t.dashboard.menu.support, icon: Ticket },
        { href: `/${workspace}/dashboard/settings`, label: t.dashboard.menu.settings, icon: Settings },
        ...( (data.user?.role === 'admin' || clientRole === 'admin') ? [{ href: `/${workspace}/admin`, label: t.dashboard.menu.admin_panel, icon: Shield }] : [])
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
    let isNotificationsOpen = false;
    let isThemeMenuOpen = false;
    let isLangMenuOpen = false;
    let isCompanyMenuOpen = false;
    let isMobileMenuOpen = false;
    
    $: companies = data.companies || [];
    let selectedCompany: any = null;

    let activeNotificationTab = 'inbox'; // 'inbox' | 'archive'
    
    $: isSpanish = $currentLang === 'es';

    // Close mobile menu when navigating
    $: if (path) {
        isMobileMenuOpen = false;
    }

    $: if (companies.length > 0 && !selectedCompany) {
        // Try to match with user's companyId if available, otherwise first
        if (data.user?.companyId) {
            selectedCompany = companies.find((c: any) => c.id === data.user.companyId) || companies[0];
        } else {
            selectedCompany = companies[0];
        }
    }

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
        isCompanyMenuOpen = false;
        isMobileMenuOpen = false;
    }

    function closeProfileMenu() {
        isProfileOpen = false;
        isThemeMenuOpen = false;
        isLangMenuOpen = false;
    }

    function closeNotificationsMenu() {
        isNotificationsOpen = false;
    }

    function closeCompanyMenu() {
        isCompanyMenuOpen = false;
    }
    
    function selectCompany(company: any) {
        selectedCompany = company;
        isCompanyMenuOpen = false;
    }
</script>

<svelte:head>
    <title>Allianzy Inc</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-background">
    <!-- Mobile Menu Overlay -->
    {#if isMobileMenuOpen}
        <div 
            class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" 
            on:click={() => isMobileMenuOpen = false}
            transition:fade={{ duration: 200 }}
        ></div>
    {/if}

    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}">
        <div class="p-6 border-b h-16 flex items-center justify-between">
            {#if workspace === 'allianzy'}
                <a href="/{workspace}" class="block">
                    <img src={logoLight} alt="Allianzy" class="h-8 dark:hidden" />
                    <img src={logoDark} alt="Allianzy" class="h-8 hidden dark:block" />
                </a>
            {:else}
                <h2 class="text-lg font-bold tracking-tight uppercase truncate">{workspace}</h2>
            {/if}
            <button class="lg:hidden ml-auto" on:click={() => isMobileMenuOpen = false}>
                <X class="w-5 h-5" />
            </button>
        </div>
        
        {#if companies.length > 0}
        <div class="px-4 pb-2 pt-4">
            <div class="relative" use:clickOutside on:click_outside={closeCompanyMenu}>
                <button
                    on:click={() => isCompanyMenuOpen = !isCompanyMenuOpen}
                    class="w-full flex items-center justify-between p-2 rounded-md border bg-card hover:bg-accent transition-colors shadow-sm"
                    disabled={companies.length <= 1}
                >
                    <div class="flex items-center gap-2 overflow-hidden">
                        <div class="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-muted/50 border">
                            {#if selectedCompany?.logo}
                                <img src={selectedCompany.logo} alt={selectedCompany.name} class="w-full h-full object-cover rounded" />
                            {:else}
                                <Building class="w-3.5 h-3.5 text-muted-foreground" />
                            {/if}
                        </div>
                        <span class="text-sm font-medium truncate">{selectedCompany?.name || 'Empresa'}</span>
                    </div>
                    {#if companies.length > 1}
                        <ChevronsUpDown class="w-4 h-4 text-muted-foreground ml-2 shrink-0 opacity-50" />
                    {/if}
                </button>

                {#if isCompanyMenuOpen && companies.length > 1}
                     <div class="absolute top-full left-0 w-full mt-1 z-50 rounded-md border bg-popover shadow-md py-1 animate-in fade-in zoom-in-95 duration-100">
                        {#each companies as company}
                            <button
                                class="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                on:click={() => selectCompany(company)}
                            >
                                 <div class="w-5 h-5 rounded flex items-center justify-center shrink-0 bg-muted/50 border">
                                    {#if company.logo}
                                        <img src={company.logo} alt={company.name} class="w-full h-full object-cover rounded" />
                                    {:else}
                                        <Building class="w-3 h-3 text-muted-foreground" />
                                    {/if}
                                </div>
                                <span class="flex-1 text-left truncate">{company.name}</span>
                                {#if selectedCompany?.id === company.id}
                                    <Check class="w-3 h-3 text-primary" />
                                {/if}
                            </button>
                        {/each}
                     </div>
                {/if}
            </div>
        </div>
        {/if}

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
                <p>&copy; {t.dashboard.footer.rights}</p>
                <p class="flex items-center gap-1">
                    {t.dashboard.footer.made_with_love} <Heart class="w-3 h-3 text-red-500 fill-current" /> {isSpanish ? 'por Allianzy.' : 'by Allianzy.'}
                </p>
            </div>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 bg-background border-b flex items-center justify-between px-4 md:px-8 shrink-0">
            <div class="flex items-center gap-4">
                <button class="lg:hidden" on:click={() => isMobileMenuOpen = !isMobileMenuOpen}>
                    <Menu class="w-5 h-5" />
                </button>
                <h1 class="text-lg font-semibold">Dashboard</h1>
            </div>
            <div class="flex items-center gap-4">
                <!-- Notifications -->
                 <div class="relative" use:clickOutside on:click_outside={closeNotificationsMenu}>
                    <button 
                        on:click={() => isNotificationsOpen = !isNotificationsOpen}
                        class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <Bell class="w-4 h-4 text-muted-foreground" />
                        {#if unreadCount > 0}
                            <span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
                        {/if}
                    </button>

                    {#if isNotificationsOpen}
                        <div class="absolute right-0 mt-2 w-[400px] rounded-lg border bg-popover shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[600px]">
                            <!-- Header with Tabs -->
                            <div class="flex items-center border-b bg-muted/30">
                                <button 
                                    class="flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 relative
                                    {activeNotificationTab === 'inbox' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
                                    on:click={() => activeNotificationTab = 'inbox'}
                                >
                                    Inbox
                                    {#if inboxNotifications.length > 0}
                                        <span class="bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full">{inboxNotifications.length}</span>
                                    {/if}
                                </button>
                                <button 
                                    class="flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2
                                    {activeNotificationTab === 'archive' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
                                    on:click={() => activeNotificationTab = 'archive'}
                                >
                                    {isSpanish ? 'Archivadas' : 'Archive'}
                                </button>
                            </div>

                            <!-- Content -->
                            <div class="overflow-y-auto flex-1 bg-popover max-h-[400px]">
                                {#if activeNotificationTab === 'inbox'}
                                    {#if inboxNotifications.length === 0}
                                        <div class="p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                                            <BellOff class="w-8 h-8 mb-2 opacity-50" />
                                            <p class="text-sm">{t.dashboard.header.notifications.empty}</p>
                                        </div>
                                    {:else}
                                        <div class="divide-y divide-border/50">
                                            {#each inboxNotifications as notification}
                                                <div class="p-4 hover:bg-muted/50 transition-colors flex gap-3 relative group">
                                                    <!-- Icon based on type -->
                                                    <div class="shrink-0 mt-1">
                                                        {#if notification.type === 'success'}
                                                            <div class="w-8 h-8 rounded-full border border-green-500/20 text-green-500 flex items-center justify-center">
                                                                <Check class="w-4 h-4" />
                                                            </div>
                                                        {:else if notification.type === 'warning'}
                                                            <div class="w-8 h-8 rounded-full border border-orange-500/20 text-orange-500 flex items-center justify-center">
                                                                <AlertTriangle class="w-4 h-4" />
                                                            </div>
                                                        {:else if notification.type === 'error'}
                                                            <div class="w-8 h-8 rounded-full border border-red-500/20 text-red-500 flex items-center justify-center">
                                                                <AlertTriangle class="w-4 h-4" />
                                                            </div>
                                                        {:else}
                                                            <div class="w-8 h-8 rounded-full border border-blue-500/20 text-blue-500 flex items-center justify-center">
                                                                <Monitor class="w-4 h-4" />
                                                            </div>
                                                        {/if}
                                                    </div>
                                                    
                                                    <!-- Content -->
                                                    <div class="flex-1 min-w-0">
                                                        <a 
                                                            href="{notification.link || '#'}" 
                                                            class="block group-hover:text-primary transition-colors"
                                                            on:click|preventDefault={async () => {
                                                                if (!notification.read) {
                                                                    const formData = new FormData();
                                                                    formData.append('id', notification.id.toString());
                                                                    try {
                                                                        await fetch(`/${workspace}/dashboard?/markNotificationRead`, {
                                                                            method: 'POST',
                                                                            body: formData
                                                                        });
                                                                    } catch (e) {
                                                                        console.error('Failed to mark as read', e);
                                                                    }
                                                                }
                                                                isNotificationsOpen = false;
                                                                if (notification.link) window.location.href = notification.link;
                                                            }}
                                                        >
                                                            <p class="text-sm font-medium leading-snug text-foreground mb-0.5">
                                                                {notification.title}
                                                            </p>
                                                            <p class="text-xs text-muted-foreground line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                            <p class="text-[10px] text-muted-foreground mt-1">
                                                                {new Date(notification.createdAt || new Date()).toLocaleDateString()}
                                                            </p>
                                                        </a>
                                                    </div>

                                                    <!-- Actions -->
                                                    <div class="shrink-0 flex flex-col items-end gap-2">
                                                        {#if !notification.read}
                                                            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                                                        {/if}
                                                        
                                                        <form 
                                                            action="/{workspace}/dashboard?/archiveNotification" 
                                                            method="POST" 
                                                            use:enhance
                                                            class="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <input type="hidden" name="id" value={notification.id} />
                                                            <button 
                                                                type="submit" 
                                                                class="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                                                                title={isSpanish ? 'Archivar' : 'Archive'}
                                                            >
                                                                <Check class="w-3 h-3" />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            {/each}
                                        </div>
                                    {/if}
                                {:else}
                                    <!-- Archive Tab -->
                                    {#if archivedNotifications.length === 0}
                                        <div class="p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                                            <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                                <BellOff class="w-6 h-6 opacity-50" />
                                            </div>
                                            <p class="text-sm">{isSpanish ? 'No hay notificaciones archivadas' : 'No archived notifications'}</p>
                                        </div>
                                    {:else}
                                        <div class="divide-y divide-border/50">
                                            {#each archivedNotifications as notification}
                                                <div class="p-4 hover:bg-muted/50 transition-colors flex gap-3 opacity-75 group relative">
                                                    <div class="flex-1 min-w-0">
                                                        <a 
                                                            href="{notification.link || '#'}" 
                                                            class="block hover:text-primary transition-colors"
                                                            on:click={() => isNotificationsOpen = false}
                                                        >
                                                             <p class="text-sm font-medium leading-snug text-foreground mb-0.5">{notification.title}</p>
                                                             <p class="text-xs text-muted-foreground">{notification.message}</p>
                                                             <p class="text-[10px] text-muted-foreground mt-1">{new Date(notification.createdAt || new Date()).toLocaleDateString()}</p>
                                                        </a>
                                                     </div>
                                                     <div class="shrink-0 flex flex-col items-end gap-2">
                                                        <form 
                                                            action="/{workspace}/dashboard?/deleteNotification" 
                                                            method="POST" 
                                                            use:enhance
                                                            class="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <input type="hidden" name="id" value={notification.id} />
                                                            <button 
                                                                type="submit" 
                                                                class="p-1 text-muted-foreground hover:text-red-500 hover:bg-muted rounded"
                                                                title={isSpanish ? 'Eliminar' : 'Delete'}
                                                            >
                                                                <Trash class="w-3 h-3" />
                                                            </button>
                                                        </form>
                                                     </div>
                                                </div>
                                            {/each}
                                        </div>
                                    {/if}
                                {/if}
                            </div>
                            
                            <!-- Footer -->
                            {#if activeNotificationTab === 'inbox' && inboxNotifications.length > 0}
                                <div class="p-2 border-t bg-muted/30">
                                    <form action="/{workspace}/dashboard?/archiveAllNotifications" method="POST" use:enhance class="w-full">
                                        <button 
                                            type="submit"
                                            class="w-full py-2 text-sm font-medium text-foreground hover:bg-background rounded-md transition-colors border shadow-sm flex items-center justify-center gap-2"
                                        >
                                            {isSpanish ? 'Archivar todo' : 'Archive All'}
                                        </button>
                                    </form>
                                </div>
                            {/if}
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
