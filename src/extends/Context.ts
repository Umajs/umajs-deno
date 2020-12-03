import typeHelper from '../utils/typeHelper';
import { BaseContext, IContext } from '../typings/IContext';

export const Context: BaseContext = {
    send(val: string | Buffer, status?: number) {
        if (status) this.status = status;
        this.body = val;
    },

    json(data: Object) {
        this.type = 'application/json';
        this.body = data;
    },

    view(viewPath: string, locals: any = {}) {
        locals.ctx = this;

        return this.render(viewPath, locals);
    },

    get userAgent() {
        return this.header['user-agent'];
    },

    param: {},

    setHeader(name: string | { [key: string]: string }, value?: string | string[]): void {
        const ctx: IContext = this;

        if (ctx.res.headersSent) {
            console.error(new Error(`Cannot set headers after they are sent to the client, url: ${ctx.url}`));

            return;
        }

        if (typeHelper.isString(name) && value !== undefined) {
            ctx.set(name, value);
        }

        if (typeHelper.isObject(name)) {
            ctx.set(name);
        }
    },

    getHeader(name: string | any): any {
        return this.header[name.toLowerCase()];
    },
};
