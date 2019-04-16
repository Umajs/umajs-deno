import Controller from './Controller';
import { StaticMap, MatchRegexp } from './Path';
import { IRoute } from './type';
import log from './log';

export const ClazzMap: Map<String, IRoute> = new Map();

async function callMethod(clazz: any, methodName: string, params: string[], ctx: any, next: Function) {
    const instance = Reflect.construct(clazz, []);
    if (!(instance instanceof Controller)) {
        throw new Error('controller must extends Controller, { Controller } = require(\'\')');
    }

    /* eslint-disable no-underscore-dangle */
    instance._ctx = { ctx, next };
    Reflect.defineProperty(instance, '_ctx', {});
    const { __before, __after } = instance;

    if (__before) {
        const beforeResult = await Promise.resolve(Reflect.apply(__before, instance, []));
        if (beforeResult === false) return;
    }

    const method = Reflect.get(instance, methodName);
    const methodResult = await Promise.resolve(Reflect.apply(method, instance, params));
    if (methodResult === false) return methodResult;

    if (__after) {
        await Promise.resolve(Reflect.apply(__after, instance, []));
    }

    return methodResult;
}

export default async function Router(ctx: any, next: Function) {
    try {
        const reqPath = ctx.request.path;
        log('request path', reqPath);

        // static
        const staticResult = StaticMap.get(reqPath);
        if (staticResult) {
            const { clazz, methodName } = staticResult;
            return await callMethod(clazz, methodName, [], ctx, next);
        }

        // regexp
        const regexpResult = MatchRegexp(reqPath);
        if (regexpResult) {
            const { clazz, methodName, params = [] } = regexpResult;
            return await callMethod(clazz, methodName, params, ctx, next);
        }

        // default
        const url = reqPath.slice(1);
        const pathArr: string[] = url ? url.split('/') : [];
        const [clazzName = 'index', methodName = 'index', ...params] = pathArr;
        if (methodName.indexOf('_') > -1) return next();

        const routeInfo: IRoute = ClazzMap.get(clazzName);
        if (!routeInfo) return next();

        const { clazz, pathMethodNames } = routeInfo;

        // controller must be have method and not configuration path
        if (!~Reflect.ownKeys(clazz.prototype).indexOf(methodName)
            || ~pathMethodNames.indexOf(methodName)) return next();

        return await callMethod(clazz, methodName, params, ctx, next);
    } catch (err) {
        ctx.app.emit('error', err, ctx);
    }
}
