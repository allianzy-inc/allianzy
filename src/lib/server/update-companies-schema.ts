
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}

const client = neon(connectionString);
const db = drizzle(client);

async function main() {
    console.log('Updating schema for companies and user_companies...');

    try {
        console.log('Creating companies table...');
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS companies (
                id serial PRIMARY KEY,
                name text NOT NULL,
                description text,
                logo text,
                phone text,
                email text,
                website text,
                region text,
                timezone text,
                address jsonb,
                registration_details jsonb,
                workspace_id integer REFERENCES workspaces(id),
                created_at timestamp DEFAULT now(),
                updated_at timestamp DEFAULT now()
            );
        `);
        console.log('✅ companies table created');

        console.log('Ensuring companies.phone and companies.region columns exist...');
        await db.execute(sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone text`);
        await db.execute(sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS region text`);
        console.log('✅ phone and region columns OK');

        console.log('Creating user_companies table...');
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS user_companies (
                id serial PRIMARY KEY,
                user_id integer REFERENCES users(id) ON DELETE CASCADE,
                company_id integer REFERENCES companies(id) ON DELETE CASCADE,
                role text DEFAULT 'member',
                is_primary boolean DEFAULT false,
                created_at timestamp DEFAULT now()
            );
        `);
        console.log('✅ user_companies table created');

    } catch (error) {
        console.error('❌ Error updating schema:', error);
    }

    process.exit(0);
}

main();
