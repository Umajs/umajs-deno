import { IContext } from "../../mod.ts";

export const TestMiddleware = async (ctx: IContext, next: Function) => {
    console.log('====middleware before====')

    await next();

    console.log('====middleware after====')
}