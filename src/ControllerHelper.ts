import * as fs from 'fs';
import * as path from 'path';

import { ControllerMatch, requireDefault } from './utils';
import { IControllerInfo, IHelper } from './type';

// ControllerMap
export const ControllerMap: Map<Function, IControllerInfo> = new Map();

/**
 * methodType 是否一致
 * @param clazz class
 * @param methodName method
 * @param methodType type
 */
export function MergeMethodType(clazz: Function, methodName: string, methodType: string) {
    const { methodMap } = ControllerMap.get(clazz);
    if (!methodMap) return true;

    const { methodType: mt } = methodMap.get(methodName);
    if (!mt) return true;

    return mt === methodType;
}

export function readControllerDir(dirPath: string) {
    console.assert(fs.existsSync(dirPath), `controller file path is not exists, path:${dirPath}`);

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        console.log(file);
        const filePath = path.resolve(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            return readControllerDir(filePath);
        }

        const controllerResult = ControllerMatch(filePath);
        if (!controllerResult) return;

        const clazzName = controllerResult[1].toLowerCase();

        // No same name
        const clazz = requireDefault(filePath);
        SetController(clazz, null, { clazzName });
    }
}

export function SetController(clazz: Function, methodName: string, info: IHelper = {}) {
    const clazzInfo: IControllerInfo = ControllerMap.get(clazz) || {};
    const { methodMap = new Map() } = clazzInfo;

    const { rootPath, clazzName, path: mpath, inside, methodType } = info;
    if (clazzName) clazzInfo.clazzName = clazzName;
    if (rootPath) clazzInfo.rootPath = rootPath;

    const methodInfo = methodMap.get(methodName) || {};
    methodInfo.inside = inside || false;
    if (mpath) methodInfo.path = mpath;
    if (methodType) methodInfo.methodType = methodType;

    methodMap.set(methodName, methodInfo);
    clazzInfo.methodMap = methodMap;
    ControllerMap.set(clazz, clazzInfo);
}

export function Inside(target: any, methodName: string) {
    SetController(target.constructor, methodName, { inside: true });
}
