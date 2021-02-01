import { Koa, Middleware } from "../../node-to-deno/koa.ts";

import { mixin } from "../utils/index.ts";
import { Delegator } from "../../node-to-deno/mod.ts";

export default function expansion(app: Koa, { context, request, response }: {
  context: { [key: string]: any };
  request: { [key: string]: any };
  response: { [key: string]: any };
}) {
  mixin(false, app.context, context);
  mixin(false, app.context.response, request);
  mixin(false, app.context.request, response);

  Delegator.create(app.context, app.context.response)
    .method("redirect")
    .access("status")
    .access("body")
    .access("type");
  Delegator.create(app.context, app.context.request).getter("headers").getter(
    "url",
  );
}
