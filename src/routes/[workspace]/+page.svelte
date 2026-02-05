<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { 
        ArrowRight, CheckCircle2, Share2, Laptop, 
        Megaphone, Palette, Image as ImageIcon, Brain,
        Globe, Menu, X as XIcon, Moon, Sun, Database, FileText, Activity, Star, Layout, 
        ChevronDown, ChevronUp, Linkedin, Instagram, Facebook, Mail,
        Zap, GitBranch, Search, Shield, Users, AlertTriangle, Briefcase, Layers, Languages, ArrowUpRight, TrendingUp, ClipboardCheck, Cpu, Lightbulb
    } from 'lucide-svelte';
    import { currentLang, translations } from '$lib/i18n';

    const serviceIcons = [Briefcase, Layers, Zap, Shield, TrendingUp, ClipboardCheck];

    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import LanguageToggle from '$lib/components/LanguageToggle.svelte';
    import ProcessCarousel from '$lib/components/ProcessCarousel.svelte';
    import { fade, slide } from 'svelte/transition';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    import beltrixLogoLight from '$lib/assets/brand/beltrix/beltrix-logo-light.svg';
    import beltrixLogoDark from '$lib/assets/brand/beltrix/beltrix-logo-dark.svg';

    // Data/Props
    export let data;

    // Reactive Statements
    $: workspace = $page.params.workspace as any;
    $: t = translations[$currentLang];

    // Session State
    // let session: any = null; // Unused
    // let loading = true; // Unused

    // Allianzy Landing Page State
    let isMenuOpen = false;
    let theme: 'light' | 'dark' | 'system' = 'system';
    let isThemeMenuOpen = false;
    let isLangMenuOpen = false;
    let openFaqIndex: number | null = null;

    // Allianzy Process Carousel State
    let activeProcessStep = 0;
    let processInterval: any;

    function startProcessInterval() {
        stopProcessInterval();
        processInterval = setInterval(() => {
            if (t.process?.steps) {
                activeProcessStep = (activeProcessStep + 1) % t.process.steps.length;
            }
        }, 5000); // 5 seconds per step
    }

    function stopProcessInterval() {
        if (processInterval) clearInterval(processInterval);
        processInterval = null;
    }

    function setActiveStep(index: number) {
        activeProcessStep = index;
    }

    function handleProcessMouseEnter() {
        stopProcessInterval();
    }

    function handleProcessMouseLeave() {
        startProcessInterval();
    }

    // Mouse Follower State
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    function handleMouseMove(event: MouseEvent) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    // Beltrix Process Steps
    $: processSteps = t?.beltrix?.process?.steps ? [
        { id: 'eval', ...t.beltrix.process.steps.eval },
        { id: 'diag', ...t.beltrix.process.steps.diag },
        { id: 'arch', ...t.beltrix.process.steps.arch },
        { id: 'scale', ...t.beltrix.process.steps.scale },
        { id: 'measure', ...t.beltrix.process.steps.measure },
        { id: 'opt', ...t.beltrix.process.steps.opt }
    ] : [];

    // Allianzy Functions
    function toggleLang() {
        currentLang.update(l => l === 'en' ? 'es' : 'en');
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        isThemeMenuOpen = false;
        isLangMenuOpen = false;
    }

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

    function toggleFaq(index: number) {
        openFaqIndex = openFaqIndex === index ? null : index;
    }

    // Allianzy Reviews Carousel State
    let activeReviewIndex = 0;
    let reviewsInterval: any;

    function startReviewsInterval() {
        stopReviewsInterval();
        reviewsInterval = setInterval(() => {
            if (t.reviews?.items) {
                activeReviewIndex = (activeReviewIndex + 1) % t.reviews.items.length;
            }
        }, 6000); // 6 seconds per review
    }

    function stopReviewsInterval() {
        if (reviewsInterval) clearInterval(reviewsInterval);
        reviewsInterval = null;
    }

    function setActiveReview(index: number) {
        activeReviewIndex = index;
        startReviewsInterval();
    }

    // Lifecycle
    onMount(() => {
        // Theme Logic
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (savedTheme) theme = savedTheme;
        applyTheme();
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
             if (theme === 'system') applyTheme();
        };
        mediaQuery.addEventListener('change', handleChange);

        // Start Carousels
        startProcessInterval();
        startReviewsInterval();

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
            stopProcessInterval();
            stopReviewsInterval();
        };
    });
</script>

<svelte:head>
    <title>{workspace === 'beltrix' ? 'Beltrix' : 'Allianzy Inc'}</title>
</svelte:head>

<svelte:window on:mousemove={handleMouseMove} bind:scrollY={scrollY} />

