-- Admin Finance: categories, transactions, and transaction attachments

CREATE TABLE IF NOT EXISTS finance_categories (
  id serial PRIMARY KEY,
  workspace_id integer NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  "group" text NOT NULL DEFAULT 'expense',
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS finance_categories_workspace_id_idx ON finance_categories(workspace_id);

CREATE TABLE IF NOT EXISTS finance_transactions (
  id serial PRIMARY KEY,
  workspace_id integer NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  description text NOT NULL,
  amount numeric(14, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  type text NOT NULL,
  category_id integer REFERENCES finance_categories(id) ON DELETE SET NULL,
  bank text,
  payment_method text NOT NULL DEFAULT 'bank',
  card_label text,
  created_by integer REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS finance_transactions_workspace_id_idx ON finance_transactions(workspace_id);
CREATE INDEX IF NOT EXISTS finance_transactions_date_idx ON finance_transactions(date);

CREATE TABLE IF NOT EXISTS finance_transaction_attachments (
  id serial PRIMARY KEY,
  transaction_id integer NOT NULL REFERENCES finance_transactions(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'other',
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS finance_transaction_attachments_transaction_id_idx ON finance_transaction_attachments(transaction_id);
