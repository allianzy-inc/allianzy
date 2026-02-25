-- Limit of members per company (owner + admins + members). Null = unlimited.
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "member_limit" integer;
