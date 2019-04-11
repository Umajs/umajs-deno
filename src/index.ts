import * as path from 'path';
import * as pathToRegexp from 'path-to-regexp';

import Controller from './Controller';
import router, { ClazzMap } from './Router';
import { readControllerDir, ControllerMap } from './ControllerMap';
import { getConfig, setConfig } from './Config';
import { Path, StaticMap, RouteMap } from './Path';

const Router = (cfg = {}) => {
    setConfig(cfg);

    const {
        controllerRoot,
    } = getConfig();

    readControllerDir(path.resolve(controllerRoot, 'controller'));

    for (const [clazz, { clazzName, pathMethodNames }] of ControllerMap) {
        ClazzMap.set(clazzName, { clazz, pathMethodNames });
    }

    const mps = [...StaticMap.keys()];
    for (const mp of mps) {
        const { clazz, methodName } = StaticMap.get(mp);

        const clazzInfo: any = ControllerMap.get(clazz) || {};
        const { rootPath = '' } = clazzInfo;

        const methodPath = rootPath + mp;
        if (mp.indexOf(':') > -1) {
            RouteMap.set(pathToRegexp(methodPath), { clazz, methodName });
        } else {
            StaticMap.set(methodPath, { clazz, methodName });
        }

        StaticMap.delete(mp);
    }

    return router;
};

export {
    Path,
    Router,
    Controller,
};
