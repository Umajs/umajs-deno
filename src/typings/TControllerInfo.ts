import { IContext } from './IContext.ts';

export type TArg = {
    argDecorator?: (ctx: IContext, ...props: any[]) => any,
    argProps?: any[],
    argIndex?: number,
}

export type TPath = {
    path?: string; // 路径
    methodTypes?: string[]; // 方法
}

export type TMethodInfo = {
    name?: string; // 方法名
    paths?: Array<TPath>;
    args?: TArg[];
    inside?: boolean; // 是否私有
}

export type TControllerInfo = {
    name?: string // filename
    root?: string // root path
    clazz?: Function // class
    methodMap?: Map<string, TMethodInfo> // method
}

export type TControllerInfoHelper = TPath & TArg & {
    root?: string
}
