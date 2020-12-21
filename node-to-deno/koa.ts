import {
  Application,
  ApplicationOptions,
  Context,
  Middleware,
  composeMiddleware,
  State,
  Request,
  Response,
  REDIRECT_BACK,
  send,
  SendOptions,
  ServerRequest
} from 'https://deno.land/x/oak/mod.ts';

class Koa<AS extends State = Record<string, any>> extends Application{
  callback: any;
  constructor(option:ApplicationOptions<AS> = {}){
    super(option);
  }
  subdomainOffset: any;
  context: any;
  request: any;
  response: any;
}

export {
  Koa,
  Context,
  Middleware,
  composeMiddleware,
  Request,
  Response,
  REDIRECT_BACK,
  send,
  SendOptions,
  ServerRequest
}