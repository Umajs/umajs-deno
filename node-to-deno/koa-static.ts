import { send } from "../node-to-deno/koa.ts";
import { fs } from "../node-to-deno/mod.ts";

export const staticMiddleware: any = (root: string, option: object = {}) => {
  return async function (ctx: any, next: Function) {
    await next();

    const pathname = ctx.request.url.pathname;
    try {
      const isExist = fs.existsSync(`${root}${pathname}`);
      if (isExist) {
        console.log("file is true");
        await send(ctx, pathname, {
          root,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};
