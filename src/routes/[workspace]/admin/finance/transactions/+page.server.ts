import { db } from '$lib/server/db';
import {
	workspaces,
	financeCategories,
	financeTransactions,
	financeTransactionAttachments
} from '$lib/server/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { uploadFile, getSignedUrlForFile } from '$lib/server/storage';

export const load: PageServerLoad = async ({ params }) => {
	const workspace = await db.query.workspaces.findFirst({
		where: eq(workspaces.slug, params.workspace)
	});

	if (!workspace) {
		return { transactions: [], categories: [] };
	}

	let categoriesRows = await db
		.select()
		.from(financeCategories)
		.where(eq(financeCategories.workspaceId, workspace.id));

	if (categoriesRows.length === 0) {
		await db.insert(financeCategories).values([
			{ workspaceId: workspace.id, name: 'Client Payments', group: 'income' },
			{ workspaceId: workspace.id, name: 'Consulting Fees', group: 'income' },
			{ workspaceId: workspace.id, name: 'Contractors', group: 'expense' },
			{ workspaceId: workspace.id, name: 'Software Subscriptions', group: 'expense' },
			{ workspaceId: workspace.id, name: 'Hosting/VPS', group: 'expense' },
			{ workspaceId: workspace.id, name: 'Ads/Marketing', group: 'expense' },
			{ workspaceId: workspace.id, name: 'Bank/Transfer', group: 'expense' },
			{ workspaceId: workspace.id, name: 'Other', group: 'other' }
		]);
		categoriesRows = await db
			.select()
			.from(financeCategories)
			.where(eq(financeCategories.workspaceId, workspace.id));
	}

	const txRows = await db
		.select()
		.from(financeTransactions)
		.where(eq(financeTransactions.workspaceId, workspace.id))
		.orderBy(desc(financeTransactions.date));

	const transactionIds = txRows.map((t) => t.id);
	const allAttachmentsList =
		transactionIds.length > 0
			? await db
					.select()
					.from(financeTransactionAttachments)
					.where(inArray(financeTransactionAttachments.transactionId, transactionIds))
			: [];
	const byTxId = allAttachmentsList;

	const categoryMap = new Map(categoriesRows.map((c) => [c.id, c]));

	const transactions = txRows.map((t) => {
		const category = t.categoryId ? categoryMap.get(t.categoryId) : null;
		const atts = byTxId.filter((a) => a.transactionId === t.id);
		return {
			id: String(t.id),
			workspaceId: t.workspaceId,
			date: t.date?.toISOString?.() ?? new Date(t.date as any).toISOString(),
			status: t.status,
			description: t.description,
			amount: Number(t.amount),
			currency: t.currency,
			type: t.type,
			categoryId: t.categoryId ? String(t.categoryId) : '',
			categoryName: category?.name ?? null,
			bank: t.bank,
			paymentMethod: t.paymentMethod,
			cardLabel: t.cardLabel,
			counterparty: t.counterparty,
			createdBy: t.createdBy,
			createdAt: t.createdAt?.toISOString?.() ?? null,
			updatedAt: t.updatedAt?.toISOString?.() ?? null,
			attachments: atts.map((a) => ({
				id: a.id,
				fileName: a.fileName,
				fileUrl: a.fileUrl,
				description: a.description,
				kind: a.kind
			}))
		};
	});

	// Sign URLs for attachments (for display)
	for (const tx of transactions) {
		for (const att of tx.attachments) {
			(att as any).signedUrl = getSignedUrlForFile(att.fileUrl, params.workspace);
		}
	}

	return {
		transactions,
		categories: categoriesRows.map((c) => ({ id: String(c.id), name: c.name, group: c.group }))
	};
};

