import { Koa, Middleware } from "../../node-to-deno/koa.ts";
import BaseController from "../core/BaseController.ts";

import Result from "../core/Result.ts";
import { IContext } from "../typings/IContext.ts";
import { throwError } from "../utils/index.ts";
import TypeHelper from "../utils/TypeHelper.ts";

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
export function middlewareToAround(middleware: (Middleware<any, IContext>)) {
  return ({ target, proceed, args }: IProceedJoinPoint): Promise<Result> =>
    new Promise((resolve, reject) => {
      middleware(target.ctx, async () => {
        try {
          const result = await proceed(...args);

          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
}

export function Around(
  around: (point: IProceedJoinPoint) => Promise<Result>,
): Function {
  if (!TypeHelper.isFunction(around)) {
    throw new Error("@Around param must be Function.");
  }

  return function aroundDecorator(
    target: Function,
    methodName: string,
    desc: PropertyDescriptor,
  ): undefined | PropertyDescriptor {
    if (!methodName) {
      Reflect.ownKeys(target.prototype).forEach((method: any) => {
        if (method === "constructor") return;

        const aroundMethod = <PropertyDescriptor> aroundDecorator(
          target.prototype,
          method,
          <PropertyDescriptor> Reflect.getOwnPropertyDescriptor(
            target.prototype,
            method,
          ),
        );

        Reflect.defineProperty(target.prototype, method, aroundMethod);
      });

      return;
    }

    throwError(
      !(target instanceof BaseController),
      "@Around only use on class extends BaseController.",
    );

    const { value: method, configurable, enumerable } = desc;

    return {
      configurable,
      enumerable,
      writable: true,
      value: async function aspect(...args: any[]) {
        const proceed = (...proceedArgs: any[]) =>
          Reflect.apply(method, this, proceedArgs.length ? proceedArgs : args);

        return await Promise.resolve(
          Reflect.apply(around, this, [{ target: this, args, proceed }]),
        );
      },
    };
  };
}

/**
 * 封装中间件装饰器
 * @param middleware 中间件
 */
export function Middleware(middleware: Middleware<any, IContext>) {
  return Around(middlewareToAround(middleware));
}
