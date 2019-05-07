import * as fs from 'fs';
import * as path from 'path';

import { requireDefault } from './utils';

export const interceptors: any = {};

export default function LoadInterceptor(dirPath: string) {
    console.assert(fs.existsSync(dirPath), `controller file path is not exists, path:${dirPath}`);

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.resolve(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            return LoadInterceptor(filePath);
        }

        const clazzName = file.split('.')[0];
        const interceptor = requireDefault(filePath);

        Reflect.set(interceptors, clazzName, interceptor);
    }
}
