-- Stripe billing fields on companies (source of truth: Stripe; we only store customer id)
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "billing_email" text;
