<script lang="ts">
    import { currentLang, translations } from '$lib/i18n';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    
    export let workspace: string = 'beltrix';

    $: t = translations[$currentLang];
    $: footerData = workspace === 'allianzy' ? t.allianzy.footer : t.footer;
    $: isAllianzy = workspace === 'allianzy';
</script>

<footer class="py-12 border-t transition-colors duration-300
    {isAllianzy ? 'bg-allianzy-black border-neutral-800 text-allianzy-white' : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 text-black dark:text-white'}">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2">
            {#if isAllianzy}
                <!-- Allianzy Logo (Small) or Text -->
                <img src={logoLight} alt="Allianzy" class="h-6 dark:hidden" />
                <img src={logoDark} alt="Allianzy" class="h-6 hidden dark:block" />
            {:else}
                 <span class="font-bold text-xl tracking-tight">Beltrix</span>
            {/if}
            <span class="text-sm opacity-60">
                &copy; {new Date().getFullYear()} {footerData.rights}
            </span>
        </div>

        {#if isAllianzy}
            <nav class="flex gap-6 text-sm font-medium opacity-80">
                <a href="/legal" class="hover:opacity-100 transition-opacity">{t.allianzy.footer.legal}</a>
                <a href="/privacy" class="hover:opacity-100 transition-opacity">{t.allianzy.footer.privacy}</a>
                <a href="/terms" class="hover:opacity-100 transition-opacity">{t.allianzy.footer.terms}</a>
            </nav>
        {/if}
    </div>
</footer>
