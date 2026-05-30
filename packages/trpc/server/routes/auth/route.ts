import { signinUserWithEmailAndPasswordInput } from "@repo/services/user/model"
import { userService } from "../../services"
import {publicProcedure, router} from "../../trpc"
import { setAuthenticationToken } from "../../utils/cookie"
import {generatePath} from "../../utils/path-generator"
import { createUserWithEmailAndPasswordInput, createUserWithEmailAndPasswordOutput, signinWithEmailAndPasswordInputModel, signinWithEmailAndPasswordOutputModel } from "./model"

const TAGS = ["Authentication"]
const getPath = generatePath("/authentication")

export const authRouter = router({
    createUserWithEmailAndPassword: publicProcedure.meta({
        openapi: {
            method: 'POST',
            path: getPath('/createUserWithEmailAndPassword'),
            tags: TAGS,
        }, 
    }).input(createUserWithEmailAndPasswordInput).output(createUserWithEmailAndPasswordOutput)
    .mutation( async ({input, ctx})=>{
        const {fullName, email, password} = input

        const {id, token} = await userService.createUserWithEmailAndPassword({
            fullName, email, password
        })

        setAuthenticationToken(ctx, token);
        return {id}
    }),
    signinUserWithEmailAndPassword: publicProcedure.meta({
        openapi:{
            method: 'POST',
            path: getPath('/signinWithEmailAndPassword'),
            tags: TAGS
        }
    })
    .input(signinWithEmailAndPasswordInputModel)
    .output(signinWithEmailAndPasswordOutputModel)
    .mutation(async ({input, ctx}) => {
        const {email, password} = input
        const {id, token} = await userService.signinUserWithEmailAndPassword({
            email, password
        })

        setAuthenticationToken(ctx, token);
        return {
            id
        }
    })
})