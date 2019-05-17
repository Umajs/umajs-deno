import { Before, After, Private, Path, RequestMethod, Controller } from '../../src/index';

@Path('/index')
export default class Index extends Controller {

    @RequestMethod('GET')
    index() {
        this.ctx.body = '这里是首页';
    }

    @Before('Before')
    @After('After')
    @Path('/test/:name')
    @RequestMethod('GET', 'POST')
    test(name: string) {
        console.log(`进入方法，参数：${name}`)
        this.ctx.body = `这里是测试页面，地址 ${this.req.path}`;
    }

    @Before('Login')
    data() {
        console.log('需要登录，你看不到这里');
    }

    @Private
    hehe() {
        this.ctx.body = 'hehe';
    }

    /* eslint-disable class-methods-use-this */
    @Before()
    before() {
        console.log('-- controller 前置方法');
    }

    @After()
    after() {
        console.log('-- controller 后置方法');
    }
}
