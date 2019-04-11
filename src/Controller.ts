export default class Controller {
    ctx: any;

    req: any;

    res: any;

    next: Function;

    __before: Function;

    __after: Function;

    set _ctx({ ctx, next }) {
        const { request: req, response: res } = ctx;
        this.ctx = ctx;
        this.req = req;
        this.res = res;
        this.next = next;
    }
}
