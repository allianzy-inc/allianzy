<script lang="ts">
    import { page } from '$app/stores';
    import { ArrowRight, CheckCircle2, LayoutGrid, ShieldCheck, Zap, Share2, Laptop, Megaphone, Palette, Image as ImageIcon, Brain } from 'lucide-svelte';
    import { currentLang, translations } from '$lib/i18n';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import LanguageToggle from '$lib/components/LanguageToggle.svelte';
    import ProcessCarousel from '$lib/components/ProcessCarousel.svelte';

    export let data;

    $: workspace = $page.params.workspace;
    $: t = translations[$currentLang];
    
    $: processSteps = [
        { id: 'eval', ...t.beltrix.process.steps.eval },
        { id: 'diag', ...t.beltrix.process.steps.diag },
        { id: 'arch', ...t.beltrix.process.steps.arch },
        { id: 'scale', ...t.beltrix.process.steps.scale },
        { id: 'measure', ...t.beltrix.process.steps.measure },
        { id: 'opt', ...t.beltrix.process.steps.opt }
    ];
</script>

{#if workspace === 'allianzy'}
    <!-- ALLIANZY LANDING PAGE (Enterprise / Engineering) -->
    <div class="min-h-screen bg-white text-slate-900 font-sans">
        <!-- Navigation -->
        <nav class="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <span class="text-xl font-bold tracking-tight text-slate-900">Allianzy<span class="text-blue-600">.</span></span>
                <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#services" class="hover:text-blue-600 transition-colors">Solutions</a>
                    <a href="#about" class="hover:text-blue-600 transition-colors">About</a>
                    <a href="#contact" class="hover:text-blue-600 transition-colors">Contact</a>
                </div>
                <div class="flex items-center gap-4">
                     <a href="/allianzy/auth/login" class="text-sm font-medium text-slate-600 hover:text-slate-900">Sign In</a>
                    <a href="/allianzy/dashboard" class="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                        Client Portal
                    </a>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative pt-24 pb-32 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="max-w-3xl">
                    <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        Premium Engineering <br>
                        <span class="text-blue-600">Solutions</span> for Scale.
                    </h1>
                    <p class="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                        We architect robust, scalable software systems for enterprise clients. 
                        Security, performance, and reliability are not optional.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="/auth/login" class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                            Access Dashboard
                            <ArrowRight class="ml-2 w-5 h-5" />
                        </a>
                        <a href="#services" class="inline-flex items-center justify-center px-8 py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl font-semibold hover:bg-slate-100 transition-all">
                            View Services
                        </a>
                    </div>
                </div>
            </div>
            <!-- Abstract Background Pattern -->
            <div class="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-bl from-blue-50 to-transparent opacity-50 blur-3xl"></div>
        </section>

        <!-- Features Grid -->
        <section class="py-24 bg-slate-50" id="services">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-3 gap-12">
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                            <ShieldCheck class="w-6 h-6" />
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-slate-900">Enterprise Security</h3>
                        <p class="text-slate-600 leading-relaxed">Bank-grade encryption and compliance standards built into every layer of your infrastructure.</p>
                    </div>
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                            <Zap class="w-6 h-6" />
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-slate-900">High Performance</h3>
                        <p class="text-slate-600 leading-relaxed">Optimized for milliseconds. We build systems that handle millions of requests without breaking a sweat.</p>
                    </div>
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                            <LayoutGrid class="w-6 h-6" />
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-slate-900">Scalable Architecture</h3>
                        <p class="text-slate-600 leading-relaxed">Modular, microservices-ready codebases designed to grow with your business needs.</p>
                    </div>
                </div>
            </div>
        </section>


    </div>

{:else if workspace === 'beltrix'}
    <!-- BELTRIX LANDING PAGE (Creative / Agency / Dark Mode) -->
    <div class="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-purple-500 selection:text-white transition-colors duration-300">
        <!-- Navigation -->
        <nav class="fixed w-full z-50 top-0 px-6 py-6 mix-blend-difference text-white">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <span class="text-2xl font-black tracking-tighter uppercase">Beltrix</span>
                <div class="flex gap-6 items-center">
                    <LanguageToggle />
                    <ThemeToggle />
                    <a href="/beltrix/auth/login" class="text-sm font-bold uppercase tracking-widest hover:text-purple-400 transition-colors">{t.beltrix.nav.login}</a>
                    <a href="/beltrix/dashboard" class="bg-white text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-purple-400 transition-colors">
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
                    <a href="/dashboard" class="group relative px-8 py-4 bg-transparent border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors rounded-full overflow-hidden">
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

    <style>
        .stroke-text {
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
    </style>
{/if}
