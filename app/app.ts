import { Koa } from '../node-to-deno/koa.ts';
import { __dirname, viewsMiddleware, staticMiddleware, path } from '../node-to-deno/mod.ts';

// process.env.ROUTE_ENV_TYPE = 'dev';
import { Router } from '../mod.ts';

const app = new Koa();
const port = 3000;

app.use(viewsMiddleware({ viewRoot: path.join(__dirname(import.meta), './views') }));
app.use(staticMiddleware(path.join(__dirname(import.meta), './static')));

app.use(async (ctx, next) => {
    if (ctx.request.url.pathname === '/favicon.ico') return;
    await next();
});

app.use(async (ctx, next) => {
    console.log('-----koa before-----');
    try {
        await next();
    } catch(err) {
        console.log(err);
    }
    
    console.log('-----koa after------');
});

// @ts-ignore
app.use(await Router({
    ROOT: __dirname(import.meta),
    app,
}));

// response
app.use(ctx => {
    ctx.response.body = "Hello Koa";
});

app.addEventListener('listen', () => {
    console.log(`启动成功，端口：${port}`);
});

await app.listen({ port })