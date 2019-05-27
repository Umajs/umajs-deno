import { Before, After, Private, Path, RequestMethod, Controller } from '../../src/index';

@Path('/page')
export default class Page extends Controller {

    @After('After')
    @Before('Before')
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

    @Before('Login')
    data2() {
        console.log('需要登录，你看不到这里');
    }
}
