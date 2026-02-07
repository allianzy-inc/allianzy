
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './src/lib/server/schema';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function checkUser() {
    const email = 'f.daniel.g@icloud.com';
    const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email)
    });
    console.log('User found:', user);
    process.exit(0);
}

checkUser();
