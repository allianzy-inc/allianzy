<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    let filter = '';
    $: filteredCases =
        data.intakeCases?.filter((c) => {
            const haystack = `${c.id} ${c.status ?? ''}`.toLowerCase();
            return haystack.includes(filter.toLowerCase());
        }) ?? [];

    function formatStatus(status: string | null) {
        if (!status) return 'draft';
        return status;
    }

    function formatDate(value: string | null) {
        if (!value) return '';
        return new Date(value).toLocaleString();
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">Intake Cases</h2>
        <div class="flex gap-2">
            <input
                type="text"
                bind:value={filter}
                placeholder="Filtrar por ID o estado..."
                class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
        </div>
    </div>

    <div class="rounded-md border bg-card shadow-sm overflow-hidden">
        <table class="w-full text-sm text-left">
            <thead class="bg-muted/50 text-muted-foreground border-b">
                <tr>
                    <th class="px-4 py-3 font-medium">ID</th>
                    <th class="px-4 py-3 font-medium">Workspace</th>
                    <th class="px-4 py-3 font-medium">Status</th>
                    <th class="px-4 py-3 font-medium">Score</th>
                    <th class="px-4 py-3 font-medium">Created</th>
                    <th class="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#if filteredCases.length === 0}
                    <tr>
                        <td class="px-4 py-6 text-center text-muted-foreground text-sm" colspan="6">
                            No hay casos de intake aún.
                        </td>
                    </tr>
                {:else}
                    {#each filteredCases as c}
                        <tr class="border-b last:border-0 hover:bg-muted/50 transition-colors">
                            <td class="px-4 py-3 font-medium">{c.id}</td>
                            <td class="px-4 py-3">{c.workspace}</td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                                        {c.status === 'qualifies_allianzy'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : c.status === 'needs_review'
                                            ? 'bg-amber-100 text-amber-800'
                                            : c.status === 'closed_no_fit'
                                            ? 'bg-red-100 text-red-700'
                                            : c.status === 'redirect_beltrix'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-700'}"
                                >
                                    {formatStatus(c.status)}
                                </span>
                            </td>
                            <td class="px-4 py-3">{c.score ?? '-'}</td>
                            <td class="px-4 py-3 text-muted-foreground">{formatDate(c.createdAt)}</td>
                            <td class="px-4 py-3 text-right space-x-2">
                                <a
                                    href={`/${data.workspace}/intake/result/${c.id}`}
                                    class="text-primary hover:underline font-medium"
                                >
                                    Ver
                                </a>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</div>

