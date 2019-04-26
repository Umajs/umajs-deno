import { Before, After, Inside, Path, Methods, Controller } from '../../src/index';

function before() {
    console.log('before', this.req.path);
    // return false;
}

@Path('/index')
export default class Index extends Controller {

    // @Private
    // @Get
    @Methods.GET
    index() {
        this.ctx.body = '这里是首页';
    }

    @Before(before)
    @Path('/test/:name', '/test2')
    test(name: string) {
        console.log('......', name);
        this.ctx.body = `这里是测试页面，地址 ${this.req.path}`;
    }

    @Inside
    hello() {
        this.ctx.body = 'hello.';
    }

    /* eslint-disable class-methods-use-this */
    // @Before()
    before() {
        console.log(123456);
    }

    @After()
    after() {
        console.log('after');
    }
}
