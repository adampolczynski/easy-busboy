# Easy, promise-like typed Busboy wrapper

[![badge](https://img.shields.io/badge/download-NPM-<COLOR>.svg)](https://npmjs.org/package/easy-busboy) ![badge](https://img.shields.io/badge/tested%20with-Jest-<COLOR>.svg) ![badge](http://img.shields.io/badge/coverage-78%25-green.svg) [![badge](https://img.shields.io/badge/my-LinkedIn-blue.svg)](https://www.linkedin.com/in/adam-polczynski-77595013b/)

##### Built with:

![badge](https://img.shields.io/badge/TypeScript-blue.svg) ![badge](https://img.shields.io/badge/pnpm-red.svg) ![badge](https://img.shields.io/badge/pure%20joy!-yellow.svg)

[typescript-image]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[pnpm-image]: https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220
[npm-image]: https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white
[express-image]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[koa-image]: https://img.shields.io/badge/Koa-33333D?logo=koa&logoColor=fff&style=flat-square
[download-url]: https://npmjs.org/package/easy-busboy

#### Work with multipart/form-data uploads with one-liner

- easily handle multiple `values`/`files` sent as `formData` with **one-liner**,

```
const { fields, files } = await easyBusboy(req);
```

- based on [Busboy](http://github.com/mscdex/busboy),
- to be used with [Koa](https://github.com/koajs/koa) and [Express](https://github.com/expressjs) (4 & 5),
- [WIP] Works when implemented as a **Express GCP cloud function** (tested with firebase SDK, see [here](http://google.com))

### Standard usage using await syntax

To install in your project run `pnpm i --save easy-busboy` or (npm) `npm i --save easy-busboy`

[![badge](https://img.shields.io/badge/download-NPM-<COLOR>.svg)](download-url)

```ts
import { easyBusboy } from 'easy-busboy';

// Express 4 or 5
app.post<{ fields: IFields; files: IFiles }>(
  '/upload-file',
  async (req, res) => {
    const { fields, files } = await easyBusboy(req);
    res.send({ fields, files });
  }
);

// Koa
router.post('/upload-file', async (ctx) => {
  const { fields, files } = await easyBusboy(ctx);
  ctx.body = { fields, files };
});
```

### Providing Busboy config

```ts
import { easyBusboy } from 'easy-busboy';

...
const { fields, files } = await easyBusboy(req, {
      limits: cfg.limits, // see busboy config limits
      headers,
      conType, // content type
      highWaterMark: ...,
      fileHwm: ...,
      defCharset: ...,
      defParamCharset: ...,
      preservePath: ...,
    });
...
```

## How it works?

It is just a simple method which encapsules Busboy `onFile`/`onField` (and other) events in a promise then creates key/value pairs for found `fields`/`files`

Small note - if multiple fields with the same name are provided in request then response is going to contain all fields indexed accordingly (no duplicates boss, sorry)

## Files processing

- `file` event provides `Readable` which is transformed directly (in memory) into `Buffer` which together is sent as a response aside `info` field storing additional file info,
- [WIP] allow to choose between processing stream in memory or in temp directory

### Examples

Before implementing package in your project you can check out functionality using attached `examples` you can find there `Express` & `Koa` servers already utilizing `easyBusboy` method as well as example clients (`axios`, `fetch`)

To be able to work with examples install dependencies in root folder first

- `pnpm i`,

then take a look at folders mentioned above and `package.json` scripts:

- `pnpm run examples:servers:install` (this one installs deps for servers examples),
- `pnpm run examples:servers:express4:start {PORT}` (run Express 4 server) (you can replace express4 here with express5 or koa), note PORT is optional and by default equals 3000,
- `pnpm run examples:servers:clean` (this one removes deps for servers examples),

Finally when server is listening either launch some example client (look at `package.json` scripts) providing correct {PORT} as an argument (the same way as with server script) or launch `Postman` [Postman](https://www.postman.com/) and play with requests to `localhost:{PORT}/upload-file` !

### Tests

- `lib/*test.ts` contains some positive/negative test scenarios clearly explaining functionality,

##### Coverage

| File       | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
| ---------- | --------- | ---------- | --------- | --------- | ------------------- |
| All files  | 78.94     | 75         | 83.33     | 78.57     |
| utils.ts   | 78.94     | 75         | 83.33     | 78.57     | 19-25               |
| ---------- | --------- | ---------- | --------- | --------- | ------------------- |
