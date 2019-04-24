import * as path from 'path';
import * as pathToRegexp from 'path-to-regexp';

import Controller from './Controller';
import router, { ClazzMap } from './Router';
import { readControllerDir, ControllerMap, Private } from './ControllerHelper';
import { getConfig, setConfig } from './Config';
import { Path, StaticMap, RouteMap } from './Path';
import { Before, After } from './AOP';
import log from './log';

const Router = (cfg = {}) => {
    setConfig(cfg);

    const {
        controllerRoot,
        routers = [],
    } = getConfig();

    readControllerDir(path.resolve(controllerRoot, 'controller'));

    for (const [clazz, { clazzName, pathMethodNames }] of ControllerMap) {
        ClazzMap.set(clazzName, { clazz, pathMethodNames });
    }

    for (const [routes, url] of routers) {
        const [, clazzName, , methodName] = url.split('/');
        if (!clazzName || !methodName) return;

        const { clazz }: any = ClazzMap.get(clazzName) || {};
        if (!clazz || Reflect.get(clazz, methodName)) return;

        const { pathMethodNames } = ControllerMap.get(clazz);
        pathMethodNames.push(methodName);
        ClazzMap.set(clazzName, {
            clazz,
            pathMethodNames,
        });
        for (const route of routes) {
            StaticMap.set(route, { clazz, methodName });
        }
    }

    const mps = [...StaticMap.keys()];
    for (const mp of mps) {
        const { clazz, methodName } = StaticMap.get(mp);

        const clazzInfo: any = ControllerMap.get(clazz) || {};
        const { rootPath = '' } = clazzInfo;

        const methodPath = rootPath + mp;
        if (mp.indexOf(':') > -1) {
            const keys = [];
            RouteMap.set(pathToRegexp(methodPath, keys), { clazz, methodName, keys });
        } else {
            StaticMap.set(methodPath, { clazz, methodName });
        }

        StaticMap.delete(mp);
    }

    log(StaticMap);
    log(RouteMap);

    return router;
};

export {
    Path,
    Router,
    Before,
    After,
    Private,
    Controller,
};
