# koa-router-class

    koa 路由，将路由转发到 class 方法上
    基于 path-to-regexp 库
    默认首页 / ==> /index/index
    默认路由 /类名/方法名
    所有的方法都有默认路由，例如 '/index/data' 会默认调用 IndexController 的 data() 方法

### usage

```js
// app.js
const { Router } = require('koa-router-class');

app.use(Router());
```

```js
// IndexController
import { Before, After, Inside, Path, RequestMethod, Controller } from 'koa-router-class';

// Path 修饰 class 时，参数为根路由(参数只能一个)
// Path 修饰 method 时，参数为方法路由(参数可有多个)
@Path('/index')
// 被 Before 修饰的方法
// 当 Before 修饰 class 时，参数为此 class 的前置函数，class 下所有 action 触发都会先调用此方法
// 当 Before 修饰 action 时， 参数为当前 action 的前置函数，调用此 action 都会条用函数参数
// After 同理
@Before('ClassBefore')
@After('ClassAfter')
export default class Index extends Controller {

    // 依赖注入，将需要的服务引入直接使用
    @Resource('Test')
    private testService: Test;

    // RequestMethod 请求 method 方法 默认全部
    @RequestMethod('GET')
    index() {
        console.log(this.testService.return1());
        this.ctx.body = '这里是首页';
    }

    // 先调用 中间件方法，再调用controller 前置，后调用 method 前置，最后调用 method
    @Before('Before')
    @After('After')
    @Path('/test/:name')
    @RequestMethod('GET', 'POST')
    test(name: string) {
        console.log(`进入方法，参数：${name}`)
        this.ctx.body = `这里是测试页面，地址 ${this.req.path}`;
    }

    // 需要登录，在 login 中做登录校验
    @Before('Login')
    data() {
        console.log('需要登录，你看不到这里');
    }

    // 私有化方法，默认路由('/index/hehe')不会进入此 action
    @Private
    hehe() {
        this.ctx.body = 'hehe';
    }
}
```

