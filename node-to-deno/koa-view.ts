import { send } from "./koa.ts";

export function viewsMiddleware(root: string, option?: object) {
  return function views(ctx:any, next:any) {

    if (ctx.render) return next();

    ctx.response.render = ctx.render = function(relPath: string) {

      return send(ctx, ctx.request.url.pathname, {
        root,
        index: relPath
      });
    }

    return next();
  }
}