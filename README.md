# koa-router-class

koa 路由，将路由转发到 class 方法上
基于 path-to-regexp 库
默认首页 / ==> /index/index
默认路由 /类名/方法名

### usage

```js
// app.js
const { Router } = require('koa-router-class');

app.use(Router());
```

```js
// IndexController
import { Before, After, Inside, Path, RequestMethod, Controller } from 'koa-router-class';

function before() {
    console.log('before', this.req.path);
    // return false;    // return false;时，对应 action 方法不会执行
}

// Path 修饰 class 时，参数为根路由(参数只能一个)
// Path 修饰 method 时，参数为方法路由(参数可有多个)
@Path('index')  // 根路由
export default class Index extends Controller {

    // RequestMethod 默认全部
    // 可以修饰一个或者多个
    @RequestMethod.GET
    @RequestMethod.POST
    index() {
        this.ctx.body = '这里是首页';
    }

    // 被 before 修饰的方法
    // 当 before 没有函数参数时，当前方法被声明为此 class 的勾子函数，所有 action 触发都会先调用此方法
    // 当 before 有函数参数时， 函数参数为当前 action 的勾子函数，调用此 action 都会条用函数参数
    // after 同理
    @Before(before)
    @Path('/test/:name', '/test2')
    test(name: string) {
        console.log('......', name);
        this.ctx.body = `这里是测试页面，地址 ${this.req.path}`;
    }

    // 私有化方法，默认路由不会进入此 action
    @Inside
    before() {
        console.log(123456);
    }

    // 勾子函数，action 调用结束后触发
    @After()
    after() {
        console.log('after');
    }
}
```

