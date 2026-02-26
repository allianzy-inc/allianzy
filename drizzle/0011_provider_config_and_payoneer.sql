-- Add payoneer to billing_provider enum
ALTER TYPE billing_provider ADD VALUE IF NOT EXISTS 'payoneer';

-- Config: which payment providers are available and their display order (solo Stripe es automático)
CREATE TABLE IF NOT EXISTS payment_provider_config (
  code text PRIMARY KEY,
  label text NOT NULL,
  is_automatic boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed: Stripe automático; el resto manual
INSERT INTO payment_provider_config (code, label, is_automatic, display_order, enabled) VALUES
  ('stripe', 'Stripe', true, 0, true),
  ('mercadopago', 'MercadoPago', false, 1, true),
  ('paypal', 'PayPal', false, 2, true),
  ('payoneer', 'Payoneer', false, 3, true),
  ('bank', 'Transferencia bancaria', false, 4, true),
  ('manual', 'Manual / Otros', false, 5, true)
ON CONFLICT (code) DO NOTHING;
