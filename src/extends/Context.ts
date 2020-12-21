import { BaseContext, IContext } from '../typings/IContext.ts';
import LazyModules from '../loader/LazyModules.ts';
import { __dirname } from '../../node-to-deno/mod.ts';

export const context: BaseContext = {
    sendData(val: string | ArrayBuffer, status?: number) {
        if (status) this.status = status;
        this.body = val;
    },

    json(data: Object) {
        this.type = 'application/json';
        this.body = data;
    },

    jsonp(data: Object, callbackField: string = 'callback') {
        this.setHeader('X-Content-Type-Options', 'nosniff');
        this.type = 'application/javascript';
        // this.body = LazyModules.jsonpBody(data, callbackField);
    },

    view(viewPath: string, locals: any = {}) {
        const ctx: IContext = <IContext>this;

        return ctx.render(viewPath);
    },

    get userAgent() {
        return this.headers['user-agent'];
    },

    param: {},

    get query() {
        let data:any = {};
        // @ts-ignore
        for (const [key, value] of this?.url?.searchParams) {
            data[key] = value;
        }
        return data;
    },

    setHeader(name: string, value: string): void {
        const ctx: IContext = <IContext>this;

        ctx.response.headers.set(name, value);
    },

    getHeader(name: string | any): any {
        return this.headers[name.toLowerCase()];
    },

    redirect(url: string, status?: string | undefined): any {
        this.redirect(url, status);
    }
};
