<script lang="ts">
    import { currentLang } from '$lib/i18n';

    function toggleLang() {
        $currentLang = $currentLang === 'en' ? 'es' : 'en';
    }
</script>

<button 
    on:click={toggleLang}
    class="px-3 py-1 rounded-full border border-current text-xs font-bold uppercase tracking-wider hover:bg-current hover:text-black dark:hover:text-black transition-all"
>
    {$currentLang === 'en' ? 'ES' : 'EN'}
</button>
