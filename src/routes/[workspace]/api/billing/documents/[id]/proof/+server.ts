import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBillingCompanyId } from '$lib/server/billing';
import * as billingDocsRepo from '$lib/server/billing-domain/billing-documents.repository';
import { uploadFile, getSignedUrlForFile, deleteFile } from '$lib/server/storage';

const workspaceFromEvent = (event: { params: Record<string, string | undefined> }) =>
	event.params.workspace ?? 'allianzy';

type ProofFile = { id: string; url: string; name: string; uploadedAt: string };

function getProofFiles(metadata: Record<string, unknown> | null): ProofFile[] {
	const meta = metadata ?? {};
	const files = meta.proof_files;
	if (Array.isArray(files) && files.length > 0) {
		return files.filter(
			(f): f is ProofFile =>
				f && typeof f === 'object' && typeof (f as any).id === 'string' && typeof (f as any).url === 'string'
		);
	}
	const legacyUrl = meta.proof_url;
	if (typeof legacyUrl === 'string' && legacyUrl) {
		const name = (meta.proof_url as string).split('/').pop() ?? 'Comprobante';
		return [{ id: 'legacy', url: legacyUrl, name, uploadedAt: String(meta.proof_uploaded_at ?? '') }];
	}
	return [];
}

/** GET: URL firmada para ver un comprobante (index=0 por defecto). */
export const GET: RequestHandler = async (event) => {
	const documentId = event.params.id;
	const indexStr = event.url.searchParams.get('index') ?? '0';
	const index = parseInt(indexStr, 10) || 0;

	const companyId = await getBillingCompanyId(event);
	if (companyId == null) return json({ error: 'Unauthorized' }, { status: 403 });

	const doc = await billingDocsRepo.findBillingDocumentById(documentId);
	if (!doc) return json({ error: 'Document not found' }, { status: 404 });
	if (doc.companyId !== companyId) return json({ error: 'Forbidden' }, { status: 403 });

	const files = getProofFiles(doc.metadata as Record<string, unknown> | null);
	const file = files[index];
	if (!file) return json({ error: 'Comprobante no encontrado' }, { status: 404 });

	const signedUrl = getSignedUrlForFile(file.url, workspaceFromEvent(event));
	if (!signedUrl) return json({ error: 'No se pudo generar el enlace' }, { status: 500 });
	return json({ url: signedUrl, name: file.name });
};

/** POST: subir comprobante de transferencia (cuando no es MercadoPago/Stripe). Cliente o admin. Añade al listado (múltiples archivos). */
export const POST: RequestHandler = async (event) => {
	const documentId = event.params.id;
	if (!documentId) return json({ error: 'id required' }, { status: 400 });

	const companyId = await getBillingCompanyId(event);
	if (companyId == null) return json({ error: 'Unauthorized' }, { status: 403 });

	const doc = await billingDocsRepo.findBillingDocumentById(documentId);
	if (!doc) return json({ error: 'Document not found' }, { status: 404 });
	if (doc.companyId !== companyId) return json({ error: 'Forbidden' }, { status: 403 });
	if (doc.provider === 'stripe') return json({ error: 'No se puede subir comprobante para facturas Stripe' }, { status: 400 });

	const formData = await event.request.formData();
	const file = formData.get('file') as File | null;
	if (!file || !(file instanceof File) || file.size === 0) {
		return json({ error: 'Archivo requerido' }, { status: 400 });
	}

	try {
		const proofUrl = await uploadFile(file, 'billing-proofs');
		const meta = (doc.metadata ?? {}) as Record<string, unknown>;
		const files = getProofFiles(meta);
		const newFile: ProofFile = {
			id: `proof_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
			url: proofUrl,
			name: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
			uploadedAt: new Date().toISOString()
		};
		const proofFiles = [...files, newFile];
		const updated = await billingDocsRepo.updateBillingDocument(documentId, {
			metadata: {
				...meta,
				proof_files: proofFiles,
				proof_url: proofFiles[0]?.url ?? proofUrl,
				proof_uploaded_at: proofFiles[0]?.uploadedAt ?? new Date().toISOString()
			}
		});
		return json({ ok: true, proof_url: proofUrl, proof_files: proofFiles, document: updated });
	} catch (err: unknown) {
		console.error('[billing/proof] upload error:', err);
		return json({ error: 'Error al subir el archivo' }, { status: 500 });
	}
};

/** DELETE: eliminar un comprobante (index). Solo si el documento no está pagado. */
export const DELETE: RequestHandler = async (event) => {
	const documentId = event.params.id;
	const indexStr = event.url.searchParams.get('index') ?? '0';
	const index = parseInt(indexStr, 10) || 0;

	const companyId = await getBillingCompanyId(event);
	if (companyId == null) return json({ error: 'Unauthorized' }, { status: 403 });

	const doc = await billingDocsRepo.findBillingDocumentById(documentId);
	if (!doc) return json({ error: 'Document not found' }, { status: 404 });
	if (doc.companyId !== companyId) return json({ error: 'Forbidden' }, { status: 403 });
	if (doc.status === 'paid') return json({ error: 'No se puede eliminar comprobante de un documento ya pagado' }, { status: 400 });

	const meta = (doc.metadata ?? {}) as Record<string, unknown>;
	const files = getProofFiles(meta);
	if (index < 0 || index >= files.length) return json({ error: 'Comprobante no encontrado' }, { status: 404 });

	const removed = files[index];
	const proofFiles = files.filter((_, i) => i !== index);
	try {
		await deleteFile(removed.url);
	} catch (e) {
		console.error('[billing/proof] delete file error:', e);
	}
	const updated = await billingDocsRepo.updateBillingDocument(documentId, {
		metadata: {
			...meta,
			proof_files: proofFiles,
			proof_url: proofFiles[0]?.url ?? null,
			proof_uploaded_at: proofFiles[0]?.uploadedAt ?? null
		}
	});
	return json({ ok: true, proof_files: proofFiles, document: updated });
};
