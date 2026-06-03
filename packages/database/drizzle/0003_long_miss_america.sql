CREATE TYPE "public"."field_type_enum" AS ENUM('TEXT', 'NUMBER', 'EMAIL', 'DATE', 'YES_NO', 'PASSWORD');--> statement-breakpoint
CREATE TABLE "forms_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_Id" uuid,
	"label" varchar(100) NOT NULL,
	"label_key" varchar(100) NOT NULL,
	"description" text,
	"placeholder" text,
	"type" "field_type_enum" NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"index" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "forms_fields_index_form_Id_unique" UNIQUE("index","form_Id")
);
--> statement-breakpoint
ALTER TABLE "forms_fields" ADD CONSTRAINT "forms_fields_form_Id_forms_id_fk" FOREIGN KEY ("form_Id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;