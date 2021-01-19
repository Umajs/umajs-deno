import { IProceedJoinPoint } from "../../mod.ts";

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
