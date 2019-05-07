import { Before, After, Private, Path, RequestMethod, Controller } from '../../src/index';

@Path('/index')
export default class Index extends Controller {

    // @Private
    @RequestMethod.GET
    index() {
        this.ctx.body = '这里是首页';
    }

    @Before('Before')
    @Path('/test/:name', '/test2')
    test(name: string) {
        console.log('......', name);
        this.ctx.body = `这里是测试页面，地址 ${this.req.path}`;
    }

    @RequestMethod.GET
    @RequestMethod.POST
    hello() {
        this.ctx.body = 'hello.';
    }

    /* eslint-disable class-methods-use-this */
    @Before()
    @Private
    before() {
        console.log('=-=Before decorator', 123456);
    }

    hehe() {
        this.ctx.body = 'hehe';
    }

    @After()
    after() {
        console.log('-=-After decorator', 654321);
    }
}
