-- Vincular documento de facturación al pago del proyecto (1:1)
ALTER TABLE billing_documents
  ADD COLUMN IF NOT EXISTS payment_id integer REFERENCES payments(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS billing_documents_payment_id_idx ON billing_documents(payment_id);
