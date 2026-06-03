import {z} from "zod"

export const createFormInputModel = z.object({
    title: z.string().max(55).describe("Title for form"),
    description: z.string().max(255).describe("Description of the form").optional()
})

export const createFormOutputModel = z.object({
    id: z.string().describe("ID of the created form")
})