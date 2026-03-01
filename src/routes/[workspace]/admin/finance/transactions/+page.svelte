<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import {
		Search,
		Plus,
		ArrowUpDown,
		FileText,
		Trash2,
		Edit2,
		Paperclip,
		X
	} from 'lucide-svelte';
	import DocumentPreviewModal from '$lib/components/DocumentPreviewModal.svelte';
	import { canEditFinance, financeRole } from '$lib/stores/finance-role.store';
	import { goto } from '$app/navigation';

	export let data: import('./$types').PageData;

	$: workspace = $page.params.workspace;
	$: canEdit = canEditFinance($financeRole);

	type Tx = (typeof data.transactions)[number];
	type Category = (typeof data.categories)[number];

	// --- State ---
	let transactions: Tx[] = data.transactions;
	let categories: Category[] = data.categories;
	let searchQuery = '';
	let sortField: 'date' | 'amount' | 'description' = 'date';
	let sortDir: 'asc' | 'desc' = 'desc';
	let currentPage = 1;
	const itemsPerPage = 10;

	// --- Drawer State ---
	let isDrawerOpen = false;
	let editingTx: Tx | null = null;
	let isSaving = false;
	let formError: string | null = null;

	// Vista previa de archivo (como en proyectos)
	let isPreviewModalOpen = false;
	let previewFile: { title: string; url: string | null } = { title: '', url: null };
	function openPreview(title: string, url: string | null) {
		if (!url) return;
		previewFile = { title, url };
		isPreviewModalOpen = true;
	}
	function closePreview() {
		isPreviewModalOpen = false;
		previewFile = { title: '', url: null };
	}

	// New attachments to add (when creating or editing)
	type NewAttachRow = { description: string; kind: string; file: File | null };
	let newAttachmentRows: NewAttachRow[] = [{ description: '', kind: 'other', file: null }];

	// Form Data
	let formData = {
		date: new Date().toISOString().split('T')[0],
		description: '',
		amount: 0,
		currency: 'USD',
		type: 'expense',
		categoryId: '',
		bank: '',
		paymentMethod: 'bank',
		cardLabel: '',
		counterparty: '',
		status: 'pending'
	};

	$: transactions = data.transactions;
	$: categories = data.categories;

	// --- Computed ---
	$: filteredTransactions = [...transactions]
		.filter((t) => {
			const search = searchQuery.toLowerCase();
			return (
				(t.description || '').toLowerCase().includes(search) ||
				t.amount.toString().includes(search) ||
				t.status.includes(search) ||
				(t.bank || '').toLowerCase().includes(search) ||
				(t.counterparty || '').toLowerCase().includes(search)
			);
		})
		.sort((a, b) => {
			const fieldA = a[sortField];
			const fieldB = b[sortField];
			if (fieldA < fieldB) return sortDir === 'asc' ? -1 : 1;
			if (fieldA > fieldB) return sortDir === 'asc' ? 1 : -1;
			return 0;
		});

	$: totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
	$: paginatedTransactions = filteredTransactions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// --- Actions ---
	function handleSort(field: 'date' | 'amount' | 'description') {
		if (sortField === field) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDir = field === 'date' ? 'desc' : 'asc';
		}
	}

	function openCreateDrawer() {
		editingTx = null;
		formError = null;
		formData = {
			date: new Date().toISOString().split('T')[0],
			description: '',
			amount: 0,
			currency: 'USD',
			type: 'expense',
			categoryId: '',
			bank: '',
			paymentMethod: 'bank',
			cardLabel: '',
			counterparty: '',
			status: 'pending'
		};
		newAttachmentRows = [{ description: '', kind: 'other', file: null }];
		isDrawerOpen = true;
		const action = $page.url.searchParams.get('action');
		if (action) {
			const url = new URL(window.location.href);
			url.searchParams.delete('action');
			goto(url.toString(), { replaceState: true, noScroll: true });
		}
	}

	function openEditDrawer(tx: Tx) {
		editingTx = tx;
		formError = null;
		formData = {
			date: (tx.date || '').toString().split('T')[0],
			description: tx.description || '',
			amount: tx.amount ?? 0,
			currency: tx.currency || 'USD',
			type: tx.type || 'expense',
			categoryId: tx.categoryId ? String(tx.categoryId) : '',
			bank: tx.bank || '',
			paymentMethod: tx.paymentMethod || 'bank',
			cardLabel: tx.cardLabel || '',
			counterparty: tx.counterparty || '',
			status: tx.status || 'pending'
		};
		newAttachmentRows = [{ description: '', kind: 'other', file: null }];
		isDrawerOpen = true;
	}

	function closeDrawer() {
		isDrawerOpen = false;
		editingTx = null;
	}

	function addAttachmentRow() {
		newAttachmentRows = [...newAttachmentRows, { description: '', kind: 'other', file: null }];
	}

	function removeAttachmentRow(i: number) {
		newAttachmentRows = newAttachmentRows.filter((_, idx) => idx !== i);
		if (newAttachmentRows.length === 0) newAttachmentRows = [{ description: '', kind: 'other', file: null }];
	}

	function onFilePick(e: Event, rowIndex: number) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			newAttachmentRows[rowIndex] = { ...newAttachmentRows[rowIndex], file };
			newAttachmentRows = [...newAttachmentRows];
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('¿Eliminar esta transacción?')) return;
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/deleteTransaction';
		const input = document.createElement('input');
		input.name = 'id';
		input.value = id;
		input.type = 'hidden';
		form.append(input);
		document.body.append(form);
		form.requestSubmit();
		setTimeout(() => form.remove(), 100);
	}

	async function handleDeleteAttachment(attachmentId: number) {
		if (!confirm('¿Eliminar este archivo adjunto?')) return;
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/deleteAttachment';
		const input = document.createElement('input');
		input.name = 'attachmentId';
		input.value = String(attachmentId);
		input.type = 'hidden';
		form.append(input);
		document.body.append(form);
		form.requestSubmit();
		setTimeout(() => form.remove(), 100);
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'paid':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
			case 'pending':
				return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
			case 'overdue':
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
			case 'reconciled':
				return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
			default:
				return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
		}
	}

	const ATTACHMENT_KINDS = [
		{ value: 'invoice', label: 'Factura' },
		{ value: 'receipt', label: 'Recibo' },
		{ value: 'transfer', label: 'Transferencia' },
		{ value: 'other', label: 'Otro' }
	] as const;
