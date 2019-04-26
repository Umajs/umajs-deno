import * as Koa from 'koa';
import * as path from 'path';

process.env.ROUTE_ENV_TYPE = 'dev';
const { Router } = require('../src/index');

const app = new Koa();

app.use(Router({
    controllerRoot: path.resolve(process.cwd(), 'test'),
    routers: [
    ],
}));

// response
app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(3000);