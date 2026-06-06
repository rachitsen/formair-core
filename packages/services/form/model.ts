import {z} from "zod";
import { getFieldInputType } from "../form-field/model";

export const createFormInput = z.object({
    title: z.string().max(55).describe("Title of the form"),
    description: z.string().max(250).describe("Description of the form").optional(),
    createdBy: z.string().uuid().describe("ID of the user who created the form"),
})

export type createFormInputType = z.infer<typeof createFormInput>


export const listFormsByUserIdInput = z.object({
    userId: z.string().uuid().describe("ID of the user whose forms to list"),
})

export type listFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>

export const getFormByIdInput = z.object({
    formId:  z.string().uuid().describe('UUID of the form'),
})

export type getFormByIdInputType = z.infer<typeof getFormByIdInput>