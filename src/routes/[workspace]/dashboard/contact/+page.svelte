<script lang="ts">
    import { Mail, Phone, MapPin } from 'lucide-svelte';
</script>

<div class="space-y-6">
    <h2 class="text-3xl font-bold tracking-tight">Contactar</h2>
    
    <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-6">
            <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-4">Envíanos un mensaje</h3>
                <form class="space-y-4">
                    <div class="grid gap-2">
                        <label class="text-sm font-medium">Asunto</label>
                        <input type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Consulta general" />
                    </div>
                    <div class="grid gap-2">
                        <label class="text-sm font-medium">Mensaje</label>
                        <textarea class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="¿En qué podemos ayudarte?"></textarea>
                    </div>
                    <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 w-full">
                        Enviar Mensaje
                    </button>
                </form>
            </div>
        </div>

        <div class="space-y-6">
            <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-4">Información de Contacto</h3>
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Mail class="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p class="text-sm font-medium">Email</p>
                            <p class="text-sm text-muted-foreground">contacto@allianzy.com</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Phone class="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p class="text-sm font-medium">Teléfono</p>
                            <p class="text-sm text-muted-foreground">+1 (555) 000-0000</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <MapPin class="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p class="text-sm font-medium">Oficina</p>
                            <p class="text-sm text-muted-foreground">123 Business Ave, Suite 100</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>