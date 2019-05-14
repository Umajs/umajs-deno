import * as Koa from 'koa';
import * as path from 'path';

process.env.ROUTE_ENV_TYPE = 'dev';
const { Router } = require('../src/index');
import routers from './routers';

const app = new Koa();

app.use(async (ctx, next) => {
    console.log('---koa before---');
    await next();
    console.log('===koa after ===');
});

app.use(Router({
    controllerPath: path.resolve(process.cwd(), 'test/controller'),
    aopPath: path.resolve(process.cwd(), 'test/aop'),
    routers,
}));

// response
app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(3000);