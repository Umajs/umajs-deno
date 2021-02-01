import Result from "./Result.ts";
import { BaseContext, IContext } from "../typings/IContext.ts";
import { IRequest } from "../typings/IRequest.ts";
import { IResponse } from "../typings/IResponse.ts";

/**
 * controller 自带方法在 ctx 中也有相同实现
 */
export default class BaseController implements BaseContext {
  constructor(readonly ctx: IContext) {
    const { request: req, response: res } = ctx;

    this.req = req;
    this.res = res;
    this.request = req;
    this.response = res;
  }

  req: IRequest;

  res: IResponse;

  request: IRequest;

  response: IResponse;

  set status(status: number) {
    this.ctx.status = status;
  }

  sendData = Result.send;

  json = Result.json;

  jsonp = Result.jsonp;

  view = async (viewPath: string, locals: { [key: string]: any } = {}) =>
    Result.view(viewPath, locals);

  stream = Result.stream;

  download = Result.download;

  redirect = Result.redirect;

  get userAgent() {
    return this.ctx.headers["user-agent"];
  }

  get param() {
    return this.ctx.param;
  }

  get query() {
    return this.ctx.query;
  }

  setHeader(name: string | any, value: string | string[]): void {
    this.ctx.setHeader(name, value);
  }

  getHeader(name: string | any): any {
    return this.ctx.getHeader(name);
  }
}
