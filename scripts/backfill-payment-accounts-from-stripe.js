/**
 * Backfill: migrar companies.stripe_accounts / stripe_customer_id → payment_accounts.
 * Ejecutar después de run-migration-0010.js.
 * Uso: node scripts/backfill-payment-accounts-from-stripe.js
 */
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const db = neon(connectionString);

async function backfill() {
  const companies = await db(
    `SELECT id, stripe_customer_id, stripe_accounts FROM companies
     WHERE stripe_customer_id IS NOT NULL OR (stripe_accounts IS NOT NULL AND stripe_accounts != '[]'::jsonb)`
  );
  if (!Array.isArray(companies)) {
    console.log('No companies with Stripe data.');
    return;
  }

  let inserted = 0;
  for (const row of companies) {
    const accounts = [];
    const stripeAccounts = row.stripe_accounts;
    if (stripeAccounts && Array.isArray(stripeAccounts)) {
      for (const a of stripeAccounts) {
        if (a && typeof a.customerId === 'string' && a.customerId.startsWith('cus_')) {
          accounts.push({ customerId: a.customerId.trim(), isDefault: Boolean(a.isDefault) });
        }
      }
    }
    if (accounts.length === 0 && row.stripe_customer_id?.trim().startsWith('cus_')) {
      accounts.push({ customerId: row.stripe_customer_id.trim(), isDefault: true });
    }
    if (accounts.length === 0) continue;

    for (let i = 0; i < accounts.length; i++) {
      const { customerId, isDefault } = accounts[i];
      const existing = await db(
        `SELECT id FROM payment_accounts WHERE company_id = $1 AND external_id = $2`,
        [row.id, customerId]
      );
      if (Array.isArray(existing) && existing.length > 0) continue;
      await db(
        `INSERT INTO payment_accounts (company_id, provider, label, external_id, status, is_default, updated_at)
         VALUES ($1, 'stripe', $2, $3, 'active', $4, now())`,
        [row.id, accounts.length > 1 ? `Stripe ${i + 1}` : 'Stripe principal', customerId, i === 0 || isDefault]
      );
      inserted++;
      console.log(`Company ${row.id}: added payment_account ${customerId}`);
    }
  }
  console.log('Backfill done. Inserted', inserted, 'payment_accounts.');
}

backfill().catch((err) => {
  console.error(err);
  process.exit(1);
});
