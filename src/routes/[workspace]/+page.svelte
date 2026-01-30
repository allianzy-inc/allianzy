<script lang="ts">
    import { page } from '$app/stores';
    import { ArrowRight, CheckCircle2, LayoutGrid, ShieldCheck, Zap } from 'lucide-svelte';
    
    $: workspace = $page.params.workspace;
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
    <div class="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
        <!-- Navigation -->
        <nav class="fixed w-full z-50 top-0 px-6 py-6 mix-blend-difference text-white">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <span class="text-2xl font-black tracking-tighter uppercase">Beltrix</span>
                <div class="flex gap-6 items-center">
                    <a href="/beltrix/auth/login" class="text-sm font-bold uppercase tracking-widest hover:text-purple-400 transition-colors">Client Login</a>
                    <a href="/beltrix/dashboard" class="bg-white text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-purple-400 transition-colors">
                        Start Project
                    </a>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
            
            <div class="relative z-10 text-center max-w-5xl mx-auto px-4">
                <h1 class="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                    UNLEASH<br>CREATIVE
                </h1>
                <p class="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto mb-12 font-light">
                    We craft digital experiences that defy expectations. 
                    Bold strategies for brands that dare to be different.
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a href="/dashboard" class="group relative px-8 py-4 bg-transparent border border-neutral-700 hover:border-white transition-colors rounded-full overflow-hidden">
                        <span class="relative z-10 font-bold uppercase tracking-widest text-sm">Enter Dashboard</span>
                        <div class="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0"></div>
                        <span class="absolute inset-0 z-10 flex items-center justify-center font-bold uppercase tracking-widest text-sm text-black translate-y-full group-hover:translate-y-0 transition-transform duration-300">Enter Dashboard</span>
                    </a>
                </div>
            </div>
        </section>

        <!-- Marquee / Ticker -->
        <div class="border-y border-white/10 py-4 bg-black overflow-hidden whitespace-nowrap">
            <div class="inline-block animate-marquee">
                <span class="text-4xl font-bold uppercase text-transparent stroke-text px-8">Strategy</span>
                <span class="text-4xl font-bold uppercase text-white px-8">Design</span>
                <span class="text-4xl font-bold uppercase text-transparent stroke-text px-8">Development</span>
                <span class="text-4xl font-bold uppercase text-white px-8">Branding</span>
                <span class="text-4xl font-bold uppercase text-transparent stroke-text px-8">Marketing</span>
                <span class="text-4xl font-bold uppercase text-white px-8">Content</span>
            </div>
        </div>

        <!-- Portfolio Grid (Abstract) -->
        <section class="py-32 px-4">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="aspect-square bg-neutral-900 rounded-3xl p-12 flex flex-col justify-end hover:bg-neutral-800 transition-colors cursor-pointer group">
                    <h3 class="text-3xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Digital Product</h3>
                    <p class="text-neutral-500">Next-gen apps</p>
                </div>
                <div class="aspect-square bg-neutral-900 rounded-3xl p-12 flex flex-col justify-end hover:bg-neutral-800 transition-colors cursor-pointer group md:mt-32">
                    <h3 class="text-3xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Brand Identity</h3>
                    <p class="text-neutral-500">Visual systems</p>
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
