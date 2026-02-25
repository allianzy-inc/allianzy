<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { User, LayoutDashboard, Briefcase, Ticket, Settings, LogOut, Shield, Bell, BellOff, Moon, Sun, Monitor, Languages, Check, ChevronRight, HelpCircle, CreditCard, ChevronsUpDown, Building, AlertTriangle, Trash, Menu, X, Loader2, PanelLeftClose, PanelLeft } from 'lucide-svelte';
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
        const savedSidebar = localStorage.getItem('dashboard-sidebar-collapsed');
        if (savedSidebar === 'true') sidebarCollapsed = true;
    });

    function toggleSidebar() {
        sidebarCollapsed = !sidebarCollapsed;
        try {
            localStorage.setItem('dashboard-sidebar-collapsed', String(sidebarCollapsed));
        } catch (_) {}
    }

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
    
    // Permissions Logic
    $: currentUserRole = selectedCompany?.role;
    $: currentUserPermissions = selectedCompany?.permissions || {};
    
    // Check if user has permission in ANY project
    $: canViewBilling = currentUserRole === 'owner' || currentUserRole === 'admin' || Object.values(currentUserPermissions).some((p: any) => p && p.includes('payments'));
    $: canViewSupport = currentUserRole === 'owner' || currentUserRole === 'admin' || Object.values(currentUserPermissions).some((p: any) => p && p.includes('support'));

    // When user has no company and no projects, show only Inicio (Overview)
    $: showOnlyInicio = !(data.hasAnyCompany ?? true) && !(data.hasAnyProject ?? true);

    // Client Menu Items (cambio vista admin/cliente solo desde menú perfil)
    $: menuItems = showOnlyInicio
        ? [
            { href: `/${workspace}/dashboard`, label: t.dashboard.menu.overview, icon: LayoutDashboard }
          ]
        : [
            { href: `/${workspace}/dashboard`, label: t.dashboard.menu.overview, icon: LayoutDashboard },
            { href: `/${workspace}/dashboard/projects`, label: t.dashboard.menu.projects, icon: Briefcase },
            ...(canViewBilling ? [{ href: `/${workspace}/dashboard/billing`, label: t.dashboard.menu.billing, icon: CreditCard }] : []),
            ...(canViewSupport ? [{ href: `/${workspace}/dashboard/support`, label: t.dashboard.menu.support, icon: Ticket }] : []),
            { href: `/${workspace}/dashboard/settings`, label: t.dashboard.menu.settings, icon: Settings }
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
    let sidebarCollapsed = false;
    
    $: companies = data.companies || [];
    let selectedCompany: any = null;

    let activeNotificationTab = 'inbox'; // 'inbox' | 'archive'
    let isArchivingAll = false;
    let deletingNotificationIds: Record<string, boolean> = {};
    let archivingNotificationIds: Record<string, boolean> = {};
    
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
        if (!company?.id || company.id === selectedCompany?.id) {
            isCompanyMenuOpen = false;
            return;
        }
        selectedCompany = company;
        isCompanyMenuOpen = false;
        // Persistir empresa en cookie para que el servidor filtre proyectos/soporte/facturación
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/${workspace}/dashboard/set-company?redirect=${encodeURIComponent(path)}`;
        const input = document.createElement('input');
        input.name = 'companyId';
        input.value = String(company.id);
        input.type = 'hidden';
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
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

    <!-- Sidebar: expandido w-64, colapsado solo iconos w-16 -->
    <aside class="fixed inset-y-0 left-0 z-50 bg-background border-r flex flex-col transition-[width,transform] duration-200 ease-in-out {isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} {sidebarCollapsed ? 'lg:translate-x-0 lg:w-16' : 'lg:translate-x-0 lg:w-64'}">
        <div class="border-b h-16 flex items-center justify-between shrink-0 {sidebarCollapsed ? 'lg:justify-center lg:px-0 p-4' : 'p-4 lg:p-6'}">
            {#if workspace === 'allianzy'}
                {#if sidebarCollapsed}
                    <a href="/{workspace}" class="hidden lg:flex items-center justify-center w-10 h-10 text-foreground" title="Allianzy" aria-label="Allianzy">
                        <svg width="32" height="27" viewBox="0 0 276 232" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-foreground">
                            <path d="M197.593 228.011C189.013 233.711 178.063 231.271 173.143 222.581L122.143 132.451C117.223 123.761 120.143 112.091 128.773 106.451C137.363 100.761 148.313 103.191 153.233 111.881L174.503 149.451L204.273 202.011C209.153 210.661 206.183 222.321 197.593 228.011Z" fill="currentColor"/>
                            <path d="M276.003 211.41C276.046 214.715 275.275 217.981 273.758 220.917C272.24 223.854 270.024 226.373 267.303 228.25C258.713 233.95 247.493 231.03 242.233 221.74L159.843 76.25L154.303 66.38L147.513 54.38C146.603 52.6361 145.233 51.175 143.551 50.1553C141.869 49.1357 139.94 48.5966 137.973 48.5966C136.006 48.5966 134.077 49.1357 132.395 50.1553C130.713 51.175 129.343 52.6361 128.433 54.38L121.653 66.38L116.023 76.33L33.6528 221.74C28.4528 230.91 17.4428 233.87 8.89282 228.45C0.0628166 222.86 -2.59718 210.21 2.75282 200.77L103.043 23.66L105.133 19.97C108.319 14.1801 112.884 9.26506 118.423 5.66C124.235 1.96826 130.977 0.00526701 137.863 0C143.536 0.0480936 149.123 1.38571 154.203 3.91165C159.282 6.4376 163.721 10.0857 167.183 14.58C168.458 16.2049 169.605 17.9268 170.613 19.73L171.973 22.13L273.303 201.11C275.077 204.253 276.007 207.801 276.003 211.41V211.41Z" fill="currentColor"/>
                            <path d="M102.733 231.76C118.66 231.76 131.573 218.848 131.573 202.92C131.573 186.992 118.66 174.08 102.733 174.08C86.8047 174.08 73.8926 186.992 73.8926 202.92C73.8926 218.848 86.8047 231.76 102.733 231.76Z" fill="currentColor"/>
                        </svg>
                    </a>
                {:else}
                    <a href="/{workspace}" class="block shrink-0">
                        <img src={logoLight} alt="Allianzy" class="h-8 dark:hidden" />
                        <img src={logoDark} alt="Allianzy" class="h-8 hidden dark:block" />
                    </a>
                {/if}
            {:else}
                {#if sidebarCollapsed}
                    <span class="hidden lg:flex w-8 h-8 items-center justify-center rounded bg-muted text-sm font-bold uppercase text-foreground" title={workspace}>{workspace.charAt(0)}</span>
                {:else}
                    <h2 class="text-lg font-bold tracking-tight uppercase truncate">{workspace}</h2>
                {/if}
            {/if}
            <button class="lg:hidden ml-auto shrink-0" on:click={() => isMobileMenuOpen = false}>
                <X class="w-5 h-5" />
            </button>
        </div>

        {#if companies.length > 0}
        <div class="{sidebarCollapsed ? 'lg:px-2 lg:pt-4' : 'px-4 pb-2 pt-4'}">
            <div class="relative" use:clickOutside on:click_outside={closeCompanyMenu}>
                <button
                    on:click={() => isCompanyMenuOpen = !isCompanyMenuOpen}
                    class="w-full flex items-center justify-between p-2 rounded-md border bg-card hover:bg-accent transition-colors shadow-sm {sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}"
                    disabled={companies.length <= 1}
                    title={sidebarCollapsed ? selectedCompany?.name || 'Empresa' : ''}
                >
                    <div class="flex items-center gap-2 overflow-hidden {sidebarCollapsed ? 'lg:gap-0' : ''}">
                        <div class="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-muted/50 border">
                            {#if selectedCompany?.logo}
                                <img src={selectedCompany.logo} alt={selectedCompany.name} class="w-full h-full object-cover rounded" />
                            {:else}
                                <Building class="w-3.5 h-3.5 text-muted-foreground" />
                            {/if}
                        </div>
                        <span class="text-sm font-medium truncate {sidebarCollapsed ? 'lg:sr-only' : ''}">{selectedCompany?.name || 'Empresa'}</span>
                    </div>
                    {#if companies.length > 1}
                        <ChevronsUpDown class="w-4 h-4 text-muted-foreground ml-2 shrink-0 opacity-50 {sidebarCollapsed ? 'lg:hidden' : ''}" />
                    {/if}
                </button>

                {#if isCompanyMenuOpen && companies.length > 1}
                     <div class="absolute top-full left-0 mt-1 z-50 rounded-md border bg-popover shadow-md py-1 animate-in fade-in zoom-in-95 duration-100 {sidebarCollapsed ? 'lg:left-full lg:ml-1 lg:min-w-[200px]' : 'w-full'}">
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

        <nav class="flex-1 p-4 space-y-1 overflow-hidden">
            {#each menuItems as item}
                <a
                    href={item.href}
                    title={sidebarCollapsed ? item.label : ''}
                    class="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors {sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''} {path === item.href || (item.href !== '/dashboard' && item.href !== `/${workspace}/dashboard` && path.startsWith(item.href)) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
                >
                    <item.icon class="w-4 h-4 shrink-0" />
                    <span class="truncate {sidebarCollapsed ? 'lg:sr-only' : ''}">{item.label}</span>
                </a>
            {/each}
        </nav>

        <div class="p-4 border-t space-y-4 shrink-0 {sidebarCollapsed ? 'lg:px-2 lg:space-y-0' : ''}">
            <a
                href="mailto:support@allianzy.us"
                class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-2 {sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}"
                title={sidebarCollapsed ? t.dashboard.footer.help_support : ''}
            >
                <HelpCircle class="w-4 h-4 shrink-0" />
                <span class="{sidebarCollapsed ? 'lg:sr-only' : ''}">{t.dashboard.footer.help_support}</span>
            </a>
            <div class="text-xs text-muted-foreground px-2 space-y-1 {sidebarCollapsed ? 'lg:hidden' : ''}">
                <p>{t.dashboard.footer.rights}</p>
            </div>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden transition-[margin] duration-200 {sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}">
        <header class="h-16 bg-background border-b flex items-center justify-between px-4 md:px-8 shrink-0">
            <div class="flex items-center gap-4">
                <button class="lg:hidden" on:click={() => isMobileMenuOpen = !isMobileMenuOpen} aria-label="Abrir menú">
                    <Menu class="w-5 h-5" />
                </button>
                <button
                    class="hidden lg:flex p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    on:click={toggleSidebar}
                    aria-label={sidebarCollapsed ? 'Mostrar menú' : 'Ocultar menú'}
                    title={sidebarCollapsed ? 'Mostrar menú' : 'Ocultar menú'}
                >
                    {#if sidebarCollapsed}
                        <PanelLeft class="w-5 h-5" />
                    {:else}
                        <PanelLeftClose class="w-5 h-5" />
                    {/if}
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
                        <div class="fixed left-4 right-4 top-16 mt-2 md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 w-auto md:w-[400px] rounded-lg border bg-popover shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh] md:max-h-[600px]">
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
                                                    {#if notification.type === 'invitation'}
                                                        <div class="flex-1 min-w-0">
                                                            <div class="flex flex-col">
                                                                <p class="text-sm font-medium leading-snug text-foreground mb-0.5">
                                                                    {notification.title}
                                                                </p>
                                                                <p class="text-xs text-muted-foreground mb-2">
                                                                    {notification.message}
                                                                </p>
                                                                <div class="flex items-center gap-2 mt-1">
                                                                     <form action="/{workspace}/dashboard?/acceptInvitation" method="POST" use:enhance>
                                                                        <input type="hidden" name="id" value={notification.id} />
                                                                        <button type="submit" class="px-2.5 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors shadow-sm">
                                                                            {isSpanish ? 'Aceptar' : 'Accept'}
                                                                        </button>
                                                                     </form>
                                                                     <form action="/{workspace}/dashboard?/rejectInvitation" method="POST" use:enhance>
                                                                        <input type="hidden" name="id" value={notification.id} />
                                                                        <button type="submit" class="px-2.5 py-1.5 bg-background border hover:bg-muted text-foreground text-xs font-medium rounded transition-colors">
                                                                            {isSpanish ? 'Rechazar' : 'Reject'}
                                                                        </button>
                                                                     </form>
                                                                </div>
                                                                 <p class="text-[10px] text-muted-foreground mt-2">
                                                                    {new Date(notification.createdAt || new Date()).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    {:else}
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
                                                    {/if}

                                                    <!-- Actions -->
                                                    <div class="shrink-0 flex flex-col items-end gap-2 justify-center">
                                                        {#if !notification.read}
                                                            <div class="w-2 h-2 rounded-full bg-blue-500 absolute top-4 right-4"></div>
                                                        {/if}
                                                        
                                                        <form 
                                                            action="/{workspace}/dashboard?/archiveNotification" 
                                                            method="POST" 
                                                            use:enhance={() => {
                                                                archivingNotificationIds[notification.id] = true;
                                                                return async ({ update }) => {
                                                                    await update();
                                                                    delete archivingNotificationIds[notification.id];
                                                                    archivingNotificationIds = archivingNotificationIds; // Trigger reactivity
                                                                };
                                                            }}
                                                            class="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <input type="hidden" name="id" value={notification.id} />
                                                            <button 
                                                                type="submit" 
                                                                class="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                                                                title={isSpanish ? 'Archivar' : 'Archive'}
                                                                disabled={archivingNotificationIds[notification.id]}
                                                            >
                                                                {#if archivingNotificationIds[notification.id]}
                                                                    <Loader2 class="w-3 h-3 animate-spin" />
                                                                {:else}
                                                                    <Check class="w-3 h-3" />
                                                                {/if}
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
                                                     <div class="shrink-0 flex flex-col items-end gap-2 justify-center">
                                                        <form 
                                                            action="/{workspace}/dashboard?/deleteNotification" 
                                                            method="POST" 
                                                            use:enhance={() => {
                                                                deletingNotificationIds[notification.id] = true;
                                                                return async ({ update }) => {
                                                                    await update();
                                                                    delete deletingNotificationIds[notification.id];
                                                                    deletingNotificationIds = deletingNotificationIds; // Trigger reactivity
                                                                };
                                                            }}
                                                            class="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <input type="hidden" name="id" value={notification.id} />
                                                            <button 
                                                                type="submit" 
                                                                class="p-1 text-muted-foreground hover:text-red-500 hover:bg-muted rounded"
                                                                title={isSpanish ? 'Eliminar' : 'Delete'}
                                                                disabled={deletingNotificationIds[notification.id]}
                                                            >
                                                                {#if deletingNotificationIds[notification.id]}
                                                                    <Loader2 class="w-3 h-3 animate-spin" />
                                                                {:else}
                                                                    <Trash class="w-3 h-3" />
                                                                {/if}
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
                                    <form 
                                        action="/{workspace}/dashboard?/archiveAllNotifications" 
                                        method="POST" 
                                        use:enhance={() => {
                                            isArchivingAll = true;
                                            return async ({ update }) => {
                                                await update();
                                                isArchivingAll = false;
                                            };
                                        }} 
                                        class="w-full"
                                    >
                                        <button 
                                            type="submit"
                                            class="w-full py-2 text-sm font-medium text-foreground hover:bg-background rounded-md transition-colors border shadow-sm flex items-center justify-center gap-2"
                                            disabled={isArchivingAll}
                                        >
                                            {#if isArchivingAll}
                                                <Loader2 class="w-4 h-4 animate-spin" />
                                                {isSpanish ? 'Archivando...' : 'Archiving...'}
                                            {:else}
                                                {isSpanish ? 'Archivar todo' : 'Archive All'}
                                            {/if}
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
                                href="/{workspace}/dashboard/profile" 
                                class="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                on:click={closeMenus}
                            >
                                <User class="w-4 h-4 mr-2" />
                                {t.dashboard.header.profile.account}
                            </a>
                            {#if data.user?.role === 'admin' || clientRole === 'admin'}
                                <a 
                                    href="/{workspace}/admin" 
                                    class="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                    on:click={closeMenus}
                                >
                                    <Shield class="w-4 h-4 mr-2" />
                                    {t.dashboard.header.profile.admin_panel}
                                </a>
                            {/if}

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
