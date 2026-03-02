<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Mail, ArrowLeft } from 'lucide-svelte';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    import { browser } from '$app/environment';
    import { currentLang } from '$lib/i18n';

    const workspace = $page.params.workspace;
    let email = $page.url.searchParams.get('email') || '';
    let error = '';
    let success = '';
    let redirectUrlToAdd = '';
    let isSubmitting = false;

    $: lang = $currentLang;
    $: redirectTo =
        browser ?
            (import.meta.env.VITE_PASSWORD_RESET_REDIRECT_URL?.trim() ||
                `${window.location.origin}/${workspace}/auth/reset-password`)
        :   '';

    const NEON_AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL?.replace(/\/$/, '') || '';

    function goBackToLogin() {
        const loginUrl = `/${workspace}/auth/login${email ? `?email=${encodeURIComponent(email)}` : ''}`;
        goto(loginUrl);
    }

    /** Petición directa desde el navegador a Neon para que el Origin sea el real (Neon suele rechazar peticiones servidor→Neon). */
    async function handleSubmit(e: Event) {
        e.preventDefault();
        if (!email?.trim() || !NEON_AUTH_URL) return;
        isSubmitting = true;
        error = '';
        success = '';
        redirectUrlToAdd = '';
        const url = `${NEON_AUTH_URL}/request-password-reset`;
        const body = JSON.stringify({ email: email.trim(), redirectTo: redirectTo || undefined });
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                const msg = data?.message || `Error ${res.status}`;
                const isRedirect = res.status === 403 || String(msg).toLowerCase().includes('redirect');
                error = msg;
                if (isRedirect && redirectTo) redirectUrlToAdd = redirectTo;
                return;
            }
            success =
                lang === 'es'
                    ? 'Si ese correo existe en nuestro sistema, recibirás un email con el enlace para restablecer tu contraseña.'
                    : "If that email exists in our system, you'll receive an email with the link to reset your password.";
        } catch (err: unknown) {
            error = err instanceof Error ? err.message : (lang === 'es' ? 'Error de conexión' : 'Connection error');
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div
    class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-950 {workspace === 'allianzy' ? 'font-bricolage' : (workspace === 'beltrix' ? 'font-merriweather' : 'font-sans')}"
>
    <!-- Abstract Background -->
    <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div
            class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse"
        ></div>
        <div
            class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse"
            style="animation-delay: 1.5s;"
        ></div>
        <div
            class="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-pink-500/20 blur-[120px] animate-pulse"
            style="animation-delay: 3s;"
        ></div>
    </div>

    <!-- Glass Card -->
    <div
        class="relative w-full max-w-md p-8 backdrop-blur-2xl bg-white/70 dark:bg-zinc-900/60 border border-white/20 dark:border-white/5 rounded-3xl shadow-2xl z-10 mx-4 transition-all duration-300"
    >
        <!-- Logo & Header -->
        <div class="flex flex-col items-center mb-8 text-center">
            {#if workspace === 'allianzy'}
                <a href="/" class="mb-6 transition-opacity hover:opacity-80 block">
                    <img src={logoLight} alt="Allianzy" class="h-10 dark:hidden" />
                    <img src={logoDark} alt="Allianzy" class="h-10 hidden dark:block" />
                </a>
            {:else}
                <a
                    href="/{workspace}"
                    class="block mb-4 transition-opacity hover:opacity-80"
                >
                    <h1 class="text-3xl font-bold tracking-tight text-foreground">Beltrix Agency</h1>
                </a>
            {/if}

            <h2 class="text-2xl font-bold text-foreground tracking-tight">
                {lang === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}
            </h2>
            <p class="text-sm text-muted-foreground mt-2">
                {lang === 'es'
                    ? 'Ingresa el correo asociado a tu cuenta y te enviaremos un enlace para restablecerla.'
                    : "Enter the email associated with your account and we'll send you a reset link."}
            </p>
        </div>

        {#if error}
            <div
                class="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 animate-in fade-in slide-in-from-top-2"
            >
                <p class="text-center">{error}</p>
                {#if redirectUrlToAdd}
                    <p class="mt-2 text-xs text-left font-mono bg-black/10 dark:bg-white/10 px-2 py-2 rounded break-all select-all" title="Copiar">
                        {redirectUrlToAdd}
                    </p>
                    <p class="mt-2 text-xs text-muted-foreground">
                        {lang === 'es'
                            ? 'Comprueba que esta URL esté en Neon Console → Auth → Domains (sin barra final).'
                            : 'Ensure this URL is in Neon Console → Auth → Domains (no trailing slash).'}
                    </p>
                {/if}
            </div>
        {/if}

        {#if success}
            <div
                class="mb-6 p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-center animate-in fade-in slide-in-from-top-2"
            >
                {success}
            </div>
        {/if}

        <form on:submit|preventDefault={handleSubmit} class="space-y-5">
            <div class="space-y-2">
                    <label
                        class="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1"
                    >
                        {lang === 'es' ? 'Correo electrónico' : 'Email Address'}
                    </label>
                <div class="relative group">
                    <Mail
                        class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                    />
                    <input
                        type="email"
                        name="email"
                        bind:value={email}
                        required
                        class="flex h-11 w-full rounded-xl border border-input bg-white/50 dark:bg-black/20 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all shadow-sm"
                        placeholder={lang === 'es' ? 'correo@ejemplo.com' : 'name@example.com'}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                class="w-full h-11 mt-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {#if isSubmitting}
                    <div
                        class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    ></div>
                    {lang === 'es' ? 'Enviando enlace...' : 'Sending reset link...'}
                {:else}
                    {lang === 'es' ? 'Enviar enlace de restablecimiento' : 'Send reset link'}
                    <span class="text-lg">→</span>
                {/if}
            </button>
        </form>

        <div class="mt-8 pt-6 border-t border-border/50">
            <button
                type="button"
                on:click={goBackToLogin}
                class="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mx-auto"
            >
                <ArrowLeft class="w-4 h-4 mr-1" />
                {lang === 'es' ? 'Volver al acceso' : 'Back to login'}
            </button>
        </div>
    </div>
</div>

