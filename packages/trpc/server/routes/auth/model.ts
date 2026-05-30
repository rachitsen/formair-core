import {z} from "zod"


export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.email().describe("Email of the user"),
    password: z.string().describe("Password of the user")
})


export const createUserWithEmailAndPasswordOutput = z.object({
    id: z.string().describe("ID of the user"),
})

export const signinWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe("Email of the user"),
    password: z.string().describe("Password of the user")
})

export const signinWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("ID of the user"),
})