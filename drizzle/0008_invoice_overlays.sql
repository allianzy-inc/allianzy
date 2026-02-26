-- Detalle interno de facturas por empresa (admin-editable)
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "invoice_overlays" jsonb DEFAULT '{}';
