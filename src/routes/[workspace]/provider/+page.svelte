<script lang="ts">
    const tasks = [
        { id: 'T-101', title: 'Design Homepage Mockup', due: '2023-10-05', priority: 'High' },
        { id: 'T-102', title: 'Implement Auth Flow', due: '2023-10-08', priority: 'Medium' },
    ];
</script>

<div class="space-y-6">
    <h2 class="text-2xl font-bold tracking-tight">Assigned Tasks</h2>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each tasks as task}
            <div class="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <span class="text-xs font-mono bg-muted px-2 py-1 rounded">{task.id}</span>
                    <span class="text-xs font-medium px-2 py-1 rounded-full {task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">
                        {task.priority}
                    </span>
                </div>
                <h3 class="text-lg font-semibold mb-2">{task.title}</h3>
                <p class="text-sm text-muted-foreground mb-4">Due: {task.due}</p>
                <button class="w-full py-2 border rounded hover:bg-muted transition-colors text-sm font-medium">
                    View Details
                </button>
            </div>
        {/each}
    </div>
</div>
