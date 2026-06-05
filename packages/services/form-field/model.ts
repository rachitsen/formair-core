import {z} from 'zod';

const fieldTypeEnum = z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD', 'DATE'])

export const createFieldInput = z.object({
    label:z.string().max(100).describe("Label of the form field"),
    type: fieldTypeEnum.describe("Type of field"),
    formId: z.string().uuid().describe("UUID of the form"),
    description: z.string().optional().describe("Description of the form field"),
    placeholder: z.string().optional().describe("Placeholder of the form field"),
    isRequired: z.boolean().optional().default(false).describe("Whether the field is required or not")
})

export type createFieldInputType = z.infer<typeof createFieldInput>

export const updateFieldInput = z.object({
    label:z.string().max(100).describe("Label of the form field").optional(),
    type: fieldTypeEnum.describe("Type of field").optional(),
    fieldId: z.string().uuid().describe("UUID of the form field"),
    description: z.string().nullable().optional().describe("Description of the form field"),
    placeholder: z.string().nullable().optional().describe("Placeholder of the form field"),
    isRequired: z.boolean().optional().default(false).describe("Whether the field is required or not")
})

export type updateFieldInputType = z.infer<typeof updateFieldInput>

export const deleteFieldInput = z.object({
     fieldId: z.string().uuid().describe("UUID of the form field which need to be deleted"),
})

export type deleteFieldInputType = z.infer<typeof deleteFieldInput>

export const getFieldInput = z.object({
     formId: z.string().uuid().describe("UUID of the form "),
})

export type getFieldInputType = z.infer<typeof getFieldInput>