<script lang="ts">
    // Mock tickets
    const tickets = [
        { id: 'TK-1', subject: 'Login issue', status: 'Open', created: '1 hour ago' }
    ];
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">Support Tickets</h2>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">New Ticket</button>
    </div>
    
    <div class="bg-card border rounded-lg overflow-hidden">
        {#if tickets.length === 0}
            <div class="p-8 text-center text-muted-foreground">
                No open tickets.
            </div>
        {:else}
            <table class="w-full text-sm text-left">
                <thead class="bg-muted/50 border-b">
                    <tr>
                        <th class="px-4 py-3 font-medium">ID</th>
                        <th class="px-4 py-3 font-medium">Subject</th>
                        <th class="px-4 py-3 font-medium">Status</th>
                        <th class="px-4 py-3 font-medium">Created</th>
                    </tr>
                </thead>
                <tbody>
                    {#each tickets as ticket}
                        <tr class="border-b last:border-0">
                            <td class="px-4 py-3 font-medium">{ticket.id}</td>
                            <td class="px-4 py-3">{ticket.subject}</td>
                            <td class="px-4 py-3">
                                <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">{ticket.status}</span>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">{ticket.created}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</div>
