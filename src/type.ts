export type IControllerInfo = {
    clazz?: Function,
    clazzName?: string,
    rootPath?: string,
    before?: Function,
    after?: Function,
    methodMap?: Map<string, IMethodInfo>,
};

export type IMethodInfo = {
    path?: string,
    inside?: boolean,
    methodTypes?: string[], // get,post...
}

export type IHelper = {
    clazzName?: string,
    rootPath?: string,
    path?: string,
    inside?: boolean,
    methodType?: string,
    before?: Function,
    after?: Function,
}

export type IPathInfo = {
    keys?: any[],
    inside?: boolean,
    clazz: Function,
    methodName: string,
    methodType?: string,
};
