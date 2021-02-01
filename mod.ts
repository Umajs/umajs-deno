export { Router } from "./src/router.ts";

export { default as BaseController } from "./src/core/BaseController.ts";
export { default as Result } from "./src/core/Result.ts";
export {
  Del,
  Get,
  Path,
  Post,
  Put,
  RequestMethod,
} from "./src/decorators/Path.ts";
export { Inject, Resource } from "./src/decorators/Resource.ts";
export {
  Around,
  Middleware,
  middlewareToAround,
} from "./src/decorators/Around.ts";
export {
  Context,
  createArgDecorator,
  Param,
  Query,
} from "./src/decorators/ArgDecorator.ts";

export type { IProceedJoinPoint } from "./src/decorators/Around.ts";
export type { IContext } from "./src/typings/IContext.ts";
