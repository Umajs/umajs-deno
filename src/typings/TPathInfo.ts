import { Key } from 'https://deno.land/x/path_to_regexp@v6.2.0/index.ts';

export type TPathInfo = {
    // 文件名
    name?: string,

    // 方法名
    methodName?: string,

    // class 对象
    clazz?: Function,

    // methodPath匹配的param
    keys?: Key[];

    routePath?: string;

    methodTypes?: string[];
};
