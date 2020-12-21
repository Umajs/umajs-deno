import { fs, path } from '../../node-to-deno/mod.ts';

import TypeHelper from './TypeHelper.ts';

export function throwError(condition: boolean, errerMsg: string) {
    if (condition) throw new Error(errerMsg);
}

/**
 * 混入目标，暂不考虑 Map & Set
 * @param target 目标
 * @param source 资源
 */
export function mixin(deep: boolean = false, target: any, ...sources: any[]) {
    if (!TypeHelper.isObject(target)) return target;

    for (const source of sources) {
        if (!TypeHelper.isObject(source)) continue;

        const keys = Reflect.ownKeys(source);

        for (const key of keys) {
            const descriptor: any = Reflect.getOwnPropertyDescriptor(source, key);
            const { get, set, value } = descriptor;

            if (get || set) {
                const desc: PropertyDescriptor = { configurable: true };

                if (get) desc.get = get;
                if (set) desc.set = set;

                Reflect.defineProperty(target, key, desc);
            } else if (Reflect.has(descriptor, 'value')) {
                Reflect.set(target, key, deep && TypeHelper.isObject(value) ? mixin(true, Reflect.get(target, key) || {}, value) : value);
            }
        }
    }

    return target;
}

/**
 * 加载目录
 * @param dirPath 文件夹地址
 * @param checkFn 加载方法
 */
export function loadDir(dirPath: string, fileArr: string[] = [], ignoreDirs: string[] = []) {
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.resolve(dirPath, file.name);

        if (file.isDirectory) {
            if (ignoreDirs.indexOf(file.name) === -1) {
                loadDir(filePath, fileArr, ignoreDirs);
            }
        } else {
            fileArr.push(filePath);
        }
    }
}

/**
 * replace tail '/'
 * @param url string
 */
export function replaceTailSlash(url: string) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}
