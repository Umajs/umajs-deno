import { Koa } from '../node-to-deno/koa.ts';
import { pathToRegexp, Key } from 'https://deno.land/x/path_to_regexp@v6.2.0/index.ts';

import { loadDir, replaceTailSlash } from './utils/index.ts';
import controllerInfo from './utils/ControllerInfo.ts';
import Require from './utils/Require.ts';
import { callMethod } from './utils/callMethod.ts';

import { TPathInfo } from './typings/TPathInfo.ts';
import { IContext } from './typings/IContext.ts';
import { context } from './extends/Context.ts';
import { response } from './extends/Response.ts';
import { request } from './extends/Request.ts';
import expansion from './extends/index.ts';

export async function Router({ ROOT, app }: {
    ROOT: string,
    app: Koa,
}) {
    const fileArr: string[] = [];
    loadDir(ROOT, fileArr, ['views', 'static']);
    await Promise.all(fileArr.map(async (filePath) => await Require.default(filePath)));

    const StaticRouterMap: Map<String, TPathInfo> = new Map();
    const RegexpRouterMap: Map<RegExp, TPathInfo> = new Map();
    const RoutePathSet: Set<string> = new Set();

    for (const info of controllerInfo.getControllersInfo()) {
        const { clazz, root = '', methodMap } = info;

        if (!methodMap) continue;

        for (const [methodName, methodInfo] of methodMap) {
            const { paths } = methodInfo;

            paths!.forEach(({ path: p, methodTypes }) => {
                const routePath = replaceTailSlash(root + p) || '/';

                if (RoutePathSet.has(routePath)) return console.log(`[URL NOT UNIQUE] ${routePath}`);
                console.log(`[URL]${routePath}`);
                RoutePathSet.add(routePath);

                if (p!.indexOf(':') > -1 || p!.indexOf('(') > -1) {
                    const keys: Key[] = [];
                    const pathReg = pathToRegexp(routePath, keys);

                    RegexpRouterMap.set(pathReg, { clazz, keys, routePath, methodTypes, methodName });
                } else {
                    StaticRouterMap.set(routePath, { clazz, routePath, methodTypes, methodName });
                }
            });
        }
    }

    function MatchRegexp(reqPath: string) {
        for (const [reg, { clazz, methodName, keys, methodTypes }] of RegexpRouterMap) {
            const result = reg.exec(reqPath);

            if (result) {
                // mixin keys and params
                const params: any = {};
                const paramArr = result.slice(1);

                keys!.forEach((k, i) => {
                    params[k.name] = paramArr[i];
                });

                return { clazz, methodName, params, methodTypes };
            }
        }

        return false;
    }

    return (ctx: IContext, next: Function) => {
        app.context = ctx;
        expansion(app, { context, request, response });

        const { method: methodType } = ctx.request;
        const reqPath = replaceTailSlash(ctx.request.url.pathname) || '/';

        const staticResult = StaticRouterMap.get(reqPath);

        if (staticResult && (!staticResult.methodTypes || staticResult.methodTypes.indexOf(methodType) > -1)) {
            const { clazz, methodName } = staticResult;

            return callMethod(clazz!, methodName!, {}, ctx, next);
        }

        const regexpResult = MatchRegexp(reqPath);

        if (regexpResult && (!regexpResult.methodTypes || regexpResult.methodTypes.indexOf(methodType) > -1)) {
            const { clazz, methodName, params = {} } = regexpResult;

            return callMethod(clazz!, methodName!, params, ctx, next);
        }

        return next();
    };
}
