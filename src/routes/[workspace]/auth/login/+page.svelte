<script lang="ts">
    import { page } from '$app/stores';
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import { Eye, EyeOff, Mail, Lock, User } from 'lucide-svelte';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    import { currentLang } from '$lib/i18n';
    
    const workspace = $page.params.workspace;
    let email = $page.url.searchParams.get('email') || '';
    let password = '';
    let name = '';
    let isRegister = $page.url.searchParams.get('mode') === 'register';
    let isLoading = false;
    let error = '';
    let showPassword = false;

    $: lang = $currentLang;
    const redirectTo = $page.url.searchParams.get('redirectTo') || '';

    let forgotPasswordUrl = '';
    $: forgotPasswordUrl = `/${workspace}/auth/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`;

    function togglePassword() {
        showPassword = !showPassword;
    }

    function formatLoginError(e: any): string {
        let message: string | undefined;

        if (e?.body?.message) {
            message = e.body.message;
        } else if (e?.message) {
            message = e.message;
        } else if (e?.code) {
            message = e.code;
        } else if (typeof e === 'string') {
            message = e;
        }

        // Mensajes amigables y traducidos para casos conocidos
        if (message && message.includes('Invalid email or password')) {
            return lang === 'es'
                ? 'Correo electrónico o contraseña inválidos.'
                : 'Invalid email or password.';
        }

        if (!message) {
            return lang === 'es'
                ? 'No se pudo iniciar sesión. Verifica tus credenciales o inténtalo más tarde.'
                : 'Authentication failed. Please check your credentials or try again later.';
        }

        // Para cualquier otro mensaje, lo mostramos tal cual, sin códigos técnicos.
        return message;
    }

    async function handleSubmit() {
        isLoading = true;
        error = '';
        
        try {
            if (isRegister) {
                const { data, error: signUpError } = await authClient.signUp.email({
                    email,
                    password,
                    name,
                });
                if (signUpError) throw signUpError;
            }
            
            const { data, error: signInError } = await authClient.signIn.email(
                {
                    email,
                    password,
                }
            );

            if (signInError) throw signInError;

            try {
                await fetch('/api/users/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        name,
                        role: 'client',
                        workspaceSlug: workspace
                    })
                });
            } catch (syncError) {
                console.error('Failed to sync user to local DB', syncError);
            }

            const targetRoute = redirectTo || `/${workspace}/dashboard`;
            await goto(targetRoute, { replaceState: true, invalidateAll: true });
        } catch (e: any) {
            console.error('Login error:', e);
            
            error = formatLoginError(e);
        } finally {
            isLoading = false;
        }
    }

    function toggleMode() {
        isRegister = !isRegister;
        error = '';
    }
</script>

<div class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-950 {workspace === 'allianzy' ? 'font-bricolage' : (workspace === 'beltrix' ? 'font-merriweather' : 'font-sans')}">
    <!-- Abstract Background -->
    <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
         <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse"></div>
         <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" style="animation-delay: 1.5s;"></div>
         <div class="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-pink-500/20 blur-[120px] animate-pulse" style="animation-delay: 3s;"></div>
    </div>

    <!-- Glass Card -->
    <div class="relative w-full max-w-md p-8 backdrop-blur-2xl bg-white/70 dark:bg-zinc-900/60 border border-white/20 dark:border-white/5 rounded-3xl shadow-2xl z-10 mx-4 transition-all duration-300">
        
        <!-- Logo & Header -->
        <div class="flex flex-col items-center mb-8 text-center">
             {#if workspace === 'allianzy'}
                 <a href="/" class="mb-6 transition-opacity hover:opacity-80 block">
                     <img src={logoLight} alt="Allianzy" class="h-10 dark:hidden" />
                     <img src={logoDark} alt="Allianzy" class="h-10 hidden dark:block" />
                 </a>
             {:else}
                <a href="/{workspace}" class="block mb-4 transition-opacity hover:opacity-80">
                    <h1 class="text-3xl font-bold tracking-tight text-foreground">Beltrix Agency</h1>
                </a>
            {/if}
             
             <h2 class="text-2xl font-bold text-foreground tracking-tight">
                {#if isRegister}
                    {lang === 'es' ? 'Crear cuenta' : 'Create Account'}
                {:else}
                    {lang === 'es' ? 'Bienvenido de nuevo' : 'Welcome Back'}
                {/if}
             </h2>
             <p class="text-sm text-muted-foreground mt-2">
                {#if isRegister}
                    {lang === 'es'
                        ? 'Ingresa tus datos para comenzar.'
                        : 'Enter your details to get started.'}
                {:else}
                    {lang === 'es'
                        ? 'Ingresa tus credenciales para acceder a tu cuenta.'
                        : 'Enter your credentials to access your account.'}
                {/if}
             </p>
        </div>

        {#if error}
            <div class="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 text-center animate-in fade-in slide-in-from-top-2">
                {error}
            </div>
        {/if}

        <form on:submit|preventDefault={handleSubmit} class="space-y-5">
            {#if isRegister}
                <div class="space-y-2">
                    <label class="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
                        {lang === 'es' ? 'Nombre completo' : 'Full Name'}
                    </label>
                    <div class="relative group">
                        <User class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            bind:value={name}
                            required
                            class="flex h-11 w-full rounded-xl border border-input bg-white/50 dark:bg-black/20 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all shadow-sm" 
                            placeholder={lang === 'es' ? 'Juan Pérez' : 'John Doe'}
                        />
                    </div>
                </div>
            {/if}

            <div class="space-y-2">
                <label class="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
                    {lang === 'es' ? 'Correo electrónico' : 'Email Address'}
                </label>
                <div class="relative group">
                    <Mail class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="email" 
                        bind:value={email}
                        required
                        class="flex h-11 w-full rounded-xl border border-input bg-white/50 dark:bg-black/20 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all shadow-sm" 
                        placeholder="name@example.com" 
                    />
                </div>
            </div>
            
            <div class="space-y-2">
                <div class="flex items-center justify-between ml-1">
                    <label class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {lang === 'es' ? 'Contraseña' : 'Password'}
                    </label>
                </div>
                <div class="relative group">
                    <Lock class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        bind:value={password}
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
                {#if !isRegister}
                    <div class="flex justify-end mt-1">
                        <a
                            href={forgotPasswordUrl}
                            class="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            {lang === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                        </a>
                    </div>
                {/if}
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                class="w-full h-11 mt-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {#if isLoading}
                    <div class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {lang === 'es' ? 'Procesando...' : 'Processing...'}
                {:else}
                    {#if isRegister}
                        {lang === 'es' ? 'Crear cuenta' : 'Create Account'}
                    {:else}
                        {lang === 'es' ? 'Iniciar sesión' : 'Sign In'}
                    {/if}
                    <span class="text-lg">→</span>
                {/if}
            </button>
        </form>

        <div class="mt-8 pt-6 border-t border-border/50">
            <div class="text-center text-sm">
                <span class="text-muted-foreground">
                    {#if isRegister}
                        {lang === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?'}
                    {:else}
                        {lang === 'es' ? '¿No tienes una cuenta?' : "Don't have an account?"}
                    {/if}
                </span>
                <button 
                    on:click={toggleMode}
                    class="ml-1 font-semibold text-primary hover:underline focus:outline-none transition-colors"
                >
                    {#if isRegister}
                        {lang === 'es' ? 'Iniciar sesión' : 'Sign in'}
                    {:else}
                        {lang === 'es' ? 'Registrarse' : 'Sign up'}
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>
