<script lang="ts">
    import { page } from '$app/stores';
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import { Eye, EyeOff, Mail, Lock, User } from 'lucide-svelte';
    import logoLight from '$lib/assets/brand/allianzy/logo-light.svg';
    import logoDark from '$lib/assets/brand/allianzy/logo-dark.svg';
    
    const workspace = $page.params.workspace;
    let email = '';
    let password = '';
    let name = '';
    let isRegister = $page.url.searchParams.get('mode') === 'register';
    let isLoading = false;
    let error = '';
    let showPassword = false;

    function togglePassword() {
        showPassword = !showPassword;
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
            
            const { data, error: signInError } = await authClient.signIn.email({
                email,
                password,
            });

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

            const targetRoute = `/${workspace}/dashboard`;
            await goto(targetRoute, { replaceState: true, invalidateAll: true });
        } catch (e: any) {
            console.error(e);
            error = e.message || 'Authentication failed';
        } finally {
            isLoading = false;
        }
    }

    function toggleMode() {
        isRegister = !isRegister;
        error = '';
    }
</script>

<div class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-950 font-sans">
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
                 <h1 class="text-3xl font-bold tracking-tight text-foreground mb-4">Beltrix Agency</h1>
             {/if}
             
             <h2 class="text-2xl font-bold text-foreground tracking-tight">
                {isRegister ? 'Create Account' : 'Welcome Back'}
             </h2>
             <p class="text-sm text-muted-foreground mt-2">
                {isRegister ? 'Enter your details to get started.' : 'Enter your credentials to access your account.'}
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
                    <label class="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                    <div class="relative group">
                        <User class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            bind:value={name}
                            required
                            class="flex h-11 w-full rounded-xl border border-input bg-white/50 dark:bg-black/20 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all shadow-sm" 
                            placeholder="John Doe" 
                        />
                    </div>
                </div>
            {/if}

            <div class="space-y-2">
                <label class="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
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
                    <label class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
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
                        <a href="#" class="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
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
                    Processing...
                {:else}
                    {isRegister ? 'Create Account' : 'Sign In'} <span class="text-lg">→</span>
                {/if}
            </button>
        </form>

        <div class="mt-8 pt-6 border-t border-border/50">
            <div class="text-center text-sm">
                <span class="text-muted-foreground">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button 
                    on:click={toggleMode}
                    class="ml-1 font-semibold text-primary hover:underline focus:outline-none transition-colors"
                >
                    {isRegister ? 'Sign in' : 'Sign up'}
                </button>
            </div>
        </div>
    </div>
</div>
