import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaParser from 'koa-bodyparser';
import koaCors from '@koa/cors';

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 3000;

const App = new Koa();

App.use(koaParser())
  .use(koaCors())
  .listen(PORT, () => {
    console.log(`🚀 Koa listening on localhost:${PORT} 🚀`);
  });
const router = new KoaRouter();

router.post('/upload-file', async (ctx) => {
  //   const res2 = await asyncBusboy(ctx, {});
  ctx.body = {}; //res2
});
