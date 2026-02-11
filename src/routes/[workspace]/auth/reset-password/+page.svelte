<script lang="ts">
    import { page } from '$app/stores';
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import { Eye, EyeOff, Lock } from 'lucide-svelte';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    import { browser } from '$app/environment';
    import { currentLang } from '$lib/i18n';

    const workspace = $page.params.workspace;
    const url = $page.url;
    const tokenFromUrl = url.searchParams.get('token') || '';
    const tokenError = url.searchParams.get('error') || '';

    let newPassword = '';
    let confirmPassword = '';
    let showPassword = false;
    let isLoading = false;
    $: lang = $currentLang;
    let error = tokenError
        ? lang === 'es'
            ? 'Este enlace para restablecer la contraseña no es válido o ha expirado. Solicita uno nuevo.'
            : 'This reset link is invalid or has expired. Please request a new one.'
        : '';
    let success = '';

    function togglePassword() {
        showPassword = !showPassword;
    }

    async function handleSubmit() {
        if (!tokenFromUrl) {
            error =
                lang === 'es'
                    ? 'Falta el token de restablecimiento. Solicita un nuevo enlace desde la página de “Olvidé mi contraseña”.'
                    : 'Reset token is missing. Please request a new link from the forgot password page.';
            return;
        }

        if (newPassword !== confirmPassword) {
            error = lang === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.';
            return;
        }

        if (newPassword.length < 8) {
            error =
                lang === 'es'
                    ? 'La contraseña debe tener al menos 8 caracteres.'
                    : 'Password must be at least 8 characters long.';
            return;
        }

        isLoading = true;
        error = '';
        success = '';

        try {
            const { error: resetError } = await authClient.resetPassword({
                newPassword,
                token: tokenFromUrl
            });

            if (resetError) throw resetError;

            success =
                lang === 'es'
                    ? 'Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión.'
                    : 'Your password has been updated. You can now sign in.';

            if (browser) {
                const email = url.searchParams.get('email') || '';
                const loginUrl = `/${workspace}/auth/login${email ? `?email=${encodeURIComponent(email)}` : ''}`;

                setTimeout(() => {
                    goto(loginUrl);
                }, 1500);
            }
        } catch (e: any) {
            console.error('Reset password error:', e);

            if (e?.body?.message) {
                error = e.body.message;
            } else if (e?.message) {
                error = e.message;
            } else if (e?.code) {
                error = e.code;
            } else if (typeof e === 'string') {
                error = e;
            } else {
                error =
                    lang === 'es'
                        ? 'No pudimos restablecer tu contraseña. Inténtalo de nuevo o solicita un nuevo enlace.'
                        : 'We could not reset your password. Please try again or request a new link.';
            }

            if (e?.status) {
                error += ` (Status: ${e.status})`;
            }
        } finally {
            isLoading = false;
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
                {lang === 'es' ? 'Restablecer contraseña' : 'Reset your password'}
            </h2>
            <p class="text-sm text-muted-foreground mt-2">
                {lang === 'es'
                    ? 'Elige una nueva contraseña para tu cuenta.'
                    : 'Choose a new password for your account.'}
            </p>
        </div>

        {#if error}
            <div
                class="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 text-center animate-in fade-in slide-in-from-top-2"
            >
                {error}
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
                        {lang === 'es' ? 'Nueva contraseña' : 'New Password'}
                    </label>
                <div class="relative group">
                    <Lock
                        class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                    />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        bind:value={newPassword}
                        required
                        class="flex h-11 w-full rounded-xl border border-input bg-white/50 dark:bg-black/20 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all shadow-sm pr-10"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        on:click={togglePassword}
                        class="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {#if showPassword}
                            <EyeOff class="h-4 w-4" />
                        {:else}
                            <Eye class="h-4 w-4" />
                        {/if}
                    </button>
                </div>
            </div>

            <div class="space-y-2">
                    <label
                        class="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1"
                    >
                        {lang === 'es' ? 'Confirmar contraseña' : 'Confirm Password'}
                    </label>
                <div class="relative group">
                    <Lock
                        class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                    />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        bind:value={confirmPassword}
                        required
                        class="flex h-11 w-full rounded-xl border border-input bg-white/50 dark:bg-black/20 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all shadow-sm pr-10"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                class="w-full h-11 mt-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {#if isLoading}
                    <div
                        class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    ></div>
                    {lang === 'es' ? 'Actualizando contraseña...' : 'Updating password...'}
                {:else}
                    {lang === 'es' ? 'Actualizar contraseña' : 'Update password'}
                    <span class="text-lg">→</span>
                {/if}
            </button>
        </form>
    </div>
</div>

