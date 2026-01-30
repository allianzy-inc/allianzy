<script lang="ts">
    import { User } from 'lucide-svelte';
</script>

<div class="space-y-6">
    <h2 class="text-3xl font-bold tracking-tight">Perfil de Usuario</h2>
    
    <div class="max-w-2xl space-y-6">
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <User class="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 class="text-xl font-semibold">Usuario Demo</h3>
                    <p class="text-sm text-muted-foreground">cliente@ejemplo.com</p>
                </div>
            </div>
            
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <label class="text-sm font-medium">Nombre Completo</label>
                    <input type="text" value="Usuario Demo" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div class="grid gap-2">
                    <label class="text-sm font-medium">Email</label>
                    <input type="email" value="cliente@ejemplo.com" disabled class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm opacity-50" />
                </div>
                <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 w-fit">
                    Guardar Cambios
                </button>
            </div>
        </div>
    </div>
</div>