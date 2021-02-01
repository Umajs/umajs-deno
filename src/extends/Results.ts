import { CALLBACK_FIELD, DOWNLOAD_PATH, VIEW_PATH } from "../utils/consts.ts";
import { IContext } from "../typings/IContext.ts";
import {
  IResults,
  TResultDownData,
  TResultJsonData,
  TResultJsonpData,
  TResultRedirectData,
  TResultStreamData,
  TResultViewData,
} from "../typings/IResult.ts";
import LazyModules from "../loader/LazyModules.ts";

export const Results: IResults = {
  done() {
  },
  send(ctx: IContext, data: any) {
    return ctx.sendData(data);
  },
  json(ctx: IContext, data: TResultJsonData) {
    return ctx.json(data);
  },
  jsonp(ctx: IContext, data: TResultJsonpData) {
    const { [CALLBACK_FIELD]: callbackField, ...jsonpData } = data;

    return ctx.jsonp(jsonpData, callbackField);
  },
  view(ctx: IContext, data: TResultViewData) {
    const { [VIEW_PATH]: viewPath, ...viewData } = data;

    return ctx.view(viewPath, viewData);
  },
  stream(ctx: IContext, data: TResultStreamData) {
    const { data: streamData, fileName } = data;

    // if (fileName) ctx.attachment(fileName);

    ctx.body = streamData;
  },
  download(ctx: IContext, data: TResultDownData) {
    const { [DOWNLOAD_PATH]: downloadPath, ...downloadOpts } = data;

    // if (!ctx.type && !ctx.get('Content-Disposition')) ctx.attachment(downloadPath);

    // return LazyModules.send(ctx, downloadPath, downloadOpts);
  },
  redirect(ctx: IContext, data: TResultRedirectData) {
    const { url, alt } = data;

    return ctx.redirect(url, alt);
  },
};
