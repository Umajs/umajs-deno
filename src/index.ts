import * as path from 'path';
import * as pathToRegexp from 'path-to-regexp';

import Controller from './Controller';
import router, { ClazzMap } from './Router';
import { readControllerDir, ControllerMap, Inside, SetController } from './ControllerHelper';
import { getConfig, setConfig } from './Config';
import { Path, StaticMap, RouteMap } from './Path';
import { Before, After } from './AOP';
import RequestMethod from './RequestMethod';
import log from './log';
import { IControllerInfo, IMethodInfo, IPathInfo } from './type';

const Router = (cfg = {}) => {
    setConfig(cfg);

    const {
        controllerRoot,
        routers = [],
    } = getConfig();

    readControllerDir(path.resolve(controllerRoot, 'controller'));

    for (const [clazz, clazzInfo] of ControllerMap) {
        ClazzMap.set(clazzInfo.clazzName, { clazz, ...clazzInfo });
    }

    // 配置路由
    for (const [routes, url] of routers) {
        const [, clazzName, , methodName] = url.split('/');
        if (!clazzName || !methodName) return;

        const { clazz }: any = ClazzMap.get(clazzName) || {};
        if (!clazz || Reflect.get(clazz, methodName)) return;

        SetController(clazz, methodName, { inside: true });
        for (const route of routes) {
            StaticMap.set(route, { clazz, methodName });
        }
    }

    const mps = [...StaticMap.keys()];
    for (const mp of mps) {
        const { clazz, methodName } = StaticMap.get(mp);

        const clazzInfo: IControllerInfo = ControllerMap.get(clazz) || {};
        const methodMap: Map<string, IMethodInfo> = clazzInfo.methodMap || new Map();
        const { inside = false } = methodMap.get(methodName) || {};
        const { rootPath = '' } = clazzInfo;

        const pathInfo: IPathInfo = { clazz, methodName, inside };
        const methodPath = rootPath + mp;
        if (mp.indexOf(':') > -1) {
            const keys = [];
            pathInfo.keys = keys;
            RouteMap.set(pathToRegexp(methodPath, keys), pathInfo);
        } else {
            StaticMap.set(methodPath, pathInfo);
        }

        StaticMap.delete(mp);
    }

    log('ControllerMap', ControllerMap);
    log('StaticMap', StaticMap);
    log('RouteMap', RouteMap);

    return router;
};

export {
    Path,
    Router,
    Before,
    After,
    Inside,
    RequestMethod,
    Controller,
};
