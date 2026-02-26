-- Billing Domain: provider-agnostic tables (Stripe, MP, PayPal, bank, manual)
-- Run after schema is applied. Requires: companies, projects tables.

-- Enums
DO $$ BEGIN
  CREATE TYPE billing_provider AS ENUM ('stripe', 'mercadopago', 'paypal', 'bank', 'manual');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_account_status AS ENUM ('active', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE billing_document_type AS ENUM ('invoice', 'receipt', 'credit_note');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE billing_document_status AS ENUM ('draft', 'open', 'paid', 'void', 'uncollectible', 'canceled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE billing_document_source AS ENUM ('project', 'subscription', 'manual', 'import');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_transaction_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded', 'canceled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'incomplete');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Enable uuid-ossp if not present (for gen_random_uuid on older PG)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- payment_accounts
CREATE TABLE IF NOT EXISTS payment_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id integer NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  provider billing_provider NOT NULL,
  label text NOT NULL,
  external_id text,
  status payment_account_status NOT NULL DEFAULT 'active',
  is_default boolean NOT NULL DEFAULT false,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payment_accounts_company_id_idx ON payment_accounts(company_id);
CREATE INDEX IF NOT EXISTS payment_accounts_provider_idx ON payment_accounts(provider);

-- subscription_records
CREATE TABLE IF NOT EXISTS subscription_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id integer NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  provider billing_provider NOT NULL,
  provider_subscription_id text,
  payment_account_id uuid REFERENCES payment_accounts(id) ON DELETE SET NULL,
  status subscription_status NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  amount integer NOT NULL,
  currency text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS subscription_records_company_id_idx ON subscription_records(company_id);
CREATE INDEX IF NOT EXISTS subscription_records_provider_sub_id_idx ON subscription_records(provider_subscription_id);

-- billing_documents
CREATE TABLE IF NOT EXISTS billing_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id integer NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type billing_document_type NOT NULL,
  provider billing_provider NOT NULL,
  provider_document_id text,
  payment_account_id uuid REFERENCES payment_accounts(id) ON DELETE SET NULL,
  number text,
  currency text NOT NULL,
  amount_total integer NOT NULL,
  amount_due integer NOT NULL,
  status billing_document_status NOT NULL,
  due_date timestamptz,
  issued_at timestamptz,
  description text,
  source billing_document_source NOT NULL,
  project_id integer REFERENCES projects(id) ON DELETE SET NULL,
  subscription_record_id uuid REFERENCES subscription_records(id) ON DELETE SET NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS billing_documents_company_id_idx ON billing_documents(company_id);
CREATE INDEX IF NOT EXISTS billing_documents_provider_doc_id_idx ON billing_documents(provider_document_id);
CREATE INDEX IF NOT EXISTS billing_documents_status_idx ON billing_documents(status);

-- billing_line_items
CREATE TABLE IF NOT EXISTS billing_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_document_id uuid NOT NULL REFERENCES billing_documents(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  quantity numeric(14,4) NOT NULL,
  unit_amount integer NOT NULL,
  amount integer NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS billing_line_items_document_id_idx ON billing_line_items(billing_document_id);

-- payment_transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id integer NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  billing_document_id uuid REFERENCES billing_documents(id) ON DELETE SET NULL,
  provider billing_provider NOT NULL,
  payment_account_id uuid REFERENCES payment_accounts(id) ON DELETE SET NULL,
  provider_payment_id text,
  amount integer NOT NULL,
  currency text NOT NULL,
  status payment_transaction_status NOT NULL,
  paid_at timestamptz,
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payment_transactions_company_id_idx ON payment_transactions(company_id);
CREATE INDEX IF NOT EXISTS payment_transactions_billing_document_id_idx ON payment_transactions(billing_document_id);
