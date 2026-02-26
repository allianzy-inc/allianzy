CREATE TYPE "public"."billing_document_source" AS ENUM('project', 'subscription', 'manual', 'import');--> statement-breakpoint
CREATE TYPE "public"."billing_document_status" AS ENUM('draft', 'open', 'paid', 'void', 'uncollectible', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."billing_document_type" AS ENUM('invoice', 'receipt', 'credit_note');--> statement-breakpoint
CREATE TYPE "public"."billing_provider" AS ENUM('stripe', 'mercadopago', 'paypal', 'payoneer', 'bank', 'manual');--> statement-breakpoint
CREATE TYPE "public"."payment_account_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."payment_transaction_status" AS ENUM('pending', 'succeeded', 'failed', 'refunded', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'trialing', 'past_due', 'canceled', 'incomplete');--> statement-breakpoint
CREATE TABLE "billing_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" integer NOT NULL,
	"type" "billing_document_type" NOT NULL,
	"provider" text NOT NULL,
	"provider_document_id" text,
	"payment_account_id" uuid,
	"number" text,
	"currency" text NOT NULL,
	"amount_total" integer NOT NULL,
	"amount_due" integer NOT NULL,
	"status" "billing_document_status" NOT NULL,
	"due_date" timestamp with time zone,
	"issued_at" timestamp with time zone,
	"description" text,
	"source" "billing_document_source" NOT NULL,
	"project_id" integer,
	"payment_id" integer,
	"subscription_record_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_line_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"billing_document_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"quantity" numeric(14, 4) NOT NULL,
	"unit_amount" integer NOT NULL,
	"amount" integer NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intake_case_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" integer,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"company" text NOT NULL,
	"role_title" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "intake_cases" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"score" integer,
	"answers_json" jsonb DEFAULT 'null'::jsonb,
	"anonymous_token" text NOT NULL,
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" integer NOT NULL,
	"provider" text NOT NULL,
	"label" text NOT NULL,
	"external_id" text,
	"status" "payment_account_status" DEFAULT 'active' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_provider_config" (
	"code" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"is_automatic" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"details" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" integer NOT NULL,
	"billing_document_id" uuid,
	"provider" text NOT NULL,
	"payment_account_id" uuid,
	"provider_payment_id" text,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" "payment_transaction_status" NOT NULL,
	"paid_at" timestamp with time zone,
	"raw" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" integer NOT NULL,
	"provider" text NOT NULL,
	"provider_subscription_id" text,
	"payment_account_id" uuid,
	"status" "subscription_status" NOT NULL,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "addresses" jsonb;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "links" jsonb;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "documents" jsonb;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "member_limit" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "stripe_accounts" jsonb;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "billing_email" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "invoice_overlays" jsonb;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "amount_paid" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "currency_paid" char(3);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "company_id" integer;--> statement-breakpoint
ALTER TABLE "user_companies" ADD COLUMN "status" text DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "user_companies" ADD COLUMN "permissions" jsonb;--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_payment_account_id_payment_accounts_id_fk" FOREIGN KEY ("payment_account_id") REFERENCES "public"."payment_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_subscription_record_id_subscription_records_id_fk" FOREIGN KEY ("subscription_record_id") REFERENCES "public"."subscription_records"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_line_items" ADD CONSTRAINT "billing_line_items_billing_document_id_billing_documents_id_fk" FOREIGN KEY ("billing_document_id") REFERENCES "public"."billing_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intake_case_contacts" ADD CONSTRAINT "intake_case_contacts_case_id_intake_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."intake_cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intake_cases" ADD CONSTRAINT "intake_cases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_accounts" ADD CONSTRAINT "payment_accounts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_billing_document_id_billing_documents_id_fk" FOREIGN KEY ("billing_document_id") REFERENCES "public"."billing_documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payment_account_id_payment_accounts_id_fk" FOREIGN KEY ("payment_account_id") REFERENCES "public"."payment_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_records" ADD CONSTRAINT "subscription_records_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_records" ADD CONSTRAINT "subscription_records_payment_account_id_payment_accounts_id_fk" FOREIGN KEY ("payment_account_id") REFERENCES "public"."payment_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "billing_documents_company_id_idx" ON "billing_documents" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "billing_documents_provider_doc_id_idx" ON "billing_documents" USING btree ("provider_document_id");--> statement-breakpoint
CREATE INDEX "billing_documents_status_idx" ON "billing_documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "billing_line_items_document_id_idx" ON "billing_line_items" USING btree ("billing_document_id");--> statement-breakpoint
CREATE INDEX "intake_case_contacts_case_id_idx" ON "intake_case_contacts" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "intake_case_contacts_email_idx" ON "intake_case_contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "intake_cases_workspace_idx" ON "intake_cases" USING btree ("workspace");--> statement-breakpoint
CREATE INDEX "intake_cases_status_idx" ON "intake_cases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "intake_cases_token_idx" ON "intake_cases" USING btree ("anonymous_token");--> statement-breakpoint
CREATE INDEX "payment_accounts_company_id_idx" ON "payment_accounts" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "payment_accounts_provider_idx" ON "payment_accounts" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "payment_transactions_company_id_idx" ON "payment_transactions" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "payment_transactions_billing_document_id_idx" ON "payment_transactions" USING btree ("billing_document_id");--> statement-breakpoint
CREATE INDEX "subscription_records_company_id_idx" ON "subscription_records" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "subscription_records_provider_sub_id_idx" ON "subscription_records" USING btree ("provider_subscription_id");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;