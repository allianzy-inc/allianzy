
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

async function addFilesColumnToProposals() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    const client = neon(connectionString);
    const db = drizzle(client);

    try {
        console.log('Adding files column to project_proposals table...');
        await db.execute(sql`
            ALTER TABLE project_proposals 
            ADD COLUMN IF NOT EXISTS files jsonb;
        `);
        console.log('✅ files column added successfully to project_proposals!');
    } catch (e) {
        console.error('❌ Error adding files column:', e);
    }
}

addFilesColumnToProposals();
