import * as Koa from 'koa';

import { Around, IProceedJoinPoint, middlewareToAround } from "../../src/decorators/Around";
import { IContext } from "../../src/typings/IContext";
/**
 * 封装中间件装饰器
 * @param middleware 中间件
 */
export function Middleware(middleware: Koa.Middleware<any, IContext>) {
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
