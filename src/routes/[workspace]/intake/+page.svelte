<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

    const workspace = $page.params.workspace;

    $: step = data.step ?? 1;
    $: caseId = data.caseId ?? data.existingCase?.id;

    const isAllianzy = workspace === 'allianzy';
    const isBeltrix = workspace === 'beltrix';
</script>

{#if isBeltrix}
    <!-- Simple placeholder for Beltrix intake -->
    <div class="max-w-2xl mx-auto py-12 px-4 space-y-6">
        <h1 class="text-3xl font-bold">Intake Beltrix</h1>
        <p class="text-muted-foreground">
            Este flujo está orientado a proyectos de marketing, diseño y sitios web operados por Beltrix Agency.
        </p>
        <p class="text-muted-foreground">
            Por ahora, si querés avanzar con un proyecto Beltrix podés escribirnos desde la página principal o
            usar el formulario de contacto.
        </p>
        <a
            href="/beltrix#services"
            class="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-colors"
        >
            Ver servicios Beltrix
        </a>
    </div>
{:else}
    <div class="max-w-3xl mx-auto py-12 px-4 space-y-8">
        <div class="space-y-2">
            <h1 class="text-3xl font-bold">Iniciar evaluación</h1>
            <p class="text-muted-foreground">
                Pre-evaluación rápida para entender si tu desafío encaja con Allianzy. No requiere cuenta.
            </p>
        </div>

        <!-- Progress -->
        <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 rounded-full {step === 1 ? 'bg-primary' : 'bg-primary/60'}"></div>
            <div class="flex-1 h-1.5 rounded-full {step === 2 ? 'bg-primary' : 'bg-muted'}"></div>
        </div>

        {#if step === 1}
            <!-- PRE-EVALUACIÓN -->
            <form method="POST" action="?/start" class="space-y-8">
                {#if form?.error}
                    <div class="rounded-md bg-red-50 text-red-700 px-4 py-3 text-sm">
                        {form.error}
                    </div>
                {/if}

                <div class="space-y-4">
                    <h2 class="text-xl font-semibold">
                        ¿Qué tipo de ayuda estás buscando principalmente?
                    </h2>
                    <div class="grid md:grid-cols-2 gap-4">
                        <label class="border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex gap-3">
                            <input
                                type="radio"
                                name="help_type"
                                value="sistemas_plataforma"
                                class="mt-1"
                                required
                            />
                            <div>
                                <div class="font-medium">Sistemas / Plataforma</div>
                                <p class="text-sm text-muted-foreground">
                                    Diseñar o consolidar una plataforma interna para operar.
                                </p>
                            </div>
                        </label>
                        <label class="border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex gap-3">
                            <input
                                type="radio"
                                name="help_type"
                                value="automatizacion_integraciones"
                                class="mt-1"
                                required
                            />
                            <div>
                                <div class="font-medium">Automatización e integraciones</div>
                                <p class="text-sm text-muted-foreground">
                                    Conectar sistemas, APIs y flujos de datos para reducir trabajo manual.
                                </p>
                            </div>
                        </label>
                        <label class="border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex gap-3">
                            <input
                                type="radio"
                                name="help_type"
                                value="escalabilidad_control"
                                class="mt-1"
                                required
                            />
                            <div>
                                <div class="font-medium">Escalabilidad y control</div>
                                <p class="text-sm text-muted-foreground">
                                    Pasar de operación reactiva a operación con reglas, métricas y procesos claros.
                                </p>
                            </div>
                        </label>
                        <label class="border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex gap-3">
                            <input
                                type="radio"
                                name="help_type"
                                value="diagnostico_estrategico"
                                class="mt-1"
                                required
                            />
                            <div>
                                <div class="font-medium">Diagnóstico estratégico</div>
                                <p class="text-sm text-muted-foreground">
                                    Entender dónde está el cuello de botella técnico/operativo antes de diseñar una solución.
                                </p>
                            </div>
                        </label>
                        <label class="border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex gap-3 md:col-span-2">
                            <input
                                type="radio"
                                name="help_type"
                                value="marketing_diseno_web"
                                class="mt-1"
                                required
                            />
                            <div>
                                <div class="font-medium">Marketing / diseño / web</div>
                                <p class="text-sm text-muted-foreground">
                                    Publicidad, redes sociales, diseño web o gráfico, piezas creativas. Estos casos suelen derivarse a Beltrix Agency.
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="space-y-4">
                    <h2 class="text-xl font-semibold">¿Cuál es el impacto actual principal?</h2>
                    <div class="grid md:grid-cols-2 gap-3">
                        <label class="inline-flex items-center gap-2 text-sm">
                            <input type="radio" name="impact" value="perdida_tiempo" required />
                            Pérdida de tiempo operativo
                        </label>
                        <label class="inline-flex items-center gap-2 text-sm">
                            <input type="radio" name="impact" value="costos" required />
                            Costos elevados o descontrolados
                        </label>
                        <label class="inline-flex items-center gap-2 text-sm">
                            <input type="radio" name="impact" value="falta_control" required />
                            Falta de control / visibilidad
                        </label>
                        <label class="inline-flex items-center gap-2 text-sm">
                            <input type="radio" name="impact" value="riesgo" required />
                            Riesgo operativo / errores críticos
                        </label>
                        <label class="inline-flex items-center gap-2 text-sm md:col-span-2">
                            <input type="radio" name="impact" value="crecimiento_bloqueado" required />
                            Crecimiento bloqueado (no se puede escalar más con la estructura actual)
                        </label>
                    </div>
                </div>

                <div class="space-y-4">
                    <h2 class="text-xl font-semibold">Personas afectadas directamente por este problema</h2>
                    <div class="grid md:grid-cols-4 gap-3 text-sm">
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="people" value="1_3" required />
                            1–3
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="people" value="4_10" required />
                            4–10
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="people" value="10_50" required />
                            10–50
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="people" value="50_plus" required />
                            50+
                        </label>
                    </div>
                </div>

                <div class="space-y-4">
                    <h2 class="text-xl font-semibold">Urgencia percibida</h2>
                    <div class="grid md:grid-cols-3 gap-3 text-sm">
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="urgency" value="exploratorio" required />
                            Exploratorio (entender opciones)
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="urgency" value="proximos_3_meses" required />
                            Resolver en los próximos 3 meses
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="urgency" value="inmediato" required />
                            Necesitamos movernos ahora
                        </label>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button
                        type="submit"
                        class="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            </form>
        {:else}
            <!-- EVALUACIÓN GUIADA -->
            <form method="POST" action="?/complete" class="space-y-8">
                <input type="hidden" name="case_id" value={caseId} />

                {#if form?.error}
                    <div class="rounded-md bg-red-50 text-red-700 px-4 py-3 text-sm">
                        {form.error}
                    </div>
                {/if}

                <div class="space-y-2">
                    <h2 class="text-xl font-semibold">Contexto de la empresa</h2>
                    <p class="text-sm text-muted-foreground">
                        Contanos brevemente a qué se dedica la organización y en qué etapa se encuentra.
                    </p>
                    <textarea
                        name="context"
                        rows="3"
                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    ></textarea>
                </div>

                <div class="space-y-2">
                    <h2 class="text-xl font-semibold">Descripción del problema actual</h2>
                    <p class="text-sm text-muted-foreground">
                        ¿Qué está pasando hoy que te llevó a buscar una solución?
                    </p>
                    <textarea
                        name="problem"
                        rows="4"
                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    ></textarea>
                </div>

                <div class="space-y-3">
                    <h2 class="text-xl font-semibold">¿Qué intentaron previamente?</h2>
                    <div class="grid md:grid-cols-2 gap-3 text-sm">
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="prior_attempt" value="nada" required />
                            Nada concreto todavía
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="prior_attempt" value="ajustes_internos" required />
                            Ajustes internos / hojas de cálculo
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="prior_attempt" value="software_externo" required />
                            Software externo genérico (SaaS)
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="prior_attempt" value="desarrollo_a_medida" required />
                            Desarrollo a medida previo
                        </label>
                        <label class="inline-flex items-center gap-2 md:col-span-2">
                            <input type="radio" name="prior_attempt" value="consultoria_previa" required />
                            Consultoría previa (externa/interna)
                        </label>
                    </div>
                </div>

                <div class="space-y-3">
                    <h2 class="text-xl font-semibold">Stack / proceso actual</h2>
                    <div class="grid md:grid-cols-2 gap-3 text-sm">
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="current_stack" value="whatsapp_email" required />
                            WhatsApp / email como canal principal
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="current_stack" value="sheets_excel" required />
                            Hojas de cálculo (Sheets / Excel)
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="current_stack" value="software_generico" required />
                            Software genérico (CRM, ERP, etc.)
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="current_stack" value="sistema_propio" required />
                            Sistema propio / desarrollo a medida
                        </label>
                        <label class="inline-flex items-center gap-2 md:col-span-2">
                            <input type="radio" name="current_stack" value="sin_proceso_formal" required />
                            No hay un proceso formal definido
                        </label>
                    </div>
                </div>

                <div class="space-y-2">
                    <h2 class="text-xl font-semibold">Resultado esperado</h2>
                    <p class="text-sm text-muted-foreground">
                        Si el proyecto fuera exitoso, ¿qué cambiaría en el día a día?
                    </p>
                    <textarea
                        name="expected_result"
                        rows="3"
                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    ></textarea>
                </div>

                <div class="space-y-3">
                    <h2 class="text-xl font-semibold">¿Quién toma la decisión final?</h2>
                    <div class="grid md:grid-cols-4 gap-3 text-sm">
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="final_decisor" value="yo" required />
                            Yo
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="final_decisor" value="direccion" required />
                            Dirección
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="final_decisor" value="socios" required />
                            Socios
                        </label>
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="final_decisor" value="otro" required />
                            Otro
                        </label>
                    </div>
                </div>

                <div class="flex justify-end gap-3">
                    <button
                        type="submit"
                        class="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-colors"
                    >
                        Ver resultado
                    </button>
                </div>
            </form>
        {/if}
    </div>
{/if}

