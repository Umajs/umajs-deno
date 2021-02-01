import {
  Application,
  ApplicationOptions,
  composeMiddleware,
  Context,
  Middleware,
  REDIRECT_BACK,
  Request,
  Response,
  send,
  SendOptions,
  ServerRequest,
  State,
} from "https://deno.land/x/oak/mod.ts";

class Koa<AS extends State = Record<string, any>> extends Application {
  callback: any;
  constructor(option: ApplicationOptions<AS> = {}) {
    super(option);
  }
  subdomainOffset: any;
  context: any;
  request: any;
  response: any;
}

export {
  composeMiddleware,
  Context,
  Koa,
  REDIRECT_BACK,
  Request,
  Response,
  send
};

export type {
  Middleware,
  ServerRequest,
  SendOptions
}