<script lang="ts">
    const cases = [
        { id: 'C-001', client: 'Acme Corp', project: 'Website Redesign', status: 'Pending', date: '2023-10-01' },
        { id: 'C-002', client: 'Globex', project: 'App Dev', status: 'Approved', date: '2023-09-28' },
        { id: 'C-003', client: 'Soylent', project: 'Consulting', status: 'Rejected', date: '2023-09-25' },
    ];
    
    let filter = '';
    $: filteredCases = cases.filter(c => 
        c.client.toLowerCase().includes(filter.toLowerCase()) || 
        c.project.toLowerCase().includes(filter.toLowerCase()) ||
        c.id.toLowerCase().includes(filter.toLowerCase())
    );
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">Cases</h2>
        <div class="flex gap-2">
            <input 
                type="text" 
                bind:value={filter} 
                placeholder="Filter cases..." 
                class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">New Case</button>
        </div>
    </div>
    
    <div class="rounded-md border bg-card shadow-sm overflow-hidden">
        <table class="w-full text-sm text-left">
            <thead class="bg-muted/50 text-muted-foreground border-b">
                <tr>
                    <th class="px-4 py-3 font-medium">ID</th>
                    <th class="px-4 py-3 font-medium">Client</th>
                    <th class="px-4 py-3 font-medium">Project</th>
                    <th class="px-4 py-3 font-medium">Status</th>
                    <th class="px-4 py-3 font-medium">Date</th>
                    <th class="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredCases as c}
                    <tr class="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td class="px-4 py-3 font-medium">{c.id}</td>
                        <td class="px-4 py-3">{c.client}</td>
                        <td class="px-4 py-3">{c.project}</td>
                        <td class="px-4 py-3">
                            <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium 
                                {c.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                 c.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                                 'bg-yellow-100 text-yellow-700'}">
                                {c.status}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-muted-foreground">{c.date}</td>
                        <td class="px-4 py-3 text-right space-x-2">
                             <button class="text-primary hover:underline font-medium">View</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
