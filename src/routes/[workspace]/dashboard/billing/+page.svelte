<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { CreditCard, Calendar, Eye, History, Repeat, AlertCircle, Settings2, Loader2, ExternalLink } from 'lucide-svelte';
	import { currentLang, translations } from '$lib/i18n';
	import type { PageData } from './$types';
	import type { BillingInvoice } from '$lib/stores/billing';
	import { formatBillingAmount, setOverlaysFromApi } from '$lib/stores/billing';
	import InvoiceDrawer from '$lib/components/billing/InvoiceDrawer.svelte';

	export let data: PageData;

	type BillingTab = 'historial' | 'suscripciones';
	let activeTab: BillingTab = 'historial';

	$: workspace = $page.params.workspace ?? 'allianzy';

	// Permissions from server
	$: canViewBilling = data.canViewBilling ?? false;
	$: canManageBilling = data.canManageBilling ?? false;

	// API state
	let loading = true;
	let linked = false;
	type PaymentAccountItem = { customerId: string; isDefault: boolean; provider?: string; label?: string; paymentAccountId?: string };
	let paymentAccounts: PaymentAccountItem[] = [];
	let allInvoices: BillingInvoice[] = [];
	let allSubscriptions: Array<{
		id: string;
		status: string;
		planName: string;
		amount: number;
		currency: string;
		currentPeriodEnd: string;
		projectName?: string;
		serviceName?: string;
	}> = [];
	let portalLoading = false;

	function accountQuery() {
		return selectedStripeCustomerId ? `?stripeCustomerId=${encodeURIComponent(selectedStripeCustomerId)}` : '';
	}

	// Para abrir el portal de Stripe desde el drawer (primera cuenta Stripe)
	$: firstStripeCustomerId = paymentAccounts.find((a) => a.provider === 'stripe')?.customerId ?? null;
	$: selectedStripeCustomerId = firstStripeCustomerId;

	async function loadBilling() {
		loading = true;
		try {
			const [accountsRes, invRes, subRes, overlaysRes] = await Promise.all([
				fetch(`/${workspace}/api/billing/accounts`, { credentials: 'include' }),
				fetch(`/${workspace}/api/billing/invoices`, { credentials: 'include' }),
				fetch(`/${workspace}/api/billing/subscriptions`, { credentials: 'include' }),
				fetch(`/${workspace}/api/billing/overlays`, { credentials: 'include' })
			]);
			const accData = await accountsRes.json().catch(() => ({ accounts: [] }));
			paymentAccounts = accData.accounts ?? [];
			const invData = await invRes.json().catch(() => ({ linked: false, invoices: [] }));
			const subData = await subRes.json().catch(() => ({ linked: false, subscriptions: [] }));
			const overlaysData = await overlaysRes.json().catch(() => ({ overlays: {} }));
			if (overlaysData.overlays && typeof overlaysData.overlays === 'object') {
				setOverlaysFromApi(overlaysData.overlays);
			}
			linked = invData.linked ?? subData.linked ?? false;
			const rawInvoices = invData.invoices ?? [];
			const rawSubs = subData.subscriptions ?? [];
			allInvoices = rawInvoices.map((inv: any) => {
				const due = inv.amount_due ?? 0;
				const paid = inv.amount_paid ?? 0;
				return {
					id: inv.id,
					documentId: inv.documentId ?? null,
					provider: inv.provider,
					accountCode: inv.account_code ?? null,
					providerDetails: inv.provider_details ?? undefined,
					status: inv.status ?? 'open',
					amount: due + paid,
					currency: inv.currency ?? 'usd',
					createdAt: inv.created ?? new Date().toISOString(),
					dueAt: inv.due_date,
					paidAt: inv.paid_at ?? null,
					description: inv.description ?? inv.number,
					projectName: inv.projectName,
					linked_project_names: Array.isArray(inv.linked_project_names) ? inv.linked_project_names : undefined,
					serviceName: inv.serviceName,
					hostedInvoiceUrl: inv.hosted_invoice_url,
					invoicePdfUrl: inv.invoice_pdf,
					receiptUrl: inv.receipt_url,
					proofUrl: inv.proof_url ?? null,
					proofUploadedAt: inv.proof_uploaded_at ?? null,
					proofFiles: inv.proof_files ?? (inv.proof_url ? [{ id: 'legacy', url: inv.proof_url, name: 'Comprobante', uploadedAt: inv.proof_uploaded_at ?? '' }] : [])
				};
			});
			allSubscriptions = rawSubs.map((sub: any) => ({
				id: sub.id,
				status: sub.status ?? 'active',
				planName: sub.price_nickname ?? 'Suscripción',
				amount: sub.price_unit_amount ?? 0,
				currency: sub.currency ?? 'usd',
				currentPeriodEnd: sub.current_period_end
					? new Date(sub.current_period_end).toLocaleDateString('es-ES')
					: '—'
			}));
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (canViewBilling && workspace) loadBilling();
	});

	// Filters (client-side)
	let filterStatus: string = '';
	/** Valor: "" = todos, "provider|accountCode" = filtrar por esa cuenta (ej. Stripe — cus_xxx). */
	let filterByAccount: string = '';
	let searchQuery = '';

	/** Nombre normalizado del método (Stripe, MercadoPago, PayPal…), sin "Stripe 1" / "Stripe 2". */
	function methodDisplayName(providerCode: string | undefined): string {
		if (!providerCode) return '—';
		if (providerCode === 'stripe') return 'Stripe';
		if (providerCode.startsWith('mercadopago')) return 'MercadoPago';
		if (providerCode.startsWith('paypal')) return 'PayPal';
		return providerCode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	/** Iniciales del proyecto: primera letra de cada palabra en mayúscula (ej. "Modelo de Proyecto" → "MDP"). */
	function projectInitials(projectName: string | null | undefined): string {
		if (!projectName || !projectName.trim()) return '';
		return projectName
			.trim()
			.split(/\s+/)
			.map((w) => w[0]?.toUpperCase() ?? '')
			.filter(Boolean)
			.join('');
	}

	/** Texto para columna Proyecto: "Proyecto MDP" o "—" si no hay nombre. */
	function projectDisplay(inv: { linked_project_names?: string[]; projectName?: string | null }): string {
		const name =
			inv.linked_project_names && inv.linked_project_names.length > 0
				? inv.linked_project_names[0]
				: inv.projectName ?? null;
		const initials = projectInitials(name);
		return initials ? `Proyecto ${initials}` : '—';
	}

	/** Opciones del filtro: una por cada cuenta (mismo método puede aparecer varias veces con distinto cus_/código). */
	$: uniqueAccounts = (() => {
		const set = new Set<string>();
		for (const inv of allInvoices) {
			if (inv.provider) set.add(`${inv.provider}|${inv.accountCode ?? ''}`);
		}
		return [...set].sort((a, b) => {
			const [pA, cA] = a.split('|');
			const [pB, cB] = b.split('|');
			const nameCmp = methodDisplayName(pA).localeCompare(methodDisplayName(pB));
			if (nameCmp !== 0) return nameCmp;
			return (cA ?? '').localeCompare(cB ?? '');
		});
	})();

	$: filteredInvoices = (() => {
		let list = [...allInvoices]
			.filter((i) => i.amount > 0)
			.sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
		if (filterStatus) list = list.filter((i) => i.status === filterStatus);
		if (filterByAccount) {
			const [provider, accountCode] = filterByAccount.split('|');
			const code = accountCode ?? '';
			list = list.filter(
				(i) => i.provider === provider && (i.accountCode ?? '') === code
			);
		}
		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			list = list.filter(
				(i) =>
					(i.description?.toLowerCase().includes(q) ?? false) ||
					(i.projectName?.toLowerCase().includes(q) ?? false) ||
					(i.serviceName?.toLowerCase().includes(q) ?? false)
			);
		}
		return list;
	})();

	/** Paginación del historial (igual que en admin). */
	const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
	let pageSize = 25;
	let currentPage = 1;
	$: totalFiltered = filteredInvoices.length;
	$: totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
	$: currentPage = totalFiltered === 0 ? 1 : Math.min(currentPage, totalPages);
	$: paginatedInvoices = filteredInvoices.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	$: rangeStart = totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	$: rangeEnd = Math.min(currentPage * pageSize, totalFiltered);

	function goToPage(page: number) {
		currentPage = Math.max(1, Math.min(page, totalPages));
	}

	let drawerOpen = false;
	let selectedInvoice: BillingInvoice | null = null;

	function openInvoiceDrawer(invoice: BillingInvoice) {
		selectedInvoice = invoice;
		drawerOpen = true;
	}

	function closeInvoiceDrawer() {
		drawerOpen = false;
		selectedInvoice = null;
	}

	async function handleUploadProof(documentId: string, file: File) {
		const formData = new FormData();
		formData.set('file', file);
		const res = await fetch(`/${workspace}/api/billing/documents/${documentId}/proof`, {
			method: 'POST',
			credentials: 'include',
			body: formData
		});
		const data = await res.json().catch(() => ({}));
		if (!res.ok) throw new Error(data.error ?? 'Error al subir');
		await loadBilling();
		if (selectedInvoice?.documentId === documentId) {
			selectedInvoice = allInvoices.find((inv) => inv.documentId === documentId) ?? selectedInvoice;
		}
	}

	async function handleManageSubscription() {
		portalLoading = true;
		try {
			const q = selectedStripeCustomerId ? `?stripeCustomerId=${encodeURIComponent(selectedStripeCustomerId)}` : '';
			const res = await fetch(`/${workspace}/api/billing/portal${q}`, { method: 'POST', credentials: 'include' });
			const data = await res.json().catch(() => ({}));
			if (data.url) window.location.href = data.url;
		} finally {
			portalLoading = false;
		}
	}

	function invoiceStatusBadgeClass(status: string): string {
		switch (status) {
			case 'paid':
				return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
			case 'open':
			case 'draft':
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
			draft: 'Borrador',
			void: 'Anulada',
			uncollectible: 'Incobrable'
		};
		return map[status] ?? status;
	}

	function subscriptionStatusBadgeClass(status: string): string {
		switch (status) {
			case 'active':
				return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
			case 'past_due':
				return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30';
			case 'canceled':
				return 'bg-muted text-muted-foreground border-border';
			case 'trialing':
				return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
			default:
				return 'bg-muted text-muted-foreground border-border';
		}
	}

	function subscriptionStatusLabel(status: string): string {
		const map: Record<string, string> = {
			active: 'Activo',
			past_due: 'Vencido',
			canceled: 'Cancelada',
			trialing: 'Prueba'
		};
		return map[status] ?? status;
	}

	$: t = translations[$currentLang];
