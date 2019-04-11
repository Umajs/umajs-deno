import * as fs from 'fs';
import * as path from 'path';

import { ControllerMatch, requireDefault } from './utils';
import { IControllerInfo } from './type';

// ControllerMap
export const ControllerMap: Map<Function, IControllerInfo> = new Map();

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

export function SetController(clazz: Function, methodName: string, { rootPath, clazzName }: IControllerInfo) {
    const clazzInfo: IControllerInfo = ControllerMap.get(clazz) || {
        pathMethodNames: [],
    };

    if (clazzName) clazzInfo.clazzName = clazzName;
    if (rootPath) clazzInfo.rootPath = rootPath;
    if (methodName && clazzInfo.pathMethodNames.indexOf(methodName) === -1) {
        clazzInfo.pathMethodNames.push(methodName);
    }

    ControllerMap.set(clazz, clazzInfo);
}
