import * as Koa from 'koa';

export default class Controller {
    constructor(ctx: Koa.Context, next: Function) {
        const { request: req, response: res } = ctx;
        this.ctx = ctx;
        this.req = req;
        this.res = res;
        this.next = next;
    }

    ctx: any;

    req: any;

    res: any;

    next: Function;

    __before: Function;

    __after: Function;
}
