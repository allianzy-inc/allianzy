<script lang="ts">
	import { X, Trash2, Star } from 'lucide-svelte';
	import { setStripeCustomerId } from '$lib/stores/billing';

	export let open = false;
	export let onClose: () => void;
	/** When set (e.g. admin), called with the Stripe customer ID and optionally set as default. */
	export let onSubmit: ((stripeCustomerId: string, setAsDefault?: boolean) => Promise<void>) | null = null;
	/** Pre-fill when editing an existing connection (e.g. cus_xxx). */
	export let initialValue = '';
	/** When set (e.g. admin), called to remove the Stripe connection (single-account mode). */
	export let onDelete: (() => Promise<void>) | null = null;
	/** List of linked accounts (multi-account mode). */
	export let accounts: { customerId: string; isDefault: boolean }[] = [];
	/** Remove one account by customerId. */
	export let onRemove: ((customerId: string) => Promise<void>) | null = null;
	/** Set an account as default. */
	export let onSetDefault: ((customerId: string) => Promise<void>) | null = null;

	let inputValue = '';
	let setAsDefaultNew = false;
	let saving = false;
	let deleting = false;
	let error: string | null = null;
	$: if (open) inputValue = initialValue ?? '';

	function isStripeCustomerId(id: string): boolean {
		const s = id.trim();
		return s.startsWith('cus_') || s.startsWith('gcus_');
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		const trimmed = inputValue.trim();
		if (!trimmed || !isStripeCustomerId(trimmed) || trimmed.length <= 5) {
			error = 'Ingresa un ID de cliente de Stripe (cus_... o gcus_... para guest)';
			return;
		}
		error = null;
		saving = true;
		try {
			if (onSubmit) {
				await onSubmit(trimmed, setAsDefaultNew);
			} else {
				setStripeCustomerId(trimmed);
			}
			inputValue = '';
			setAsDefaultNew = false;
			if (accounts.length === 0) onClose();
		} catch (err: any) {
			error = err?.message ?? 'Error al vincular';
		} finally {
			saving = false;
		}
	}

	function handleClose() {
		inputValue = '';
		error = null;
		onClose();
	}

	async function handleDelete() {
		if (!onDelete) return;
		if (!confirm('¿Eliminar la conexión con Stripe? La empresa dejará de tener facturación vinculada.')) return;
		deleting = true;
		error = null;
		try {
			await onDelete();
			onClose();
		} catch (err: any) {
			error = err?.message ?? 'Error al eliminar';
		} finally {
			deleting = false;
		}
	}

	async function removeOne(customerId: string) {
		if (!onRemove) return;
		if (!confirm('¿Eliminar esta cuenta de pago de la empresa?')) return;
		deleting = true;
		error = null;
		try {
			await onRemove(customerId);
		} catch (err: any) {
			error = err?.message ?? 'Error al eliminar';
		} finally {
			deleting = false;
		}
	}
</script>

{#if open}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
		<button
			type="button"
			class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
			aria-label="Cerrar modal"
			on:click={handleClose}
			on:keydown={(e) => e.key === 'Escape' && handleClose()}
		></button>
		<div
			class="relative rounded-lg border bg-card shadow-xl max-w-md w-full p-6"
			role="dialog"
			aria-labelledby="link-stripe-title"
			aria-modal="true"
		>
			<div class="flex items-center justify-between mb-4">
				<h2 id="link-stripe-title" class="text-lg font-semibold">{initialValue ? 'Editar conexión Stripe' : 'Vincular cliente con Stripe'}</h2>
				<button
					type="button"
					on:click={handleClose}
					class="p-2 hover:bg-muted rounded-full"
					aria-label="Cerrar"
				>
					<X class="w-5 h-5" />
				</button>
			</div>
			<p class="text-sm text-muted-foreground mb-4">
				Ingresa el ID de cliente de Stripe (<code class="bg-muted px-1 rounded">cus_xxxxx</code> o <code class="bg-muted px-1 rounded">gcus_xxxxx</code> para guest).
				Podés vincular varias cuentas y elegir una como predeterminada.
			</p>
			{#if error}
				<p class="text-sm text-destructive mb-4">{error}</p>
			{/if}
			{#if accounts.length > 0}
				<div class="mb-4 space-y-2">
					<p class="text-sm font-medium">Cuentas vinculadas</p>
					<ul class="space-y-2">
						{#each accounts as acc}
							<li class="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
								<code class="font-mono text-xs truncate flex-1">{acc.customerId}</code>
								{#if acc.isDefault}
									<span class="text-xs text-muted-foreground shrink-0">Predeterminada</span>
								{:else if onSetDefault}
									<button
										type="button"
										on:click={() => onSetDefault(acc.customerId)}
										disabled={deleting}
										class="shrink-0 inline-flex items-center gap-1 text-xs text-primary hover:underline"
										title="Establecer como predeterminada"
									>
										<Star class="w-3.5 h-3.5" />
										Predeterminada
									</button>
								{/if}
								{#if onRemove}
									<button
										type="button"
										on:click={() => removeOne(acc.customerId)}
										disabled={deleting}
										class="shrink-0 p-1.5 text-destructive hover:bg-destructive/10 rounded"
										aria-label="Eliminar cuenta"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			<form on:submit={handleSubmit} class="space-y-4">
				<div>
					<label for="stripe-customer-id" class="block text-sm font-medium mb-1">
						{accounts.length > 0 ? 'Añadir otra cuenta' : 'Stripe Customer ID'}
					</label>
					<input
						id="stripe-customer-id"
						type="text"
						bind:value={inputValue}
						placeholder="cus_... o gcus_..."
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				</div>
				{#if accounts.length > 0}
					<label class="flex items-center gap-2 text-sm">
						<input type="checkbox" bind:checked={setAsDefaultNew} class="rounded border-input" />
						Usar como predeterminada
					</label>
				{/if}
				<div class="flex flex-col gap-3">
					<div class="flex justify-end gap-2">
						{#if accounts.length === 0 && initialValue && onDelete}
							<button
								type="button"
								on:click={handleDelete}
								disabled={saving || deleting}
								class="mr-auto text-sm font-medium text-destructive hover:underline disabled:opacity-50 inline-flex items-center gap-1.5"
							>
								{#if deleting}
									<span class="inline-block w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin"></span>
								{/if}
								<Trash2 class="w-4 h-4" />
								Eliminar conexión
							</button>
						{/if}
						<button type="button" on:click={handleClose} class="px-4 py-2 text-sm font-medium rounded-md border hover:bg-muted" disabled={saving || deleting}>
							Cancelar
						</button>
						<button
							type="submit"
							class="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
							disabled={saving || deleting}
						>
							{saving ? 'Guardando...' : accounts.length > 0 ? 'Añadir cuenta' : (initialValue ? 'Guardar' : 'Vincular')}
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}
