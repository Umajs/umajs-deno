const Koa = require('koa');
const path = require('path');

const { Router } = require('../dist/index');

const app = new Koa();

app.use(Router({
    controllerRoot: path.resolve(process.cwd(), ''),
}));

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);