import { Koa, Middleware } from '../../node-to-deno/koa.ts';

import { Around, IProceedJoinPoint, middlewareToAround, IContext } from "../../mod.ts";
/**
 * 封装中间件装饰器
 * @param middleware 中间件
 */
export function Middleware(middleware: Middleware<any, IContext>) {
    return Around(middlewareToAround(middleware));
}

/**
 * 切面 Around 方法
 * @param point IProceedJoinPoint
 */
export const test = async (point: IProceedJoinPoint) => {
    console.log('----around before----')

    const { proceed, args } = point;
    const result = await proceed(args);

    console.log('----around after----')

    return result;
};

/**
 * 切面 Around 方法
 * @param point IProceedJoinPoint
 */
export const test1 = async (point: IProceedJoinPoint) => {
    console.log('>>>>around before>>>>')

    const { proceed, args } = point;
    const result = await proceed(args);

    console.log('>>>>around after>>>>')

    return result;
};
