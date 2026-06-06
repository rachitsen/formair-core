import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  json,
} from "drizzle-orm/pg-core";

import { formsTable } from "./form";
import { formsfieldsTable } from "./form-fields";

export interface FormSubmissionValue {
    formFieldId: string,
    value: string
}

export type FormSubmissionValueRow = FormSubmissionValue[]

export const formSubmissionsTable = pgTable("form_submissions",{
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("formId").references(() => formsTable.id),
    fieldId: uuid("fieldId").references(() => formsfieldsTable.id),
    value: json('values').$type<FormSubmissionValueRow>(),
    createdAt: timestamp("created_at").defaultNow(),
})