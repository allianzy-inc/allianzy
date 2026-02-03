<script lang="ts">
    import { X, Download, Printer, ExternalLink, FileText, AlertCircle } from 'lucide-svelte';
    import { fade, scale } from 'svelte/transition';

    export let isOpen = false;
    export let title = '';
    export let fileUrl: string | null = null;
    export let onClose: () => void;

    // Detect file type
    $: fileName = (() => {
        if (!fileUrl) return '';
        try {
            // Handle proxy URLs with url param (e.g. /api/files?url=...)
            if (fileUrl.includes('url=')) {
                const urlObj = new URL(fileUrl, 'http://localhost');
                const embeddedUrl = urlObj.searchParams.get('url');
                if (embeddedUrl) {
                    // Extract filename from the embedded B2 URL
                    return embeddedUrl.split('?')[0].split('/').pop() || '';
                }
            }
            
            // Handle proxy URLs with key param (e.g. /api/files?key=...)
            if (fileUrl.includes('key=')) {
                const url = new URL(fileUrl, 'http://localhost'); // Base for relative URLs
                const key = url.searchParams.get('key');
                if (key) return key;
            }
            // Handle regular paths/URLs, stripping query params
            return fileUrl.split('?')[0].split('/').pop() || '';
        } catch (e) {
            return fileUrl;
        }
    })();

    $: isPdf = fileName.toLowerCase().endsWith('.pdf');
    $: isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(fileName);
    
    // For handling iframe load errors or fallback
    let loadError = false;

    function handleClose() {
        loadError = false;
        onClose();
    }

    function handlePrint() {
        if (fileUrl) {
            const printWindow = window.open(fileUrl, '_blank');
            printWindow?.print();
        }
    }

    $: if (isOpen && fileUrl) {
        console.log('DocumentPreviewModal opening:', { title, fileUrl });
    }
</script>

{#if isOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6" transition:fade={{ duration: 200 }}>
        <div class="bg-background w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" transition:scale={{ duration: 200, start: 0.95 }}>
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-primary/10 rounded-lg text-primary">
                        <FileText class="w-5 h-5" />
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg leading-tight">{title}</h3>
                        <p class="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">{fileName.split('/').pop() || 'Documento'}</p>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    {#if fileUrl}
                        <a href={fileUrl} download target="_blank" class="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Descargar">
                            <Download class="w-5 h-5" />
                        </a>
                        <a href={fileUrl} target="_blank" class="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Abrir en nueva pestaña">
                            <ExternalLink class="w-5 h-5" />
                        </a>
                    {/if}
                    <button on:click={handleClose} class="p-2 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors ml-2" title="Cerrar">
                        <X class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="flex-1 bg-gray-100/50 relative overflow-hidden flex items-center justify-center p-4">
                {#if fileUrl && !loadError}
                    {#if isPdf}
                        <iframe 
                            src="{fileUrl}#toolbar=0" 
                            class="w-full h-full rounded-lg border bg-white shadow-sm" 
                            title="Document Preview"
                            on:error={() => loadError = true}
                        ></iframe>
                    {:else if isImage}
                        <img 
                            src={fileUrl} 
                            alt={title} 
                            class="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                            on:error={() => loadError = true}
                        />
                    {:else}
                        <!-- Fallback for other file types -->
                        <div class="text-center space-y-4">
                            <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <FileText class="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div>
                                <p class="font-medium">Vista previa no disponible</p>
                                <p class="text-sm text-muted-foreground">Este tipo de archivo no se puede previsualizar directamente.</p>
                            </div>
                            <a href={fileUrl} target="_blank" class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90">
                                <Download class="w-4 h-4" /> Descargar Archivo
                            </a>
                        </div>
                    {/if}
                {:else}
                    <div class="text-center space-y-4">
                        <AlertCircle class="w-12 h-12 text-destructive mx-auto" />
                        <p class="font-medium text-destructive">No se pudo cargar el documento</p>
                        <p class="text-sm text-muted-foreground">El archivo no está disponible o el enlace ha expirado.</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
