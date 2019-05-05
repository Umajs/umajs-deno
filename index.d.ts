import * as Koa from "koa";

export = WF;

declare namespace WF {

    export function Before(fn?: Function): Function;
    export function After(fn?: Function): Function;
    export function Path(...props: string[]): Function;

    export const Private: Function;

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

    export class Controller {
        ctx: Koa.Context;
        req: Koa.Request;
        res: Koa.Response;
        next: Function;
    }
}