</script>

<svelte:head>
	<title>Transacciones · Admin Finance</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Transacciones</h1>
			<p class="text-muted-foreground text-sm">Registra y gestiona transacciones (ingresos y egresos).</p>
		</div>
		{#if canEdit}
			<button
				class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm font-medium"
				on:click={openCreateDrawer}
			>
				<Plus class="w-4 h-4" />
				Nueva transacción
			</button>
		{/if}
	</div>

	<div class="flex flex-col items-center justify-between bg-card p-4 rounded-lg border">
		<div class="relative w-full sm:w-72">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
			<input
				type="text"
				placeholder="Buscar por descripción, monto, banco..."
				bind:value={searchQuery}
				class="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
			/>
		</div>
	</div>

	<div class="rounded-lg border bg-card overflow-hidden shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full text-sm text-left">
				<thead class="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
					<tr>
						<th
							class="px-6 py-3 cursor-pointer hover:text-foreground"
							on:click={() => handleSort('date')}
						>
							<div class="flex items-center gap-1">Fecha <ArrowUpDown class="w-3 h-3" /></div>
						</th>
						<th class="px-6 py-3">Descripción</th>
						<th class="px-6 py-3">Empresa / Persona</th>
						<th class="px-6 py-3">Categoría</th>
						<th
							class="px-6 py-3 cursor-pointer hover:text-foreground"
							on:click={() => handleSort('amount')}
						>
							<div class="flex items-center gap-1">Monto <ArrowUpDown class="w-3 h-3" /></div>
						</th>
						<th class="px-6 py-3">Banco / Medio</th>
						<th class="px-6 py-3">Estado</th>
						<th class="px-6 py-3 text-right">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#if filteredTransactions.length === 0}
						<tr>
							<td colspan="8" class="px-6 py-12 text-center text-muted-foreground">
								<div class="flex flex-col items-center justify-center gap-2">
									<FileText class="w-8 h-8 opacity-20" />
									<p>No hay transacciones. Añade la primera desde el botón superior.</p>
								</div>
							</td>
						</tr>
					{:else}
						{#each paginatedTransactions as tx (tx.id)}
							<tr class="hover:bg-muted/50 transition-colors group">
								<td class="px-6 py-4 whitespace-nowrap text-muted-foreground">
									{new Date(tx.date).toLocaleDateString()}
								</td>
								<td class="px-6 py-4 font-medium">
									<div class="flex items-center gap-2">
										<span>{tx.description || '—'}</span>
										{#if tx.attachments?.length > 0}
											<button
												type="button"
												on:click|stopPropagation={() => openPreview(tx.attachments[0].fileName, (tx.attachments[0] as any).signedUrl || tx.attachments[0].fileUrl)}
												class="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
												title="{tx.attachments.length} archivo(s) — clic para ver"
											>
												<Paperclip class="w-3.5 h-3.5" />
											</button>
										{/if}
									</div>
									<div class="text-xs text-muted-foreground font-normal">
										{tx.type === 'income' ? 'Ingreso' : 'Egreso'}
										{#if tx.paymentMethod}
											• {tx.paymentMethod === 'bank' ? 'Transferencia' : tx.paymentMethod === 'card' ? 'Tarjeta' : tx.paymentMethod}
										{/if}
									</div>
								</td>
								<td class="px-6 py-4 text-muted-foreground text-sm">
									{tx.counterparty || '—'}
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium">
										{tx.categoryName || tx.categoryId || '—'}
									</span>
								</td>
								<td class="px-6 py-4 font-mono font-medium">
									{new Intl.NumberFormat('en-US', { style: 'currency', currency: tx.currency }).format(tx.amount)}
								</td>
								<td class="px-6 py-4 text-muted-foreground text-xs">
									{tx.bank || '—'}
									{#if tx.cardLabel}
										<br /><span class="text-muted-foreground/80">{tx.cardLabel}</span>
									{/if}
								</td>
								<td class="px-6 py-4">
									<span
										class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(tx.status)}"
									>
										{tx.status}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									{#if canEdit}
										<div
											class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<button
												class="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
												title="Editar"
												on:click={() => openEditDrawer(tx)}
											>
												<Edit2 class="w-4 h-4" />
											</button>
											<button
												class="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-md text-muted-foreground transition-colors"
												title="Eliminar"
												on:click={() => handleDelete(tx.id)}
											>
												<Trash2 class="w-4 h-4" />
											</button>
										</div>
									{/if}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
		{#if totalPages > 1}
			<div
				class="px-6 py-4 border-t bg-muted/20 flex items-center justify-between"
			>
				<span class="text-xs text-muted-foreground">
					{(currentPage - 1) * itemsPerPage + 1}–{Math.min(
						currentPage * itemsPerPage,
						filteredTransactions.length
					)} de {filteredTransactions.length}
				</span>
				<div class="flex items-center gap-2">
					<button
						class="px-3 py-1 text-xs border rounded-md hover:bg-muted disabled:opacity-50"
						disabled={currentPage === 1}
						on:click={() => currentPage--}
					>
						Anterior
					</button>
					<button
						class="px-3 py-1 text-xs border rounded-md hover:bg-muted disabled:opacity-50"
						disabled={currentPage === totalPages}
						on:click={() => currentPage++}
					>
						Siguiente
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Drawer Create/Edit -->
{#if isDrawerOpen}
	<div class="fixed inset-0 z-50 flex justify-end">
		<div
			class="absolute inset-0 bg-background/80 backdrop-blur-sm"
			on:click={closeDrawer}
			transition:fade={{ duration: 200 }}
		></div>

		<div
			class="relative w-full max-w-lg bg-card h-full border-l shadow-2xl flex flex-col overflow-hidden"
			transition:fly={{ x: 100, duration: 300 }}
		>
			<div class="px-6 py-4 border-b flex items-center justify-between shrink-0">
				<h2 class="text-lg font-bold">
					{editingTx ? 'Editar transacción' : 'Nueva transacción'}
				</h2>
				<button on:click={closeDrawer} class="p-2 hover:bg-muted rounded-full">
					<Plus class="w-5 h-5 rotate-45" />
				</button>
			</div>

			<form
				method="POST"
				action={editingTx ? '?/updateTransaction' : '?/createTransaction'}
				enctype="multipart/form-data"
				use:enhance={(e) => {
					formError = null;
					const form = e?.target as HTMLFormElement | undefined;
					if (form) {
						const withFiles = newAttachmentRows.filter((r) => r.file);
						const descEl = form.querySelector('input[name="attachment_descriptions"]') as HTMLInputElement | null;
						const kindEl = form.querySelector('input[name="attachment_kinds"]') as HTMLInputElement | null;
						if (descEl) descEl.value = JSON.stringify(withFiles.map((r) => r.description));
						if (kindEl) kindEl.value = JSON.stringify(withFiles.map((r) => r.kind));
					}
					isSaving = true;
					return async ({ result, update }) => {
						isSaving = false;
						try {
							if (result.type === 'failure') {
								const d = (result.data || {}) as { create?: { error?: string }; update?: { error?: string } };
								formError = d.create?.error ?? d.update?.error ?? 'Error al guardar. Revisa los campos obligatorios (arriba) y que el archivo no sea demasiado grande.';
							} else if (result.type === 'success' && (result.data?.create?.success || result.data?.update?.success)) {
								closeDrawer();
							}
						} catch (e) {
							formError = 'Error inesperado al guardar.';
						}
						await update();
					};
				}}
				class="flex flex-col flex-1 min-h-0"
			>
				{#if editingTx}
					<input type="hidden" name="id" value={editingTx.id} />
				{/if}

				<div class="flex-1 overflow-y-auto p-6 space-y-6">
					<!-- Campos obligatorios (siempre visibles arriba) -->
					<div class="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 mb-2">
						<p class="text-xs font-medium text-amber-700 dark:text-amber-400 mb-3">Campos obligatorios</p>
						<div class="space-y-3">
							<div class="space-y-2">
								<label class="text-sm font-medium" for="tx-desc">Descripción</label>
								<input
									id="tx-desc"
									type="text"
									name="description"
									bind:value={formData.description}
									class="w-full p-2 border rounded-md bg-background"
									placeholder="ej. Hosting web, Pago cliente X"
								/>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div class="space-y-2">
									<label class="text-sm font-medium" for="tx-amount">Monto</label>
									<input
										id="tx-amount"
										type="number"
										name="amount"
										bind:value={formData.amount}
										class="w-full p-2 border rounded-md bg-background"
										min="0"
										step="0.01"
									/>
								</div>
								<div class="space-y-2">
									<label class="text-sm font-medium" for="tx-date">Fecha</label>
									<input
										id="tx-date"
										type="date"
										name="date"
										bind:value={formData.date}
										class="w-full p-2 border rounded-md bg-background"
									/>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div class="space-y-2">
									<label class="text-sm font-medium" for="tx-currency">Moneda</label>
									<select
										id="tx-currency"
										name="currency"
										bind:value={formData.currency}
										class="w-full p-2 border rounded-md bg-background"
									>
										<option value="USD">USD</option>
										<option value="UYU">UYU</option>
										<option value="EUR">EUR</option>
									</select>
								</div>
								<div class="space-y-2">
									<label class="text-sm font-medium" for="tx-status">Estado</label>
									<select
										id="tx-status"
										name="status"
										bind:value={formData.status}
										class="w-full p-2 border rounded-md bg-background"
									>
										<option value="pending">Pendiente</option>
										<option value="paid">Pagado</option>
										<option value="overdue">Vencido</option>
										<option value="reconciled">Conciliado</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<div class="space-y-2">
						<label class="text-sm font-medium" for="tx-category">Categoría</label>
						<select
							id="tx-category"
							name="categoryId"
							bind:value={formData.categoryId}
							class="w-full p-2 border rounded-md bg-background"
						>
							<option value="">Seleccionar categoría...</option>
							{#each categories as cat}
								<option value={cat.id}>{cat.name}</option>
							{/each}
						</select>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<label class="text-sm font-medium">Tipo</label>
							<div class="flex bg-muted rounded-md p-1">
								<button
									type="button"
									class="flex-1 text-xs py-1.5 rounded-sm transition-colors {formData.type === 'income' ? 'bg-background shadow-sm font-medium' : 'hover:bg-background/50'}"
									on:click={() => (formData.type = 'income')}
								>Ingreso</button>
								<button
									type="button"
									class="flex-1 text-xs py-1.5 rounded-sm transition-colors {formData.type === 'expense' ? 'bg-background shadow-sm font-medium' : 'hover:bg-background/50'}"
									on:click={() => (formData.type = 'expense')}
								>Egreso</button>
							</div>
							<input type="hidden" name="type" value={formData.type} />
						</div>
						<div class="space-y-2">
							<label class="text-sm font-medium" for="tx-method">Medio de pago</label>
							<select
								id="tx-method"
								name="paymentMethod"
								bind:value={formData.paymentMethod}
								class="w-full p-2 border rounded-md bg-background"
							>
								<option value="bank">Transferencia bancaria</option>
								<option value="card">Tarjeta de crédito/débito</option>
								<option value="wire">Wire</option>
								<option value="cash">Efectivo</option>
								<option value="other">Otro</option>
							</select>
						</div>
					</div>

					<div class="space-y-2">
						<label class="text-sm font-medium" for="tx-bank">Banco / Institución</label>
						<input
							id="tx-bank"
							type="text"
							name="bank"
							bind:value={formData.bank}
							class="w-full p-2 border rounded-md bg-background"
							placeholder="ej. Banco Itaú, Mercado Pago"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium" for="tx-card">Tarjeta o cuenta (opcional)</label>
						<input
							id="tx-card"
							type="text"
							name="cardLabel"
							bind:value={formData.cardLabel}
							class="w-full p-2 border rounded-md bg-background"
							placeholder="ej. Visa ****1234, Cuenta corriente"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium" for="tx-counterparty">Empresa o persona (opcional)</label>
						<input
							id="tx-counterparty"
							type="text"
							name="counterparty"
							bind:value={formData.counterparty}
							class="w-full p-2 border rounded-md bg-background"
							placeholder="De quien se recibe o a quien se hace el pago"
						/>
					</div>

					<!-- Attachments: existing (when editing) -->
					{#if editingTx && editingTx.attachments?.length > 0}
						<div class="space-y-2">
							<label class="text-sm font-medium">Archivos adjuntos</label>
							<ul class="space-y-2">
								{#each editingTx.attachments as att}
									<li
										class="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50 text-sm"
									>
										<button
											type="button"
											on:click={() => openPreview(att.fileName, (att as any).signedUrl || att.fileUrl)}
											class="flex items-center gap-2 text-left min-w-0 flex-1 group"
										>
											<div class="p-1 rounded bg-muted group-hover:bg-muted/80 shrink-0">
												<Paperclip class="w-3 h-3 text-muted-foreground" />
											</div>
											<div class="min-w-0">
												<span class="font-medium text-primary hover:underline truncate block">{att.fileName}</span>
												{#if att.description}
													<span class="text-muted-foreground text-xs block truncate">{att.description}</span>
												{/if}
												<span class="text-muted-foreground/70 text-xs">{att.kind}</span>
											</div>
										</button>
										{#if canEdit}
											<button
												type="button"
												class="p-1 hover:bg-red-100 rounded text-red-600 shrink-0"
												title="Eliminar adjunto"
												on:click={() => handleDeleteAttachment(att.id)}
											>
												<X class="w-4 h-4" />
											</button>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- New attachments -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<label class="text-sm font-medium">Añadir archivos (factura, recibo, transferencia…)</label>
							<button
								type="button"
								class="text-xs text-primary hover:underline"
								on:click={addAttachmentRow}
							>
								+ Añadir otro
							</button>
						</div>
						{#each newAttachmentRows as row, i}
							<div class="flex flex-wrap items-end gap-2 p-2 rounded-md border bg-muted/20">
								<input
									type="file"
									name="attachment_files"
									class="text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-foreground"
									accept="image/*,.pdf,.doc,.docx"
									on:change={(e) => onFilePick(e, i)}
								/>
								<input
									type="text"
									class="flex-1 min-w-[120px] p-1.5 text-sm border rounded bg-background"
									placeholder="Descripción del archivo"
									bind:value={row.description}
								/>
								<select
									class="p-1.5 text-sm border rounded bg-background"
									bind:value={row.kind}
								>
									{#each ATTACHMENT_KINDS as opt}
										<option value={opt.value}>{opt.label}</option>
									{/each}
								</select>
								<button
									type="button"
									class="p-1.5 hover:bg-muted rounded"
									on:click={() => removeAttachmentRow(i)}
									title="Quitar fila"
								>
									<Trash2 class="w-4 h-4" />
								</button>
							</div>
						{/each}
						<input type="hidden" name="attachment_descriptions" value={JSON.stringify(newAttachmentRows.map((r) => r.description))} />
						<input type="hidden" name="attachment_kinds" value={JSON.stringify(newAttachmentRows.map((r) => r.kind))} />
					</div>
				</div>

				<div class="p-6 border-t bg-muted/10 shrink-0 space-y-3">
					{#if formError}
						<p class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
							{formError}
						</p>
					{/if}
					<div class="flex justify-end gap-3">
						<button
							type="button"
							on:click={closeDrawer}
							class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
							disabled={isSaving}
						>
							Cancelar
						</button>
						<button
							type="submit"
							class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
							disabled={isSaving}
						>
						{#if isSaving}
							<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
							Guardando...
						{:else}
							{editingTx ? 'Guardar cambios' : 'Guardar transacción'}
						{/if}
					</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<DocumentPreviewModal
	isOpen={isPreviewModalOpen}
	title={previewFile.title}
	fileUrl={previewFile.url}
	onClose={closePreview}
/>