</script>

<svelte:head>
	<title>{t.dashboard?.page?.billing?.title ?? 'Facturación'}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">{t.dashboard?.page?.billing?.title ?? 'Facturación'}</h2>
			<p class="text-muted-foreground">{t.dashboard?.page?.billing?.subtitle ?? 'Historial de facturas y suscripciones.'}</p>
		</div>
	</div>

	{#if !canViewBilling}
		<div class="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 text-center">
			<AlertCircle class="h-12 w-12 mx-auto text-amber-600 dark:text-amber-400 mb-4 opacity-80" />
			<h3 class="text-lg font-semibold">Acceso denegado</h3>
			<p class="text-muted-foreground mt-1">
				No tienes permiso para ver la facturación. Contacta al administrador de la organización.
			</p>
		</div>
	{:else}
		{#if loading}
			<div class="flex items-center justify-center py-16">
				<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		{:else}
		<div class="border-b border-border">
			<nav class="flex gap-6" aria-label="Facturación">
				<button
					type="button"
					class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-2 {activeTab === 'historial'
						? 'border-primary text-primary'
						: 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}"
					on:click={() => (activeTab = 'historial')}
				>
					<History class="w-4 h-4" />
					Historial
				</button>
				<button
					type="button"
					class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-2 {activeTab === 'suscripciones'
						? 'border-primary text-primary'
						: 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}"
					on:click={() => (activeTab = 'suscripciones')}
				>
					<Repeat class="w-4 h-4" />
					Suscripciones vigentes
				</button>
			</nav>
		</div>

		{#if activeTab === 'historial'}
			<div class="rounded-md border bg-card">
				<div class="p-4 border-b border-border flex flex-col sm:flex-row gap-4 flex-wrap">
					<div class="flex-1 min-w-[200px]">
						<label for="billing-search" class="sr-only">Buscar por concepto, proyecto o servicio</label>
						<input
							id="billing-search"
							type="search"
							bind:value={searchQuery}
							placeholder="Buscar por concepto, proyecto o servicio..."
							class="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						/>
					</div>
					<div class="flex flex-wrap gap-2 items-center">
						<label for="billing-provider" class="sr-only">Método / cuenta de pago</label>
						<select
							id="billing-provider"
							bind:value={filterByAccount}
							class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<option value="">Todos los métodos</option>
							{#each uniqueAccounts as key}
								{@const [provider, accountCode] = key.split('|')}
								<option value={key}>
									{methodDisplayName(provider)}{accountCode ? ` — ${accountCode}` : ''}
								</option>
							{/each}
						</select>
						<label for="billing-status" class="sr-only">Estado</label>
						<select
							id="billing-status"
							bind:value={filterStatus}
							class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<option value="">Todos los estados</option>
							<option value="paid">Pagado</option>
							<option value="open">Pendiente</option>
							<option value="void">Anulada</option>
							<option value="uncollectible">Incobrable</option>
						</select>
					</div>
				</div>
				<div class="p-6">
					{#if filteredInvoices.length === 0}
						<div class="text-center py-12">
							<CreditCard class="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
							<h3 class="text-lg font-medium">No hay facturas</h3>
							<p class="text-muted-foreground mt-1">
								No hay facturas que coincidan con los filtros o aún no tienes historial.
							</p>
						</div>
					{:else}
						<div class="hidden md:block relative w-full overflow-auto">
							<table class="w-full caption-bottom text-sm text-left">
								<thead class="[&_tr]:border-b">
									<tr class="border-b transition-colors hover:bg-muted/50">
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Concepto</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Método de pago</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Cuenta de pago</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Proyecto</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Monto</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Fecha factura</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Vencimiento</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Fecha pago</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th>
										<th class="h-12 px-4 align-middle font-medium text-right">Acciones</th>
									</tr>
								</thead>
								<tbody class="[&_tr:last-child]:border-0">
									{#each paginatedInvoices as invoice}
										<tr class="border-b transition-colors hover:bg-muted/50">
											<td class="p-4 align-middle font-medium">{invoice.description ?? invoice.id}</td>
											<td class="p-4 align-middle text-sm">{methodDisplayName(invoice.provider)}</td>
											<td class="p-4 align-middle font-mono text-xs text-muted-foreground" title={invoice.accountCode ?? ''}>{invoice.accountCode ?? '—'}</td>
											<td class="p-4 align-middle" title={invoice.projectName ?? undefined}>
												{projectDisplay(invoice)}
											</td>
											<td class="p-4 align-middle font-mono">{formatBillingAmount(invoice.amount, invoice.currency)}</td>
											<td class="p-4 align-middle">
												{#if invoice.createdAt}
													<div class="flex items-center gap-2">
														<Calendar class="h-3 w-3 text-muted-foreground" />
														{new Date(invoice.createdAt).toLocaleDateString('es-ES')}
													</div>
												{:else}
													—
												{/if}
											</td>
											<td class="p-4 align-middle">
												{#if invoice.dueAt}
													<div class="flex items-center gap-2">
														<Calendar class="h-3 w-3 text-muted-foreground" />
														{new Date(invoice.dueAt).toLocaleDateString('es-ES')}
													</div>
												{:else}
													—
												{/if}
											</td>
											<td class="p-4 align-middle">
												{#if invoice.paidAt}
													<div class="flex items-center gap-2">
														<Calendar class="h-3 w-3 text-muted-foreground" />
														{new Date(invoice.paidAt).toLocaleDateString('es-ES')}
													</div>
												{:else}
													—
												{/if}
											</td>
											<td class="p-4 align-middle">
												<span
													class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold {invoiceStatusBadgeClass(invoice.status)}"
												>
													{invoiceStatusLabel(invoice.status)}
												</span>
											</td>
											<td class="p-4 align-middle text-right">
												<button
													type="button"
													on:click={() => openInvoiceDrawer(invoice)}
													class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
													title="Ver detalle"
												>
													<Eye class="h-4 w-4" />
													<span class="sr-only">Ver detalle</span>
												</button>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border">
							<p class="text-sm text-muted-foreground">
								{totalFiltered === 0
									? 'Sin resultados'
									: `Mostrando ${rangeStart}–${rangeEnd} de ${totalFiltered}`}
							</p>
							<div class="flex items-center gap-4">
								<label for="billing-pagesize" class="text-sm text-muted-foreground">Mostrar</label>
								<select
									id="billing-pagesize"
									bind:value={pageSize}
									on:change={() => (currentPage = 1)}
									class="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
								>
									{#each PAGE_SIZE_OPTIONS as size}
										<option value={size}>{size}</option>
									{/each}
								</select>
								<div class="flex items-center gap-1">
									<button
										type="button"
										disabled={currentPage <= 1}
										on:click={() => goToPage(currentPage - 1)}
										class="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
									>
										Anterior
									</button>
									<span class="px-2 text-sm text-muted-foreground">
										Página {currentPage} de {totalPages}
									</span>
									<button
										type="button"
										disabled={currentPage >= totalPages}
										on:click={() => goToPage(currentPage + 1)}
										class="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
									>
										Siguiente
									</button>
								</div>
							</div>
						</div>
						<div class="md:hidden space-y-4">
							{#each paginatedInvoices as invoice}
								<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
									<div class="flex justify-between items-start gap-4">
										<div class="space-y-1">
											<h4 class="font-semibold leading-none tracking-tight">{invoice.description ?? invoice.id}</h4>
											<p class="text-sm text-muted-foreground">{methodDisplayName(invoice.provider)} · {invoice.accountCode ?? '—'}</p>
											<p class="text-sm text-muted-foreground">{projectDisplay(invoice)}</p>
											{#if invoice.serviceName}
												<p class="text-xs text-muted-foreground">{invoice.serviceName}</p>
											{/if}
										</div>
										<div class="font-mono font-medium whitespace-nowrap">{formatBillingAmount(invoice.amount, invoice.currency)}</div>
									</div>
									<div class="flex items-center justify-between pt-2 border-t border-border">
										<div class="space-y-2">
											{#if invoice.createdAt}
												<div class="flex items-center gap-2 text-sm text-muted-foreground">
													<Calendar class="h-3 w-3" />
													Factura: {new Date(invoice.createdAt).toLocaleDateString('es-ES')}
												</div>
											{/if}
											{#if invoice.dueAt}
												<div class="flex items-center gap-2 text-sm text-muted-foreground">
													<Calendar class="h-3 w-3" />
													Venc.: {new Date(invoice.dueAt).toLocaleDateString('es-ES')}
												</div>
											{/if}
											{#if invoice.paidAt}
												<div class="flex items-center gap-2 text-sm text-muted-foreground">
													<Calendar class="h-3 w-3" />
													Pago: {new Date(invoice.paidAt).toLocaleDateString('es-ES')}
												</div>
											{/if}
											<span
												class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold {invoiceStatusBadgeClass(invoice.status)}"
											>
												{invoiceStatusLabel(invoice.status)}
											</span>
										</div>
										<button
											type="button"
											on:click={() => openInvoiceDrawer(invoice)}
											class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9"
											title="Ver detalle"
										>
											<Eye class="h-4 w-4" />
											<span class="sr-only">Ver detalle</span>
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<!-- Subscriptions tab -->
			{#if allSubscriptions.length > 0}
				<!-- Summary panel (first subscription or primary) -->
				{@const primary = allSubscriptions[0]}
				<div class="rounded-lg border bg-card p-6 space-y-4">
					<div class="flex flex-wrap items-center justify-between gap-4">
						<div>
							<h3 class="text-lg font-semibold">{primary.planName}</h3>
							<p class="text-sm text-muted-foreground mt-0.5">
								{#if primary.projectName || primary.serviceName}
									{primary.projectName ?? ''}{primary.projectName && primary.serviceName ? ' · ' : ''}{primary.serviceName ?? ''}
								{:else}
									Suscripción activa
								{/if}
							</p>
						</div>
						<span
							class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {subscriptionStatusBadgeClass(primary.status)}"
						>
							{subscriptionStatusLabel(primary.status)}
						</span>
					</div>
					<div class="flex flex-wrap items-center gap-6 text-sm">
						<div class="flex items-center gap-2">
							<Calendar class="h-4 w-4 text-muted-foreground" />
							<span class="text-muted-foreground">Renovación:</span>
							<span>{primary.currentPeriodEnd}</span>
						</div>
						<div>
							<span class="text-muted-foreground">Monto: </span>
							<span class="font-mono font-medium">{formatBillingAmount(primary.amount, primary.currency)}</span>
						</div>
					</div>
					{#if canManageBilling}
						<button
							type="button"
							on:click={handleManageSubscription}
							disabled={portalLoading}
							class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
						>
							{#if portalLoading}
								<Loader2 class="w-4 h-4 animate-spin" />
							{:else}
								<Settings2 class="w-4 h-4" />
							{/if}
							Gestionar suscripción
						</button>
					{/if}
				</div>
			{/if}

			<div class="rounded-md border bg-card">
				<div class="p-6">
					{#if allSubscriptions.length === 0}
						<div class="text-center py-12">
							<Repeat class="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
							<h3 class="text-lg font-medium">No hay suscripciones vigentes</h3>
							<p class="text-muted-foreground mt-1">No tienes servicios activos asociados a tus proyectos.</p>
						</div>
					{:else}
						<div class="hidden md:block relative w-full overflow-auto">
							<table class="w-full caption-bottom text-sm text-left">
								<thead class="[&_tr]:border-b">
									<tr class="border-b transition-colors hover:bg-muted/50">
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Plan</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Servicio / Proyecto</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Precio</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Renovación</th>
										<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th>
									</tr>
								</thead>
								<tbody class="[&_tr:last-child]:border-0">
									{#each allSubscriptions as sub}
										<tr class="border-b transition-colors hover:bg-muted/50">
											<td class="p-4 align-middle font-medium">{sub.planName}</td>
											<td class="p-4 align-middle">
												<div class="flex flex-col">
													<span>{sub.serviceName ?? '—'}</span>
													{#if sub.projectName}
														<span class="text-xs text-muted-foreground">{sub.projectName}</span>
													{/if}
												</div>
											</td>
											<td class="p-4 align-middle font-mono">{formatBillingAmount(sub.amount, sub.currency)}</td>
											<td class="p-4 align-middle">
												<div class="flex items-center gap-2">
													<Calendar class="h-3 w-3 text-muted-foreground" />
													{sub.currentPeriodEnd}
												</div>
											</td>
											<td class="p-4 align-middle">
												<span
													class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold {subscriptionStatusBadgeClass(sub.status)}"
												>
													{subscriptionStatusLabel(sub.status)}
												</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<div class="md:hidden space-y-4">
							{#each allSubscriptions as sub}
								<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2">
									<div class="font-semibold">{sub.planName}</div>
									<p class="text-sm text-muted-foreground">{sub.serviceName ?? sub.projectName ?? '—'}</p>
									<div class="flex justify-between items-center pt-2 border-t border-border">
										<span class="font-mono text-sm">{formatBillingAmount(sub.amount, sub.currency)}</span>
										<span
											class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold {subscriptionStatusBadgeClass(sub.status)}"
										>
											{subscriptionStatusLabel(sub.status)}
										</span>
									</div>
									<div class="flex items-center gap-2 text-xs text-muted-foreground">
										<Calendar class="h-3 w-3" />
										Renovación: {sub.currentPeriodEnd}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
		{/if}
	{/if}
</div>

<InvoiceDrawer
	open={drawerOpen}
	invoice={selectedInvoice}
	workspace={workspace}
	canManageBilling={canManageBilling}
	canEditInternalDetail={false}
	canUploadProof={true}
	onUploadProof={handleUploadProof}
	onProofDeleted={async () => {
		await loadBilling();
		selectedInvoice = allInvoices.find((inv) => inv.documentId === selectedInvoice?.documentId) ?? selectedInvoice;
	}}
	onClose={closeInvoiceDrawer}
/>
