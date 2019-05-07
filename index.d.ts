import * as Koa from "koa";

export = WF;

declare namespace WF {

    /**
     * 单条路由配置，如下：
     * [['/r1', '/r2/:name'], controllers.r2.name, 'GET']
     * [['/r1', '/r2/:name'], '/r2/name', ['GET', 'POST']]
     */
    export type router = [string[], string, string?];

    /**
     * 路由参数
     */
    export type routerOptions = {
        controllerPath?: string,    // default /src/controller
        interceptorPath?: string,   // default /src/interceptor
        controllerSuffix?: string,  // default Controller
        routers?: router[],
    }

    /**
     * Router 路由
     */
    export function Router(options?: routerOptions): Koa.Middleware;

    /**
     * Before 修饰器
     * 当 Before 没有函数参数时，当前方法被声明为此 class 的勾子函数，所有 action 触发都会先调用此方法
     * 当 Before 有函数参数时， 函数参数为当前 action 的勾子函数，调用此 action 都会条用函数参数
     * 函数返回 false 时，action 不执行
     * @param fn 勾子函数，此参数单独配置 action 的前置方法
     */
    export function Before(fn?: Function): Function;

    /**
     * After 修饰器
     * 使用说明参考 Before 修饰器
     * @param fn 勾子函数，此参数单独配置 action 的后置方法
     */
    export function After(fn?: Function): Function;

    /**
     * Path 修饰器
     * Path 修饰 class 时，参数为根路由(参数只能一个)
     * Path 修饰 method 时，参数为方法路由(参数可有多个)
     * @param props 路由参数
     */
    export function Path(...props: string[]): Function;

    /**
     * Private 修饰器
     * 将 controller action 方法私有，设置后没有默认路由
     */
    export const Private: Function;

    /**
     * controllers 配置路由文件使用
     */
    export const controllers: any;

    /**
     * 访问 method
     */
    export namespace RequestMethod {
        export const GET: Function;
        export const POST: Function;
        export const PUT: Function;
        export const OPTION: Function;
        export const HEAD: Function;
        export const DELETE: Function;
        export const TRACE: Function;
        export const CONNECT: Function;
    }

    /**
     * Controller 基类，提供一些基本方法
     * TODO
     */
    export class Controller {
        ctx: Koa.Context;
        req: Koa.Request;
        res: Koa.Response;
        next: Function;
    }
}
