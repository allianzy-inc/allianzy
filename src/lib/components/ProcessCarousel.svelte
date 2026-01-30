<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fade, fly } from 'svelte/transition';

    export let steps: {
        id: string;
        title: string;
        subtitle?: string;
        items?: string[];
        desc?: string;
    }[];

    let activeIndex = 0;
    let interval: any;
    const DURATION = 5000; // 5 seconds per slide

    const images: Record<string, string> = {
        eval: "https://images.unsplash.com/photo-1553877612-823271e47490?q=80&w=2607&auto=format&fit=crop", // Meeting/Analysis
        diag: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop", // Data/Charts
        arch: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop", // Technical/Structure
        scale: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop", // Global/Network
        measure: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2676&auto=format&fit=crop", // Analytics
        opt: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop"   // Lightning/Energy
    };

    function startTimer() {
        stopTimer();
        interval = setInterval(() => {
            activeIndex = (activeIndex + 1) % steps.length;
        }, DURATION);
    }

    function stopTimer() {
        if (interval) clearInterval(interval);
    }

    function setActive(index: number) {
        activeIndex = index;
        startTimer(); // Reset timer on manual interaction
    }

    onMount(() => {
        startTimer();
    });

    onDestroy(() => {
        stopTimer();
    });
</script>

<div 
    class="bg-neutral-50 dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-2xl shadow-purple-900/10"
    role="region" 
    aria-label="Process Carousel"
    on:mouseenter={stopTimer}
    on:mouseleave={startTimer}
>
    <!-- Navigation Tabs -->
    <div class="flex overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 scrollbar-hide">
        {#each steps as step, i}
            <button 
                class="flex-1 min-w-[150px] px-6 py-6 text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group text-left outline-none focus:outline-none"
                class:text-purple-600={activeIndex === i}
                class:dark:text-purple-400={activeIndex === i}
                class:text-neutral-500={activeIndex !== i}
                class:dark:text-neutral-500={activeIndex !== i}
                on:click={() => setActive(i)}
            >
                <span class="block text-xs mb-1 opacity-50">Step {i + 1}</span>
                {step.title}
                
                <!-- Active Indicator -->
                {#if activeIndex === i}
                    <div class="absolute bottom-0 left-0 w-full h-1 bg-purple-500" transition:fade={{ duration: 200 }}></div>
                {/if}
                
                <!-- Hover Indicator -->
                <div class="absolute bottom-0 left-0 w-full h-1 bg-neutral-200 dark:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
        {/each}
    </div>

    <!-- Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        
        <!-- Left: Text Info -->
        <div class="p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
            {#key activeIndex}
                <div 
                    in:fly={{ y: 20, duration: 400, delay: 100 }} 
                    class="relative z-10"
                >
                    <div class="text-purple-500 font-bold mb-4 tracking-widest uppercase text-sm">
                        Phase {activeIndex + 1}
                    </div>
                    
                    <h3 class="text-3xl md:text-5xl font-black mb-8 text-black dark:text-white leading-tight">
                        {steps[activeIndex].title}
                    </h3>
                    
                    {#if steps[activeIndex].subtitle}
                        <p class="text-xl text-neutral-600 dark:text-neutral-300 mb-8 font-light">
                            {steps[activeIndex].subtitle}
                        </p>
                    {/if}

                    <div class="space-y-4">
                        {#if steps[activeIndex].items}
                            {#each steps[activeIndex].items as item}
                                <div class="flex items-start">
                                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4 mt-1">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                    </span>
                                    <span class="text-lg text-neutral-700 dark:text-neutral-300 font-medium">{item}</span>
                                </div>
                            {/each}
                        {:else if steps[activeIndex].desc}
                             <div class="flex items-start">
                                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4 mt-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                </span>
                                <span class="text-lg text-neutral-700 dark:text-neutral-300 font-medium">{steps[activeIndex].desc}</span>
                            </div>
                        {/if}
                    </div>

                    <!-- Progress Bar (Visual Timer) -->
                    <div class="absolute bottom-0 left-0 h-1 bg-purple-500/10 w-full mt-12 hidden md:block">
                        {#key activeIndex}
                            <div 
                                class="h-full bg-purple-500" 
                                style="width: 0%; animation: progress {DURATION}ms linear forwards;"
                            ></div>
                        {/key}
                    </div>
                </div>
            {/key}
        </div>

        <!-- Right: Image -->
        <div class="relative overflow-hidden h-64 lg:h-auto">
            {#key activeIndex}
                <div 
                    class="absolute inset-0"
                    in:fade={{ duration: 600 }}
                >
                    <div class="absolute inset-0 bg-gradient-to-r from-neutral-50 dark:from-neutral-900 to-transparent z-10 lg:w-1/3"></div>
                    <img 
                        src={images[steps[activeIndex].id] || images.eval} 
                        alt={steps[activeIndex].title}
                        class="w-full h-full object-cover transform scale-105 transition-transform duration-[10000ms]"
                    />
                    <!-- Overlay for better text contrast if needed, mostly style -->
                    <div class="absolute inset-0 bg-purple-900/10 mix-blend-overlay"></div>
                </div>
            {/key}
        </div>
    </div>
</div>

<style>
    @keyframes progress {
        from { width: 0%; }
        to { width: 100%; }
    }
    
    /* Hide scrollbar for tabs */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>