-- Add missing columns to payments (amount_original, amount_paid, currencies, exchange_rate, amount_usd, payment_method, provider_payment_id)
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "amount_original" numeric(14, 2);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "currency_original" char(3);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "amount_paid" numeric(14, 2);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "currency_paid" char(3);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "exchange_rate" numeric(14, 6);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "amount_usd" numeric(14, 2);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "payment_method" text;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "provider_payment_id" text;