export const actions: Actions = {
	createTransaction: async ({ request, params, locals }) => {
		try {
			const formData = await request.formData();
			const date = formData.get('date') as string;
			const status = formData.get('status') as string;
			const description = formData.get('description') as string;
			const amount = formData.get('amount') as string;
			const currency = formData.get('currency') as string;
			const type = formData.get('type') as string;
			const categoryIdRaw = formData.get('categoryId') as string;
			const bank = (formData.get('bank') as string) || null;
			const paymentMethod = formData.get('paymentMethod') as string;
			const cardLabel = (formData.get('cardLabel') as string) || null;
			const counterparty = (formData.get('counterparty') as string)?.trim() || null;

			if (!date || !description || amount === null || amount === '') {
				return fail(400, { create: { error: 'Faltan fecha, descripción o monto.' } });
			}

			const workspace = await db.query.workspaces.findFirst({
				where: eq(workspaces.slug, params.workspace)
			});
			if (!workspace) return fail(404, { create: { error: 'Workspace no encontrado.' } });

			const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : null;
			if (categoryIdRaw && isNaN(categoryId)) {
				return fail(400, { create: { error: 'Categoría inválida.' } });
			}

			const [inserted] = await db
				.insert(financeTransactions)
				.values({
					workspaceId: workspace.id,
					date: new Date(date),
					status: status || 'pending',
					description: description.trim(),
					amount: String(amount),
					currency: currency || 'USD',
					type: type === 'income' ? 'income' : 'expense',
					categoryId: categoryId ?? undefined,
					bank: bank ?? undefined,
					paymentMethod: paymentMethod || 'bank',
					cardLabel: cardLabel ?? undefined,
					counterparty: counterparty ?? undefined,
					createdBy: locals.user?.id ? parseInt(String(locals.user.id), 10) : undefined
				})
				.returning({ id: financeTransactions.id });

			if (!inserted) return fail(500, { create: { error: 'Error al crear la transacción.' } });

			const descriptionsJson = formData.get('attachment_descriptions') as string;
			const kindsJson = formData.get('attachment_kinds') as string;
			const rawFiles = formData.getAll('attachment_files') as File[];
			const files = rawFiles.filter((f) => f?.size > 0 && f?.name);
			let descriptions: string[] = [];
			let kinds: string[] = [];
			try {
				if (descriptionsJson) descriptions = JSON.parse(descriptionsJson) as string[];
				if (kindsJson) kinds = JSON.parse(kindsJson) as string[];
			} catch (_) {}

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				try {
					const url = await uploadFile(file, 'finance-transactions');
					const desc = descriptions[i] ?? '';
					const kind = (kinds[i] as 'invoice' | 'receipt' | 'transfer' | 'other') || 'other';
					await db.insert(financeTransactionAttachments).values({
						transactionId: inserted.id,
						fileUrl: url,
						fileName: file.name,
						description: desc || null,
						kind
					});
				} catch (err) {
					const msg = err instanceof Error ? err.message : 'Error al subir el archivo';
					return fail(500, { create: { error: `Archivo "${file.name}": ${msg}. Comprueba la configuración de almacenamiento (B2).` } });
				}
			}

			return { create: { success: true } };
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Error inesperado';
			return fail(500, { create: { error: msg } });
		}
	},

	updateTransaction: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const idRaw = formData.get('id') as string;
		const id = idRaw ? parseInt(idRaw, 10) : NaN;
		if (!id || isNaN(id)) return fail(400, { update: { error: 'ID inválido.' } });

		const date = formData.get('date') as string;
		const status = formData.get('status') as string;
		const description = formData.get('description') as string;
		const amount = formData.get('amount') as string;
		const currency = formData.get('currency') as string;
		const type = formData.get('type') as string;
		const categoryIdRaw = formData.get('categoryId') as string;
			const bank = (formData.get('bank') as string) || null;
			const paymentMethod = formData.get('paymentMethod') as string;
			const cardLabel = (formData.get('cardLabel') as string) || null;
			const counterparty = (formData.get('counterparty') as string)?.trim() || null;

			if (!date || !description || amount === null || amount === '') {
				return fail(400, { update: { error: 'Faltan fecha, descripción o monto.' } });
			}

			const workspace = await db.query.workspaces.findFirst({
				where: eq(workspaces.slug, params.workspace)
			});
			if (!workspace) return fail(404, { update: { error: 'Workspace no encontrado.' } });

			const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : null;

			await db
				.update(financeTransactions)
				.set({
					date: new Date(date),
					status: status || 'pending',
					description: description.trim(),
					amount: String(amount),
					currency: currency || 'USD',
					type: type === 'income' ? 'income' : 'expense',
					categoryId: categoryId ?? null,
					bank: bank ?? null,
					paymentMethod: paymentMethod || 'bank',
					cardLabel: cardLabel ?? null,
					counterparty: counterparty ?? null,
					updatedAt: new Date()
				})
			.where(
				and(
					eq(financeTransactions.id, id),
					eq(financeTransactions.workspaceId, workspace.id)
				)
			);

		const descriptionsJson = formData.get('attachment_descriptions') as string;
		const kindsJson = formData.get('attachment_kinds') as string;
		const rawFiles = formData.getAll('attachment_files') as File[];
		const files = rawFiles.filter((f) => f?.size > 0 && f?.name);
		let descriptions: string[] = [];
		let kinds: string[] = [];
		try {
			if (descriptionsJson) descriptions = JSON.parse(descriptionsJson) as string[];
			if (kindsJson) kinds = JSON.parse(kindsJson) as string[];
		} catch (_) {}

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			try {
				const url = await uploadFile(file, 'finance-transactions');
				const desc = descriptions[i] ?? '';
				const kind = (kinds[i] as 'invoice' | 'receipt' | 'transfer' | 'other') || 'other';
				await db.insert(financeTransactionAttachments).values({
					transactionId: id,
					fileUrl: url,
					fileName: file.name,
					description: desc || null,
					kind
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : 'Error al subir el archivo';
				return fail(500, { update: { error: `Archivo "${file.name}": ${msg}` } });
			}
		}

		return { update: { success: true } };
	},

	deleteTransaction: async ({ request, params }) => {
		const formData = await request.formData();
		const idRaw = formData.get('id') as string;
		const id = idRaw ? parseInt(idRaw, 10) : NaN;
		if (!id || isNaN(id)) return fail(400, { delete: { error: 'ID inválido.' } });

		const workspace = await db.query.workspaces.findFirst({
			where: eq(workspaces.slug, params.workspace)
		});
		if (!workspace) return fail(404, { delete: { error: 'Workspace no encontrado.' } });

		await db
			.delete(financeTransactions)
			.where(
				and(
					eq(financeTransactions.id, id),
					eq(financeTransactions.workspaceId, workspace.id)
				)
			);
		throw redirect(303, `/${params.workspace}/admin/finance/transactions`);
	},

	deleteAttachment: async ({ request, params }) => {
		const formData = await request.formData();
		const attachmentIdRaw = formData.get('attachmentId') as string;
		const attachmentId = attachmentIdRaw ? parseInt(attachmentIdRaw, 10) : NaN;
		if (!attachmentId || isNaN(attachmentId)) return fail(400, { deleteAttachment: { error: 'ID inválido.' } });

		const workspace = await db.query.workspaces.findFirst({
			where: eq(workspaces.slug, params.workspace)
		});
		if (!workspace) return fail(404, { deleteAttachment: { error: 'Workspace no encontrado.' } });

		const [att] = await db
			.select({ transactionId: financeTransactionAttachments.transactionId })
			.from(financeTransactionAttachments)
			.where(eq(financeTransactionAttachments.id, attachmentId))
			.limit(1);
		if (!att) return fail(404, { deleteAttachment: { error: 'Adjunto no encontrado.' } });

		const [tx] = await db
			.select({ workspaceId: financeTransactions.workspaceId })
			.from(financeTransactions)
			.where(eq(financeTransactions.id, att.transactionId))
			.limit(1);
		if (!tx || tx.workspaceId !== workspace.id) {
			return fail(404, { deleteAttachment: { error: 'Adjunto no encontrado.' } });
		}

		await db
			.delete(financeTransactionAttachments)
			.where(eq(financeTransactionAttachments.id, attachmentId));
		throw redirect(303, `/${params.workspace}/admin/finance/transactions`);
	}
};
