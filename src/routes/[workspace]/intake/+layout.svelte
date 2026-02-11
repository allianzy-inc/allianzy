<script lang="ts">
    import { page } from '$app/stores';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    import beltrixLogoLight from '$lib/assets/brand/beltrix/beltrix-logo-light.svg';
    import beltrixLogoDark from '$lib/assets/brand/beltrix/beltrix-logo-dark.svg';
    import { Languages, Sun, Moon, Laptop } from 'lucide-svelte';
    import { currentLang } from '$lib/i18n';
    import { onMount } from 'svelte';

    $: workspace = $page.params.workspace;
    $: isAllianzyIntake = workspace === 'allianzy';
    const year = new Date().getFullYear();

    let theme: 'light' | 'dark' | 'system' = 'system';
    let prefersDark = true; // default for SSR; updated in onMount
    let isThemeMenuOpen = false;
    let isLangMenuOpen = false;

    $: effectiveDark = theme === 'dark' || (theme === 'system' && prefersDark);
    $: showDarkIntake = isAllianzyIntake && effectiveDark;

    function toggleThemeMenu() {
        isThemeMenuOpen = !isThemeMenuOpen;
        if (isThemeMenuOpen) isLangMenuOpen = false;
    }

    function toggleLangMenu() {
        isLangMenuOpen = !isLangMenuOpen;
        if (isLangMenuOpen) isThemeMenuOpen = false;
    }

    function setLang(lang: 'en' | 'es') {
        currentLang.set(lang);
        isLangMenuOpen = false;
    }

    function setTheme(newTheme: 'light' | 'dark' | 'system') {
        theme = newTheme;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('theme', newTheme);
        }
        applyTheme();
        isThemeMenuOpen = false;
    }

    function applyTheme() {
        if (typeof window === 'undefined') return;
        const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    onMount(() => {
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (saved) theme = saved;
        prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const q = window.matchMedia('(prefers-color-scheme: dark)');
        const upd = () => { prefersDark = q.matches; };
        q.addEventListener('change', upd);
        applyTheme();
        return () => q.removeEventListener('change', upd);
    });
</script>

<!-- Allianzy intake: dark or light shell según tema; other workspaces: default -->
<div
    class="min-h-screen flex flex-col {isAllianzyIntake
        ? showDarkIntake
            ? 'text-zinc-100'
            : 'bg-zinc-100 text-zinc-900'
        : 'bg-background text-foreground'}"
    style={isAllianzyIntake && showDarkIntake
        ? 'background: radial-gradient(ellipse 120% 100% at 50% -10%, rgba(15, 23, 42, 0.6) 0%, transparent 50%), linear-gradient(180deg, #0B0F1A 0%, #070A12 70%, #050810 100%);'
        : isAllianzyIntake && !showDarkIntake
            ? 'background: linear-gradient(180deg, #f4f4f5 0%, #e4e4e7 100%);'
            : undefined}
