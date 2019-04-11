export type IControllerInfo = {
    clazzName?: string,
    rootPath?: string,
    pathMethodNames?: string[],
};

export type IPathInfo = {
    clazz: Function,
    methodName: string,
};

export type IRoute = {
    clazz: Function,
    pathMethodNames: string[],
}
