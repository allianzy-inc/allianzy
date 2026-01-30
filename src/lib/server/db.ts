import { env } from '$env/dynamic/private';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = env.DATABASE_URL;

if (!connectionString) {
    console.warn('DATABASE_URL is not set. Database connection will not be available.');
}

const sql = neon(connectionString || 'postgresql://placeholder');
export const db = drizzle(sql, { schema });

