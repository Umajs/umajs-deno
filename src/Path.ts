import { SetController } from './ControllerMap';
import { IPathInfo } from './type';

// static
export const StaticMap: Map<string, IPathInfo> = new Map();
// path decorator
export const RouteMap: Map<RegExp, IPathInfo> = new Map();

export function MatchRegexp(reqPath: string) {
    for (const [reg, { clazz, methodName }] of RouteMap) {
        const result = reg.exec(reqPath);
        if (result) {
            return { clazz, methodName, params: result.slice(1) };
        }
    }

    return false;
}

export function Path(...pathArr: string[]) {
    console.assert(pathArr.length, 'decorator must have arguments, like "@path(\'/test/:test\')".');
    return function Method(...props: any[]) {
        if (props.length === 1) {
            if (pathArr.length > 1) throw new Error('class only has one argument');
            SetController(props[0], null, { rootPath: pathArr[0] });
        }

        const [target, methodName] = props;
        const clazz = target.constructor;
        pathArr.forEach((p) => {
            const methodPath: string = p;
            const pathInfo: IPathInfo = {
                clazz,
                methodName,
            };

            StaticMap.set(methodPath, pathInfo);
        });

        SetController(clazz, methodName, {});
    };
}
