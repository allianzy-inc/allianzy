-- Múltiples cuentas Stripe por empresa (combobox en admin y dashboard)
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "stripe_accounts" jsonb DEFAULT '[]';

-- Backfill: si ya tiene stripe_customer_id, copiarlo como única cuenta por defecto
UPDATE "companies"
SET "stripe_accounts" = jsonb_build_array(jsonb_build_object('customerId', "stripe_customer_id", 'isDefault', true))
WHERE "stripe_customer_id" IS NOT NULL AND "stripe_customer_id" <> ''
  AND ("stripe_accounts" IS NULL OR "stripe_accounts" = '[]'::jsonb);
