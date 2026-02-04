<script lang="ts">
    import { onMount } from 'svelte';
    import { currentLang, translations } from '$lib/i18n';
    import { Globe, Menu, X, ArrowRight, CheckCircle2, Moon, Sun, Laptop } from 'lucide-svelte';
    import { fade, slide } from 'svelte/transition';

    let isMenuOpen = false;
    let theme: 'light' | 'dark' | 'system' = 'system';
    let isThemeMenuOpen = false;

    $: t = translations[$currentLang];

    function toggleLang() {
        currentLang.update(l => l === 'en' ? 'es' : 'en');
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function toggleThemeMenu() {
        isThemeMenuOpen = !isThemeMenuOpen;
    }
    
    function setTheme(newTheme: 'light' | 'dark' | 'system') {
        theme = newTheme;
        localStorage.setItem('theme', newTheme);
        applyTheme();
        isThemeMenuOpen = false;
    }

    function applyTheme() {
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
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (savedTheme) theme = savedTheme;
        applyTheme();
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
             if (theme === 'system') applyTheme();
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    });
</script>

<svelte:head>
    <title>Allianzy Inc</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div class="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
            <div class="flex items-center gap-2">
                <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Allianzy Inc.</span>
            </div>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
                <a href="#home" class="transition-colors hover:text-primary relative group">
                    {t.nav.home}
                    <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </a>
                <div class="relative group">
                    <button class="flex items-center gap-1 transition-colors hover:text-primary focus:outline-none">
                        {t.nav.services}
                    </button>
                    <!-- Dropdown -->
                    <div class="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div class="w-64 rounded-xl border bg-popover p-4 shadow-xl grid gap-2">
                            <a href="/beltix" class="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors">
                                <div class="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <span class="text-purple-600 font-bold text-xs">B</span>
                                </div>
                                <div>
                                    <div class="font-medium">{t.services.beltix.title}</div>
                                    <div class="text-xs text-muted-foreground line-clamp-1">{t.services.beltix.desc}</div>
                                </div>
                            </a>
                            <a href="/allianzy" class="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors">
                                <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <span class="text-blue-600 font-bold text-xs">A</span>
                                </div>
                                <div>
                                    <div class="font-medium">{t.services.allianzy.title}</div>
                                    <div class="text-xs text-muted-foreground line-clamp-1">{t.services.allianzy.desc}</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <a href="#about" class="transition-colors hover:text-primary">{t.nav.about}</a>
                <a href="#contact" class="transition-colors hover:text-primary">{t.nav.contact}</a>
            </nav>

            <div class="hidden md:flex items-center gap-4">
                <!-- Theme Toggle -->
                <div class="relative">
                    <button 
                        on:click={toggleThemeMenu}
                        class="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
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
                            <button on:click={() => setTheme('light')} class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {theme === 'light' ? 'text-primary' : ''}">
                                <Sun class="h-4 w-4" /> Light
                            </button>
                            <button on:click={() => setTheme('dark')} class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {theme === 'dark' ? 'text-primary' : ''}">
                                <Moon class="h-4 w-4" /> Dark
                            </button>
                            <button on:click={() => setTheme('system')} class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {theme === 'system' ? 'text-primary' : ''}">
                                <Laptop class="h-4 w-4" /> System
                            </button>
                        </div>
                    {/if}
                </div>

                <button 
                    on:click={toggleLang}
                    class="flex items-center gap-2 text-sm font-medium rounded-full border border-input bg-transparent hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all px-3 py-1 text-muted-foreground"
                >
                    <Globe class="h-4 w-4" />
                    {$currentLang.toUpperCase()}
                </button>
                <a href="/allianzy/auth/login" class="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    {t.nav.login}
                </a>
            </div>

            <!-- Mobile Menu Button -->
            <button class="md:hidden p-2" on:click={toggleMenu}>
                {#if isMenuOpen}
                    <X class="h-6 w-6" />
                {:else}
                    <Menu class="h-6 w-6" />
                {/if}
            </button>
        </div>

        <!-- Mobile Nav -->
        {#if isMenuOpen}
            <div transition:slide class="md:hidden border-t bg-background">
                <div class="container flex flex-col gap-4 p-4">
                    <a href="#home" class="text-lg font-medium py-2" on:click={toggleMenu}>{t.nav.home}</a>
                    <div class="space-y-2 py-2">
                        <p class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.nav.services}</p>
                        <a href="/beltix" class="block pl-4 text-base py-1" on:click={toggleMenu}>{t.services.beltix.title}</a>
                        <a href="/allianzy" class="block pl-4 text-base py-1" on:click={toggleMenu}>{t.services.allianzy.title}</a>
                    </div>
                    <a href="#about" class="text-lg font-medium py-2" on:click={toggleMenu}>{t.nav.about}</a>
                    <a href="#contact" class="text-lg font-medium py-2" on:click={toggleMenu}>{t.nav.contact}</a>
                    
                    <div class="flex items-center justify-between pt-6 border-t mt-2">
                        <div class="flex items-center gap-2 bg-muted rounded-full p-1">
                            <button on:click={() => setTheme('light')} class="p-2 rounded-full {theme === 'light' ? 'bg-background shadow-sm' : ''}"><Sun class="h-4 w-4" /></button>
                            <button on:click={() => setTheme('dark')} class="p-2 rounded-full {theme === 'dark' ? 'bg-background shadow-sm' : ''}"><Moon class="h-4 w-4" /></button>
                            <button on:click={() => setTheme('system')} class="p-2 rounded-full {theme === 'system' ? 'bg-background shadow-sm' : ''}"><Laptop class="h-4 w-4" /></button>
                        </div>
                        <button on:click={toggleLang} class="flex items-center gap-2 text-sm font-medium border px-3 py-1.5 rounded-md">
                            <Globe class="h-4 w-4" />
                            {$currentLang.toUpperCase()}
                        </button>
                    </div>
                     <a href="/allianzy/auth/login" class="mt-4 block w-full text-center py-3 rounded-lg bg-primary text-primary-foreground font-semibold">
                        {t.nav.login}
                    </a>
                </div>
            </div>
        {/if}
    </header>

    <!-- Hero Section -->
    <section id="home" class="relative flex-1 flex flex-col items-center justify-center py-32 text-center px-4 overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background -z-10"></div>
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div class="absolute top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl opacity-50 animate-pulse" style="animation-delay: 2s"></div>

        <div class="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-sm bg-background/50 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span class="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Allianzy Inc.
        </div>

        <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight lg:text-8xl max-w-5xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100">
            <span class="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t.hero.title}
            </span>
        </h1>
        
        <p class="text-xl sm:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
            {t.hero.subtitle}
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300">
            <a href="/allianzy/intake" class="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                {t.hero.cta} <ArrowRight class="h-5 w-5" />
            </a>
            <a href="/beltix" class="px-8 py-4 rounded-full border border-input bg-background/50 backdrop-blur-sm font-semibold text-lg hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center">
                {t.services.beltix.title}
            </a>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-32 px-4 relative">
        <div class="container mx-auto">
            <div class="text-center mb-20">
                <h2 class="text-3xl md:text-5xl font-bold mb-6">{t.services.title}</h2>
                <div class="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <!-- Allianzy Card -->
                <div class="group relative overflow-hidden rounded-3xl border bg-card p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-100 transition-opacity"></div>
                    <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
                    
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-3xl font-bold flex items-center gap-3">
                                Allianzy
                            </h3>
                            <span class="text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full uppercase tracking-wide">{t.services.allianzy.tag}</span>
                        </div>
                        
                        <p class="text-muted-foreground text-lg mb-8 leading-relaxed">
                            {t.services.allianzy.desc}
                        </p>
                        
                        <ul class="space-y-4 mb-10">
                            {#each (t.services.allianzy.features || []) as feature}
                                <li class="flex items-center gap-3 text-base">
                                    <div class="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                                        <CheckCircle2 class="h-4 w-4 text-green-600 dark:text-green-400"/>
                                    </div>
                                    {feature}
                                </li>
                            {/each}
                        </ul>
                        
                        <a href="/allianzy" class="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:gap-2 transition-all group-hover:translate-x-1">
                            {t.services.allianzy.link} <ArrowRight class="h-5 w-5 ml-2" />
                        </a>
                    </div>
                </div>

                <!-- Beltix Card -->
                <div class="group relative overflow-hidden rounded-3xl border bg-card p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-100 transition-opacity"></div>
                    <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all"></div>
                    
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-3xl font-bold flex items-center gap-3 font-serif">
                                Beltix Agency
                            </h3>
                            <span class="text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full uppercase tracking-wide">{t.services.beltix.tag}</span>
                        </div>
                        
                        <p class="text-muted-foreground text-lg mb-8 leading-relaxed">
                            {t.services.beltix.desc}
                        </p>
                        
                         <ul class="space-y-4 mb-10">
                             {#each (t.services.beltix.features || []) as feature}
                                <li class="flex items-center gap-3 text-base">
                                    <div class="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1">
                                        <CheckCircle2 class="h-4 w-4 text-purple-600 dark:text-purple-400"/>
                                    </div>
                                    {feature}
                                </li>
                            {/each}
                        </ul>
                        
                        <a href="/beltix" class="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold hover:gap-2 transition-all group-hover:translate-x-1">
                            {t.services.beltix.link} <ArrowRight class="h-5 w-5 ml-2" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t bg-muted/30">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-2xl font-bold mb-8">Allianzy Inc.</h2>
            <div class="flex justify-center gap-8 mb-8 text-muted-foreground">
                <a href="#home" class="hover:text-foreground transition-colors">{t.nav.home}</a>
                <a href="#services" class="hover:text-foreground transition-colors">{t.nav.services}</a>
                <a href="#about" class="hover:text-foreground transition-colors">{t.nav.about}</a>
                <a href="#contact" class="hover:text-foreground transition-colors">{t.nav.contact}</a>
            </div>
            <p class="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Allianzy Inc. {t.footer.rights}</p>
        </div>
    </footer>
</div>
