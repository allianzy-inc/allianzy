/**
 * Run drizzle/0014_provider_config_details.sql
 * Usage: node scripts/run-migration-0014.js
 */
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, '..', 'drizzle', '0014_provider_config_details.sql');
const sql = readFileSync(sqlPath, 'utf-8');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const db = neon(connectionString);

function splitStatements(fullSql) {
  return fullSql
    .split(/;\s*\n/)
    .map((s) => s.replace(/--[^\n]*/g, '').trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(';') ? s : s + ';'));
}

async function run() {
  const statements = splitStatements(sql);
  for (const st of statements) {
    if (!st.trim()) continue;
    try {
      await db(st);
      console.log('Ran:', st.slice(0, 70) + '...');
    } catch (err) {
      console.error('Statement failed:', st.slice(0, 80));
      throw err;
    }
  }
  console.log('Migration 0014 done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
