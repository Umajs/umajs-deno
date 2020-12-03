import { Path, BaseController } from '../../src/index';

// Path 修饰 class 时，参数为根路由(参数只能一个)
// Path 修饰 method 时，参数为方法路由(参数可有多个)
@Path('/index')
export default class Index extends BaseController {

    // RequestMethod 请求 method 方法 默认全部
    @Path()
    index() {
        this.ctx.body = '这里是首页';
    }

    @Path('/test/:name')
    test(name: string) {
        console.log(`进入方法，参数：${name}`)
        this.ctx.body = `这里是测试页面，地址 ${this.req.path}`;
    }

    @Path('/data')
    data() {
        console.log('需要登录，你看不到这里');
    }

    // 私有化方法，无路由不会进入此 action
    hehe() {
        this.ctx.body = 'hehe';
    }
}
