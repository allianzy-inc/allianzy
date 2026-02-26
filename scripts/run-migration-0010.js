/**
 * Run drizzle/0010_billing_domain.sql (Billing Domain tables)
 * Usage: node scripts/run-migration-0010.js
 */
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, '..', 'drizzle', '0010_billing_domain.sql');
const sql = readFileSync(sqlPath, 'utf-8');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const db = neon(connectionString);

function splitStatements(fullSql) {
  const statements = [];
  let current = '';
  let inDoBlock = false;
  const lines = fullSql.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('--')) continue;
    current += (current ? '\n' : '') + line;
    if (t.includes('DO $$')) inDoBlock = true;
    if (inDoBlock && t.endsWith('END $$;')) {
      inDoBlock = false;
      statements.push(current.trim());
      current = '';
    } else if (!inDoBlock && t.endsWith(';')) {
      statements.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) statements.push(current.trim());
  return statements.filter(Boolean);
}

async function run() {
  const lines = sql.split('\n').filter((line) => !line.trim().startsWith('--'));
  const fullSql = lines.join('\n').trim();
  const statements = splitStatements(fullSql);
  for (const st of statements) {
    await db(st);
    const preview = st.slice(0, 60).replace(/\s+/g, ' ');
    console.log('Ran:', preview + (st.length > 60 ? '...' : ''));
  }
  console.log('Migration 0010 (billing domain) done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
