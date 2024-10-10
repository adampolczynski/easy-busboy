# Easy, promise-like typed Busboy wrapper

[![badge](https://img.shields.io/badge/download-NPM-<COLOR>.svg)](https://npmjs.org/package/easy-busboy) ![badge](https://img.shields.io/badge/tested%20with-Jest-<COLOR>.svg) ![badge](http://img.shields.io/badge/coverage-88%25-green.svg) [![badge](https://img.shields.io/badge/my-LinkedIn-blue.svg)](https://www.linkedin.com/in/adam-polczynski-77595013b/)

##### Built with:

![badge](https://img.shields.io/badge/TypeScript-blue.svg) ![badge](https://img.shields.io/badge/pnpm-red.svg) ![badge](https://img.shields.io/badge/pure%20joy!-yellow.svg)

#### Multipart/form-data uploads with one-liner

- use **one-liner** instead of event listeners to consume Busboy functionality, no other dependencies,
- based on [Busboy](http://github.com/mscdex/busboy),
- to be used with `Express` (4 & 5) and `Koa`,
- [WIP] works when implemented as a `firebase cloud function`,
- [WIP] option to specify the way file `stream` gets processed to `Buffer` ('memory' | 'storage'),
- typed and covered with tests,

### Standard usage (using await syntax)

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
app.use(async (ctx) => {
  const { fields, files } = await easyBusboy(ctx.req);
  ctx.body = { fields, files };
});
```

### Response format

No data is being lost while parsing, below is the response interface:

```ts
{
  files: Record<
    string,
    {
      buffer: Buffer;
      info: FileInfo; // imported from Busboy
    }
  >;
  fields: Record<
    string,
    {
      value: string;
      info: FieldInfo; // imported from Busboy
    }
  >;
}
```

### Providing Busboy config

```ts
import { easyBusboy } from 'easy-busboy';

...
const { fields, files } = await easyBusboy(req, {
      processStreamsMethod: 'memory' | 'storage', // [WIP] default 'memory'
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

## [WIP] Specify files processing method

You can specify `processStreamsMethod` in config, it may be:

- `storage` - so that file `streams` will be converted into `Buffers` using temporary directory,
- `memory` - above will be achieved without saving temporary file

In first case file will be returned as a Buffer, in second it is a URI pointing temporary file path

## Examples

Before implementing package in your project you can check out functionality using attached `examples` you can find there `Express` servers already utilizing `easyBusboy` method as well as example client (`axios`)

To be able to work with examples install dependencies in root folder first

- `pnpm i`,

then take a look at folders mentioned above and `package.json` scripts:

- `pnpm run examples:servers:install` (this one installs deps for servers examples),
- `pnpm run examples:servers:express4:start {PORT}` (run Express 4 server) (you can replace express4 here with 'express5' or 'koa'), note PORT is optional and by default equals 3000,
- `pnpm run examples:servers:clean` (this one removes deps for servers examples),

Finally when server is listening either launch some example client (look at `package.json` scripts) providing correct {PORT} as an argument (the same way as with server script) or launch `Postman` [Postman](https://www.postman.com/) and play with requests to `localhost:{PORT}/upload-file` !

## Tests

- `pnpm test` to run,
- `lib/*test.ts` contains some positive/negative test scenarios clearly explaining functionality,

### Coverage

| File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines |
| --------- | ------- | -------- | ------- | ------- | --------------- |
| All files | 88.52   | 71.42    | 70      | 96.07   |
| index.ts  | 85.71   | 33.33    | 64.28   | 94.59   | 113-114         |
| utils.ts  | 94.73   | 100      | 83.33   | 100     |
