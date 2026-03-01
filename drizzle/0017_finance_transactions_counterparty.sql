-- Add optional counterparty (company or person) to finance transactions

ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS counterparty text;

COMMENT ON COLUMN finance_transactions.counterparty IS 'Empresa o persona de la que se recibe o a la que se hace el pago (opcional).';
