import Koa from 'koa';
import koaParser from 'koa-bodyparser';
import koaCors from '@koa/cors';
import { easyBusboy } from '../../../lib';

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 3000;

const App = new Koa();

App.use(koaParser())
  .use(koaCors())
  .use(async (ctx) => {
    const { fields, files } = await easyBusboy(ctx.req);
    ctx.body = { fields, files };
  })
  .listen(PORT, () => {
    console.log(`Koa listening http://127.0.0.1:${PORT}/ 🚀`);
  });
