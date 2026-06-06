CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"formId" uuid,
	"fieldId" uuid,
	"values" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_formId_forms_id_fk" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_fieldId_forms_fields_id_fk" FOREIGN KEY ("fieldId") REFERENCES "public"."forms_fields"("id") ON DELETE no action ON UPDATE no action;