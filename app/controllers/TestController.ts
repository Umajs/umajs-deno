import {
  Around,
  BaseController,
  Inject,
  middlewareToAround,
  Param,
  Path,
  RequestMethod,
  Result,
} from "../../mod.ts";
import Test from "../service/Test.ts";

// Path 修饰 class 时，参数为根路由(参数只能一个)
// Path 修饰 method 时，参数为方法路由(参数可有多个)
@Path("/test")
@Around(async (point) => {
  console.log("----around before----");

  const { proceed, args } = point;
  const result = await proceed(args);

  console.log("----around after----");

  return result;
})
export default class Index extends BaseController {
  @Inject(Test)
  t: Test;

  @Path()
  index() {
    console.log(this.t.test());

    return this.sendData("This is index");
  }

  @Path({ method: RequestMethod.POST })
  post() {
    return this.sendData("This is post page.");
  }

  @Path("/test/:name")
  @Around(middlewareToAround((ctx, next) => {
    console.log("》》", ctx.request.url.pathname);
    return next();
  }))
  test(@Param("name") name: string) {
    console.log(`进入方法，参数：${JSON.stringify(name)}`);
    return Result.send(`这里是测试页面，地址 ${this.req.url.pathname}`);
  }

  // 私有化方法，无路由不会进入此 action
  hehe() {
    return this.sendData("hehe");
  }
}
