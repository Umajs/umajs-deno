# koa-router-class

koa 路由，将路由转发到 class 方法上
基于 path-to-regexp 库

### usage

```js
// app.js
const { Router } = require('koa-router-class');

app.use(Router());
```

```js
// IndexController
@Path('index')  // 根路由
import { Before, After, Inside, Path, Methods, Controller } from 'koa-router-class';

// Path 修饰class 时，参数为根路由(参数只能一个)
// Path 修饰method 时，参数为方法路由(参数可有多个)
@Path('/index')
export default class Index extends Controller {

    @Methods.GET
    index() {
        this.ctx.body = '这里是首页';
    }

    // 被before 修饰的方法
    // 当 before 没有函数参数时，当前方法被声明为此 class 的勾子函数，所有 action 触发都会先调用此方法
    // 当 before 有函数参数时， 函数参数为当前 action 的勾子函数，调用此 action 都会条用函数参数
    // after 同理
    @Before(function before() {
        console.log('before', this.req.path);
        // return false;
    })
    @Path('/test/:name', '/test2')
    test(name: string) {
        console.log('......', name);
        this.ctx.body = `这里是测试页面，地址 ${this.req.path}`;
    }

    // 私有化方法
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

