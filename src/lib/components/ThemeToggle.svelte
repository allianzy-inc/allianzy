<script lang="ts">
    import { onMount } from 'svelte';
    import { Sun, Moon } from 'lucide-svelte';

    let isDark = true; // Default to dark for Beltrix

    onMount(() => {
        // Check local storage or system preference
        if (localStorage.getItem('theme') === 'dark' || 
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            isDark = true;
            document.documentElement.classList.add('dark');
        } else {
            isDark = false;
            document.documentElement.classList.remove('dark');
        }
    });

    function toggleTheme() {
        isDark = !isDark;
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
</script>

<button 
    on:click={toggleTheme}
    class="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
    aria-label="Toggle Theme"
>
    {#if isDark}
        <Moon class="w-5 h-5 text-white" />
    {:else}
        <Sun class="w-5 h-5 text-black" />
    {/if}
</button>
