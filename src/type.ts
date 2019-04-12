export type IControllerInfo = {
    clazzName?: string,
    rootPath?: string,
    pathMethodNames?: string[],
};

export type IPathInfo = {
    keys?: any[],
    clazz: Function,
    methodName: string,
};

export type IRoute = {
    clazz: Function,
    pathMethodNames: string[],
}
