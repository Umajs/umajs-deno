import * as Koa from 'koa';

import Result from '../core/Result';
import { IContext } from '../typings/IContext';
import TypeHelper from '../utils/TypeHelper';

export interface IProceedJoinPoint<T = any> {
    target: T;
    args: Array<any>;
    proceed(...props: any[]): Promise<Result>;
}

/**
 * 将中间件转成切面 around 方法
 * @param middleware 中间件
 * eg:
    const around = middlewareToAround((ctx, next) => {
        console.log('》》', ctx.request.path);
        return next();
    });
    @Around(around)
 */
export function middlewareToAround(middleware: (Koa.Middleware<any, IContext>)) {
    return ({ target, proceed, args }: IProceedJoinPoint): Promise<Result> => middleware(target.ctx, () => proceed(...args));
}

export function Around(around: (point: IProceedJoinPoint) => Promise<Result>): Function {
    if (!TypeHelper.isFunction(around)) throw new Error('Around param must be Function.');

    return function aroundDecorator(target: Function, methodName: string, desc: PropertyDescriptor): PropertyDescriptor {
        if (!methodName) {
            Reflect.ownKeys(target.prototype).forEach((method: string) => {
                if (method === 'constructor') return;

                const aroundMethod = aroundDecorator(target, method, Reflect.getOwnPropertyDescriptor(target.prototype, method));

                Reflect.defineProperty(target.prototype, method, aroundMethod);
            });

            return;
        }

        const { value: method, configurable, enumerable } = desc;

        return {
            configurable,
            enumerable,
            writable: true,
            value: function aspect(...args: any[]) {
                const proceed = (...proceedArgs: any[]) => Reflect.apply(method, this, proceedArgs.length ? proceedArgs : args);

                return Reflect.apply(around, this, [{ target: this, args, proceed }]);
            },
        };
    };
}
