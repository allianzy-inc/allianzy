import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';

async function addFilesColumn() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    const client = neon(connectionString);
    const db = drizzle(client);

    try {
        console.log('Adding files column to requirements table...');
        await db.execute(sql`
            ALTER TABLE requirements 
            ADD COLUMN IF NOT EXISTS files jsonb;
        `);
        console.log('✅ files column added successfully!');
    } catch (e) {
        console.error('❌ Error adding files column:', e);
    }
}

addFilesColumn();
