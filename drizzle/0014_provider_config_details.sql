-- Datos/direcciones por método de pago (ej. CVU, Alias, Banco, PayPal Email).
ALTER TABLE payment_provider_config
  ADD COLUMN IF NOT EXISTS details jsonb DEFAULT '[]';

COMMENT ON COLUMN payment_provider_config.details IS 'Array of { label: string, value: string } e.g. CVU, Alias, Banco, PayPal Email';
