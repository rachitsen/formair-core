import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext, Context } from "./context";
import { getAuthenticationToken } from "./utils/cookie";
import { userService } from "./services";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure = tRPCContext.procedure.use(async options =>{
  const {ctx} = options
  const userToken = getAuthenticationToken(ctx);
  if(!userToken){
    throw new Error("User is not login")
  }

  const {id} = await userService.verifyAndDecodeUserToken(userToken);
  return options.next({
    
      ctx:{
        ...ctx,
        user:{
          id
        }
      }
    })
  })

