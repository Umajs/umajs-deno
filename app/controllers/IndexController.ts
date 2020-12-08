
import Result from '../../src/core/Result';
import { Path, RequestMethod, BaseController, Param, Around, Inject } from '../../src/index';
import { Middleware, test, test1 } from '../decorators/AroundTest';
import { Get } from '../decorators/Path';
import { TestMiddleware } from '../middlewares/Test';
import Test from '../service/Test';

// Path 修饰 class 时，参数为根路由(参数只能一个)
// Path 修饰 method 时，参数为方法路由(参数可有多个)
@Around(test)
@Around(test1)
export default class Index extends BaseController {

    @Inject(Test)
    t: Test;

    @Get('/')
    index() {
        console.log(this.t.test());

        return this.send('This is index');
    }

    @Path({ value: '/post', method: RequestMethod.POST })
    post() {
        return this.send('This is post page.');
    }

    @Path('/test/:name')
    @Middleware(TestMiddleware)
    test(@Param('name') name: string) {
        console.log(`进入方法，参数：${JSON.stringify(name)}`)
        return Result.send(`这里是测试页面，地址 ${this.req.path}`);
    }

    // 私有化方法，无路由不会进入此 action
    hehe() {
        return this.send('hehe');
    }
}
