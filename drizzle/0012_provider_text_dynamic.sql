-- Provider como TEXT para permitir métodos de pago dinámicos (ej. mercadopago_ar, paypal_uk).
ALTER TABLE payment_accounts ALTER COLUMN provider TYPE text USING provider::text;
ALTER TABLE subscription_records ALTER COLUMN provider TYPE text USING provider::text;
ALTER TABLE billing_documents ALTER COLUMN provider TYPE text USING provider::text;
ALTER TABLE payment_transactions ALTER COLUMN provider TYPE text USING provider::text;

-- Dejar solo Stripe precargado; el resto se agrega desde Configuraciones.
DELETE FROM payment_provider_config WHERE code != 'stripe';
