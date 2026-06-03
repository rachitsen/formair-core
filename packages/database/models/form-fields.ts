import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique
} from "drizzle-orm/pg-core";
import { formsTable} from "./form";

export const fieldTypeEnum = pgEnum('field_type_enum', ['TEXT', 'NUMBER', 'EMAIL', 'DATE', 'YES_NO', 'PASSWORD'])

export const formsfieldsTable = pgTable("forms_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_Id").references(()=> formsTable.id),
  label: varchar("label", {length:100}).notNull(),
  labelKey: varchar("label_key", {length:100}).notNull(),
  description: text("description"),
  placeholder: text("placeholder"),
  type: fieldTypeEnum("type").notNull(),
  isRequired: boolean("is_required").default(false).notNull(),
  index: numeric("index", {scale: 2}).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table)=>{
    return {
        uniqueFormIdAndIndex: unique().on(table.index,table.formId)
    }
});

