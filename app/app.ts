import * as Koa from 'koa';

// process.env.ROUTE_ENV_TYPE = 'dev';
import { Router } from '../src/index';

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
    ROOT: __dirname,
    app,
}));

// response
app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(3000, () => {
    console.log('启动成功，端口：3000');
});
