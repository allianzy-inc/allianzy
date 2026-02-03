
import 'dotenv/config'; // Load .env file
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { users, companies, userCompanies } from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set in .env');
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function main() {
    console.log('Migrating user companies...');

    try {
        const allUsers = await db.select().from(users);

        for (const user of allUsers) {
            if (user.company) {
                console.log(`Processing user ${user.email} with company ${user.company}`);

                // Create company
                const [newCompany] = await db.insert(companies).values({
                    name: user.company,
                    logo: user.companyLogo,
                    workspaceId: user.workspaceId,
                }).returning();

                console.log(`Created company ${newCompany.name} (ID: ${newCompany.id})`);

                // Link user to company
                await db.insert(userCompanies).values({
                    userId: user.id,
                    companyId: newCompany.id,
                    role: 'owner',
                    isPrimary: true,
                });

                console.log(`Linked user ${user.id} to company ${newCompany.id}`);
            }
        }

        console.log('Migration complete.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
    
    process.exit(0);
}

main();
