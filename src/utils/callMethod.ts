import Result from '../core/Result.ts';
import { IContext } from '../typings/IContext.ts';
import ControllerInfo from './ControllerInfo.ts';
import TypeHelper from './TypeHelper.ts';

export async function callMethod(clazz: Function, methodName: string, param: object, ctx: IContext, next: Function) {
    const clazzInfo = ControllerInfo.get(clazz);

    if (!clazzInfo) return next();

    const { name, methodMap = new Map() } = clazzInfo;
    const methodInfo = methodMap.get(methodName);

    if (!methodInfo) return next();

    const instance = Reflect.construct(clazz, [ctx]);
    const method = Reflect.get(instance, methodName);

    if (!methodInfo || !TypeHelper.isFunction(method)) return next();

    const { args = [] } = methodInfo;
    const argsV: any[] = [];

    ctx.param = param;
    for (const { argDecorator, argProps, argIndex } of args) {
        const argVal = await Promise.resolve(argDecorator(ctx, ...argProps));

        if (argVal instanceof Result) return Result.finish(ctx, argVal);

        argsV[argIndex] = argVal;
    }

    const methodResult = await Promise.resolve(Reflect.apply(method, instance, argsV));

    if (methodResult instanceof Result) return Result.finish(ctx, methodResult);

    throw new Error(`[NOT_RETURN_RESULT] ${name}.${methodName} does not return result, e.g "Result.[view|json]()"`);
}
