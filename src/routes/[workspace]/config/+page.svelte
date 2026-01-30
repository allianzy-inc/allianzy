<script lang="ts">
    let brandColor = '#000000';
    let logoUrl = '';
    
    function save() {
        alert('Branding saved!');
    }
</script>

<div class="max-w-2xl space-y-8">
    <h2 class="text-2xl font-bold tracking-tight">Workspace Configuration</h2>
    
    <div class="bg-card border rounded-lg p-6 space-y-6 shadow-sm">
        <div class="grid gap-2">
            <label class="text-sm font-medium">Brand Color</label>
            <div class="flex gap-4 items-center">
                <input type="color" bind:value={brandColor} class="h-10 w-20 p-1 rounded border cursor-pointer" />
                <span class="text-sm font-mono bg-muted px-2 py-1 rounded">{brandColor}</span>
            </div>
        </div>
        
        <div class="grid gap-2">
            <label class="text-sm font-medium">Logo URL</label>
            <input type="text" bind:value={logoUrl} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="https://example.com/logo.png" />
        </div>
        
        <div class="pt-4 border-t">
            <button on:click={save} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 font-medium">
                Save Changes
            </button>
        </div>
    </div>
</div>
