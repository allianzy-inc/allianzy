<script lang="ts">
    import { page } from '$app/stores';
    import type { PageData } from './$types';

    export let data: PageData;

    const workspace = $page.params.workspace;
    const casePath = `/${workspace}/intake/result/${data.caseId}`;

    const registerUrl = `/${workspace}/auth/login?mode=register&redirectTo=${encodeURIComponent(casePath)}`;
    const contactUrl = `/${workspace}/intake/contact/${data.caseId}`;

    const isAllianzy = workspace === 'allianzy';
    const beltrixUrl = data.beltrixAgencyUrl ?? '';
    const beltrixIntakeHref = beltrixUrl ? `${beltrixUrl}?from=allianzy` : '/beltrix/intake';
    const beltrixHomeHref = beltrixUrl || '/beltrix';
</script>

<div class="max-w-3xl mx-auto py-12 px-4 space-y-8">
    <div class="space-y-2">
        <h1 class="text-3xl font-bold">Resultado de la evaluación</h1>
        {#if data.score != null}
            <p class="text-muted-foreground text-sm">
                Score interno: {data.score}
            </p>
        {/if}
    </div>

    {#if data.status === 'redirect_beltrix'}
        <div class="space-y-4">
            <p class="text-lg">
                Por el tipo de necesidad que marcaste, este caso encaja mejor con
                <strong>Beltrix Agency</strong> (marketing, diseño y web).
            </p>
            <p class="text-muted-foreground">
                Podés continuar el proceso directamente desde Beltrix para trabajar sobre la parte creativa
                y operativa de tu proyecto.
            </p>
            <a
                href={beltrixIntakeHref}
                class="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-colors"
            >
                Ir a Beltrix
            </a>
        </div>
    {:else if data.status === 'closed_no_fit'}
        <div class="space-y-4">
            <p class="text-lg font-medium">
                En este momento, el desafío que describiste no parece requerir el tipo de intervención
                estructural que hace Allianzy.
            </p>
            <p class="text-muted-foreground">
                Esto no significa que no haya una solución, sino que probablemente sea más eficiente abordarlo
                desde servicios operativos o de marketing tradicionales.
            </p>
            <a
                href={beltrixHomeHref}
                class="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-colors"
            >
                Ver alternativas en Beltrix
            </a>
        </div>
    {:else}
        <div class="space-y-4">
            <p class="text-lg font-medium">
                Tu caso <strong>{data.status === 'qualifies_allianzy' ? 'califica para Allianzy' : 'requiere revisión técnica'}</strong>.
            </p>
            <p class="text-muted-foreground">
                A partir de la información que compartiste, tiene sentido avanzar con una conversación técnica
                para entender el alcance real y decidir el siguiente paso.
            </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mt-6">
            <div class="border rounded-2xl p-6 space-y-3 bg-card">
                <h2 class="text-xl font-semibold">Agendar llamada técnica</h2>
                <p class="text-sm text-muted-foreground">
                    Recomendado si querés revisar el caso directamente con nuestro equipo.
                </p>
                <p class="text-xs text-muted-foreground">
                    Si no tenés cuenta todavía, te vamos a pedir que inicies sesión primero.
                </p>
                <a
                    href={data.hasSession ? `/${workspace}/dashboard/contact` : registerUrl}
                    class="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-colors mt-2"
                >
                    Agendar llamada técnica
                </a>
            </div>

            <div class="border rounded-2xl p-6 space-y-3 bg-card/80">
                <h2 class="text-xl font-semibold">Solicitar contacto (sin cuenta)</h2>
                <p class="text-sm text-muted-foreground">
                    Si preferís no crear una cuenta en esta instancia, podés dejar tus datos y
                    continuar el proceso por email.
                </p>
                <a
                    href={contactUrl}
                    class="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-colors mt-2"
                >
                    Solicitar contacto
                </a>
            </div>
        </div>
    {/if}

    {#if isAllianzy}
        <p class="text-xs text-muted-foreground mt-8">
            Esta evaluación no es una propuesta formal ni una aceptación definitiva de proyecto. Sirve como
            filtro estructural para priorizar los casos donde Allianzy puede aportar el mayor impacto.
        </p>
    {/if}
</div>

