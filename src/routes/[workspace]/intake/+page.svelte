<script lang="ts">
    import { fade } from 'svelte/transition';

    let step = 1;
    
    function next() {
        if (step < 3) step++;
    }
    
    function prev() {
        if (step > 1) step--;
    }
    
    function submit() {
        alert('Intake submitted!');
    }
</script>

<div class="max-w-2xl mx-auto py-12 px-4">
    <div class="mb-8">
        <h1 class="text-3xl font-bold">Project Intake</h1>
        <p class="text-muted-foreground">Tell us about your needs.</p>
        
        <!-- Progress Bar -->
        <div class="mt-4 flex gap-2">
            {#each [1, 2, 3] as s}
                <div class="h-2 flex-1 rounded-full transition-colors {s <= step ? 'bg-primary' : 'bg-gray-200'}"></div>
            {/each}
        </div>
    </div>
    
    <div class="bg-card border rounded-lg p-8 shadow-sm min-h-[400px]">
        {#if step === 1}
            <div in:fade class="space-y-4">
                <h2 class="text-xl font-semibold">Contact Information</h2>
                <div class="grid gap-2">
                    <label class="text-sm font-medium">Full Name</label>
                    <input type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="John Doe">
                </div>
                 <div class="grid gap-2">
                    <label class="text-sm font-medium">Email</label>
                    <input type="email" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="john@example.com">
                </div>
            </div>
        {:else if step === 2}
             <div in:fade class="space-y-4">
                <h2 class="text-xl font-semibold">Project Details</h2>
                <div class="grid gap-2">
                    <label class="text-sm font-medium">Project Name</label>
                    <input type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Project Alpha">
                </div>
                 <div class="grid gap-2">
                    <label class="text-sm font-medium">Description</label>
                    <textarea class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Describe your project..."></textarea>
                </div>
                 <div class="grid gap-2">
                    <label class="text-sm font-medium">Attachments</label>
                    <div class="flex items-center justify-center w-full">
                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-muted-foreground/25">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <p class="text-sm text-muted-foreground"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                <p class="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" class="hidden" />
                        </label>
                    </div>
                </div>
            </div>
        {:else}
             <div in:fade class="space-y-4">
                <h2 class="text-xl font-semibold">Review</h2>
                <p class="text-muted-foreground">Please review your information before submitting.</p>
                
                <div class="bg-muted p-4 rounded text-sm space-y-2">
                    <p><strong>Name:</strong> John Doe</p>
                    <p><strong>Email:</strong> john@example.com</p>
                    <p><strong>Project:</strong> Project Alpha</p>
                </div>
            </div>
        {/if}
    </div>
    
    <div class="mt-6 flex justify-between">
        <button 
            on:click={prev} 
            disabled={step === 1}
            class="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-muted transition-colors"
        >
            Back
        </button>
        {#if step < 3}
            <button 
                on:click={next}
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
                Next
            </button>
        {:else}
             <button 
                on:click={submit}
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:opacity-90 transition-opacity"
            >
                Submit Intake
            </button>
        {/if}
    </div>
</div>
