<script lang="ts">
	import { X, ExternalLink, Download, CreditCard, Plus, Trash2, Loader2, Receipt, Upload, FileCheck, Copy, Check, Eye } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import type { BillingInvoice, BillingInvoiceOverlay } from '$lib/stores/billing';
	import { billingOverlays, formatBillingAmount, setOverlay } from '$lib/stores/billing';
	import DocumentPreviewModal from '$lib/components/DocumentPreviewModal.svelte';

	export let open = false;
	export let invoice: BillingInvoice | null = null;
	/** Para construir URLs de API (ej. /allianzy/api/...). */
	export let workspace = 'allianzy';
	/** Ver en Stripe, Pagar en Stripe, etc. */
	export let canManageBilling = false;
	/** Solo desde /admin: editar detalle interno (líneas, título). El cliente nunca puede editar. */
	export let canEditInternalDetail = false;
	/** Si se proporciona, se llama al guardar para persistir en el servidor (admin). */
	export let onSaveOverlay: ((stripeInvoiceId: string, overlay: BillingInvoiceOverlay) => Promise<void>) | undefined = undefined;
	/** Cliente puede subir comprobante de transferencia (cuando no es Stripe/MercadoPago automático). */
	export let canUploadProof = false;
	/** Si true (admin), permite subir/editar comprobantes aunque la factura esté pagada. */
	export let allowUploadProofWhenPaid = false;
	/** Callback para subir comprobante: (documentId, file) => Promise. */
	export let onUploadProof: ((documentId: string, file: File) => Promise<void>) | undefined = undefined;
	/** Callback cuando se elimina un comprobante (para refrescar datos). */
	export let onProofDeleted: (() => Promise<void>) | undefined = undefined;
	/** ID de la empresa (admin billing): para vincular factura Stripe a proyectos. */
	export let companyId: number | undefined = undefined;
	/** Proyectos de la empresa (admin billing): lista para checkboxes de vinculación. */
	export let companyProjects: { id: number; name: string | null }[] = [];
	/** Callback tras guardar vínculos proyecto (para refrescar factura). */
	export let onLinkProjects: (() => Promise<void>) | undefined = undefined;
	export let onClose: () => void;

	let proofFile: File | null = null;
	let proofUploading = false;
	let proofError = '';
	let proofDeleteLoading: number | null = null;
	let previewOpen = false;
	let previewUrl: string | null = null;
	let previewTitle = '';
	let previewFetching = false;
	/** IDs de proyectos seleccionados (Stripe, admin). */
	let linkedProjectIds: number[] = [];
	let linkProjectsSaving = false;
	let linkProjectsError = '';

	$: overlay = invoice ? $billingOverlays[invoice.id] : undefined;
	$: title = overlay?.title ?? invoice?.description ?? 'Factura';
	$: items = overlay?.items ?? [];
	let editMode = false;
	let saving = false;
	let lastInvoiceId = '';
	$: if (invoice && invoice.id !== lastInvoiceId) {
		lastInvoiceId = invoice.id;
		editMode = false;
		linkedProjectIds = Array.isArray(invoice.linked_project_ids) ? [...invoice.linked_project_ids] : [];
	}

	// Local edit state: amounts in the form are in DOLLARS (user-friendly); we convert to cents on save
	let editTitle = '';
	let editItems: { id: string; label: string; amount: number }[] = []; // amount = dollars in form
	let newItemLabel = '';
	let newItemAmount = '';

	function initEdit() {
		editTitle = title;
		editItems = items.map((i) => ({ id: i.id, label: i.label, amount: i.amount / 100 })); // cents → dollars
		newItemLabel = '';
		newItemAmount = '';
	}

	function enterEditMode() {
		initEdit();
		editMode = true;
	}

	function cancelEdit() {
		editMode = false;
	}

	let saveError = '';
	async function saveEdit() {
		if (!invoice) return;
		saving = true;
		saveError = '';
		try {
			const current = $billingOverlays[invoice.id];
			const items = editItems.map((i) => ({
				id: i.id,
				label: String(i.label ?? ''),
				amount: Math.round(Number(i.amount) * 100) || 0 // dollars → cents
			}));
			const updated: BillingInvoiceOverlay = {
				stripeInvoiceId: invoice.id,
				title: editTitle,
				projectId: current?.projectId,
				notes: current?.notes,
				items
			};
			if (onSaveOverlay) {
				await onSaveOverlay(invoice.id, updated);
			}
			setOverlay(invoice.id, updated);
			editMode = false;
		} catch (e: any) {
			saveError = e?.message ?? 'Error al guardar';
		} finally {
			saving = false;
		}
	}

	function addItem() {
		const amountDollars = parseFloat(newItemAmount || '0') || 0;
		if (!newItemLabel.trim()) return;
		editItems = [...editItems, { id: `tmp_${Date.now()}`, label: newItemLabel.trim(), amount: amountDollars }];
		newItemLabel = '';
		newItemAmount = '';
	}

	function removeItem(idx: number) {
		editItems = editItems.filter((_, i) => i !== idx);
	}

	function invoiceStatusBadgeClass(status: string): string {
		switch (status) {
			case 'paid':
				return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
			case 'open':
				return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30';
			case 'void':
				return 'bg-muted text-muted-foreground border-border';
			case 'uncollectible':
				return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
			default:
				return 'bg-muted text-muted-foreground border-border';
		}
	}

	function invoiceStatusLabel(status: string): string {
		const map: Record<string, string> = {
			paid: 'Pagado',
			open: 'Pendiente',
			void: 'Anulada',
			uncollectible: 'Incobrable'
		};
		return map[status] ?? status;
	}

	async function submitProof() {
		if (!invoice?.documentId || !proofFile || !onUploadProof) return;
		proofUploading = true;
		proofError = '';
		try {
			await onUploadProof(invoice.documentId, proofFile);
			proofFile = null;
		} catch (e: unknown) {
			proofError = (e as Error)?.message ?? 'Error al subir';
		} finally {
			proofUploading = false;
		}
	}

	$: showProofSection = canUploadProof && invoice?.documentId && invoice?.provider && invoice.provider !== 'stripe';
	$: showPaymentDetailsSection =
		invoice?.provider && invoice.provider !== 'stripe' && Array.isArray(invoice.providerDetails) && invoice.providerDetails.length > 0;

	$: proofList = (() => {
		if (!invoice) return [];
		if (Array.isArray(invoice.proofFiles) && invoice.proofFiles.length > 0) return invoice.proofFiles;
		if (invoice.proofUrl) return [{ id: 'legacy', url: invoice.proofUrl, name: 'Comprobante', uploadedAt: invoice.proofUploadedAt ?? '' }];
		return [];
	})();
	$: canEditProofs = showProofSection && (invoice?.status !== 'paid' || allowUploadProofWhenPaid);

	let copiedKey: string | null = null;

	async function openProofView(index: number) {
		if (!invoice?.documentId || previewFetching) return;
		previewFetching = true;
		previewUrl = null;
		previewTitle = proofList[index]?.name ?? 'Comprobante';
		try {
			const res = await fetch(`/${workspace}/api/billing/documents/${invoice.documentId}/proof?index=${index}`, { credentials: 'include' });
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? 'No se pudo cargar');
			const base = typeof window !== 'undefined' ? window.location.origin : '';
			previewUrl = data.url ? (data.url.startsWith('http') ? data.url : `${base}${data.url}`) : null;
			previewOpen = true;
		} catch (e) {
			proofError = (e as Error)?.message ?? 'Error al abrir';
		} finally {
			previewFetching = false;
		}
	}

	async function deleteProof(index: number) {
		if (!invoice?.documentId || proofDeleteLoading !== null || !onProofDeleted) return;
		proofDeleteLoading = index;
		proofError = '';
		try {
			const res = await fetch(`/${workspace}/api/billing/documents/${invoice.documentId}/proof?index=${index}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? 'Error al eliminar');
			await onProofDeleted();
		} catch (e) {
			proofError = (e as Error)?.message ?? 'Error al eliminar';
		} finally {
			proofDeleteLoading = null;
		}
	}
	function copyToClipboard(value: string, key: string) {
		if (!value) return;
		navigator.clipboard.writeText(value).then(
			() => {
				copiedKey = key;
				setTimeout(() => (copiedKey = null), 2000);
			},
			() => {}
		);
	}

	/** Siempre mostrar en admin con empresa para que se pueda asociar proyecto a cualquier pago. */
	$: showLinkProjectsSection = canManageBilling && companyId != null;

	function toggleProjectLink(projectId: number) {
		const idx = linkedProjectIds.indexOf(projectId);
		if (idx >= 0) linkedProjectIds = linkedProjectIds.filter((id) => id !== projectId);
		else linkedProjectIds = [...linkedProjectIds, projectId];
	}

	async function saveLinkProjects() {
		if (!invoice || companyId == null) return;
		linkProjectsSaving = true;
		linkProjectsError = '';
		try {
			const isUpcoming = invoice.id?.startsWith?.('upcoming_');
			const url =
				!isUpcoming && invoice.documentId != null
					? `/${workspace}/api/billing/documents/${invoice.documentId}`
					: `/${workspace}/api/billing/link-projects`;
			const method = !isUpcoming && invoice.documentId != null ? 'PATCH' : 'POST';
			const body: Record<string, unknown> =
				!isUpcoming && invoice.documentId != null
					? { companyId, projectIds: linkedProjectIds }
					: {
							companyId,
							projectIds: linkedProjectIds,
							provider: invoice.provider ?? 'stripe',
							providerDocumentId: invoice.id,
							...(isUpcoming && {
								amountCents: invoice.amount,
								dueDate: invoice.dueAt ?? undefined,
								currency: invoice.currency ?? undefined
							})
						};
			const res = await fetch(url, {
				method,
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? 'Error al guardar vínculos');
			if (onLinkProjects) await onLinkProjects();
		} catch (e: unknown) {
			linkProjectsError = (e as Error)?.message ?? 'Error al guardar';
		} finally {
			linkProjectsSaving = false;
		}
	}
</script>

{#if open && invoice}
	<div class="fixed inset-0 z-50 flex justify-end" role="presentation">
		<!-- Backdrop: use button for a11y (keyboard + screen reader) -->
		<button
			type="button"
			class="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-default"
			aria-label="Cerrar panel"
			on:click={onClose}
			on:keydown={(e) => e.key === 'Escape' && onClose()}
		></button>

		<div
			class="relative w-full max-w-lg bg-card border-l shadow-2xl flex flex-col max-h-full overflow-hidden"
			role="dialog"
			aria-label="Detalle de factura"
			transition:fly={{ x: 320, duration: 200 }}
		>
			<div class="px-6 py-4 border-b flex items-center justify-between shrink-0">
				<h2 class="text-lg font-semibold truncate pr-2">Detalle de factura</h2>
				<button type="button" on:click={onClose} class="p-2 hover:bg-muted rounded-full" aria-label="Cerrar">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-6 space-y-6">
				<!-- Title / concept -->
				<div>
					<p class="text-sm text-muted-foreground">Concepto</p>
					<p class="font-medium">{title}</p>
				</div>

				<!-- Period / dates -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-muted-foreground">Creada</p>
						<p class="text-sm">{new Date(invoice.createdAt).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</p>
					</div>
					{#if invoice.dueAt}
						<div>
							<p class="text-sm text-muted-foreground">Vencimiento</p>
							<p class="text-sm">{new Date(invoice.dueAt).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</p>
						</div>
					{/if}
				</div>

				<!-- Status -->
				<div>
					<p class="text-sm text-muted-foreground mb-1">Estado</p>
					<span
						class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {invoiceStatusBadgeClass(invoice.status)}"
					>
						{invoiceStatusLabel(invoice.status)}
					</span>
				</div>

				<!-- Totals -->
				<div class="rounded-lg border bg-muted/30 p-4">
					<p class="text-sm text-muted-foreground">Total</p>
					<p class="text-xl font-semibold">{formatBillingAmount(invoice.amount, invoice.currency)}</p>
					{#if invoice.projectName || invoice.serviceName}
						<p class="text-sm text-muted-foreground mt-1">
							{invoice.projectName ?? ''}{invoice.projectName && invoice.serviceName ? ' · ' : ''}{invoice.serviceName ?? ''}
						</p>
					{/if}
				</div>

				<!-- Vincular a proyectos (admin) -->
				{#if showLinkProjectsSection}
					<div class="rounded-lg border bg-muted/30 p-4 space-y-3">
						<p class="text-sm font-medium">Vincular a proyectos</p>
						<p class="text-sm text-muted-foreground">
							Marcá los proyectos de la empresa a los que corresponde esta factura. Podés elegir uno o varios. El pago se verá en la pestaña Pagos de cada proyecto.
						</p>
						{#if invoice?.id?.startsWith?.('upcoming_')}
							<p class="text-sm text-muted-foreground mb-2">
								Factura próxima (aún no emitida). Vinculá a proyectos para que cuando se emita aparezca en la pestaña Pagos de cada proyecto.
							</p>
						{/if}
						{#if linkProjectsError}
							<p class="text-sm text-destructive">{linkProjectsError}</p>
						{/if}
						{#if companyProjects.length === 0}
							<p class="text-sm text-muted-foreground rounded-md border border-dashed border-muted-foreground/30 bg-background/50 px-3 py-3">
								No hay proyectos asociados a esta empresa. Asociá la empresa a proyectos desde <strong>Admin → Proyectos</strong> (campo Empresa en cada proyecto) para poder vincularlos aquí.
							</p>
						{:else}
							<div class="space-y-2 max-h-48 overflow-y-auto">
								{#each companyProjects as project}
									{@const id = project.id}
									<label class="flex items-center gap-2 cursor-pointer rounded-md border bg-background/80 px-3 py-2 hover:bg-accent/50">
										<input
											type="checkbox"
											checked={linkedProjectIds.includes(id)}
											on:change={() => toggleProjectLink(id)}
										/>
										<span class="text-sm truncate">{project.name ?? `Proyecto ${id}`}</span>
									</label>
								{/each}
							</div>
							<button
								type="button"
								class="btn btn-primary btn-sm"
								disabled={linkProjectsSaving}
								on:click={saveLinkProjects}
							>
								{#if linkProjectsSaving}
									<Loader2 class="w-4 h-4 animate-spin" />
								{/if}
								Guardar vínculos
							</button>
						{/if}
					</div>
				{/if}

				<!-- Datos para realizar el pago (transferencia, etc.) cuando no es Stripe -->
				{#if showPaymentDetailsSection}
					<div class="rounded-lg border bg-muted/30 p-4 space-y-3">
						<p class="text-sm font-medium">Datos para realizar el pago</p>
						<p class="text-sm text-muted-foreground">
							Realizá la transferencia o el pago con los siguientes datos. Podés copiar cada valor con el botón.
						</p>
						<div class="space-y-2">
							{#each (invoice?.providerDetails ?? []) as item, i}
								{@const key = `${item.label}-${i}`}
								<div class="flex items-center gap-2 rounded-md border bg-background/80 px-3 py-2">
									<div class="flex-1 min-w-0">
										<p class="text-xs text-muted-foreground">{item.label}</p>
										<p class="text-sm font-mono truncate" title={item.value}>{item.value}</p>
									</div>
									<button
										type="button"
										on:click={() => copyToClipboard(item.value, key)}
										class="shrink-0 p-2 rounded-md border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
										title="Copiar"
									>
										{#if copiedKey === key}
											<Check class="w-4 h-4 text-green-600 dark:text-green-400" />
										{:else}
											<Copy class="w-4 h-4" />
										{/if}
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Comprobante de transferencia (cliente, métodos no Stripe) -->
				{#if showProofSection}
					<div class="rounded-lg border bg-muted/30 p-4 space-y-2">
						<p class="text-sm font-medium flex items-center gap-2">
							<FileCheck class="w-4 h-4 text-muted-foreground" />
							Comprobante de transferencia
						</p>
						{#if proofList.length > 0}
							<p class="text-sm text-muted-foreground">Podés ver, descargar o eliminar los archivos (hasta que el admin marque como pagado).</p>
							<ul class="space-y-2">
								{#each proofList as proof, i}
									<li class="flex items-center gap-2 rounded-md border bg-background/80 px-3 py-2 text-sm">
										<span class="flex-1 truncate text-muted-foreground" title={proof.name}>{proof.name}</span>
										<button
											type="button"
											on:click={() => openProofView(i)}
											disabled={previewFetching}
											class="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium hover:bg-accent"
											title="Ver documento"
										>
											{#if previewFetching && previewTitle === proof.name}
												<Loader2 class="h-3 w-3 animate-spin" />
											{:else}
												<Eye class="h-3 w-3" />
											{/if}
											Ver
										</button>
										{#if canEditProofs}
											<button
												type="button"
												on:click={() => deleteProof(i)}
												disabled={proofDeleteLoading === i}
												class="inline-flex items-center gap-1 rounded border border-destructive/50 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
												title="Eliminar"
											>
												{#if proofDeleteLoading === i}
													<Loader2 class="h-3 w-3 animate-spin" />
												{:else}
													<Trash2 class="h-3 w-3" />
												{/if}
												Eliminar
											</button>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}
						{#if canEditProofs}
							<div class="pt-2 border-t border-border/50">
								<p class="text-sm text-muted-foreground mb-2">Agregar otro archivo (imagen o PDF).</p>
								<input
									type="file"
									accept="image/*,.pdf"
									class="text-sm file:mr-2 file:rounded file:border file:px-3 file:py-1.5 file:text-sm file:font-medium"
									on:change={(e) => { proofFile = e.currentTarget.files?.[0] ?? null; proofError = ''; if (proofFile) submitProof(); }}
								/>
								{#if proofFile}
									<div class="flex items-center gap-2 mt-2">
										<button type="button" on:click={submitProof} disabled={proofUploading}
											class="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
											{#if proofUploading}<Loader2 class="h-4 w-4 animate-spin" />{:else}<Upload class="h-4 w-4" />{/if}
											Subir comprobante
										</button>
									</div>
								{/if}
							</div>
						{:else if proofList.length === 0}
							<p class="text-sm text-muted-foreground">Podés subir el comprobante de la transferencia para acreditar el pago.</p>
							<input
								type="file"
								accept="image/*,.pdf"
								class="text-sm file:mr-2 file:rounded file:border file:px-3 file:py-1.5 file:text-sm file:font-medium"
								on:change={(e) => { proofFile = e.currentTarget.files?.[0] ?? null; proofError = ''; if (proofFile) submitProof(); }}
							/>
							{#if proofFile}
								<div class="flex items-center gap-2">
									<button
										type="button"
										on:click={submitProof}
										disabled={proofUploading}
										class="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
									>
										{#if proofUploading}
											<Loader2 class="w-4 h-4 animate-spin" />
										{:else}
											<Upload class="w-4 h-4" />
										{/if}
										Subir comprobante
									</button>
								</div>
							{/if}
						{/if}
						{#if proofError}
							<p class="text-sm text-destructive">{proofError}</p>
						{/if}
					</div>
				{/if}

				<DocumentPreviewModal
					isOpen={previewOpen}
					title={previewTitle}
					fileUrl={previewUrl}
					onClose={() => { previewOpen = false; previewUrl = null; previewTitle = ''; }}
				/>

				<!-- Action buttons -->
				<div class="flex flex-wrap gap-2">
					{#if canManageBilling && invoice.hostedInvoiceUrl}
						<a
							href={invoice.hostedInvoiceUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							<ExternalLink class="w-4 h-4" />
							Ver en Stripe
						</a>
					{/if}
					{#if invoice.invoicePdfUrl}
						<a
							href={invoice.invoicePdfUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							<Download class="w-4 h-4" />
							Descargar factura
						</a>
					{/if}
					{#if invoice.receiptUrl}
						<a
							href={invoice.receiptUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							<Receipt class="w-4 h-4" />
							Descargar recibo
						</a>
					{/if}
					{#if canManageBilling && invoice.status === 'open' && invoice.hostedInvoiceUrl}
						<a
							href={invoice.hostedInvoiceUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90"
						>
							<CreditCard class="w-4 h-4" />
							Pagar en Stripe
						</a>
					{/if}
				</div>

				<!-- Detalle interno (solo admin puede editar desde /admin) -->
				<div class="border-t pt-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-medium">Detalle interno</h3>
						{#if canEditInternalDetail && !editMode}
							<button
								type="button"
								on:click={enterEditMode}
								class="text-sm text-primary hover:underline"
							>
								Editar
							</button>
						{/if}
						{#if canEditInternalDetail && editMode}
							<div class="flex gap-2">
								<button
									type="button"
									on:click={cancelEdit}
									class="text-sm px-2 py-1 rounded border hover:bg-muted"
								>
									Cancelar
								</button>
								<button
									type="button"
									on:click={saveEdit}
									disabled={saving}
									class="text-sm px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-1"
								>
									{#if saving}
										<Loader2 class="w-4 h-4 animate-spin" />
									{/if}
									Guardar
								</button>
							</div>
							{#if saveError}
								<p class="text-sm text-destructive mt-2">{saveError}</p>
							{/if}
						{/if}
					</div>

					{#if canEditInternalDetail && editMode}
						<div class="space-y-3">
							<div>
								<label for="overlay-title" class="text-xs text-muted-foreground">Título</label>
								<input
									id="overlay-title"
									type="text"
									bind:value={editTitle}
									class="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								/>
							</div>
							{#each editItems as item, idx}
								<div class="flex gap-2 items-center">
									<input
										type="text"
										bind:value={item.label}
										class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
										placeholder="Concepto"
									/>
									<input
										type="number"
										step="0.01"
										min="0"
										bind:value={item.amount}
										class="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
										placeholder="0"
										title="Monto en USD"
									/>
									<button
										type="button"
										on:click={() => removeItem(idx)}
										class="p-2 text-destructive hover:bg-destructive/10 rounded"
										aria-label="Eliminar línea"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</div>
							{/each}
							<div class="flex gap-2">
								<input
									type="text"
									bind:value={newItemLabel}
									placeholder="Nueva línea"
									class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
								/>
								<input
									type="number"
									step="0.01"
									min="0"
									bind:value={newItemAmount}
									placeholder="USD"
									class="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
									title="Monto en USD"
								/>
								<button
									type="button"
									on:click={addItem}
									class="p-2 rounded-md border border-input hover:bg-muted inline-flex items-center"
									aria-label="Añadir línea"
								>
									<Plus class="w-4 h-4" />
								</button>
							</div>
						</div>
					{:else}
						<ul class="space-y-2">
							{#each items as item}
								<li class="flex justify-between text-sm">
									<span>{item.label}</span>
									<span class="font-mono">{formatBillingAmount(item.amount, invoice.currency)}</span>
								</li>
							{/each}
						</ul>
						{#if items.length === 0}
							<p class="text-sm text-muted-foreground">Sin líneas de detalle.</p>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
