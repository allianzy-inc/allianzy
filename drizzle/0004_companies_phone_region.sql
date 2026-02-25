-- Ensure companies.phone and companies.region exist (for DBs created before these columns or with partial migrations)
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "phone" text;
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "region" text;
