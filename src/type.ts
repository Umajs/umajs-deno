export type IControllerInfo = {
    clazz?: Function,
    clazzName?: string,
    rootPath?: string,
    methodMap?: Map<string, IMethodInfo>,
};

export type IMethodInfo = {
    path?: string,
    inside?: boolean,
    methodType?: string, // get,post...
}

export type IHelper = {
    clazzName?: string,
    rootPath?: string,
    path?: string,
    inside?: boolean,
    methodType?: string,
}

export type IPathInfo = {
    keys?: any[],
    inside?: boolean,
    clazz: Function,
    methodName: string,
    methodType?: string,
};
