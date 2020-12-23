# umajs-deno

    [Umajs](https://github.com/wuba/Umajs) deno 版本，拥有 Umajs 全量功能。

### demo

clone 当前工程，在根目录下执行 `deno run --allow-read --allow-net -c tsconfig.json app/app.ts` 后访问 http://localhost:3000

### usage

```js
import { Router } from "../mod.ts";

app.use(
  await Router({
    ROOT: __dirname(import.meta),
    app,
  })
);
```

#### IndexController.ts

```js
import {
  Result,
  Path,
  RequestMethod,
  BaseController,
  Param,
  Around,
  Inject,
} from "../../mod.ts";
import { Middleware, test, test1 } from "../decorators/AroundTest.ts";
import { Get } from "../decorators/Path.ts";
import { TestMiddleware } from "../middlewares/Test.ts";
import Test from "../service/Test.ts";
import { __dirname } from "../../node-to-deno/mod.ts";

// Path 修饰 class 时，参数为根路由(参数只能一个)
// Path 修饰 method 时，参数为方法路由(参数可有多个)
@Around(test)
@Around(test1)
export default class Index extends BaseController {
  @Inject(Test)
  t: Test;

  @Get("/")
  index() {
    console.log(this.t.test());

    return Result.view("index.ejs", { frameName: "Umajs" });
  }

  @Path({ value: "/post", method: RequestMethod.POST })
  post() {
    return this.sendData("This is post page.");
  }

  @Path("/test/:name")
  @Middleware(TestMiddleware)
  test(@Param("name") name: string) {
    console.log(`进入方法，参数：${JSON.stringify(name)}`);
    return Result.send(`这里是测试页面，地址 ${this.req.url.pathname}`);
  }

  // 私有化方法，无路由不会进入此 action
  hehe() {
    return this.sendData("hehe");
  }
}
```
