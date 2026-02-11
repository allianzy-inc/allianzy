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
    const year = new Date().getFullYear();

    let theme: 'light' | 'dark' | 'system' = 'system';
    let isThemeMenuOpen = false;
    let isLangMenuOpen = false;

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
        applyTheme();
    });
</script>

<div class="min-h-screen flex flex-col bg-background text-foreground">
    <header class="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
            <a href="/{workspace}" class="flex items-center gap-2">
                {#if workspace === 'beltrix'}
                    <img src={beltrixLogoLight} alt="Beltrix" class="h-7 w-auto dark:hidden" />
                    <img src={beltrixLogoDark} alt="Beltrix" class="h-7 w-auto hidden dark:block" />
                {:else}
                    <img src={logoLight} alt="Allianzy" class="h-7 w-auto dark:hidden" />
                    <img src={logoDark} alt="Allianzy" class="h-7 w-auto hidden dark:block" />
                {/if}
            </a>

            <div class="flex items-center gap-3">
                <!-- Theme menu -->
                <div class="relative">
                    <button
                        on:click={toggleThemeMenu}
                        class="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
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
                        <div class="absolute top-full right-0 mt-2 w-36 rounded-md border bg-popover p-1 shadow-md z-50">
                            <button
                                on:click={() => setTheme('light')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {theme === 'light' ? 'text-primary' : ''}"
                            >
                                <Sun class="h-4 w-4" /> Light
                            </button>
                            <button
                                on:click={() => setTheme('dark')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {theme === 'dark' ? 'text-primary' : ''}"
                            >
                                <Moon class="h-4 w-4" /> Dark
                            </button>
                            <button
                                on:click={() => setTheme('system')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {theme === 'system' ? 'text-primary' : ''}"
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
                        class="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        aria-label="Cambiar idioma"
                    >
                        <Languages class="h-5 w-5" />
                    </button>
                    {#if isLangMenuOpen}
                        <div class="absolute top-full right-0 mt-2 w-36 rounded-md border bg-popover p-1 shadow-md z-50">
                            <button
                                on:click={() => setLang('en')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {$currentLang === 'en' ? 'text-primary' : ''}"
                            >
                                English
                            </button>
                            <button
                                on:click={() => setLang('es')}
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {$currentLang === 'es' ? 'text-primary' : ''}"
                            >
                                Español
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </header>

    <main class="flex-1">
        <slot />
    </main>

    <footer class="border-t py-4 text-xs text-muted-foreground">
        <div class="container mx-auto px-4 flex items-center justify-between gap-4">
            <span>© {year} Allianzy Inc. Todos los derechos reservados.</span>
            <span class="hidden sm:inline">
                Evaluación preliminar. No constituye propuesta ni aceptación definitiva de proyecto.
            </span>
        </div>
    </footer>
</div>
