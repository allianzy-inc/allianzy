<script lang="ts">
    import { page } from '$app/stores';
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import { Eye, EyeOff } from 'lucide-svelte';
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
                
                // User is created in Auth system. Now sync to our local DB with 'client' role.
                // Note: signUp usually doesn't auto-login if email verification is enabled, 
                // but we'll try to login immediately to get the session for syncing.
            }
            
            const { data, error: signInError } = await authClient.signIn.email({
                email,
                password,
            });

            if (signInError) throw signInError;

            // Sync user to local DB
            try {
                await fetch('/api/users/sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        name,
                        role: 'client',
                        workspaceSlug: workspace
                    })
                });
            } catch (syncError) {
                console.error('Failed to sync user to local DB', syncError);
                // We don't block login if sync fails, but it might affect role-based access
            }

            // Always redirect to dashboard, admins can switch views later from the dashboard sidebar
            const targetRoute = `/${workspace}/dashboard`;
            console.log('Login: Redirecting to Dashboard:', targetRoute);
            
            // Force full reload to ensure clean state if needed
            // window.location.href = targetRoute;
            // Use goto for SPA navigation
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

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
    <div class="w-full max-w-md space-y-8">
        <div class="text-center">
            <h1 class="text-3xl font-bold tracking-tight">
                {workspace === 'allianzy' ? 'Allianzy Inc.' : 'Beltrix Agency'}
            </h1>
            <p class="mt-2 text-muted-foreground">
                {isRegister ? 'Create your account' : 'Sign in to your account'}
            </p>
        </div>

        <div class="bg-card p-8 border rounded-xl shadow-sm">
            {#if error}
                <div class="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
                    {error}
                </div>
            {/if}

            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                {#if isRegister}
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Full Name</label>
                        <input 
                            type="text" 
                            bind:value={name}
                            required
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                            placeholder="John Doe" 
                        />
                    </div>
                {/if}

                <div class="space-y-2">
                    <label class="text-sm font-medium">Email</label>
                    <input 
                        type="email" 
                        bind:value={email}
                        required
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                        placeholder="name@example.com" 
                    />
                </div>
                
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <label class="text-sm font-medium">Password</label>
                        {#if !isRegister}
                            <a href="#" class="text-sm font-medium text-primary hover:underline">Forgot password?</a>
                        {/if}
                    </div>
                    <div class="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            bind:value={password}
                            required
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-10" 
                        />
                        <button 
                            type="button" 
                            on:click={togglePassword}
                            class="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                            {#if showPassword}
                                <EyeOff class="h-4 w-4" />
                            {:else}
                                <Eye class="h-4 w-4" />
                            {/if}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    class="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {#if isLoading}
                        Loading...
                    {:else}
                        {isRegister ? 'Create account' : 'Sign in'}
                    {/if}
                </button>
            </form>

            <div class="mt-6 text-center text-sm">
                <span class="text-muted-foreground">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button 
                    on:click={toggleMode}
                    class="ml-1 font-medium text-primary hover:underline focus:outline-none"
                >
                    {isRegister ? 'Sign in' : 'Sign up'}
                </button>
            </div>
        </div>
    </div>
</div>
