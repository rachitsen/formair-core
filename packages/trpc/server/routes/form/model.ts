import {z} from "zod"

export const createFormInputModel = z.object({
    title: z.string().max(55).describe("Title for form"),
    description: z.string().max(255).describe("Description of the form").optional()
})

export const createFormOutputModel = z.object({
    id: z.string().describe("ID of the created form")
})

export const listFormsOutputModel = z.array(z.object({
    id: z.string().describe("ID of the form"),
    title: z.string().max(55).describe("Title for form"),
    description: z.string().max(255).describe("Description of the form").nullable().optional(),
    createdAt: z.date().nullable().describe("Timestamp of form creation"),
    updatedAt: z.date().nullable().describe("Timestamp of last form update"),
})
)
