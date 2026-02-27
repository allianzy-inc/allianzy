<script lang="ts">
	import { X, Trash2, Star, Pencil } from 'lucide-svelte';

	export type AccountItem = {
		customerId: string;
		isDefault: boolean;
		provider?: string;
		label?: string;
		paymentAccountId?: string;
	};

	export let open = false;
	export let onClose: () => void;
	/** Todas las cuentas (Stripe, MercadoPago, PayPal, etc.) */
	export let accounts: AccountItem[] = [];
	/** Añadir cuenta Stripe (cus_xxx o gcus_xxx para guest). Se llama desde el formulario Stripe. */
	export let onAddStripe: ((stripeCustomerId: string, setAsDefault?: boolean) => Promise<void>) | null = null;
	/** Eliminar cuenta: recibe paymentAccountId (uuid) o customerId (cus_xxx) para Stripe legacy */
	export let onRemove: ((accountId: string) => Promise<void>) | null = null;
	/** Establecer predeterminada: recibe paymentAccountId o customerId para Stripe legacy */
	export let onSetDefault: ((accountId: string) => Promise<void>) | null = null;
	/** Editar cuenta: recibe paymentAccountId (uuid), payload con label y opcional customerId (Stripe). Solo si tiene paymentAccountId. */
	export let onUpdate: ((paymentAccountId: string, payload: { label: string; customerId?: string }) => Promise<void>) | null = null;
	/** Tras cambiar algo (añadir, quitar, predeterminada, editar) para que el padre refresque la lista */
	export let onAfterChange: (() => void | Promise<void>) | undefined = undefined;

	let stripeInput = '';
	let setAsDefaultNew = false;
	let saving = false;
	let error: string | null = null;
	/** ID de la cuenta en edición (paymentAccountId uuid). */
	let editingId: string | null = null;
	let editLabel = '';
	let editCustomerId = '';

	function providerLabel(provider: string | undefined): string {
		if (!provider) return '—';
		if (provider === 'stripe') return 'Stripe';
		if (provider.startsWith('mercadopago')) return 'MercadoPago';
		if (provider.startsWith('paypal')) return 'PayPal';
		return provider.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function isStripeCustomerId(id: string): boolean {
		const s = id.trim();
		return s.startsWith('cus_') || s.startsWith('gcus_');
	}

	async function handleAddStripe(e: Event) {
		e.preventDefault();
		const trimmed = stripeInput.trim();
		if (!trimmed || !isStripeCustomerId(trimmed) || trimmed.length <= 5) {
			error = 'Ingresa un ID de cliente de Stripe (cus_... o gcus_... para guest)';
			return;
		}
		error = null;
		saving = true;
		try {
			if (onAddStripe) await onAddStripe(trimmed, setAsDefaultNew);
			stripeInput = '';
			setAsDefaultNew = false;
			if (onAfterChange) await onAfterChange();
		} catch (err: any) {
			error = err?.message ?? 'Error al vincular';
		} finally {
			saving = false;
		}
	}

	function handleClose() {
		stripeInput = '';
		error = null;
		onClose();
	}

	function accountId(acc: AccountItem): string {
		return acc.paymentAccountId ?? (acc.provider === 'stripe' ? acc.customerId : '') ?? '';
	}

	async function removeOne(acc: AccountItem) {
		const id = accountId(acc);
		if (!id || !onRemove) return;
		const label = acc.label || acc.customerId || providerLabel(acc.provider);
		if (!confirm(`¿Eliminar la cuenta "${label}" de la empresa?`)) return;
		saving = true;
		error = null;
		try {
			await onRemove(id);
			if (onAfterChange) await onAfterChange();
		} catch (err: any) {
			error = err?.message ?? 'Error al eliminar';
		} finally {
			saving = false;
		}
	}

	async function setDefaultOne(acc: AccountItem) {
		const id = accountId(acc);
		if (!id || !onSetDefault) return;
		saving = true;
		error = null;
		try {
			await onSetDefault(id);
			if (onAfterChange) await onAfterChange();
		} catch (err: any) {
			error = err?.message ?? 'Error al cambiar predeterminada';
		} finally {
			saving = false;
		}
	}

	function startEdit(acc: AccountItem) {
		const id = acc.paymentAccountId ?? null;
		if (!id || !onUpdate) return;
		editingId = id;
		editLabel = acc.label ?? acc.customerId ?? '';
		editCustomerId = (acc.provider ?? 'stripe') === 'stripe' ? (acc.customerId ?? '') : '';
		error = null;
	}

	function cancelEdit() {
		editingId = null;
		editLabel = '';
		editCustomerId = '';
		error = null;
	}

	async function saveEdit() {
		if (!editingId || !onUpdate) return;
		const label = editLabel.trim();
		if (!label) {
			error = 'El nombre es obligatorio';
			return;
		}
		const isStripe = isStripeCustomerId(editCustomerId);
		if (editCustomerId.trim() && !isStripe) {
			error = 'El ID de Stripe debe ser cus_... o gcus_...';
			return;
		}
		error = null;
		saving = true;
		try {
			await onUpdate(editingId, {
				label,
				...(isStripe ? { customerId: editCustomerId.trim() } : {})
			});
			cancelEdit();
			if (onAfterChange) await onAfterChange();
		} catch (err: any) {
			error = err?.message ?? 'Error al guardar';
		} finally {
			saving = false;
		}
	}
</script>

{#if open}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
		<button
			type="button"
			class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
			aria-label="Cerrar"
			on:click={handleClose}
			on:keydown={(e) => e.key === 'Escape' && handleClose()}
		></button>
		<div
			class="relative rounded-lg border bg-card shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
			role="dialog"
			aria-labelledby="manage-accounts-title"
			aria-modal="true"
		>
			<div class="flex items-center justify-between p-6 border-b border-border shrink-0">
				<h2 id="manage-accounts-title" class="text-lg font-semibold">Gestionar cuentas de pago</h2>
				<button type="button" on:click={handleClose} class="p-2 hover:bg-muted rounded-full" aria-label="Cerrar">
					<X class="w-5 h-5" />
				</button>
			</div>
			<p class="text-sm text-muted-foreground px-6 pt-2 shrink-0">
				Cuentas vinculadas a esta empresa (Stripe, MercadoPago, PayPal, etc.). Podés editar, establecer una como predeterminada o eliminar.
			</p>
			{#if error}
				<p class="text-sm text-destructive px-6 py-2 shrink-0">{error}</p>
			{/if}
			<div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
				{#if accounts.length > 0}
					<ul class="space-y-2">
						{#each accounts as acc}
							<li class="rounded-md border bg-muted/30 px-3 py-2 text-sm">
								{#if acc.paymentAccountId && editingId === acc.paymentAccountId}
									<form on:submit|preventDefault={saveEdit} class="space-y-2">
										<div>
											<label class="text-xs text-muted-foreground">Nombre</label>
											<input
												type="text"
												bind:value={editLabel}
												class="mt-0.5 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
												placeholder="Ej. Stripe principal"
											/>
										</div>
										{#if (acc.provider ?? 'stripe') === 'stripe'}
											<div>
												<label class="text-xs text-muted-foreground">ID de cliente (cus_... o gcus_...)</label>
												<input
													type="text"
													bind:value={editCustomerId}
													class="mt-0.5 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm font-mono"
													placeholder="cus_... o gcus_..."
												/>
											</div>
										{/if}
										<div class="flex gap-2">
											<button
												type="submit"
												disabled={saving}
												class="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
											>
												{saving ? 'Guardando...' : 'Guardar'}
											</button>
											<button type="button" on:click={cancelEdit} disabled={saving} class="px-3 py-1.5 text-sm rounded-md border hover:bg-muted">
												Cancelar
											</button>
										</div>
									</form>
								{:else}
									<div class="flex items-center justify-between gap-2">
										<div class="min-w-0 flex-1 flex flex-col gap-0.5">
											<div class="flex items-center gap-2">
												<span class="shrink-0 text-xs font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
													{providerLabel(acc.provider)}
												</span>
												<span class="truncate text-sm">{acc.label || acc.customerId}</span>
											</div>
											{#if (acc.provider ?? 'stripe') === 'stripe' && acc.customerId}
												<span class="font-mono text-xs text-muted-foreground" title={acc.customerId}>{acc.customerId}</span>
											{/if}
										</div>
										<div class="flex items-center gap-1 shrink-0">
											{#if onUpdate && acc.paymentAccountId}
												<button
													type="button"
													on:click={() => startEdit(acc)}
													disabled={saving || editingId != null}
													class="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded"
													aria-label="Editar cuenta"
												>
													<Pencil class="w-4 h-4" />
												</button>
											{/if}
											{#if acc.isDefault}
												<span class="text-xs text-muted-foreground">Predeterminada</span>
											{:else if onSetDefault && accountId(acc)}
												<button
													type="button"
													on:click={() => setDefaultOne(acc)}
													disabled={saving}
													class="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
													title="Establecer como predeterminada"
												>
													<Star class="w-3.5 h-3.5" />
													Predeterminada
												</button>
											{/if}
											{#if onRemove && accountId(acc)}
												<button
													type="button"
													on:click={() => removeOne(acc)}
													disabled={saving}
													class="p-1.5 text-destructive hover:bg-destructive/10 rounded"
													aria-label="Eliminar cuenta"
												>
													<Trash2 class="w-4 h-4" />
												</button>
											{/if}
										</div>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-sm text-muted-foreground">Aún no hay cuentas vinculadas. Añadí una cuenta Stripe abajo.</p>
				{/if}

				{#if onAddStripe}
					<div class="border-t border-border pt-4">
						<p class="text-sm font-medium mb-2">Añadir cuenta Stripe</p>
						<form on:submit={handleAddStripe} class="space-y-2">
							<input
								type="text"
								bind:value={stripeInput}
								placeholder="ID de cliente (cus_... o gcus_...)"
								class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							/>
							<label class="flex items-center gap-2 text-sm">
								<input type="checkbox" bind:checked={setAsDefaultNew} class="rounded border-input" />
								Usar como predeterminada
							</label>
							<button
								type="submit"
								class="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
								disabled={saving}
							>
								{saving ? 'Guardando...' : 'Añadir cuenta Stripe'}
							</button>
						</form>
					</div>
				{/if}
			</div>
			<div class="p-6 border-t border-border shrink-0">
				<button
					type="button"
					on:click={handleClose}
					class="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md border hover:bg-muted"
				>
					Cerrar
				</button>
			</div>
		</div>
	</div>
{/if}
