import type {CookieOptions, Response, Request} from 'express';
import { TRPCContext } from '../context';

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

const defaultCookieOptions: CookieOptions = {
    path:'/',
    httpOnly:true,
    secure:false,
    sameSite:"strict",
    maxAge: ONE_YEAR
}
export function createCookieFactory(res: Response){
    return function createCookie(name: string, value: string, opts: CookieOptions = defaultCookieOptions){
        res.cookie(name, value, opts);
    }
}

export function getCookieFactory(req: Request){
    return function getCookie(name: string){
        return req.cookies?.[name]
    }
}

export function clearCookieFactory(res: Response){
    return function clearCookie(name: string){
       res.clearCookie(name);
    }
}


//Authentication Cookie

const AUTHENTICATION_COOKIE_NAME = 'authentication-token';

export function setAuthenticationToken(ctx: TRPCContext, accessToken: string){
    ctx.createCookie(AUTHENTICATION_COOKIE_NAME, accessToken)
}

export function getAuthenticationToken(ctx: TRPCContext){
    return ctx.getCookie(AUTHENTICATION_COOKIE_NAME)
}

export function clearAuthenticationToken(ctx: TRPCContext){
     ctx.clearCookie(AUTHENTICATION_COOKIE_NAME)
}