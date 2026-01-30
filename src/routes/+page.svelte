<script lang="ts">
    import { currentLang, translations } from '$lib/i18n';
    import { Globe, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-svelte';
    import { fade, slide } from 'svelte/transition';

    let isMenuOpen = false;

    $: t = translations[$currentLang];

    function toggleLang() {
        currentLang.update(l => l === 'en' ? 'es' : 'en');
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }
</script>

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="container flex h-16 items-center justify-between px-4 md:px-8">
            <div class="flex items-center gap-2">
                <span class="text-xl font-bold tracking-tight">Allianzy Inc.</span>
            </div>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
                <a href="#home" class="transition-colors hover:text-primary">{t.nav.home}</a>
                <div class="relative group">
                    <button class="flex items-center gap-1 transition-colors hover:text-primary focus:outline-none">
                        {t.nav.services}
                    </button>
                    <!-- Dropdown -->
                    <div class="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div class="rounded-md border bg-popover p-2 shadow-md">
                            <a href="/beltix" class="block rounded-sm px-3 py-2 hover:bg-accent hover:text-accent-foreground">
                                {t.services.beltix.title}
                            </a>
                            <a href="/allianzy" class="block rounded-sm px-3 py-2 hover:bg-accent hover:text-accent-foreground">
                                {t.services.allianzy.title}
                            </a>
                        </div>
                    </div>
                </div>
                <a href="#about" class="transition-colors hover:text-primary">{t.nav.about}</a>
                <a href="#contact" class="transition-colors hover:text-primary">{t.nav.contact}</a>
            </nav>

            <div class="hidden md:flex items-center gap-4">
                <button 
                    on:click={toggleLang}
                    class="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                    <Globe class="h-4 w-4" />
                    {$currentLang.toUpperCase()}
                </button>
                <a href="/allianzy/auth/login" class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
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
                    <a href="#home" class="text-sm font-medium" on:click={toggleMenu}>{t.nav.home}</a>
                    <div class="space-y-2">
                        <p class="text-sm font-medium text-muted-foreground">{t.nav.services}</p>
                        <a href="/beltix" class="block pl-4 text-sm" on:click={toggleMenu}>• {t.services.beltix.title}</a>
                        <a href="/allianzy" class="block pl-4 text-sm" on:click={toggleMenu}>• {t.services.allianzy.title}</a>
                    </div>
                    <a href="#about" class="text-sm font-medium" on:click={toggleMenu}>{t.nav.about}</a>
                    <a href="#contact" class="text-sm font-medium" on:click={toggleMenu}>{t.nav.contact}</a>
                    <div class="flex items-center justify-between pt-4 border-t">
                        <button on:click={toggleLang} class="flex items-center gap-2 text-sm font-medium">
                            <Globe class="h-4 w-4" />
                            {$currentLang.toUpperCase()}
                        </button>
                         <a href="/allianzy/auth/login" class="text-sm font-medium text-primary">
                            {t.nav.login}
                        </a>
                    </div>
                </div>
            </div>
        {/if}
    </header>

    <!-- Hero Section -->
    <section id="home" class="flex-1 flex flex-col items-center justify-center py-24 text-center px-4 bg-gray-50 dark:bg-zinc-900">
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight lg:text-7xl max-w-4xl mb-6">
            {t.hero.title}
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mb-10">
            {t.hero.subtitle}
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
            <a href="/allianzy/intake" class="px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2">
                {t.hero.cta} <ArrowRight class="h-5 w-5" />
            </a>
            <a href="/beltix" class="px-8 py-3 rounded-md border border-input bg-background font-semibold text-lg hover:bg-accent hover:text-accent-foreground transition-all">
                {t.services.beltix.title}
            </a>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-24 px-4 bg-background">
        <div class="container mx-auto">
            <h2 class="text-3xl font-bold text-center mb-16">{t.services.title}</h2>
            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <!-- Allianzy Card -->
                <div class="group relative overflow-hidden rounded-xl border bg-card p-8 hover:shadow-lg transition-all duration-300">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                        Allianzy
                        <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Premium</span>
                    </h3>
                    <p class="text-muted-foreground mb-6 h-20">
                        {t.services.allianzy.desc}
                    </p>
                    <ul class="space-y-2 mb-8 text-sm">
                        <li class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-green-500"/> Engineering</li>
                        <li class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-green-500"/> Consulting</li>
                        <li class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-green-500"/> Staff Augmentation</li>
                    </ul>
                    <a href="/allianzy" class="inline-flex items-center text-primary font-medium hover:underline">
                        {t.services.allianzy.link} <ArrowRight class="h-4 w-4 ml-1" />
                    </a>
                </div>

                <!-- Beltix Card -->
                <div class="group relative overflow-hidden rounded-xl border bg-card p-8 hover:shadow-lg transition-all duration-300">
                     <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 class="text-2xl font-bold mb-4 font-serif flex items-center gap-2">
                        Beltix Agency
                        <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Creative</span>
                    </h3>
                    <p class="text-muted-foreground mb-6 h-20">
                        {t.services.beltix.desc}
                    </p>
                     <ul class="space-y-2 mb-8 text-sm">
                        <li class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-purple-500"/> Branding</li>
                        <li class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-purple-500"/> UI/UX Design</li>
                        <li class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-purple-500"/> Marketing</li>
                    </ul>
                    <a href="/beltix" class="inline-flex items-center text-purple-600 font-medium hover:underline">
                        {t.services.beltix.link} <ArrowRight class="h-4 w-4 ml-1" />
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 border-t bg-muted/20">
        <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Allianzy Inc. {t.footer.rights}</p>
        </div>
    </footer>
</div>
