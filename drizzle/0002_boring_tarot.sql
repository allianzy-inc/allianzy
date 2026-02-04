CREATE TABLE "case_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" integer,
	"user_id" integer,
	"author_name" text,
	"subject" text,
	"content" text NOT NULL,
	"files" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"logo" text,
	"phone" text,
	"email" text,
	"website" text,
	"region" text,
	"timezone" text,
	"address" jsonb,
	"registration_details" jsonb,
	"workspace_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"message" text,
	"type" text DEFAULT 'info',
	"link" text,
	"read" boolean DEFAULT false,
	"archived" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_payments" (
	"project_id" integer NOT NULL,
	"payment_id" integer NOT NULL,
	CONSTRAINT "project_payments_project_id_payment_id_pk" PRIMARY KEY("project_id","payment_id")
);
--> statement-breakpoint
CREATE TABLE "proposal_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"proposal_id" integer,
	"user_id" integer,
	"author_name" text,
	"subject" text,
	"content" text NOT NULL,
	"files" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "request_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer,
	"user_id" integer,
	"author_name" text,
	"subject" text,
	"content" text NOT NULL,
	"files" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"client_id" integer,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'pending',
	"files" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "requirement_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"requirement_id" integer,
	"user_id" integer,
	"author_name" text,
	"subject" text,
	"content" text NOT NULL,
	"files" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subservices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'Active',
	"price" text,
	"service_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"company_id" integer,
	"role" text DEFAULT 'member',
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cases" DROP CONSTRAINT "cases_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "project_milestones" DROP CONSTRAINT "project_milestones_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "cases" ALTER COLUMN "status" SET DEFAULT 'open';--> statement-breakpoint
ALTER TABLE "cases" ADD COLUMN "client_id" integer;--> statement-breakpoint
ALTER TABLE "cases" ADD COLUMN "assigned_to" integer;--> statement-breakpoint
ALTER TABLE "cases" ADD COLUMN "subject" text;--> statement-breakpoint
ALTER TABLE "cases" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "cases" ADD COLUMN "files" jsonb;--> statement-breakpoint
ALTER TABLE "cases" ADD COLUMN "closed_at" timestamp;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "document_url" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "amount_original" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "currency_original" char(3);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "exchange_rate" numeric(14, 6);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "amount_usd" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "provider_payment_id" text;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "provider" text DEFAULT 'Allianzy';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "client_id" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "links" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "project_proposals" ADD COLUMN "files" jsonb;--> statement-breakpoint
ALTER TABLE "requirements" ADD COLUMN "files" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "addresses" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_logo" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_links" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "job_title" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "identification" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "case_comments" ADD CONSTRAINT "case_comments_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_comments" ADD CONSTRAINT "case_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_payments" ADD CONSTRAINT "project_payments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_payments" ADD CONSTRAINT "project_payments_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposal_comments" ADD CONSTRAINT "proposal_comments_proposal_id_project_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."project_proposals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposal_comments" ADD CONSTRAINT "proposal_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_comments" ADD CONSTRAINT "request_comments_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_comments" ADD CONSTRAINT "request_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_comments" ADD CONSTRAINT "requirement_comments_requirement_id_requirements_id_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."requirements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_comments" ADD CONSTRAINT "requirement_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subservices" ADD CONSTRAINT "subservices_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_companies" ADD CONSTRAINT "user_companies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_companies" ADD CONSTRAINT "user_companies_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "case_comments_case_id_idx" ON "case_comments" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "proposal_comments_proposal_id_idx" ON "proposal_comments" USING btree ("proposal_id");--> statement-breakpoint
CREATE INDEX "request_comments_request_id_idx" ON "request_comments" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "requirement_comments_requirement_id_idx" ON "requirement_comments" USING btree ("requirement_id");--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" DROP COLUMN "workspace_id";--> statement-breakpoint
ALTER TABLE "requirements" DROP COLUMN "document_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";