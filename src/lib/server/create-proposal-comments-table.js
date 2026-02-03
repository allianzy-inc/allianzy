import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const sql = neon(connectionString);

async function createTable() {
    console.log('Creating proposal_comments table...');
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "proposal_comments" (
                "id" serial PRIMARY KEY NOT NULL,
                "proposal_id" integer REFERENCES "project_proposals"("id") ON DELETE CASCADE,
                "user_id" integer REFERENCES "users"("id"),
                "author_name" text,
                "subject" text,
                "content" text NOT NULL,
                "files" jsonb,
                "created_at" timestamp DEFAULT now()
            );
        `;
        console.log('Table created successfully!');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

createTable();
