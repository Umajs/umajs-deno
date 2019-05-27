import * as pathToRegexp from 'path-to-regexp';

import Controller from './Controller';
import router, { ClazzMap } from './Router';
import { LoadControllers, ControllerMap, Private, SetController, controllers } from './ControllerHelper';
import { getConfig, setConfig } from './Config';
import { Path, StaticMap, RouteMap, PathMap } from './Path';
import { LoadAop, Before, After } from './AOP';
import RequestMethod from './RequestMethod';
import log from './log';
import { IControllerInfo, IMethodInfo, IPathInfo } from './type';
import { loadResources, Resource } from './Resource';

const Router = (cfg = {}) => {
    setConfig(cfg);

    const {
        controllerPath,
        resourcePath,
        aopPath,
        routers = [],
    } = getConfig();

    aopPath && LoadAop(aopPath);

    loadResources(resourcePath);

    LoadControllers(controllerPath);
    log('ControllerMap', ControllerMap);

    for (const [clazz, clazzInfo] of ControllerMap) {
        ClazzMap.set(clazzInfo.clazzName, { clazz, ...clazzInfo });
    }

    // 配置路由
    routers.forEach(([routes, url, methodType]) => {
        const [, clazzName, methodName] = url.split('/');
        if (!clazzName || !methodName) return;

        const { clazz }: any = ClazzMap.get(clazzName) || {};
        if (!clazz || Reflect.get(clazz, methodName)) return;

        SetController(clazz, methodName, { inside: true, methodType });
        for (const route of routes) {
            PathMap.set({ clazz, methodName, methodType }, route);
        }
    });

    for (const [{ clazz, methodName }, mp] of PathMap) {
        const clazzInfo: IControllerInfo = ControllerMap.get(clazz) || {};
        const methodMap: Map<string, IMethodInfo> = clazzInfo.methodMap || new Map();
        const { inside = false } = methodMap.get(methodName) || {};
        const { rootPath = '' } = clazzInfo;

        const pathInfo: IPathInfo = { clazz, methodName, inside };
        const methodPath = rootPath + mp;
        if (mp.indexOf(':') > -1 || mp.indexOf('(') > -1) {
            const keys = [];
            pathInfo.keys = keys;
            RouteMap.set(pathToRegexp(methodPath, keys), pathInfo);
        } else {
            StaticMap.set(methodPath, pathInfo);
        }

        StaticMap.delete(mp);
    }

    log('PathMap', PathMap);
    log('StaticMap', StaticMap);
    log('RouteMap', RouteMap);
    PathMap.clear();

    return router;
};

export {
    Path,
    Router,
    Before,
    After,
    Private,
    Resource,
    RequestMethod,
    Controller,
    controllers,
};
