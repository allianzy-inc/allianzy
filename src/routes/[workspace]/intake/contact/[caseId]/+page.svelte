<script lang="ts">
    import type { ActionData, PageData } from './$types';

    export let data: PageData;
    export let form: ActionData;
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Solicitar contacto técnico</h1>
        <p class="text-sm text-muted-foreground">
            Si preferís no crear una cuenta todavía, podés dejar tus datos y continuaremos el proceso por email.
        </p>
    </div>

    {#if form?.success}
        <div class="rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:border dark:border-emerald-800/50 dark:text-emerald-200 px-4 py-3 text-sm space-y-2">
            <p>
                Hemos recibido tu solicitud. Uno de nuestros asesores técnicos se contactará contigo vía email.
            </p>
            {#if form.emailWarning}
                <p class="text-xs text-emerald-900 dark:text-emerald-300">
                    {form.emailWarning}
                </p>
            {/if}
        </div>
    {:else}
        {#if form?.error}
            <div class="rounded-md bg-red-50 text-red-700 dark:bg-red-950/80 dark:border dark:border-red-800/50 dark:text-red-200 px-4 py-3 text-sm">
                {form.error}
            </div>
        {/if}

        <form method="POST" class="space-y-6">
            <div class="space-y-2">
                <label class="text-sm font-medium" for="full_name">Nombre completo</label>
                <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={form?.values?.full_name}
                    required
                />
                {#if form?.fieldErrors?.full_name}
                    <p class="text-xs text-red-600">{form.fieldErrors.full_name[0]}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <label class="text-sm font-medium" for="email">Correo electrónico</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={form?.values?.email}
                    required
                />
                {#if form?.fieldErrors?.email}
                    <p class="text-xs text-red-600">{form.fieldErrors.email[0]}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <label class="text-sm font-medium" for="company">Empresa</label>
                <input
                    id="company"
                    name="company"
                    type="text"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={form?.values?.company}
                    required
                />
                {#if form?.fieldErrors?.company}
                    <p class="text-xs text-red-600">{form.fieldErrors.company[0]}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <label class="text-sm font-medium" for="role_title">Cargo / Rol (opcional)</label>
                <input
                    id="role_title"
                    name="role_title"
                    type="text"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={form?.values?.role_title}
                />
            </div>

            <button
                type="submit"
                class="w-full h-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-colors"
            >
                Enviar solicitud
            </button>
        </form>
    {/if}
</div>

