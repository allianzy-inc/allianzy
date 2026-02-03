
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

async function updateCasesSchema() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    const client = neon(connectionString);
    const db = drizzle(client);

    try {
        console.log('Updating cases table schema...');
        
        // Add files column
        await db.execute(sql`
            ALTER TABLE cases 
            ADD COLUMN IF NOT EXISTS files jsonb;
        `);
        console.log('✅ files column added to cases');

        // Add closed_at column
        await db.execute(sql`
            ALTER TABLE cases 
            ADD COLUMN IF NOT EXISTS closed_at timestamp;
        `);
        console.log('✅ closed_at column added to cases');

        // Create case_comments table
        console.log('Creating case_comments table...');
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS case_comments (
                id serial PRIMARY KEY,
                case_id integer REFERENCES cases(id) ON DELETE CASCADE,
                user_id integer REFERENCES users(id),
                author_name text,
                content text NOT NULL,
                files jsonb,
                created_at timestamp DEFAULT now()
            );
        `);
        console.log('✅ case_comments table created');

    } catch (e) {
        console.error('❌ Error updating schema:', e);
    }
}

updateCasesSchema();
