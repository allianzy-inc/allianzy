
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}

const client = neon(connectionString);
const db = drizzle(client, { schema });

async function main() {
    console.log('Creating request_comments table...');

    try {
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS request_comments (
                id serial PRIMARY KEY,
                request_id integer REFERENCES requests(id) ON DELETE CASCADE,
                user_id integer REFERENCES users(id),
                author_name text,
                subject text,
                content text NOT NULL,
                files jsonb,
                created_at timestamp DEFAULT now()
            );
        `);
        console.log('Successfully created request_comments table.');
    } catch (error) {
        console.error('Error creating table:', error);
    }

    process.exit(0);
}

main();
