<script lang="ts">
    import { authClient } from '$lib/auth-client';
    import { onMount } from 'svelte';
    import { CheckCircle, Clock, AlertCircle } from 'lucide-svelte';
    import { page } from '$app/stores';
    import { currentLang } from '$lib/i18n';

    const workspace = $page.params.workspace;
    let session: any = null;
    let loading = true;
    let userRole = 'client'; // Default to client as requested

    onMount(async () => {
        console.log('[DASHBOARD-CLIENT] Mounted');
        try {
            const { data } = await authClient.getSession();
            session = data?.session;
            if (data?.user) {
                // @ts-ignore
                if (data.user.role) userRole = data.user.role;
            }
        } catch (e) {
            console.error('Failed to get session', e);
        } finally {
            loading = false;
        }
    });

    export let data;
    
    // Use real data if available
    $: userProjects = data.projects || [];
    $: user = data.user || session?.user;
    $: isSpanish = $currentLang === 'es';

    $: quickActions = [
        { 
            name: isSpanish ? 'Agendar Reunión' : 'Book Meeting', 
            href: 'mailto:support@allianzy.us', 
            icon: 'Calendar' 
        },
        { 
            name: isSpanish ? 'Contactar Soporte' : 'Contact Support', 
            href: `/${workspace}/dashboard/support`, 
            icon: 'MessageSquare' 
        },
        { 
            name: isSpanish ? 'Ver Facturación' : 'View Invoices', 
            href: `/${workspace}/dashboard/billing`, 
            icon: 'FileText' 
        }
    ];
</script>

{#if loading}
    <div class="flex items-center justify-center h-64">
        <p class="text-muted-foreground">{isSpanish ? 'Cargando panel...' : 'Loading dashboard...'}</p>
    </div>
{:else}
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">
                    {isSpanish ? 'Bienvenido de nuevo,' : 'Welcome back,'} {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.name || 'Client')}
                </h2>
                <p class="text-muted-foreground">
                    {isSpanish 
                        ? `Aquí tienes un resumen de tus servicios en ${workspace === 'allianzy' ? 'Allianzy' : 'Beltix'}.`
                        : `Here is an overview of your ${workspace === 'allianzy' ? 'Allianzy' : 'Beltix'} services.`
                    }
                </p>
            </div>
        </div>
        
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <!-- Projects Status -->
            <div class="bg-card border rounded-lg p-6 shadow-sm col-span-2">
                <h3 class="text-lg font-semibold mb-4">{isSpanish ? 'Tus Proyectos' : 'Your Projects'}</h3>
                <div class="space-y-4">
                    {#if userProjects.length === 0}
                        <div class="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
                            <p>{isSpanish ? 'No se encontraron proyectos activos.' : 'No active projects found.'}</p>
                        </div>
                    {:else}
                        {#each userProjects as project}
                            <a href="/{workspace}/dashboard/projects/{project.id}" class="flex items-center gap-4 p-4 bg-muted/50 rounded-md hover:bg-muted/80 transition-colors">
                                <div class="h-12 w-12 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                                    {#if project.imageUrl}
                                        <img src={project.imageUrl} alt={project.name} class="w-full h-full object-cover" />
                                    {:else}
                                        <div class="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {project.name[0]}
                                        </div>
                                    {/if}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-medium truncate">{project.name}</p>
                                    <p class="text-sm text-muted-foreground truncate">{project.description || ''}</p>
                                </div>
                                <div class="text-right">
                                    <span class="inline-block px-2 py-1 text-xs font-medium rounded-full 
                                        {project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                         project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                                         'bg-yellow-100 text-yellow-700'}">
                                        {project.status}
                                    </span>
                                </div>
                            </a>
                        {/each}
                    {/if}
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="bg-card border rounded-lg p-6 shadow-sm">
                 <h3 class="text-lg font-semibold mb-4">{isSpanish ? 'Acciones Rápidas' : 'Quick Actions'}</h3>
                 <div class="grid gap-4">
                    {#each quickActions as action}
                        <a href={action.href} class="p-3 border rounded-md hover:bg-muted transition-colors flex items-center gap-3">
                            <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <!-- Simple icon placeholder -->
                                <span class="text-xs font-bold">{action.name[0]}</span>
                            </div>
                            <span class="font-medium text-sm">{action.name}</span>
                        </a>
                    {/each}
                 </div>
            </div>
        </div>
    </div>
{/if}
