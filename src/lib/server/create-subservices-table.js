import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const sql = neon(connectionString);

async function createTable() {
    console.log('Creating subservices table...');
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "subservices" (
                "id" serial PRIMARY KEY NOT NULL,
                "name" text NOT NULL,
                "description" text,
                "status" text DEFAULT 'Active',
                "price" text,
                "service_id" integer REFERENCES "services"("id") ON DELETE CASCADE,
                "created_at" timestamp DEFAULT now()
            );
        `;
        console.log('Table subservices created successfully!');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

createTable();
