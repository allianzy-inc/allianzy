-- Proyecto pertenece a una empresa; evita mezclar proyectos cuando el cliente tiene varias empresas.
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "company_id" integer REFERENCES "companies"("id") ON DELETE SET NULL;
