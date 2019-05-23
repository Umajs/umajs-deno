import * as fs from 'fs';
import * as path from 'path';

import { requireDefault } from './utils';
import log from './log';

const ResourceMap: Map<string, Function> = new Map();
const claszzArr = [];

export function loadResources(dirPath: string) {
    console.assert(fs.existsSync(dirPath), `controller file path is not exists, path:${dirPath}`);

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        log('resource', file);
        const filePath = path.resolve(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            loadResources(filePath);
        } else {
            const clazz = requireDefault(filePath);
            if (claszzArr.indexOf(clazz) > -1) {
                const name = file.split('.')[0];
                ResourceMap.set(name, Reflect.construct(clazz, []));
            }
        }
    }
}

export function Resource(...props: any[]): any {
    if (props.length !== 1) throw new Error('@Resource usage error! @Resource or @Resource(\'resourceName\')');

    if (typeof props[0] !== 'string') {
        claszzArr.push(props[0]);
        return;
    }

    return function resource(): any {
        return {
            get() {
                return ResourceMap.get(props[0]);
            },
        };
    };
}
