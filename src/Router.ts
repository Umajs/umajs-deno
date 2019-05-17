import Controller from './Controller';
import { StaticMap, MatchRegexp } from './Path';
import log from './log';
import { IControllerInfo } from './type';
import { MergeMethodType, ControllerMap } from './ControllerHelper';

export const ClazzMap: Map<String, IControllerInfo> = new Map();

async function callMethod(clazz: any, methodName: string, params: string[], ctx: any, next: Function, methodType: string) {
    if (!MergeMethodType(clazz, methodName, methodType)) return next();

    const instance = Reflect.construct(clazz, [ctx, next]);
    if (!(instance instanceof Controller)) {
        throw new Error('controller must extends Controller, { Controller } = require(\'\')');
    }

    // 几次调用 ControllerMap，可以优化
    const { before, after } = ControllerMap.get(clazz);

    if (before) {
        const beforeResult = await Promise.resolve(Reflect.apply(before, instance, []));
        if (beforeResult === false) return;
    }

    const method = Reflect.get(instance, methodName);
    const methodResult = await Promise.resolve(Reflect.apply(method, instance, params));
    if (methodResult === false) return methodResult;

    if (after) {
        await Promise.resolve(Reflect.apply(after, instance, []));
    }

    return methodResult;
}

export default async function Router(ctx: any, next: Function) {
    const { path: reqPath, method } = ctx.request;
    log('request path', reqPath, method);

    // static
    const staticResult = StaticMap.get(reqPath);
    if (staticResult) {
        const { clazz, methodName } = staticResult;
        return await callMethod(clazz, methodName, [], ctx, next, method);
    }

    // regexp
    const regexpResult = MatchRegexp(reqPath);
    if (regexpResult) {
        const { clazz, methodName, params = [] } = regexpResult;
        return await callMethod(clazz, methodName, params, ctx, next, method);
    }

    // default
    const url = reqPath.slice(1);
    const pathArr: string[] = url ? url.split('/') : [];
    const [clazzName = 'index', methodName = 'index', ...params] = pathArr;
    if (methodName.indexOf('_') > -1) return next();

    const routeInfo: IControllerInfo = ClazzMap.get(clazzName);
    if (!routeInfo) return next();

    const { clazz, methodMap } = routeInfo;

    console.log('methodMap', methodMap.get(methodName));
    // controller must be have method and not configuration path
    if (!~Reflect.ownKeys(clazz.prototype).indexOf(methodName)
        || (methodMap.get(methodName) && methodMap.get(methodName).inside)) return next();

    return await callMethod(clazz, methodName, params, ctx, next, method);
}
