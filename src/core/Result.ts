import { SendOptions } from "../../node-to-deno/koa.ts";

import { CALLBACK_FIELD, DOWNLOAD_PATH, VIEW_PATH } from "../utils/consts.ts";
import { Results } from "../extends/Results.ts";
import { IResult } from "../typings/IResult.ts";
import { IContext } from "../typings/IContext.ts";

export default class Result<T = any> implements IResult {
  constructor({ type, data, status }: IResult) {
    this.type = type;
    this.data = data;
    this.status = status!;
  }

  type: string;

  data: T;

  status: number;

  static done() {
    return new Result({
      type: "done",
    });
  }

  static send(data: string | Deno.Buffer, status?: number) {
    return new Result({
      type: "send",
      data,
      status,
    });
  }

  static json(data: { [key: string]: any }) {
    return new Result({
      type: "json",
      data,
    });
  }

  static jsonp(
    data: { [key: string]: any },
    callbackField: string = "callback",
  ) {
    return new Result({
      type: "jsonp",
      data: {
        ...data,
        [CALLBACK_FIELD]: callbackField,
      },
    });
  }

  static view(viewPath: string, locals: { [key: string]: any } = {}) {
    return new Result({
      type: "view",
      data: {
        ...locals,
        [VIEW_PATH]: viewPath,
      },
    });
  }

  static stream(data: ReadableStream, fileName?: string) {
    return new Result({
      type: "stream",
      data: {
        data,
        fileName,
      },
    });
  }

  static download(filePath: string, opts?: SendOptions) {
    return new Result({
      type: "download",
      data: {
        ...opts,
        [DOWNLOAD_PATH]: filePath,
      },
    });
  }

  static redirect(url: string, alt?: string) {
    return new Result({
      type: "redirect",
      data: {
        url,
        alt,
      },
    });
  }

  static finish(ctx: IContext, result: Result) {
    const { type, status, data } = result;

    if (status) ctx.status = status;

    return Reflect.get(Results, type)(ctx, data);
  }
}
