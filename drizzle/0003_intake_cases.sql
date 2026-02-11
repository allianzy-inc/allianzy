CREATE TABLE "intake_cases" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"score" integer,
	"answers_json" jsonb,
	"anonymous_token" text NOT NULL,
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "intake_case_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" integer,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"company" text NOT NULL,
	"role_title" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "intake_cases" ADD CONSTRAINT "intake_cases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "intake_case_contacts" ADD CONSTRAINT "intake_case_contacts_case_id_intake_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."intake_cases"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "intake_cases_workspace_idx" ON "intake_cases" USING btree ("workspace");
--> statement-breakpoint
CREATE INDEX "intake_cases_status_idx" ON "intake_cases" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "intake_cases_token_idx" ON "intake_cases" USING btree ("anonymous_token");
--> statement-breakpoint
CREATE INDEX "intake_case_contacts_case_id_idx" ON "intake_case_contacts" USING btree ("case_id");
--> statement-breakpoint
CREATE INDEX "intake_case_contacts_email_idx" ON "intake_case_contacts" USING btree ("email");

