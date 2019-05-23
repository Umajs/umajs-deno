import * as fs from 'fs';
import * as path from 'path';

import { requireDefault } from './utils';

export const AopMap: Map<string, Function> = new Map();

export function LoadAop(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.resolve(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            return LoadAop(filePath);
        }

        const aopName = file.split('.')[0];
        const aopFn: Function = requireDefault(filePath);

        AopMap.set(aopName, aopFn);
    }
}

/* 写入到 ControllerMap 中 */
function defineNewProperty(clazz: Function, methodName: string, method: Function) {
    const oldMethod = Reflect.get(clazz.prototype, methodName);
    Reflect.defineProperty(clazz.prototype, methodName, {
        writable: true,
        value: async function fn(...props: any[]) {
            if (oldMethod) {
                const result = await Promise.resolve(Reflect.apply(oldMethod, this, props));
                if (methodName === '__before' && result === false) return;
            }
            return method.apply(this, props);
        },
    });
}

export function Before(aopName?: string): Function {
    return function _before(target: Function, methodName: string, desc: PropertyDescriptor) {
        if (!methodName || !desc) {
            return defineNewProperty(target, '__before', AopMap.get(aopName));
        }

        const { value, configurable, enumerable } = desc;
        return {
            configurable,
            enumerable,
            writable: true,
            value: async function before(...props: any[]) {
                const beforeResult = await Promise.resolve(Reflect.apply(AopMap.get(aopName), this, []));
                if (beforeResult === false) return;
                return value.apply(this, props);
            },
        };
    };
}

export function After(aopName?: string): Function {
    return function _after(target: Function, methodName: string, desc: PropertyDescriptor) {
        if (!methodName || !desc) {
            return defineNewProperty(target, '__after', AopMap.get(aopName));
        }

        const { value, configurable, enumerable } = desc;
        return {
            configurable,
            enumerable,
            writable: true,
            value: async function after(...props: any[]) {
                await Promise.resolve(Reflect.apply(value, this, props));
                return AopMap.get(aopName).apply(this);
            },
        };
    };
}
