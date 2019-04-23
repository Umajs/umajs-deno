import * as Koa from 'koa';
import * as path from 'path';

const { Router } = require('../src/index');

const app = new Koa();

app.use(Router({
    controllerRoot: path.resolve(process.cwd(), 'test'),
}));

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);