{#if workspace === 'allianzy'}
    <!-- NEW ALLIANZY LANDING PAGE DESIGN -->
    <div class="min-h-screen bg-background text-foreground flex flex-col font-bricolage transition-colors duration-300 overflow-x-hidden selection:bg-primary/20 selection:text-primary relative">
        
        <!-- Global Unified Background -->
        <div class="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
             <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/20 blur-[100px] animate-pulse"></div>
             <div class="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" style="animation-delay: 2s;"></div>
             <div class="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-pink-500/20 blur-[100px] animate-pulse" style="animation-delay: 4s;"></div>
             <div class="absolute top-[40%] left-[-20%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" style="animation-duration: 8s;"></div>
             <div class="absolute bottom-[20%] right-[-20%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" style="animation-delay: 3s; animation-duration: 9s;"></div>
        </div>

        <!-- Mouse Follower Effect -->
        <div 
            class="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
            style="
                background: radial-gradient(600px circle at {mouseX}px {mouseY}px, rgba(124, 58, 237, 0.15), transparent 40%);
            "
        ></div>

        <!-- Navbar -->
        <header 
            class="fixed top-0 z-50 w-full transition-all duration-300 {scrollY > 20 ? 'border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm' : 'bg-transparent border-transparent'}"
        >
            <div class="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 relative">
                <div class="flex items-center gap-2">
                    <!-- Logo/Brand -->
                    <a href="#home" class="block">
                         <img src={logoLight} alt="Allianzy" class="h-8 w-auto dark:hidden" />
                         <img src={logoDark} alt="Allianzy" class="h-8 w-auto hidden dark:block" />
                    </a>
                </div>

                <!-- Desktop Nav -->
                <nav class="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
                    <a href="#home" class="transition-colors hover:text-primary relative group">
                        {t.nav.home}
                    </a>
                    <a href="#capabilities" class="transition-colors hover:text-primary">{t.nav.capabilities}</a>
                    <a href="#services" class="transition-colors hover:text-primary">{t.nav.services}</a>
                    <a href="#faq" class="transition-colors hover:text-primary">{t.nav.faq}</a>
                </nav>

                <div class="hidden md:flex items-center gap-4">
                    <div class="flex items-center gap-1">
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

                        <!-- Language Toggle -->
                        <div class="relative">
                            <button 
                                on:click={toggleLangMenu}
                                class="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <Languages class="h-5 w-5" />
                            </button>
                            {#if isLangMenuOpen}
                                <div class="absolute top-full right-0 mt-2 w-36 rounded-md border bg-popover p-1 shadow-md z-50">
                                    <button on:click={() => setLang('en')} class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {$currentLang === 'en' ? 'text-primary' : ''}">
                                        English
                                    </button>
                                    <button on:click={() => setLang('es')} class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent {$currentLang === 'es' ? 'text-primary' : ''}">
                                        Español
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                    
                    {#if data?.user}
                        <a href="/dashboard" class="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                            {t.nav.dashboard}
                        </a>
                    {:else}
                        <div class="flex items-center gap-2">
                            <a href="/allianzy/auth/login" class="px-5 py-2.5 rounded-full bg-transparent text-foreground border border-input text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all">
                                {t.nav.login}
                            </a>
                            <a href="/allianzy/auth/register" class="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                                {t.nav.start_eval}
                            </a>
                        </div>
                    {/if}
                </div>

                <!-- Mobile Menu Button -->
                <button class="md:hidden p-2" on:click={toggleMenu}>
                    {#if isMenuOpen}
                        <XIcon class="h-6 w-6" />
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
                        <a href="#capabilities" class="text-lg font-medium py-2" on:click={toggleMenu}>{t.nav.capabilities}</a>
                        <a href="#services" class="text-lg font-medium py-2" on:click={toggleMenu}>{t.nav.services}</a>
                        <a href="#faq" class="text-lg font-medium py-2" on:click={toggleMenu}>{t.nav.faq}</a>
                        
                        <div class="flex items-center justify-between pt-6 border-t mt-2">
                            <div class="flex items-center gap-2 bg-muted rounded-full p-1">
                                <button on:click={() => setTheme('light')} class="p-2 rounded-full {theme === 'light' ? 'bg-background shadow-sm' : ''}"><Sun class="h-4 w-4" /></button>
                                <button on:click={() => setTheme('dark')} class="p-2 rounded-full {theme === 'dark' ? 'bg-background shadow-sm' : ''}"><Moon class="h-4 w-4" /></button>
                                <button on:click={() => setTheme('system')} class="p-2 rounded-full {theme === 'system' ? 'bg-background shadow-sm' : ''}"><Laptop class="h-4 w-4" /></button>
                            </div>
                            <button on:click={toggleLang} class="flex items-center gap-2 text-sm font-medium border px-3 py-1.5 rounded-md">
                                <Languages class="h-4 w-4" />
                                {$currentLang.toUpperCase()}
                            </button>
                        </div>
                        {#if data?.user}
                            <a href="/dashboard" class="mt-4 block w-full text-center py-3 rounded-lg bg-primary text-primary-foreground font-semibold">
                                {t.nav.dashboard}
                            </a>
                        {:else}
                            <a href="/allianzy/auth/login" class="mt-4 block w-full text-center py-3 rounded-lg bg-transparent border border-input text-foreground font-semibold">
                                {t.nav.login}
                            </a>
                            <a href="/allianzy/auth/register" class="mt-2 block w-full text-center py-3 rounded-lg bg-primary text-primary-foreground font-semibold">
                                {t.nav.start_eval}
                            </a>
                        {/if}
                    </div>
                </div>
            {/if}
        </header>

            <!-- Hero Section -->
             <section id="home" class="relative z-10 flex-1 flex flex-col items-center justify-center py-32 lg:py-48 text-center px-4 overflow-visible">
                <!-- Hero Specific Intense Lights -->
                <div class="absolute inset-0 w-full h-full pointer-events-none -z-10">
                    <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/30 blur-[120px] animate-pulse"></div>
                    <div class="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/30 blur-[120px] animate-pulse" style="animation-delay: 1.5s;"></div>
                    <div class="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-500/30 blur-[120px] animate-pulse" style="animation-delay: 3s;"></div>
                </div>

                <div class="relative z-10 inline-flex overflow-hidden rounded-full p-[1px] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 group cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                    <span class="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#a855f7_50%,#3b82f6_100%)]"></span>
                    <div class="inline-flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-black px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-3xl">
                        <span class="mr-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary tracking-wide">
                            {t.hero.badge?.new}
                        </span>
                        <span class="mr-1">{t.hero.badge?.text}</span>
                        <ArrowRight class="ml-1 h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
    
                <h1 class="relative z-10 text-5xl sm:text-7xl font-bold tracking-tight lg:text-8xl max-w-5xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100 whitespace-pre-line leading-tight">
                    {t.hero.title}
                </h1>
                
                <p class="relative z-10 text-xl sm:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200 whitespace-pre-line">
                    {t.hero.subtitle}
                </p>
    
                <!-- Supporting text removed -->
                
                <div class="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-400 items-center justify-center">
                    <a href="/allianzy/intake" class="px-8 py-4 rounded-full bg-foreground text-background font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 min-w-[160px]">
                        {t.hero.cta}
                    </a>
                    
                    <a href="#how-we-work" class="px-8 py-4 rounded-full border border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-md font-medium text-lg hover:bg-white/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 min-w-[160px] shadow-lg">
                        {t.hero.cta_secondary}
                    </a>
                </div>
            </section>
    
            <!-- Problem Section -->
            <section class="py-12 md:py-24 px-4 relative z-10">
                <div class="container mx-auto max-w-6xl text-center relative z-10">
                    <h2 class="text-3xl md:text-5xl font-bold mb-12">{t.problem.title}</h2>
                    
                    <div class="grid md:grid-cols-3 gap-12 text-left mb-16">
                        {#each t.problem.items as item, i}
                            <div class="flex flex-col items-start gap-4 group">
                                <div class="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                                    <svelte:component this={[Users, FileText, GitBranch][i]} class="w-6 h-6" />
                                </div>
                                <p class="text-lg leading-relaxed text-gray-600 dark:text-white/70">{item}</p>
                            </div>
                        {/each}
                    </div>
                    
                    <div class="space-y-2 text-xl md:text-2xl font-medium text-muted-foreground">
                        <p>{t.problem.closure_1}</p>
                        <p class="text-foreground font-bold">{t.problem.closure_2}</p>
                    </div>
                </div>
            </section>

        <!-- Capabilities Section -->
        <section id="capabilities" class="py-12 md:py-24 px-4 relative">
            <div class="container mx-auto max-w-6xl relative z-10">
                <!-- Bento Box Container -->
                <div class="rounded-[2.5rem] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#05050A]/60 backdrop-blur-3xl overflow-hidden relative grid lg:grid-cols-5 shadow-2xl transition-colors duration-500">
                    
                    <!-- Left: Hero/Gradient Section -->
                    <div class="lg:col-span-2 relative p-8 md:p-12 flex flex-col justify-center overflow-hidden">
                        <!-- Dynamic Gradient Background -->
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/80 to-transparent z-0"></div>
                        <div class="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-pink-500/50 blur-[100px] animate-pulse rounded-full z-0"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/70 dark:to-[#05050A]/60 z-0 opacity-100 transition-colors duration-500"></div>
                        
                        <!-- Content -->
                        <div class="relative z-10 max-w-[85%]">
                            <div class="inline-flex items-center rounded-lg bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-8 text-white shadow-lg">
                                {t.capabilities.badge}
                            </div>
                            
                            <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                                {t.capabilities.title}
                            </h2>
                            
                            <p class="text-lg text-white/90 mb-10 max-w-md leading-relaxed font-medium">
                                {t.hero.subtitle}
                            </p>
                            
                            <a href="/allianzy/intake" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 hover:scale-105 transition-all shadow-xl">
                                {t.hero.cta}
                            </a>
                        </div>
                    </div>

                    <!-- Right: Grid Items -->
                    <div class="lg:col-span-3 bg-transparent p-8 md:p-12 grid sm:grid-cols-2 gap-x-8 gap-y-12 relative z-10">
                         <!-- Custom Designed Systems -->
                        <div class="group">
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5 text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">
                                <GitBranch class="w-6 h-6" />
                            </div>
                            <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-3 transition-colors">{t.capabilities.items.custom.title}</h3>
                            <p class="text-gray-600 dark:text-white/60 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors">{t.capabilities.items.custom.desc}</p>
                        </div>

                        <!-- Automation -->
                        <div class="group">
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5 text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">
                                <Zap class="w-6 h-6" />
                            </div>
                            <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-3 transition-colors">{t.capabilities.items.automation.title}</h3>
                            <p class="text-gray-600 dark:text-white/60 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors">{t.capabilities.items.automation.desc}</p>
                        </div>

                        <!-- Platform -->
                        <div class="group">
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5 text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">
                                <Layers class="w-6 h-6" />
                            </div>
                            <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-3 transition-colors">{t.capabilities.items.platform.title}</h3>
                            <p class="text-gray-600 dark:text-white/60 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors">{t.capabilities.items.platform.desc}</p>
                        </div>

                        <!-- Consulting -->
                        <div class="group">
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5 text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">
                                <Search class="w-6 h-6" />
                            </div>
                            <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-3 transition-colors">{t.capabilities.items.consulting.title}</h3>
                            <p class="text-gray-600 dark:text-white/60 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors">{t.capabilities.items.consulting.desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Comparison Table (Simple Table Only) -->
        <section class="py-12 md:py-24 px-4 relative">
             <div class="container mx-auto max-w-5xl relative z-10">
                <!-- Title -->
                <div class="mb-16 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                        {t.why_allianzy.title}
                    </h2>
                </div>

                <!-- Header -->
                <div class="grid grid-cols-2 pb-6 border-b border-gray-200 dark:border-white/10 mb-2">
                    <div class="text-lg font-semibold flex items-center gap-3 text-muted-foreground">
                        <Users class="w-5 h-5" />
                        <span>{t.why_allianzy.traditional.title}</span>
                    </div>
                    <div class="text-lg font-semibold flex items-center gap-3 text-gray-900 dark:text-white pl-6">
                        <Shield class="w-5 h-5" />
                        <span>{t.why_allianzy.allianzy.title}</span>
                    </div>
                </div>
                
                <!-- Rows -->
                <div class="space-y-0">
                     {#each t.why_allianzy.traditional.items as item, i}
                        <div class="grid grid-cols-2 border-b border-gray-200 dark:border-white/10 last:border-0 group transition-colors py-6">
                            <div class="pr-6 flex items-start gap-3 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                                <XIcon class="w-5 h-5 text-red-500/50 group-hover:text-red-500 shrink-0 mt-1 transition-colors" />
                                <span>{item}</span>
                            </div>
                            <div class="pl-6 flex items-start gap-3 font-medium text-gray-700 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors relative">
                                <!-- Active Indicator (Vertical Line) -->
                                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-primary group-hover:h-full transition-all duration-300"></div>
                                
                                <CheckCircle2 class="w-5 h-5 text-primary shrink-0 mt-1" />
                                <span>{t.why_allianzy.allianzy.items[i]}</span>
                            </div>
                        </div>
                     {/each}
                </div>
             </div>
        </section>




        <!-- Process Flow Animation (Responsive: Horizontal small on Mobile / Horizontal large on Desktop) -->
        <section class="py-12 md:py-24 px-4 relative">
             <div class="container mx-auto max-w-6xl relative z-10 flex justify-center">
                <!-- Animated Process Flow -->
                <div class="relative flex items-center gap-0 w-full justify-center md:justify-between">
                    <!-- Styles for the animation -->
                    <style>
                        @keyframes flow-line-horizontal {
                            0%, 100% { background-position: -100% 0%; opacity: 0.3; }
                            50% { background-position: 100% 0%; opacity: 1; }
                        }
                        @keyframes pulse-block {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
                            50% { box-shadow: 0 0 50px 10px rgba(168, 85, 247, 0.4); border-color: rgba(168, 85, 247, 0.9); }
                        }
                        
                        /* Updated duration to 4.8s for 6 steps (0.8s intervals) */
                        .block-pulse-1 { animation: pulse-block 4.8s infinite ease-in-out 0s; }
                        .block-pulse-2 { animation: pulse-block 4.8s infinite ease-in-out 0.8s; }
                        .block-pulse-3 { animation: pulse-block 4.8s infinite ease-in-out 1.6s; }
                        .block-pulse-4 { animation: pulse-block 4.8s infinite ease-in-out 2.4s; }
                        .block-pulse-5 { animation: pulse-block 4.8s infinite ease-in-out 3.2s; }
                        .block-pulse-6 { animation: pulse-block 4.8s infinite ease-in-out 4.0s; }
                        
                        /* Responsive animations for lines */
                        .line-flow-1 { animation: flow-line-horizontal 4.8s infinite linear 0.4s; }
                        .line-flow-2 { animation: flow-line-horizontal 4.8s infinite linear 1.2s; }
                        .line-flow-3 { animation: flow-line-horizontal 4.8s infinite linear 2.0s; }
                        .line-flow-4 { animation: flow-line-horizontal 4.8s infinite linear 2.8s; }
                        .line-flow-5 { animation: flow-line-horizontal 4.8s infinite linear 3.6s; }
                    </style>

                    <!-- Step 1: Input -->
                    <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-1 shadow-sm shrink-0">
                        <Database class="w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70" />
                    </div>
                    
                    <!-- Connector 1 -->
                    <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]">
                        <div class="absolute inset-0 w-full h-full line-flow-1 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    </div>

                    <!-- Step 2: Analysis -->
                    <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-2 shadow-sm shrink-0">
                        <Search class="w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70" />
                    </div>

                    <!-- Connector 2 -->
                    <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]">
                        <div class="absolute inset-0 w-full h-full line-flow-2 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    </div>

                    <!-- Step 3: Processing -->
                    <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-3 shadow-sm shrink-0">
                        <Cpu class="w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70" />
                    </div>

                    <!-- Connector 3 -->
                    <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]">
                        <div class="absolute inset-0 w-full h-full line-flow-3 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    </div>

                    <!-- Step 4: Integration -->
                    <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-4 shadow-sm shrink-0">
                        <GitBranch class="w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70" />
                    </div>

                    <!-- Connector 4 -->
                    <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]">
                        <div class="absolute inset-0 w-full h-full line-flow-4 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    </div>

                    <!-- Step 5: Output -->
                    <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-5 shadow-sm shrink-0">
                        <Lightbulb class="w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70" />
                    </div>

                    <!-- Connector 5 -->
                    <div class="h-0.5 flex-1 bg-gray-200 dark:bg-white/10 relative overflow-hidden min-w-[8px] md:min-w-[40px]">
                        <div class="absolute inset-0 w-full h-full line-flow-5 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    </div>

                    <!-- Step 6: Growth -->
                    <div class="relative z-10 w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all duration-300 block-pulse-6 shadow-sm shrink-0">
                        <TrendingUp class="w-4 h-4 md:w-8 md:h-8 text-gray-500 dark:text-white/70" />
                    </div>
                </div>
             </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="py-12 md:py-24 px-4 relative">
            <div class="container mx-auto max-w-6xl relative z-10">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-5xl font-bold mb-4">{t.services.title}</h2>
                    <p class="text-xl text-muted-foreground">{t.services.principle}</p>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {#each t.services.items as item, i}
                        <div class="group relative p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur-2xl hover:bg-white/80 dark:hover:bg-purple-500/5 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all duration-500 overflow-hidden shadow-[0_0_30px_-10px_rgba(168,85,247,0.1)] dark:shadow-[0_0_30px_-10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.2)] dark:hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.15)]">
                            <!-- Glow Effect -->
                            <div class="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 dark:bg-purple-600/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 dark:group-hover:bg-purple-600/20 transition-all duration-500"></div>
                            
                            <!-- Icon -->
                            <div class="relative z-10 mb-12 flex items-start justify-between">
                                <div class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-white/80 group-hover:scale-110 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/10 group-hover:border-purple-300 dark:group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-500 shadow-[0_0_15px_-5px_rgba(168,85,247,0.1)]">
                                    <svelte:component this={serviceIcons[i] || Briefcase} class="w-7 h-7" />
                                </div>
                                <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                    <ArrowUpRight class="w-6 h-6 text-purple-500 dark:text-purple-400/80" />
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="relative z-10">
                                <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">{item.title}</h3>
                                <p class="text-base text-muted-foreground leading-relaxed group-hover:text-gray-600 dark:group-hover:text-purple-100/70 transition-colors duration-300">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- How We Work -->
        <section id="how-we-work" class="py-12 md:py-24 px-4 relative">
            <div class="container mx-auto max-w-6xl relative z-10">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-5xl font-bold mb-6">{t.process.title}</h2>
                </div>

                <div class="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start relative">
                    <!-- Left: Steps List -->
                    <div class="space-y-6 relative" role="region" aria-label="Process steps" on:mouseenter={handleProcessMouseEnter} on:mouseleave={handleProcessMouseLeave}>
                        <!-- Vertical Line (Desktop only) -->
                        <div class="hidden lg:block absolute top-8 bottom-8 right-[-48px] w-px bg-border/50"></div>
                        
                         {#each t.process.steps as step, i}
                            <div class="relative">
                                <button 
                                    class="w-full text-left p-6 rounded-2xl transition-all duration-300 border flex flex-col gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-primary relative z-10
                                    {activeProcessStep === i 
                                        ? 'bg-card border-primary/50 shadow-lg scale-[1.02]' 
                                        : 'bg-card/30 border-transparent hover:bg-card/50 opacity-60 hover:opacity-100'}"
                                    on:click={() => setActiveStep(i)}
                                    on:mouseenter={() => setActiveStep(i)}
                                >
                                    <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                                        {$currentLang === 'en' ? 'Step' : 'Paso'} {i + 1}
                                    </span>
                                    <h3 class="text-xl font-bold text-foreground {activeProcessStep === i ? 'text-primary' : ''}">
                                        {step.title}
                                    </h3>
                                </button>

                                <!-- Dot Indicator (Desktop only) -->
                                <div class="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-[-54px] z-20 items-center justify-center w-3 h-3 rounded-full transition-all duration-300
                                    {activeProcessStep === i 
                                        ? 'bg-background border-2 border-primary scale-150 shadow-[0_0_15px_rgba(124,58,237,0.5)]' 
                                        : 'bg-background border border-muted-foreground/30'}">
                                    {#if activeProcessStep === i}
                                        <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                    {/if}
                                </div>
                            </div>
                         {/each}
                    </div>

                    <!-- Right: Detail Card -->
                    <div class="lg:sticky lg:top-32 mt-8 lg:mt-0">
                        <div class="relative h-[520px] lg:h-[580px] rounded-3xl overflow-hidden border border-white/10 bg-card/30 backdrop-blur-xl shadow-2xl flex flex-col transition-all duration-500 group">
                            <!-- Gradient Glow -->
                             <div class="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full transition-all duration-500 opacity-50 group-hover:opacity-100 pointer-events-none"></div>
                             <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full transition-all duration-500 opacity-50 group-hover:opacity-100 pointer-events-none"></div>
                             
                             <div class="relative z-10 p-8 md:p-12 pb-0 flex-1">
                                <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-xl mb-6 shadow-inner">
                                    {activeProcessStep + 1}
                                </div>
                                
                                {#key activeProcessStep}
                                    <div in:slide={{ duration: 300, axis: 'y' }}>
                                        <h3 class="text-2xl md:text-3xl font-bold mb-4 text-foreground leading-tight">
                                            {t.process.steps[activeProcessStep].title}
                                        </h3>
                                        <p class="text-lg text-muted-foreground leading-relaxed mb-8">
                                            {t.process.steps[activeProcessStep].desc}
                                        </p>
                                    </div>
                                {/key}
                             </div>

                             <!-- Step Image -->
                             <div class="relative w-full h-64 mt-auto overflow-hidden" style="mask-image: linear-gradient(to bottom, transparent, black 40%); -webkit-mask-image: linear-gradient(to bottom, transparent, black 40%);">
                                {#key activeProcessStep}
                                    <div class="absolute inset-0" in:fade={{ duration: 600 }}>
                                        <img 
                                            src={t.process.steps[activeProcessStep].image} 
                                            alt={t.process.steps[activeProcessStep].title}
                                            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                {/key}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Reviews -->
        <section class="py-12 md:py-24 px-4 relative">
            <div class="container mx-auto max-w-4xl relative z-10">
                <div class="text-center mb-16">
                    
                    {#if t.reviews.items && t.reviews.items.length > 0}
                        <div class="relative min-h-[600px] md:min-h-[500px] flex flex-col items-center justify-center">
                            {#key activeReviewIndex}
                                <div in:fade={{ duration: 500 }} class="absolute inset-0 flex flex-col items-center justify-center">
                                    <div class="text-center px-4">
                                        <blockquote class="text-xl md:text-3xl font-medium leading-relaxed mb-10 text-foreground/90 max-w-3xl mx-auto">
                                            "{t.reviews.items[activeReviewIndex].quote}"
                                        </blockquote>
                                        
                                        <div class="flex flex-col items-center gap-4">
                                            <div class="h-16 w-32 flex items-center justify-center">
                                                <img 
                                                    src={t.reviews.items[activeReviewIndex].logo} 
                                                    alt={t.reviews.items[activeReviewIndex].company} 
                                                    class="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                            <div class="text-center">
                                                <div class="font-bold text-lg">{t.reviews.items[activeReviewIndex].author}</div>
                                                <div class="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t.reviews.items[activeReviewIndex].company}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/key}
                        </div>

                        <!-- Dots Navigation -->
                        <div class="flex justify-center gap-3 mt-4">
                            {#each t.reviews.items as _, i}
                                <button 
                                    class="w-2.5 h-2.5 rounded-full transition-all duration-300 {activeReviewIndex === i ? 'bg-primary w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}"
                                    aria-label="Go to review {i + 1}"
                                    on:click={() => setActiveReview(i)}
                                ></button>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section id="faq" class="py-12 md:py-24 px-4 relative isolate overflow-hidden">
             <!-- Subtle Background -->
             <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div class="absolute top-[20%] right-[30%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[90px] animate-pulse" style="animation-duration: 9s;"></div>
            </div>

            <div class="container mx-auto max-w-3xl relative z-10">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold">{t.faq.title}</h2>
                </div>
                
                <div class="space-y-4">
                    {#each t.faq.items as item, i}
                        <div class="border border-white/10 rounded-xl overflow-hidden bg-white/5 dark:bg-white/5 backdrop-blur-md transition-all duration-300 hover:shadow-md hover:bg-white/10 dark:hover:bg-white/10">
                            <button 
                                class="w-full flex items-center justify-between p-5 text-left font-medium hover:text-primary transition-colors"
                                on:click={() => toggleFaq(i)}
                            >
                                {item.q}
                                {#if openFaqIndex === i}
                                    <ChevronUp class="w-4 h-4 text-muted-foreground" />
                                {:else}
                                    <ChevronDown class="w-4 h-4 text-muted-foreground" />
                                {/if}
                            </button>
                            {#if openFaqIndex === i}
                                <div transition:slide class="p-5 text-muted-foreground leading-relaxed border-t border-white/10 bg-black/5 dark:bg-white/5">
                                    {item.a}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Bottom CTA -->
        <section class="py-12 md:py-24 px-4 relative isolate overflow-hidden">
             <!-- Background elements matching other sections -->
             <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-primary/10 blur-[100px] animate-pulse"></div>
            </div>

            <div class="container mx-auto max-w-6xl relative z-10">
                <div class="relative rounded-3xl overflow-hidden border border-white/10 bg-transparent shadow-2xl shadow-blue-500/20 group">
                    
                    <!-- Grid Pattern Overlay -->
                    <div class="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

                    <!-- Decorative Curved Glows (Corners) -->
                    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/40 blur-[80px] rounded-full group-hover:bg-blue-500/50 transition-all duration-500"></div>
                    <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/40 blur-[80px] rounded-full group-hover:bg-purple-500/50 transition-all duration-500"></div>
                    
                    <!-- Center Bottom Glow -->
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/3 bg-gradient-to-t from-pink-500/20 to-transparent blur-3xl opacity-50"></div>

                    <!-- Content -->
                    <div class="relative z-10 px-8 py-20 md:py-32 text-center">
                        <h2 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-foreground drop-shadow-sm">
                            {t.cta_final.title}
                        </h2>
                        <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                            {t.cta_final.subtitle}
                        </p>
                        
                        <a href="/allianzy/intake" class="px-10 py-5 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 border border-white/10 shadow-lg shadow-primary/20">
                            {t.cta_final.button} <ArrowRight class="w-5 h-5" />
                        </a>
                    </div>
                    
                    <!-- Grain/Texture Overlay -->
                    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-16 border-t bg-muted/10 text-sm">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-4 gap-12 mb-12">
                    <div class="col-span-1 md:col-span-1">
                        <div class="flex items-center gap-2 mb-4">
                             <img src={logoLight} alt="Allianzy" class="h-8 w-auto dark:hidden" />
                             <img src={logoDark} alt="Allianzy" class="h-8 w-auto hidden dark:block" />
                        </div>
                        <p class="text-muted-foreground mb-4">
                            {t.footer.desc}
                        </p>
                        <div class="flex gap-4">
                            <a href="https://www.linkedin.com/company/allianzyinc/" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors"><Linkedin class="w-4 h-4" /></a>
                            <a href="https://www.instagram.com/allianzy.inc/" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors"><Instagram class="w-4 h-4" /></a>
                            <a href="https://www.facebook.com/allianzy.inc" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors"><Facebook class="w-4 h-4" /></a>
                            <a href="mailto:support@allianzy.us" class="text-muted-foreground hover:text-foreground transition-colors"><Mail class="w-4 h-4" /></a>
                        </div>
                    </div>
                    
                    <div class="col-span-1 md:col-span-3 flex justify-end">
                        <div>
                            <h3 class="font-semibold mb-4">{t.footer.menu.title}</h3>
                            <ul class="space-y-2 text-muted-foreground">
                                <li><a href="#home" class="hover:text-foreground transition-colors">{t.footer.menu.home}</a></li>
                                <li><a href="#capabilities" class="hover:text-foreground transition-colors">{t.footer.menu.capabilities}</a></li>
                                <li><a href="#services" class="hover:text-foreground transition-colors">{t.footer.menu.services}</a></li>
                                <li><a href="#faq" class="hover:text-foreground transition-colors">{t.footer.menu.faq}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
                    <p>&copy; {new Date().getFullYear()} Allianzy Inc. {t.footer.rights}</p>
                    <div class="flex gap-6">
                        <a href="/" class="hover:text-foreground transition-colors">{t.footer.privacy}</a>
                        <a href="/" class="hover:text-foreground transition-colors">{t.footer.terms}</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>

{:else if workspace === 'beltrix'}
    <!-- BELTRIX LANDING PAGE (Creative / Agency / Dark Mode) -->
    <div class="min-h-screen bg-white dark:bg-black text-black dark:text-white font-merriweather selection:bg-purple-500 selection:text-white transition-colors duration-300">
        <!-- Navigation -->
        <nav class="fixed w-full z-50 top-0 px-6 py-6 text-black dark:text-white transition-colors duration-300">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <a href="/beltrix" class="block">
                    <img src={beltrixLogoLight} alt="Beltrix" class="h-8 w-auto dark:hidden" />
                    <img src={beltrixLogoDark} alt="Beltrix" class="h-8 w-auto hidden dark:block" />
                </a>
                <div class="flex gap-6 items-center">
                    <LanguageToggle />
                    <ThemeToggle />
                    <a href="/beltrix/auth/login" class="text-sm font-bold uppercase tracking-widest hover:text-purple-400 transition-colors">{t.beltrix.nav.login}</a>
                    <a href="/beltrix/dashboard" class="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                        {t.beltrix.nav.start}
                    </a>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-white dark:via-black to-white dark:to-black transition-colors duration-300"></div>
            
            <div class="relative z-10 text-center max-w-5xl mx-auto px-4">
                <h1 class="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-b from-black to-neutral-500 dark:from-white dark:to-neutral-500">
                    {@html t.beltrix.hero.title}
                </h1>
                <p class="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12 font-light">
                    {t.beltrix.hero.subtitle}
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a href="/dashboard" class="group relative px-8 py-4 bg-transparent border border-neutral-200 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors rounded-full overflow-hidden">
                        <span class="relative z-10 font-bold uppercase tracking-widest text-sm text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors">{t.beltrix.hero.enter}</span>
                        <div class="absolute inset-0 bg-black dark:bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0"></div>
                        <span class="absolute inset-0 z-10 flex items-center justify-center font-bold uppercase tracking-widest text-sm text-white dark:text-black translate-y-full group-hover:translate-y-0 transition-transform duration-300">{t.beltrix.hero.enter}</span>
                    </a>
                </div>
            </div>
        </section>

        <!-- Marquee / Ticker -->
        <div class="border-y border-neutral-200 dark:border-white/10 py-4 bg-white dark:bg-black overflow-hidden whitespace-nowrap transition-colors duration-300">
            <div class="inline-block animate-marquee">
                <span class="text-4xl font-bold uppercase text-transparent stroke-text px-8">{t.beltrix.ticker.strategy}</span>
                <span class="text-4xl font-bold uppercase text-black dark:text-white px-8">{t.beltrix.ticker.design}</span>
                <span class="text-4xl font-bold uppercase text-transparent stroke-text px-8">{t.beltrix.ticker.dev}</span>
                <span class="text-4xl font-bold uppercase text-black dark:text-white px-8">{t.beltrix.ticker.branding}</span>
                <span class="text-4xl font-bold uppercase text-transparent stroke-text px-8">{t.beltrix.ticker.marketing}</span>
                <span class="text-4xl font-bold uppercase text-black dark:text-white px-8">{t.beltrix.ticker.content}</span>
            </div>
        </div>

        <!-- Services Grid -->
        <section class="py-32 px-4 bg-slate-50 dark:bg-black transition-colors duration-300">
            <div class="max-w-7xl mx-auto">
                <div class="mb-20">
                    <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-black dark:text-white transition-colors">{t.beltrix.services.title}</h2>
                    <div class="h-1 w-20 bg-purple-600"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <!-- Column 1 -->
                    <div class="space-y-12">
                        <!-- Social Media Management -->
                        <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none">
                            <div class="aspect-[4/3] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop" alt="Social Media" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div class="p-8 md:p-10 relative">
                                <div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">
                                    <Share2 class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t.beltrix.services.social.title}</h3>
                                <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">
                                    {t.beltrix.services.social.desc}
                                </p>
                                <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    {t.beltrix.services.social.cta} <ArrowRight class="ml-2 w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <!-- Digital Advertising -->
                        <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none">
                             <div class="aspect-[4/3] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Digital Ads" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div class="p-8 md:p-10 relative">
                                <div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">
                                    <Megaphone class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t.beltrix.services.ads.title}</h3>
                                <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">
                                    {t.beltrix.services.ads.desc}
                                </p>
                                <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    {t.beltrix.services.ads.cta} <ArrowRight class="ml-2 w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <!-- Social Media Design -->
                        <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none">
                             <div class="aspect-[4/3] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=2070&auto=format&fit=crop" alt="Design" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div class="p-8 md:p-10 relative">
                                <div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">
                                    <ImageIcon class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t.beltrix.services.design.title}</h3>
                                <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">
                                    {t.beltrix.services.design.desc}
                                </p>
                                <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    {t.beltrix.services.design.cta} <ArrowRight class="ml-2 w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2 (Staggered) -->
                    <div class="space-y-12 md:pt-32">
                        <!-- Professional Website -->
                        <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none">
                             <div class="aspect-[4/3] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" alt="Website" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div class="p-8 md:p-10 relative">
                                <div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">
                                    <Laptop class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t.beltrix.services.web.title}</h3>
                                <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">
                                    {t.beltrix.services.web.desc}
                                </p>
                                <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    {t.beltrix.services.web.cta} <ArrowRight class="ml-2 w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <!-- Visual Branding -->
                        <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none">
                             <div class="aspect-[4/3] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2070&auto=format&fit=crop" alt="Branding" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div class="p-8 md:p-10 relative">
                                <div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">
                                    <Palette class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t.beltrix.services.brand.title}</h3>
                                <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">
                                    {t.beltrix.services.brand.desc}
                                </p>
                                <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    {t.beltrix.services.brand.cta} <ArrowRight class="ml-2 w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <!-- Digital Consulting -->
                        <div class="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-500 shadow-sm dark:shadow-none">
                             <div class="aspect-[4/3] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" alt="Consulting" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div class="p-8 md:p-10 relative">
                                <div class="absolute top-0 right-0 -translate-y-1/2 mr-8 md:mr-10 w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">
                                    <Brain class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 class="text-3xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t.beltrix.services.consulting.title}</h3>
                                <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">
                                    {t.beltrix.services.consulting.desc}
                                </p>
                                <a href="/contact" class="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black dark:text-white border-b border-purple-500 pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    {t.beltrix.services.consulting.cta} <ArrowRight class="ml-2 w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Process Section (Continuous Optimization) -->
        <section class="py-32 bg-white dark:bg-black transition-colors duration-300 border-t border-neutral-200 dark:border-neutral-800">
            <div class="max-w-7xl mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-black dark:text-white transition-colors">
                        {t.beltrix.process.title}
                    </h2>
                    <p class="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-light max-w-3xl mx-auto">
                        {t.beltrix.process.subtitle}
                    </p>
                </div>

                <!-- New Carousel Component -->
                <ProcessCarousel steps={processSteps} />
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="py-32 bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
            <div class="max-w-7xl mx-auto px-6">
                <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 text-center text-black dark:text-white transition-colors">
                    {t.beltrix.testimonials.title}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {#each t.beltrix.testimonials.items as item}
                        <div class="bg-white dark:bg-black p-10 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all duration-300 shadow-sm dark:shadow-none">
                            <div class="mb-8">
                                {#each Array(5) as _}
                                    <span class="text-purple-500">★</span>
                                {/each}
                            </div>
                            <p class="text-xl font-medium mb-8 leading-relaxed text-neutral-800 dark:text-neutral-200">"{item.quote}"</p>
                            <div>
                                <p class="font-bold text-black dark:text-white uppercase tracking-wider">{item.author}</p>
                                <p class="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{item.role}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section class="py-32 bg-white dark:bg-black transition-colors duration-300 border-t border-neutral-200 dark:border-neutral-800">
            <div class="max-w-4xl mx-auto px-6">
                <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 text-center text-black dark:text-white transition-colors">
                    {t.beltrix.faq.title}
                </h2>
                <div class="space-y-6">
                    {#each t.beltrix.faq.items as item}
                        <div class="group border-b border-neutral-200 dark:border-neutral-800 pb-6">
                            <h3 class="text-2xl font-bold mb-4 text-black dark:text-white group-hover:text-purple-500 transition-colors cursor-pointer flex justify-between items-center">
                                {item.q}
                                <span class="text-purple-500">+</span>
                            </h3>
                            <p class="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                                {item.a}
                            </p>
                        </div>
                    {/each}
                </div>
            </div>
        </section>
    </div>
{/if}

<style>
    .fill-mode-both {
        animation-fill-mode: both;
    }
    .stroke-text {
        -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
    }
</style>