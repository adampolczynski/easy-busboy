import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaParser from 'koa-bodyparser';
import koaCors from '@koa/cors';

const App = new Koa();
const KOA_PORT = 3003;

App.use(koaParser())
  .use(koaCors())
  .listen(KOA_PORT, () => {
    console.log(`🚀 Koa listening http://127.0.0.1:${KOA_PORT}/ 🚀`);
  });
const router = new KoaRouter();

router.post('/upload-file', async (ctx) => {
  //   const res2 = await asyncBusboy(ctx, {});
  ctx.body = {}; //res2
});
