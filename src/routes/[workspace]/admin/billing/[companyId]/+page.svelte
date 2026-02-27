<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { CreditCard, Calendar, Eye, History, Repeat, Link2, Settings2, ArrowLeft, Loader2, Plus, Pencil, Trash2, RefreshCw, MoreVertical } from 'lucide-svelte';
	import type { PageData } from './$types';
	import type { BillingInvoice, BillingInvoiceOverlay } from '$lib/stores/billing';
	import { formatBillingAmount, setOverlaysFromApi } from '$lib/stores/billing';
	import InvoiceDrawer from '$lib/components/billing/InvoiceDrawer.svelte';
	import ManageAccountsModal from '$lib/components/billing/ManageAccountsModal.svelte';

	export let data: PageData;

	$: workspace = $page.params.workspace;
	$: companyName = data.companyName ?? 'Empresa';
	$: companyId = data.companyId;
	$: companiesUrl = `/${workspace}/admin/companies`;
	/** Todas las cuentas de pago (Stripe, MercadoPago, PayPal, etc.) */
	let allAccounts: { customerId: string; isDefault: boolean; provider?: string; label?: string; paymentAccountId?: string }[] = [];
	/** Cuenta Stripe seleccionada para ver suscripciones / portal (solo afecta suscripciones). */
	let selectedStripeCustomerId: string | null = null;

	/** Solo cuentas Stripe (para combobox Ver cuenta y portal). */
	$: stripeAccounts = allAccounts.filter((a) => (a.provider ?? 'stripe') === 'stripe');

	/** Proveedores (para crear facturación manual en el modal). */
	let billingProviders: { code: string; label: string; isAutomatic: boolean }[] = [];

	type BillingTab = 'historial' | 'suscripciones';
	let activeTab: BillingTab = 'historial';

	$: canViewBilling = data.canViewBilling ?? true;
	$: canManageBilling = data.canManageBilling ?? true;

	let loading = true;
	let linked = false;
	let allInvoices: BillingInvoice[] = [];
	/** Proyectos de la empresa (para vincular facturas Stripe). */
	let companyProjects: { id: number; name: string | null }[] = [];
	let allSubscriptions: Array<{
		id: string;
		status: string;
		planName: string;
		amount: number;
		currency: string;
		currentPeriodEnd: string;
		projectName?: string;
		serviceName?: string;
		/** Cuenta Stripe (cus_xxx) a la que pertenece la suscripción */
		accountCode?: string | null;
	}> = [];
	/** ID de la cuenta Stripe cuya sesión de portal se está creando (solo ese botón muestra loading). */
	let portalLoadingId: string | null = null;
	let billingError: string | null = null;

	/** Query para suscripciones/portal: una cuenta Stripe (opcional). */
	function subscriptionQuery() {
		const c = selectedStripeCustomerId;
		return c ? `&stripeCustomerId=${encodeURIComponent(c)}` : '';
	}

	async function loadBilling() {
		loading = true;
		billingError = null;
		try {
			if (billingProviders.length === 0) {
				const provRes = await fetch(`/${workspace}/api/billing/providers`, { credentials: 'include' });
				const provData = await provRes.json().catch(() => ({ providers: [] }));
				billingProviders = provData.providers ?? [];
			}
			// Cargar todas las cuentas y todas las facturas (un solo historial)
			const [accountsRes, invRes, subRes, overlaysRes, projectsRes] = await Promise.all([
				fetch(`/${workspace}/api/billing/accounts?companyId=${companyId}`, { credentials: 'include' }),
				fetch(`/${workspace}/api/billing/invoices?companyId=${companyId}`, { credentials: 'include' }),
				fetch(`/${workspace}/api/billing/subscriptions?companyId=${companyId}`, { credentials: 'include' }),
				fetch(`/${workspace}/api/billing/overlays?companyId=${companyId}`, { credentials: 'include' }),
				fetch(`/${workspace}/api/billing/projects?companyId=${companyId}`, { credentials: 'include' })
			]);
			const accData = await accountsRes.json().catch(() => ({ accounts: [] }));
			allAccounts = accData.accounts ?? [];
			const stripeOnly = allAccounts.filter((a) => (a.provider ?? 'stripe') === 'stripe');
			if (stripeOnly.length > 0 && !selectedStripeCustomerId) {
				selectedStripeCustomerId = accData.selectedCustomerId ?? accData.defaultCustomerId ?? stripeOnly[0].customerId ?? null;
			}
			const invData = await invRes.json().catch(() => ({ linked: false, invoices: [] }));
			const subData = await subRes.json().catch(() => ({ linked: false, subscriptions: [] }));
			const overlaysData = await overlaysRes.json().catch(() => ({ overlays: {} }));
			if (overlaysData.overlays && typeof overlaysData.overlays === 'object') {
				setOverlaysFromApi(overlaysData.overlays);
			}
			const projectsData = await projectsRes.json().catch(() => ({ projects: [] }));
			companyProjects = projectsData.projects ?? [];
			linked = invData.linked ?? subData.linked ?? allAccounts.length > 0;
			billingError = invData.error ?? subData.error ?? null;
			const rawInvoices = invData.invoices ?? [];
			const rawSubs = subData.subscriptions ?? [];
			allInvoices = rawInvoices.map((inv: any) => {
				const due = inv.amount_due ?? 0;
				const paid = inv.amount_paid ?? 0;
				return {
				id: inv.id,
				documentId: inv.documentId ?? null,
				provider: inv.provider ?? 'stripe',
				accountCode: inv.account_code ?? null,
				providerDetails: inv.provider_details ?? undefined,
				status: inv.status ?? 'open',
				amount: due + paid,
				amountDueCents: due,
				amountPaidCents: paid,
				currency: inv.currency ?? 'usd',
				createdAt: inv.created ?? new Date().toISOString(),
				dueAt: inv.due_date,
				paidAt: inv.paid_at ?? null,
				description: inv.description ?? inv.number,
				projectName: inv.projectName,
				serviceName: inv.serviceName,
				hostedInvoiceUrl: inv.hosted_invoice_url,
				invoicePdfUrl: inv.invoice_pdf,
				receiptUrl: inv.receipt_url,
				proofUrl: inv.proof_url ?? null,
				proofUploadedAt: inv.proof_uploaded_at ?? null,
				proofFiles: inv.proof_files ?? (inv.proof_url ? [{ id: 'legacy', url: inv.proof_url, name: 'Comprobante', uploadedAt: inv.proof_uploaded_at ?? '' }] : []),
				linked_project_ids: Array.isArray(inv.linked_project_ids) ? inv.linked_project_ids : [],
				linked_project_names: Array.isArray(inv.linked_project_names) ? inv.linked_project_names : []
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
					: '—',
				accountCode: sub.account_code ?? null
			}));
		} finally {
			loading = false;
		}
	}

	onMount(() => loadBilling());

	function clickOutside(node: HTMLElement) {
		const handleClick = (e: MouseEvent) => {
			if (node && !node.contains(e.target as Node)) {
				billingMenuOpen = false;
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	let syncLoading = false;
	async function handleSync() {
		if (!companyId || syncLoading) return;
		syncLoading = true;
		try {
			const res = await fetch(`/${workspace}/api/billing/sync?companyId=${companyId}`, {
				method: 'POST',
				credentials: 'include'
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? 'Error al sincronizar');
			await loadBilling();
		} catch (e) {
			billingError = (e as Error)?.message ?? 'Error al sincronizar';
		} finally {
			syncLoading = false;
		}
	}

	let filterStatus = '';
	/** Valor: "" = todos, "provider|accountCode" = filtrar por esa cuenta de pago. */
	let filterByAccount = '';
	let searchQuery = '';

	/** Nombre normalizado del método (Stripe, MercadoPago, etc.). */
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

	/** Texto para columna Proyecto: solo iniciales (ej. "MDP") o "—". El título de la columna es "Proyecto". */
	function projectDisplay(inv: { linked_project_names?: string[]; projectName?: string | null }): string {
		const name =
			inv.linked_project_names && inv.linked_project_names.length > 0
				? inv.linked_project_names[0]
				: inv.projectName ?? null;
		const initials = projectInitials(name);
		return initials || '—';
	}

	/** Opciones del filtro: todas las cuentas (allAccounts) + las que aparecen en facturas, para que se vean todos los clientes Stripe aunque no tengan facturas. */
	$: uniqueAccounts = (() => {
		const set = new Set<string>();
		for (const acc of allAccounts) {
			const provider = acc.provider ?? 'stripe';
			const code = provider === 'stripe' ? (acc.customerId ?? '') : (acc.paymentAccountId ?? '');
			if (provider) set.add(`${provider}|${code}`);
		}
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

	/** Paginación del historial */
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
	let manageAccountsModalOpen = false;

	// Modal crear/editar facturación manual
	let manualDocModalOpen = false;
	let billingMenuOpen = false;
	let manualDocEditId: string | null = null;
	let manualDocForm = { number: '', amountTotal: '', amountDue: '', currency: 'usd', dueDate: '', description: '', status: 'open', provider: 'mercadopago_ar' };
	let manualDocSaving = false;
	let manualDocError: string | null = null;
	let deleteConfirmId: string | null = null;
	let deleteLoading = false;

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
		const res = await fetch(
			`/${workspace}/api/billing/documents/${documentId}/proof?companyId=${companyId}`,
			{ method: 'POST', credentials: 'include', body: formData }
		);
		const data = await res.json().catch(() => ({}));
		if (!res.ok) throw new Error(data.error ?? 'Error al subir');
		await loadBilling();
		if (selectedInvoice?.documentId === documentId) {
			selectedInvoice = allInvoices.find((inv) => inv.documentId === documentId) ?? selectedInvoice;
		}
	}

	async function handleSaveOverlay(stripeInvoiceId: string, overlay: BillingInvoiceOverlay) {
		const res = await fetch(`/${workspace}/api/billing/overlays`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({
				companyId,
				stripeInvoiceId,
				overlay: { title: overlay.title, items: overlay.items }
			})
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err.error ?? res.statusText ?? 'Error al guardar');
		}
	}

	function openManageAccountsModal() {
		manageAccountsModalOpen = true;
	}

	function closeManageAccountsModal() {
		manageAccountsModalOpen = false;
	}

	async function handleAddStripe(stripeCustomerId: string, setAsDefault = false) {
		const res = await fetch(`/${workspace}/api/billing/link`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ companyId, stripeCustomerId, setAsDefault, action: 'add' })
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err.error ?? 'Error al vincular');
		}
		await loadBilling();
	}

	/** Eliminar cuenta: id es customerId (cus_xxx) para Stripe o paymentAccountId (uuid) para el resto. */
	async function handleRemoveAccount(id: string) {
		if (id.startsWith('cus_')) {
			const res = await fetch(`/${workspace}/api/billing/link`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ companyId, stripeCustomerId: id, action: 'remove' })
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error ?? 'Error al eliminar');
			}
		} else {
			const res = await fetch(`/${workspace}/api/billing/accounts`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ companyId, paymentAccountId: id, action: 'remove' })
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error ?? 'Error al eliminar');
			}
		}
		await loadBilling();
	}

	/** Establecer predeterminada: id es customerId (Stripe) o paymentAccountId (uuid). */
	async function handleSetDefaultAccount(id: string) {
		if (id.startsWith('cus_')) {
			const res = await fetch(`/${workspace}/api/billing/link`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ companyId, stripeCustomerId: id, action: 'setDefault' })
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error ?? 'Error al cambiar predeterminada');
			}
		} else {
			const res = await fetch(`/${workspace}/api/billing/accounts`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ companyId, paymentAccountId: id, action: 'setDefault' })
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error ?? 'Error al cambiar predeterminada');
			}
		}
		await loadBilling();
	}

	/** Editar cuenta (label y opcional customerId Stripe). paymentAccountId es el uuid de la cuenta. */
	async function handleUpdateAccount(paymentAccountId: string, payload: { label: string; customerId?: string }) {
		const res = await fetch(`/${workspace}/api/billing/accounts`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({
				companyId,
				paymentAccountId,
				label: payload.label,
				...(payload.customerId != null ? { stripeCustomerId: payload.customerId } : {})
			})
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err.error ?? 'Error al actualizar');
		}
		await loadBilling();
	}

	/** Abre el portal de Stripe para la empresa. Si se pasa stripeCustomerId (p. ej. de una suscripción), se usa esa cuenta. */
	async function handleManageSubscription(stripeCustomerId?: string | null) {
		const cusId = stripeCustomerId ?? selectedStripeCustomerId;
		portalLoadingId = cusId ?? '';
		try {
			const q = cusId ? `&stripeCustomerId=${encodeURIComponent(cusId)}` : '';
			const res = await fetch(`/${workspace}/api/billing/portal?companyId=${companyId}${q}`, { method: 'POST', credentials: 'include' });
			const data = await res.json().catch(() => ({}));
			if (data.url) window.location.href = data.url;
		} finally {
			portalLoadingId = null;
		}
	}

	function invoiceStatusBadgeClass(status: string): string {
		switch (status) {
			case 'paid':
				return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
			case 'upcoming':
				return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
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
			upcoming: 'Próxima factura',
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

	function openCreateManualDoc() {
		manualDocEditId = null;
		const firstManual = billingProviders.find((p) => !p.isAutomatic)?.code ?? 'mercadopago_ar';
		manualDocForm = { number: '', amountTotal: '', amountDue: '', currency: 'usd', dueDate: '', description: '', status: 'open', provider: firstManual };
		manualDocError = null;
		manualDocModalOpen = true;
	}

	function openEditManualDoc(inv: BillingInvoice & { documentId?: string | null; provider?: string; amountDueCents?: number; amountPaidCents?: number }) {
		if (!inv.documentId) return;
		manualDocEditId = inv.documentId;
		const due = inv.amountDueCents ?? inv.amount ?? 0;
		const paid = inv.amountPaidCents ?? 0;
		manualDocForm = {
			number: inv.description ?? '',
			amountTotal: String((due + paid) / 100),
			amountDue: String(due / 100),
			currency: inv.currency ?? 'usd',
			dueDate: inv.dueAt ? inv.dueAt.slice(0, 10) : '',
			description: inv.description ?? '',
			status: inv.status ?? 'open',
			provider: inv.provider ?? 'mercadopago_ar'
		};
		manualDocError = null;
		manualDocModalOpen = true;
	}

	function closeManualDocModal() {
		manualDocModalOpen = false;
		manualDocEditId = null;
		manualDocError = null;
	}

	async function saveManualDoc() {
		manualDocSaving = true;
		manualDocError = null;
		try {
			const amountTotal = Math.round(parseFloat(manualDocForm.amountTotal || '0') * 100);
			const amountDue = Math.round(parseFloat(manualDocForm.amountDue || manualDocForm.amountTotal || '0') * 100);
			const url = manualDocEditId
				? `/${workspace}/api/billing/documents/${manualDocEditId}`
				: `/${workspace}/api/billing/documents`;
			const method = manualDocEditId ? 'PUT' : 'POST';
			const body = manualDocEditId
				? {
						number: manualDocForm.number || undefined,
						amountTotal,
						amountDue,
						currency: manualDocForm.currency || 'usd',
						status: manualDocForm.status,
						dueDate: manualDocForm.dueDate || undefined,
						description: manualDocForm.description || undefined
					}
				: {
						companyId,
						provider: manualDocForm.provider,
						number: manualDocForm.number || undefined,
						amountTotal,
						amountDue,
						currency: manualDocForm.currency,
						dueDate: manualDocForm.dueDate || undefined,
						description: manualDocForm.description || undefined,
						status: manualDocForm.status
					};
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(body)
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? res.statusText);
			closeManualDocModal();
			await loadBilling();
		} catch (e: any) {
			manualDocError = e?.message ?? 'Error al guardar';
		} finally {
			manualDocSaving = false;
		}
	}

	async function deleteManualDoc(documentId: string) {
		if (!documentId || deleteLoading) return;
		deleteLoading = true;
		try {
			const res = await fetch(`/${workspace}/api/billing/documents/${documentId}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? res.statusText);
			deleteConfirmId = null;
			await loadBilling();
		} catch (e: any) {
			manualDocError = e?.message ?? 'Error al eliminar';
		} finally {
			deleteLoading = false;
		}
	}

	function canEditDeleteInvoice(inv: BillingInvoice & { documentId?: string | null; provider?: string }) {
		return inv.documentId && inv.provider && inv.provider !== 'stripe';
	}
</script>

<svelte:head>
	<title>Facturación - {companyName}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4">
		<a
			href={companiesUrl}
			class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
		>
			<ArrowLeft class="w-4 h-4" />
			Volver a empresas
		</a>
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Facturación - {companyName}</h2>
			<p class="text-muted-foreground">Historial de facturas y suscripciones de esta empresa.</p>
		</div>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-16">
			<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else if !linked}
		<div class="rounded-lg border bg-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div class="flex items-start gap-3">
				<Link2 class="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
				<div>
					<h3 class="font-medium">Sin cuentas de pago</h3>
					<p class="text-sm text-muted-foreground mt-0.5">
						Vinculá una cuenta de Stripe (o añadí facturación manual) para ver facturas y suscripciones.
					</p>
				</div>
			</div>
			{#if canManageBilling}
				<div class="relative shrink-0" use:clickOutside>
					<button
						type="button"
						on:click={() => (billingMenuOpen = !billingMenuOpen)}
						class="inline-flex items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						aria-expanded={billingMenuOpen}
						aria-haspopup="true"
						aria-label="Opciones de facturación"
					>
						<MoreVertical class="h-5 w-5" />
					</button>
					{#if billingMenuOpen}
						<div
							class="absolute right-0 top-full z-50 mt-1 min-w-[220px] rounded-md border bg-popover py-1 text-popover-foreground shadow-md"
							role="menu"
						>
							<button
								type="button"
								role="menuitem"
								on:click={() => {
									billingMenuOpen = false;
									openManageAccountsModal();
								}}
								class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
							>
								<Settings2 class="h-4 w-4" />
								Gestionar cuentas
							</button>
							{#if allAccounts.some((a) => (a.provider ?? 'stripe') === 'stripe')}
								<button
									type="button"
									role="menuitem"
									disabled={syncLoading}
									on:click={() => {
										billingMenuOpen = false;
										handleSync();
									}}
									class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
								>
									{#if syncLoading}
										<Loader2 class="h-4 w-4 animate-spin" />
									{:else}
										<RefreshCw class="h-4 w-4" />
									{/if}
									Sincronizar facturación
								</button>
							{/if}
							{#if billingProviders.some((p) => !p.isAutomatic)}
								<button
									type="button"
									role="menuitem"
									on:click={() => {
										billingMenuOpen = false;
										openCreateManualDoc();
									}}
									class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
								>
									<Plus class="h-4 w-4" />
									Crear facturación manual
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		{#if canManageBilling}
			<div class="rounded-lg border bg-card p-4 space-y-4">
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div class="flex items-start gap-3">
						<Link2 class="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<h3 class="font-medium">Cuentas de pago</h3>
							<p class="text-sm text-muted-foreground mt-0.5">
								Stripe, MercadoPago, PayPal y otras cuentas vinculadas. Gestioná todas desde un solo lugar.
							</p>
						</div>
					</div>
					<div class="relative shrink-0" use:clickOutside>
						<button
							type="button"
							on:click={() => (billingMenuOpen = !billingMenuOpen)}
							class="inline-flex items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
							aria-expanded={billingMenuOpen}
							aria-haspopup="true"
							aria-label="Opciones de facturación"
						>
							<MoreVertical class="h-5 w-5" />
						</button>
						{#if billingMenuOpen}
							<div
								class="absolute right-0 top-full z-50 mt-1 min-w-[220px] rounded-md border bg-popover py-1 text-popover-foreground shadow-md"
								role="menu"
							>
								<button
									type="button"
									role="menuitem"
									on:click={() => {
										billingMenuOpen = false;
										openManageAccountsModal();
									}}
									class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
								>
									<Settings2 class="h-4 w-4" />
									Gestionar cuentas
								</button>
								{#if allAccounts.some((a) => (a.provider ?? 'stripe') === 'stripe')}
									<button
										type="button"
										role="menuitem"
										disabled={syncLoading}
										on:click={() => {
											billingMenuOpen = false;
											handleSync();
										}}
										class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
									>
										{#if syncLoading}
											<Loader2 class="h-4 w-4 animate-spin" />
										{:else}
											<RefreshCw class="h-4 w-4" />
										{/if}
										Sincronizar facturación
									</button>
								{/if}
								{#if billingProviders.some((p) => !p.isAutomatic)}
									<button
										type="button"
										role="menuitem"
										on:click={() => {
											billingMenuOpen = false;
											openCreateManualDoc();
										}}
										class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
									>
										<Plus class="h-4 w-4" />
										Crear facturación manual
									</button>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
		{#if billingError}
			<div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
				Error al cargar datos de Stripe: {billingError}. Comprueba que STRIPE_SECRET_KEY sea correcta y corresponda al mismo modo (test/live) que el cliente.
			</div>
		{/if}
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
					<label for="admin-billing-search" class="sr-only">Buscar por concepto, proyecto o servicio</label>
					<input
						id="admin-billing-search"
						type="search"
						bind:value={searchQuery}
						placeholder="Buscar por concepto, proyecto o servicio..."
						class="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				</div>
				<div class="flex flex-wrap gap-2 items-center">
					<label for="admin-billing-account" class="sr-only">Método / cuenta de pago</label>
					<select
						id="admin-billing-account"
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
					<label for="admin-billing-status" class="sr-only">Estado</label>
					<select
						id="admin-billing-status"
						bind:value={filterStatus}
						class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<option value="">Todos los estados</option>
						<option value="upcoming">Próxima factura</option>
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
							No hay facturas que coincidan con los filtros o aún no hay historial para esta empresa.
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
										<td class="p-4 align-middle" title={invoice.linked_project_names?.join(', ') ?? invoice.projectName ?? undefined}>
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
											<div class="flex items-center justify-end gap-1">
												<button
													type="button"
													on:click={() => openInvoiceDrawer(invoice)}
													class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
													title="Ver detalle"
												>
													<Eye class="h-4 w-4" />
													<span class="sr-only">Ver detalle</span>
												</button>
												{#if canEditDeleteInvoice(invoice)}
													<button
														type="button"
														on:click={() => openEditManualDoc(invoice)}
														class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
														title="Editar"
													>
														<Pencil class="h-4 w-4" />
														<span class="sr-only">Editar</span>
													</button>
													{#if deleteConfirmId === invoice.documentId}
														<button
															type="button"
															on:click={() => deleteManualDoc(invoice.documentId!)}
															disabled={deleteLoading}
															class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-destructive bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground h-8 w-8 disabled:opacity-50"
															title="Confirmar eliminar"
														>
															{#if deleteLoading}
																<Loader2 class="h-4 w-4 animate-spin" />
															{:else}
																<Trash2 class="h-4 w-4" />
															{/if}
															<span class="sr-only">Eliminar</span>
														</button>
														<button
															type="button"
															on:click={() => (deleteConfirmId = null)}
															class="text-xs text-muted-foreground hover:text-foreground"
														>
															Cancelar
														</button>
													{:else}
														<button
															type="button"
															on:click={() => (deleteConfirmId = invoice.documentId ?? null)}
															class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-destructive/20 text-destructive h-8 w-8"
															title="Eliminar"
														>
															<Trash2 class="h-4 w-4" />
															<span class="sr-only">Eliminar</span>
														</button>
													{/if}
												{/if}
											</div>
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
							<label for="admin-billing-pagesize" class="text-sm text-muted-foreground">Mostrar</label>
							<select
								id="admin-billing-pagesize"
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
		{#if allAccounts.some((a) => (a.provider ?? 'stripe') === 'stripe')}
			<div class="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 mb-4 text-sm text-blue-700 dark:text-blue-300">
				<p class="font-medium">¿Falta alguna suscripción (ej. 12,50 US$)?</p>
				<p class="mt-1 text-muted-foreground">
					Cada suscripción puede estar en una cuenta Stripe distinta. Agregá la otra cuenta en <strong>Gestionar cuentas</strong> (el ID <code class="text-xs bg-muted px-1 rounded">cus_...</code> que ves en Stripe) y hacé clic en <strong>Sincronizar facturación</strong> para que aparezcan todas.
				</p>
			</div>
		{/if}
		{#if allSubscriptions.length > 0}
			<div class="space-y-4">
				{#each allSubscriptions as sub}
					<div class="rounded-lg border bg-card p-6 space-y-4">
						<div class="flex flex-wrap items-center justify-between gap-4">
							<div>
								<h3 class="text-lg font-semibold">{sub.planName}</h3>
								<p class="text-sm text-muted-foreground mt-0.5">
									{#if sub.projectName || sub.serviceName}
										{sub.projectName ?? ''}{sub.projectName && sub.serviceName ? ' · ' : ''}{sub.serviceName ?? ''}
									{:else}
										Suscripción activa
									{/if}
								</p>
								{#if sub.accountCode}
									<p class="text-xs font-mono text-muted-foreground mt-1">{sub.accountCode}</p>
								{/if}
							</div>
							<span
								class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {subscriptionStatusBadgeClass(sub.status)}"
							>
								{subscriptionStatusLabel(sub.status)}
							</span>
						</div>
						<div class="flex flex-wrap items-center gap-6 text-sm">
							<div>
								<span class="text-muted-foreground">Monto: </span>
								<span class="font-mono font-medium">{formatBillingAmount(sub.amount, sub.currency)}</span>
							</div>
						</div>
						{#if canManageBilling && sub.accountCode}
							<button
								type="button"
								on:click={() => handleManageSubscription(sub.accountCode)}
								disabled={portalLoadingId != null}
								class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
							>
								{#if portalLoadingId === sub.accountCode}
									<Loader2 class="w-4 h-4 animate-spin" />
								{:else}
									<Settings2 class="w-4 h-4" />
								{/if}
								Gestionar suscripción
							</button>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
		<div class="rounded-md border bg-card">
			<div class="p-6">
				{#if allSubscriptions.length === 0}
					<div class="text-center py-12">
						<Repeat class="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
						<h3 class="text-lg font-medium">No hay suscripciones vigentes</h3>
						<p class="text-muted-foreground mt-1">No hay servicios activos asociados a esta empresa.</p>
					</div>
				{:else}
					<div class="hidden md:block relative w-full overflow-auto">
						<table class="w-full caption-bottom text-sm text-left">
							<thead class="[&_tr]:border-b">
								<tr class="border-b transition-colors hover:bg-muted/50">
									<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Plan</th>
									<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Cuenta Stripe</th>
									<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Servicio / Proyecto</th>
									<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Precio</th>
									<th class="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th>
									<th class="h-12 px-4 align-middle font-medium text-right">Acciones</th>
								</tr>
							</thead>
							<tbody class="[&_tr:last-child]:border-0">
								{#each allSubscriptions as sub}
									<tr class="border-b transition-colors hover:bg-muted/50">
										<td class="p-4 align-middle font-medium">{sub.planName}</td>
										<td class="p-4 align-middle font-mono text-xs text-muted-foreground" title={sub.accountCode ?? ''}>{sub.accountCode ?? '—'}</td>
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
											<span
												class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold {subscriptionStatusBadgeClass(sub.status)}"
											>
												{subscriptionStatusLabel(sub.status)}
											</span>
										</td>
										<td class="p-4 align-middle text-right">
											{#if canManageBilling && sub.accountCode}
												<button
													type="button"
													on:click={() => handleManageSubscription(sub.accountCode)}
													disabled={portalLoadingId != null}
													class="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
												>
													{#if portalLoadingId === sub.accountCode}
														<Loader2 class="w-4 h-4 animate-spin" />
													{:else}
														<Settings2 class="w-4 h-4" />
													{/if}
													Gestionar
												</button>
											{/if}
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
								{#if sub.accountCode}
									<p class="text-xs font-mono text-muted-foreground">{sub.accountCode}</p>
								{/if}
								<p class="text-sm text-muted-foreground">{sub.serviceName ?? sub.projectName ?? '—'}</p>
								<div class="flex justify-between items-center pt-2 border-t border-border">
									<span class="font-mono text-sm">{formatBillingAmount(sub.amount, sub.currency)}</span>
									<span
										class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold {subscriptionStatusBadgeClass(sub.status)}"
									>
										{subscriptionStatusLabel(sub.status)}
									</span>
								</div>
								{#if canManageBilling && sub.accountCode}
									<button
										type="button"
										on:click={() => handleManageSubscription(sub.accountCode)}
										disabled={portalLoadingId != null}
										class="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
									>
										{#if portalLoadingId === sub.accountCode}
											<Loader2 class="w-4 h-4 animate-spin" />
										{:else}
											<Settings2 class="w-4 h-4" />
										{/if}
										Gestionar suscripción
									</button>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
	{/if}
</div>

<InvoiceDrawer
	open={drawerOpen}
	invoice={selectedInvoice}
	workspace={workspace}
	companyId={companyId}
	companyProjects={companyProjects}
	canManageBilling={canManageBilling}
	canEditInternalDetail={true}
	canUploadProof={true}
	allowUploadProofWhenPaid={true}
	onUploadProof={handleUploadProof}
	onSaveOverlay={handleSaveOverlay}
	onProofDeleted={async () => {
		await loadBilling();
		selectedInvoice = allInvoices.find((inv) => inv.documentId === selectedInvoice?.documentId) ?? selectedInvoice;
	}}
	onLinkProjects={async () => {
		await loadBilling();
		selectedInvoice = allInvoices.find((inv) => inv.documentId === selectedInvoice?.documentId) ?? selectedInvoice;
	}}
	onClose={closeInvoiceDrawer}
/>

<ManageAccountsModal
	open={manageAccountsModalOpen}
	onClose={closeManageAccountsModal}
	accounts={allAccounts}
	onAddStripe={handleAddStripe}
	onRemove={handleRemoveAccount}
	onSetDefault={handleSetDefaultAccount}
	onUpdate={handleUpdateAccount}
	onAfterChange={loadBilling}
/>

{#if manualDocModalOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
		role="dialog"
		aria-modal="true"
		aria-labelledby="manual-doc-title"
	>
		<div class="bg-card border rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
			<h2 id="manual-doc-title" class="text-lg font-semibold">
				{manualDocEditId ? 'Editar facturación' : 'Crear facturación'}
			</h2>
			{#if manualDocError}
				<p class="text-sm text-destructive">{manualDocError}</p>
			{/if}
			<div class="grid gap-4">
				{#if !manualDocEditId}
					<div>
						<label for="md-provider" class="block text-sm font-medium mb-1">Proveedor</label>
						<select id="md-provider" bind:value={manualDocForm.provider} class="w-full rounded-md border bg-background px-3 py-2 text-sm">
							{#each billingProviders.filter((p) => !p.isAutomatic) as p}
								<option value={p.code}>{p.label}</option>
							{/each}
						</select>
					</div>
				{/if}
				<div>
					<label for="md-number" class="block text-sm font-medium mb-1">Número / Concepto</label>
					<input id="md-number" type="text" bind:value={manualDocForm.number} class="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Ej. INV-001" />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="md-amount" class="block text-sm font-medium mb-1">Monto total (USD)</label>
						<input id="md-amount" type="number" step="0.01" min="0" bind:value={manualDocForm.amountTotal} class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="md-due" class="block text-sm font-medium mb-1">Monto pendiente (USD)</label>
						<input id="md-due" type="number" step="0.01" min="0" bind:value={manualDocForm.amountDue} class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
					</div>
				</div>
				<div>
					<label for="md-currency" class="block text-sm font-medium mb-1">Moneda</label>
					<select id="md-currency" bind:value={manualDocForm.currency} class="w-full rounded-md border bg-background px-3 py-2 text-sm">
						<option value="usd">USD</option>
						<option value="eur">EUR</option>
						<option value="ars">ARS</option>
					</select>
				</div>
				<div>
					<label for="md-duedate" class="block text-sm font-medium mb-1">Vencimiento</label>
					<input id="md-duedate" type="date" bind:value={manualDocForm.dueDate} class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
				</div>
				<div>
					<label for="md-desc" class="block text-sm font-medium mb-1">Descripción</label>
					<input id="md-desc" type="text" bind:value={manualDocForm.description} class="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Descripción opcional" />
				</div>
				<div>
					<label for="md-status" class="block text-sm font-medium mb-1">Estado</label>
					<select id="md-status" bind:value={manualDocForm.status} class="w-full rounded-md border bg-background px-3 py-2 text-sm">
						<option value="draft">Borrador</option>
						<option value="open">Pendiente</option>
						<option value="paid">Pagado</option>
						<option value="void">Anulada</option>
					</select>
				</div>
			</div>
			<div class="flex justify-end gap-2 pt-2">
				<button type="button" on:click={closeManualDocModal} class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
					Cancelar
				</button>
				<button type="button" on:click={saveManualDoc} disabled={manualDocSaving} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2">
					{#if manualDocSaving}
						<Loader2 class="h-4 w-4 animate-spin" />
					{/if}
					{manualDocEditId ? 'Guardar' : 'Crear'}
				</button>
			</div>
		</div>
	</div>
{/if}
