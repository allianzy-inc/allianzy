<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { CreditCard, Loader2, Save, ToggleLeft, Plus, Trash2, ListChecks } from 'lucide-svelte';

	$: workspace = $page.params.workspace;

	type DetailItem = { label: string; value: string };
	type ProviderConfig = {
		code: string;
		label: string;
		isAutomatic: boolean;
		displayOrder: number;
		enabled: boolean;
		details?: DetailItem[] | null;
	};

	let configs: ProviderConfig[] = [];
	let loading = true;
	let saving: string | null = null;
	let error: string | null = null;
	let addModalOpen = false;
	let newLabel = '';
	let newCode = '';
	let addSaving = false;
	let deleteConfirmCode: string | null = null;
	let deleteLoading = false;

	// Modal "Datos de pago" para métodos manuales
	let detailsModalCode: string | null = null;
	let detailsModalLabel = '';
	let detailsModalItems: DetailItem[] = [];
	let detailsSaving = false;

	async function load() {
		loading = true;
		error = null;
		try {
			const res = await fetch(`/${workspace}/api/billing/provider-config`, { credentials: 'include' });
			if (!res.ok) throw new Error('No se pudo cargar la configuración');
			const data = await res.json();
			configs = data.configs ?? [];
		} catch (e: any) {
			error = e?.message ?? 'Error';
		} finally {
			loading = false;
		}
	}

	async function updateProvider(code: string, updates: Partial<ProviderConfig>) {
		saving = code;
		try {
			const res = await fetch(`/${workspace}/api/billing/provider-config`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ code, ...updates })
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				throw new Error(d.error ?? res.statusText);
			}
			await load();
		} catch (e: any) {
			error = e?.message ?? 'Error al guardar';
		} finally {
			saving = null;
		}
	}

	function openAddModal() {
		newLabel = '';
		newCode = '';
		addModalOpen = true;
		error = null;
	}

	async function addProvider() {
		if (!newLabel.trim()) {
			error = 'El nombre es obligatorio';
			return;
		}
		addSaving = true;
		error = null;
		try {
			const res = await fetch(`/${workspace}/api/billing/provider-config`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					label: newLabel.trim(),
					...(newCode.trim() && { code: newCode.trim() })
				})
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? res.statusText);
			addModalOpen = false;
			await load();
		} catch (e: any) {
			error = e?.message ?? 'Error al agregar';
		} finally {
			addSaving = false;
		}
	}

	async function deleteProvider(code: string) {
		if (code === 'stripe' || deleteLoading) return;
		deleteLoading = true;
		error = null;
		try {
			const res = await fetch(`/${workspace}/api/billing/provider-config?code=${encodeURIComponent(code)}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? res.statusText);
			deleteConfirmCode = null;
			await load();
		} catch (e: any) {
			error = e?.message ?? 'Error al eliminar';
		} finally {
			deleteLoading = false;
		}
	}

	function openDetailsModal(c: ProviderConfig) {
		if (c.isAutomatic) return;
		detailsModalCode = c.code;
		detailsModalLabel = c.label;
		detailsModalItems = Array.isArray(c.details) && c.details.length
			? c.details.map((d) => ({ label: d.label || '', value: d.value || '' }))
			: [];
		error = null;
	}

	function addDetailRow() {
		detailsModalItems = [...detailsModalItems, { label: '', value: '' }];
	}

	function removeDetailRow(i: number) {
		detailsModalItems = detailsModalItems.filter((_, idx) => idx !== i);
	}

	async function saveDetails() {
		if (!detailsModalCode) return;
		detailsSaving = true;
		error = null;
		try {
			const details = detailsModalItems
				.map((d) => ({ label: d.label.trim(), value: d.value.trim() }))
				.filter((d) => d.label || d.value);
			const res = await fetch(`/${workspace}/api/billing/provider-config`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ code: detailsModalCode, details })
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				throw new Error(d.error ?? res.statusText);
			}
			detailsModalCode = null;
			await load();
		} catch (e: any) {
			error = e?.message ?? 'Error al guardar datos';
		} finally {
			detailsSaving = false;
		}
	}

	onMount(() => load());
</script>

<div class="space-y-6">
	<h2 class="text-3xl font-bold tracking-tight">Configuraciones</h2>

	<div class="grid gap-6">
		<div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
			<h3 class="text-lg font-semibold mb-4">Preferencias Generales</h3>
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Notificaciones por Email</label>
						<p class="text-sm text-muted-foreground">Recibir actualizaciones sobre tus proyectos.</p>
					</div>
					<input type="checkbox" checked class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
				</div>
			</div>
		</div>

		<div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
			<div class="flex items-center gap-2 mb-4">
				<CreditCard class="h-5 w-5 text-muted-foreground" />
				<h3 class="text-lg font-semibold">Proveedores de pago</h3>
			</div>
			<p class="text-sm text-muted-foreground mb-4">
				Solo <strong>Stripe</strong> viene precargado y se sincroniza automáticamente. Agregá los métodos que necesites (ej. MercadoPago Argentina, MercadoPago Uruguay, PayPal USA, PayPal UK, transferencia bancaria). El resto son de carga manual en la facturación por empresa.
			</p>
			<div class="flex justify-end mb-4">
				<button
					type="button"
					on:click={openAddModal}
					class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
				>
					<Plus class="h-4 w-4" />
					Agregar método de pago
				</button>
			</div>
			{#if loading}
				<div class="flex items-center justify-center py-8">
					<Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			{:else if error}
				<p class="text-sm text-destructive">{error}</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b">
								<th class="text-left py-2 font-medium">Código</th>
								<th class="text-left py-2 font-medium">Nombre</th>
								<th class="text-left py-2 font-medium">Tipo</th>
								<th class="text-left py-2 font-medium">Orden</th>
								<th class="text-left py-2 font-medium">Habilitado</th>
								<th class="text-left py-2 font-medium w-24">Datos</th>
								<th class="w-24"></th>
								<th class="w-20"></th>
							</tr>
						</thead>
						<tbody>
							{#each configs as c (c.code)}
								<tr class="border-b border-border/50">
									<td class="py-2 font-mono text-muted-foreground text-xs">{c.code}</td>
									<td class="py-2">
										<input
											type="text"
											value={c.label}
											class="bg-background border rounded px-2 py-1 w-full max-w-[180px]"
											on:blur={(e) => {
												const v = e.currentTarget.value.trim();
												if (v !== c.label) updateProvider(c.code, { label: v });
											}}
										/>
									</td>
									<td class="py-2">
										{#if c.isAutomatic}
											<span class="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Automático</span>
										{:else}
											<span class="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Manual</span>
										{/if}
									</td>
									<td class="py-2">
										<input
											type="number"
											value={c.displayOrder}
											min="0"
											class="bg-background border rounded px-2 py-1 w-16"
											on:blur={(e) => {
												const v = parseInt(e.currentTarget.value, 10);
												if (!Number.isNaN(v) && v !== c.displayOrder) updateProvider(c.code, { displayOrder: v });
											}}
										/>
									</td>
									<td class="py-2">
										<button
											type="button"
											class="flex items-center gap-1 text-muted-foreground hover:text-foreground"
											title={c.enabled ? 'Deshabilitar' : 'Habilitar'}
											on:click={() => updateProvider(c.code, { enabled: !c.enabled })}
											disabled={saving === c.code}
										>
											{#if saving === c.code}
												<Loader2 class="h-4 w-4 animate-spin" />
											{:else}
												<ToggleLeft class="h-5 w-5" />
											{/if}
											<span class="text-xs">{c.enabled ? 'Sí' : 'No'}</span>
										</button>
									</td>
									<td class="py-2">
										{#if c.isAutomatic}
											<span class="text-xs text-muted-foreground">—</span>
										{:else}
											<button
												type="button"
												class="flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs"
												title="Editar datos de pago (CVU, Alias, email, etc.)"
												on:click={() => openDetailsModal(c)}
											>
												<ListChecks class="h-4 w-4" />
												{#if Array.isArray(c.details) && c.details.length > 0}
													<span>({c.details.length})</span>
												{/if}
											</button>
										{/if}
									</td>
									<td class="py-2">
										{#if saving === c.code}
											<Loader2 class="h-4 w-4 animate-spin text-muted-foreground" />
										{:else}
											<Save class="h-4 w-4 text-muted-foreground opacity-50" />
										{/if}
									</td>
									<td class="py-2">
										{#if deleteConfirmCode === c.code}
											<span class="text-xs text-muted-foreground">¿Eliminar?</span>
											<button
												type="button"
												on:click={() => deleteProvider(c.code)}
												disabled={deleteLoading}
												class="ml-1 text-destructive hover:underline text-xs font-medium disabled:opacity-50"
											>
												Sí
											</button>
											<button
												type="button"
												on:click={() => (deleteConfirmCode = null)}
												class="ml-1 text-muted-foreground hover:underline text-xs"
											>
												No
											</button>
										{:else if c.code === 'stripe'}
											<span class="text-xs text-muted-foreground">—</span>
										{:else}
											<button
												type="button"
												on:click={() => (deleteConfirmCode = c.code)}
												class="text-muted-foreground hover:text-destructive p-1 rounded"
												title="Eliminar método"
											>
												<Trash2 class="h-4 w-4" />
												<span class="sr-only">Eliminar</span>
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div>

{#if addModalOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
		role="dialog"
		aria-modal="true"
		aria-labelledby="add-provider-title"
	>
		<div class="bg-card border rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
			<h2 id="add-provider-title" class="text-lg font-semibold">Agregar método de pago</h2>
			<p class="text-sm text-muted-foreground">
				Nombre libre (ej. MercadoPago Argentina, PayPal UK). El código se genera solo; podés editarlo si querés uno corto.
			</p>
			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}
			<div>
				<label for="new-label" class="block text-sm font-medium mb-1">Nombre</label>
				<input
					id="new-label"
					type="text"
					bind:value={newLabel}
					placeholder="Ej. MercadoPago Argentina"
					class="w-full rounded-md border bg-background px-3 py-2 text-sm"
				/>
			</div>
			<div>
				<label for="new-code" class="block text-sm font-medium mb-1">Código (opcional)</label>
				<input
					id="new-code"
					type="text"
					bind:value={newCode}
					placeholder="Ej. mercadopago_ar (se genera del nombre si se deja vacío)"
					class="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono text-xs"
				/>
			</div>
			<div class="flex justify-end gap-2 pt-2">
				<button type="button" on:click={() => (addModalOpen = false)} class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
					Cancelar
				</button>
				<button type="button" on:click={addProvider} disabled={addSaving || !newLabel.trim()} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2">
					{#if addSaving}
						<Loader2 class="h-4 w-4 animate-spin" />
					{/if}
					Agregar
				</button>
			</div>
		</div>
	</div>
{/if}

{#if detailsModalCode}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
		role="dialog"
		aria-modal="true"
		aria-labelledby="details-modal-title"
	>
		<div class="bg-card border rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] flex flex-col">
			<div class="shrink-0 p-4 border-b">
				<h2 id="details-modal-title" class="text-lg font-semibold">Datos de pago — {detailsModalLabel}</h2>
				<p class="text-sm text-muted-foreground mt-1">
					Agregá ítems como CVU, Alias, Banco, PayPal Email, etc. para que el cliente sepa dónde transferir o a qué email enviar.
				</p>
			</div>
			<div class="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
				{#if error}
					<p class="text-sm text-destructive">{error}</p>
				{/if}
				{#each detailsModalItems as item, i}
					<div class="flex gap-2 items-center">
						<input
							type="text"
							placeholder="Ej. CVU, Alias, Banco, PayPal Email"
							bind:value={item.label}
							class="flex-1 rounded-md border bg-background px-3 py-2 text-sm min-w-0"
						/>
						<input
							type="text"
							placeholder="Valor"
							bind:value={item.value}
							class="flex-1 rounded-md border bg-background px-3 py-2 text-sm min-w-0"
						/>
						<button
							type="button"
							on:click={() => removeDetailRow(i)}
							class="p-2 text-muted-foreground hover:text-destructive rounded"
							title="Quitar"
						>
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				{/each}
				<button
					type="button"
					on:click={addDetailRow}
					class="inline-flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 w-full justify-center"
				>
					<Plus class="h-4 w-4" />
					Agregar ítem
				</button>
			</div>
			<div class="shrink-0 flex justify-end gap-2 p-4 border-t">
				<button type="button" on:click={() => (detailsModalCode = null)} class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
					Cancelar
				</button>
				<button type="button" on:click={saveDetails} disabled={detailsSaving} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2">
					{#if detailsSaving}
						<Loader2 class="h-4 w-4 animate-spin" />
					{/if}
					Guardar datos
				</button>
			</div>
		</div>
	</div>
{/if}