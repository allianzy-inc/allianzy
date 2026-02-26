/**
 * One-off: run drizzle/0009_stripe_accounts.sql
 * Usage: node scripts/run-migration-0009.js
 */
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, '..', 'drizzle', '0009_stripe_accounts.sql');
const sql = readFileSync(sqlPath, 'utf-8');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const db = neon(connectionString);

async function run() {
  const lines = sql.split('\n').filter((line) => !line.trim().startsWith('--'));
  const fullSql = lines.join('\n').trim();
  const statements = fullSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const statement of statements) {
    await db(statement + ';');
    console.log('Ran:', statement.slice(0, 80) + (statement.length > 80 ? '...' : ''));
  }
  console.log('Migration 0009 done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
