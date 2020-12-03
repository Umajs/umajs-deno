import controllerInfo from '../utils/controllerInfo';
import TypeHelper from '../utils/TypeHelper';

/* eslint no-shadow: 0 */
enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    OPTION = 'OPTION',
    HEAD = 'HEAD',
    DELETE = 'DELETE',
    TRACE = 'TRACE',
    CONNECT = 'CONNECT',
}

export type TPathObjArgs = {
    value?: string | string[],
    method?: RequestMethod | RequestMethod[],
}

/**
 * 路由装饰器
 * 可以装饰 class，作为跟路由，只装饰 class 不生效，必须和 method 装饰配合使用
 * 可以装饰 method，没有跟路由的时候直接作为路由使用，有跟路由的时候和跟路由组合使用
 * @param args 路由参数
 * eg:
 * Path('/p1')
 * Path('/p1', 'p2')
 * Path({ value: '/p1' })
 * Path({ value: '/p1', method: RequestType.GET })
 * Path({ value: ['/p1', '/p2'], method: RequestType.GET })
 * Path({ value: ['/p1', '/p2'], method: [RequestType.GET, RequestType.POST] })
 */
export function Path(...args: [...string[]] | [TPathObjArgs]): Function {
    return function Method(...props: Parameters<MethodDecorator> | Parameters<ClassDecorator>) {
        const [arg0] = args;

        // decorate class
        if (props.length === 1) {
            if (args.length > 1) throw new Error('@Path only receivew one (string) parameter when decorate class');

            if (!TypeHelper.isString(arg0) || !arg0.startsWith('/')) throw new Error(`path must be string start with "/", now is "${arg0}"`);

            return controllerInfo.setControllersInfo(props[0], null, { root: arg0 });
        }

        // decorator method
        const values = [];
        const methodTypes = [];

        if (TypeHelper.isObject(arg0)) {
            if (args.length > 1) throw new Error('@Path only receive one Object as a parameter');

            const { value = '/', method = [] } = arg0;

            values.push(...(Array.isArray(value) ? value : [value]));
            methodTypes.push(...(Array.isArray(method) ? method : [method]));
        } else {
            (args.length > 0 ? args : ['/']).forEach((arg: any) => {
                if (TypeHelper.isString(arg)) values.push(arg);
                else throw new Error(`@Path only receive one Object as a parameter, now is "${JSON.stringify(arg)}"`);
            });
        }

        const [target, methodName] = props;

        values.forEach((p) => {
            if (!TypeHelper.isString(p) || !p.startsWith('/')) throw new Error(`path must be string start with "/", now is "${p}"`);

            controllerInfo.setControllersInfo(target.constructor, <string>methodName, { path: p, methodTypes });
        });
    };
}
