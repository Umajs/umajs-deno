import * as Koa from 'koa';
import * as path from 'path';

process.env.ROUTE_ENV_TYPE = 'dev';
const { Router } = require('../src/index');
import routers from './routers';

const app = new Koa();

app.use(async (ctx, next) => {
    if (ctx.request.path === '/favicon.ico') return;
    await next();
});

app.use(async (ctx, next) => {
    console.log('-----koa before-----');
    await next();
    console.log('-----koa after------');
});

app.use(Router({
    controllerPath: path.resolve(process.cwd(), 'app/controller'),
    resourcePath: path.resolve(process.cwd(), 'app'),
    aopPath: path.resolve(process.cwd(), 'app/aop'),
    routers,
}));

// response
app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(3000);