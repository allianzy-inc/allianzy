<script lang="ts">
	import { X, Trash2, Star } from 'lucide-svelte';

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
	/** Añadir cuenta Stripe (cus_xxx). Se llama desde el formulario Stripe. */
	export let onAddStripe: ((stripeCustomerId: string, setAsDefault?: boolean) => Promise<void>) | null = null;
	/** Eliminar cuenta: recibe paymentAccountId (uuid) o customerId (cus_xxx) para Stripe legacy */
	export let onRemove: ((accountId: string) => Promise<void>) | null = null;
	/** Establecer predeterminada: recibe paymentAccountId o customerId para Stripe legacy */
	export let onSetDefault: ((accountId: string) => Promise<void>) | null = null;
	/** Tras cambiar algo (añadir, quitar, predeterminada) para que el padre refresque la lista */
	export let onAfterChange: (() => void | Promise<void>) | undefined = undefined;

	let stripeInput = '';
	let setAsDefaultNew = false;
	let saving = false;
	let error: string | null = null;

	function providerLabel(provider: string | undefined): string {
		if (!provider) return '—';
		if (provider === 'stripe') return 'Stripe';
		if (provider.startsWith('mercadopago')) return 'MercadoPago';
		if (provider.startsWith('paypal')) return 'PayPal';
		return provider.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	async function handleAddStripe(e: Event) {
		e.preventDefault();
		const trimmed = stripeInput.trim();
		if (!trimmed || (!trimmed.startsWith('cus_') && trimmed.length <= 5)) {
			error = 'Ingresa un ID de cliente de Stripe (cus_...)';
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
				Cuentas vinculadas a esta empresa (Stripe, MercadoPago, PayPal, etc.). Podés establecer una como predeterminada o eliminar.
			</p>
			{#if error}
				<p class="text-sm text-destructive px-6 py-2 shrink-0">{error}</p>
			{/if}
			<div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
				{#if accounts.length > 0}
					<ul class="space-y-2">
						{#each accounts as acc}
							<li class="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
								<div class="min-w-0 flex-1 flex items-center gap-2">
									<span class="shrink-0 text-xs font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
										{providerLabel(acc.provider)}
									</span>
									<span class="truncate font-mono text-xs" title={acc.customerId}>{acc.label || acc.customerId}</span>
								</div>
								<div class="flex items-center gap-1 shrink-0">
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
								placeholder="ID de cliente (cus_...)"
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
