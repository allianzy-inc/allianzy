
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { requirements, projects } from './schema';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function seedRequirements() {
    console.log('Seeding requirements...');

    try {
        // Get the first project
        const projectData = await db.select().from(projects).limit(1);
        
        if (projectData.length === 0) {
            console.log('No projects found. Please seed projects first.');
            return;
        }

        const projectId = projectData[0].id;

        const newRequirements = [
            {
                title: 'Brief de Diseño',
                description: 'Documento detallado con los requisitos de diseño y referencias visuales.',
                status: 'pending',
                documentUrl: 'https://docs.google.com/document/d/123456789/edit',
                projectId,
                createdAt: new Date('2023-10-25T10:00:00')
            },
            {
                title: 'Credenciales de Acceso',
                description: 'Accesos a redes sociales y cuentas publicitarias.',
                status: 'approved',
                documentUrl: 'https://docs.google.com/spreadsheets/d/987654321/edit',
                projectId,
                createdAt: new Date('2023-10-26T14:30:00')
            },
            {
                title: 'Assets Gráficos',
                description: 'Logos, tipografías y manual de marca.',
                status: 'pending',
                documentUrl: 'https://drive.google.com/drive/folders/abcdefg',
                projectId,
                createdAt: new Date('2023-10-27T09:15:00')
            }
        ];

        for (const req of newRequirements) {
            await db.insert(requirements).values(req);
        }

        console.log('Requirements seeded successfully!');
    } catch (error) {
        console.error('Error seeding requirements:', error);
    }
}

seedRequirements();
