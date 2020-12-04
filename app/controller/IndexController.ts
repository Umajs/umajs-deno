import Result from '../../src/core/Result';
import { Path, BaseController, Param, Around, middlewareToAround } from '../../src/index';

// Path 修饰 class 时，参数为根路由(参数只能一个)
// Path 修饰 method 时，参数为方法路由(参数可有多个)
@Path('/index')
export default class Index extends BaseController {

    // RequestMethod 请求 method 方法 默认全部
    @Path()
    index() {
        return this.send('This is index');
    }

    @Path('/test/:name')
    @Around((point) => {
        const { proceed, args } = point;
        return proceed(args);
    })
    @Around(middlewareToAround((ctx, next) => {
        console.log('》》', ctx.request.path);
        return next();
    }))
    test(@Param('name') name: string) {
        console.log(`进入方法，参数：${JSON.stringify(name)}`)
        return Result.send(`这里是测试页面，地址 ${this.req.path}`);
    }

    // 私有化方法，无路由不会进入此 action
    hehe() {
        return this.send('hehe');
    }
}
