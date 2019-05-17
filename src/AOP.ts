import * as fs from 'fs';
import * as path from 'path';

import { SetController } from './ControllerHelper';
import { requireDefault } from './utils';

export const aops: any = {};

export function LoadAop(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.resolve(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            return LoadAop(filePath);
        }

        const clazzName = file.split('.')[0];
        const interceptor = requireDefault(filePath);

        Reflect.set(aops, clazzName, interceptor);
    }
}

/* 写入到 ControllerMap 中 */
function reDefineProperty(clazz: Function, methodName: string, newMethodName: string) {
    SetController(clazz.constructor, methodName, {
        inside: true,
        [newMethodName]: Reflect.get(clazz, methodName),
    });
}

export function Before(aopName?: string): Function {
    return function _before(target: Function, methodName: string, { value, configurable, enumerable }: PropertyDescriptor) {
        if (!aopName) {
            return reDefineProperty(target, methodName, 'before');
        }

        return {
            configurable,
            enumerable,
            writable: true,
            value: async function before(...props: any[]) {
                const beforeResult = await Promise.resolve(Reflect.apply(aops[aopName], this, []));
                if (beforeResult === false) return;
                return value.apply(this, props);
            },
        };
    };
}

export function After(aopName?: string): Function {
    return function _after(target: Function, methodName: string, { value, configurable, enumerable }: PropertyDescriptor) {
        if (!aopName) {
            return reDefineProperty(target, methodName, 'after');
        }

        return {
            configurable,
            enumerable,
            writable: true,
            value: async function after(...props: any[]) {
                await Promise.resolve(Reflect.apply(value, this, props));
                return aops[aopName].apply(this);
            },
        };
    };
}