>
    <header
        class="{isAllianzyIntake
            ? showDarkIntake
                ? 'border-white/10 bg-black/30 backdrop-blur-md'
                : 'border-zinc-200/80 bg-white/80 backdrop-blur-md'
            : 'border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'}"
    >
        <div class="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
            <a href="/{workspace}" class="flex items-center gap-2">
                {#if workspace === 'beltrix'}
                    <img src={beltrixLogoLight} alt="Beltrix" class="h-7 w-auto dark:hidden" />
                    <img src={beltrixLogoDark} alt="Beltrix" class="h-7 w-auto hidden dark:block" />
                {:else}
                    {#if isAllianzyIntake}
                        <img src={showDarkIntake ? logoDark : logoLight} alt="Allianzy" class="h-7 w-auto" />
                    {:else}
                        <img src={logoLight} alt="Allianzy" class="h-7 w-auto dark:hidden" />
                        <img src={logoDark} alt="Allianzy" class="h-7 w-auto hidden dark:block" />
                    {/if}
                {/if}
            </a>

            <div class="flex items-center gap-3">
                <!-- Theme menu -->
                <div class="relative">
                    <button
                        on:click={toggleThemeMenu}
                        class="p-2 rounded-full transition-colors {isAllianzyIntake ? (showDarkIntake ? 'hover:bg-white/10 text-zinc-400 hover:text-zinc-100' : 'hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900') : 'hover:bg-accent text-muted-foreground hover:text-foreground'}"
                        aria-label="Cambiar tema"
                    >
                        {#if theme === 'light'}
                            <Sun class="h-5 w-5" />
                        {:else if theme === 'dark'}
                            <Moon class="h-5 w-5" />
                        {:else}
                            <Laptop class="h-5 w-5" />
                        {/if}
                    </button>
                    {#if isThemeMenuOpen}
                        <div
                            class="absolute top-full right-0 mt-2 w-36 rounded-md border p-1 shadow-lg z-50 {isAllianzyIntake && showDarkIntake
                                ? 'border-white/20 bg-zinc-900/95 backdrop-blur'
                                : 'border-border bg-popover'}"
                        >
                            <button
                                on:click={() => setTheme('light')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm {isAllianzyIntake && showDarkIntake ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-accent'} {theme === 'light' ? 'text-primary font-medium' : ''}"
                            >
                                <Sun class="h-4 w-4" /> Light
                            </button>
                            <button
                                on:click={() => setTheme('dark')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm {isAllianzyIntake && showDarkIntake ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-accent'} {theme === 'dark' ? 'text-primary font-medium' : ''}"
                            >
                                <Moon class="h-4 w-4" /> Dark
                            </button>
                            <button
                                on:click={() => setTheme('system')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm {isAllianzyIntake && showDarkIntake ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-accent'} {theme === 'system' ? 'text-primary font-medium' : ''}"
                            >
                                <Laptop class="h-4 w-4" /> System
                            </button>
                        </div>
                    {/if}
                </div>

                <!-- Language menu -->
                <div class="relative">
                    <button
                        on:click={toggleLangMenu}
                        class="p-2 rounded-full transition-colors {isAllianzyIntake ? (showDarkIntake ? 'hover:bg-white/10 text-zinc-400 hover:text-zinc-100' : 'hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900') : 'hover:bg-accent text-muted-foreground hover:text-foreground'}"
                        aria-label="Cambiar idioma"
                    >
                        <Languages class="h-5 w-5" />
                    </button>
                    {#if isLangMenuOpen}
                        <div
                            class="absolute top-full right-0 mt-2 w-36 rounded-md border p-1 shadow-lg z-50 {isAllianzyIntake && showDarkIntake
                                ? 'border-white/20 bg-zinc-900/95 backdrop-blur'
                                : 'border-border bg-popover'}"
                        >
                            <button
                                on:click={() => setLang('en')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm {isAllianzyIntake && showDarkIntake ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-accent'} {$currentLang === 'en' ? 'text-primary font-medium' : ''}"
                            >
                                English
                            </button>
                            <button
                                on:click={() => setLang('es')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm {isAllianzyIntake && showDarkIntake ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-accent'} {$currentLang === 'es' ? 'text-primary font-medium' : ''}"
                            >
                                Español
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </header>

    <main class="flex-1 flex flex-col items-center px-4 py-6 md:py-8">
        {#if isAllianzyIntake}
            <div class="w-full max-w-3xl flex flex-col flex-1">
                <div
                    class="w-full rounded-2xl border shadow-xl p-6 md:p-8 flex-1 {showDarkIntake
                        ? 'dark border-white/10 bg-zinc-900/90 shadow-black/20'
                        : 'border-zinc-200/80 bg-white/95 shadow-zinc-200/50'}"
                >
                    <slot />
                </div>
            </div>
        {:else}
            <slot />
        {/if}
    </main>

    <footer
        class="border-t py-4 text-xs {isAllianzyIntake ? (showDarkIntake ? 'border-white/10 text-zinc-500' : 'border-zinc-200 text-zinc-500') : 'text-muted-foreground'}"
    >
        <div class="container mx-auto px-4 flex items-center justify-between gap-4">
            <span>© {year} Allianzy Inc. Todos los derechos reservados.</span>
            <span class="hidden sm:inline">
                Evaluación preliminar. No constituye propuesta ni aceptación definitiva de proyecto.
            </span>
        </div>
    </footer>
</div>
