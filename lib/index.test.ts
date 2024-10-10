import { easyBusboy } from '.';
import type { IEasyBusboyResponse } from '.';
import http from 'http';
import { readFile } from 'fs/promises';
import path from 'path';

const HOST = '0.0.0.0';
const PORT = 3000;

const ENDPOINT = `http://${HOST}:${PORT}`;

const FIELDS_LIMIT = 100;

const person1FilePath = path.join(__dirname, '../examples/assets/person1.jpg');
const person2FilePath = path.join(__dirname, '../examples/assets/person2.jpg');
const person3FilePath = path.join(__dirname, '../examples/assets/person3.jpg');

describe('easyBusboy method', () => {
  let server: http.Server;

  let file1: Buffer;
  let file2: Buffer;
  let file3: Buffer;

  beforeAll(async () => {
    file1 = await readFile(person1FilePath);
    file2 = await readFile(person2FilePath);
    file3 = await readFile(person3FilePath);

    server = http.createServer((req, res) => {
      if (req.method === 'POST') {
        easyBusboy(req, { limits: { fields: FIELDS_LIMIT } }).then(
          (data) => {
            res.end(JSON.stringify(data));
          },
          (error) => {
            res.statusCode = 500;
            res.end(error.message);
          }
        );
      } else {
        res.end('Unsupported');
      }
    });

    await new Promise((res, rej) => {
      server.listen(PORT, () => {
        res(true);
      });
    });
  });

  afterAll(() => {
    server.close();
  });

  it('Fetch endpoint using easyBusboy, expect code 200', async () => {
    const formData = await prepareFormData();
    const { status } = await fetch(ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    expect(status).toEqual(200);
  });

  it('Fetch endpoint using easyBusboy, expect correct and indexed fields returned', async () => {
    const formData = await prepareFormData();
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      body: formData,
    });
    const { fields } = (await res.json()) as IEasyBusboyResponse;

    const textFields = formData.getAll('text');
    expect(textFields[0]).toEqual(fields['text'].value);
    expect(textFields[1]).toEqual(fields['text_2'].value);
    expect(textFields[2]).toEqual(fields['text_3'].value);
    expect(formData.get('json like field [123] {}')).toEqual(
      fields['json like field [123] {}'].value
    );
  });

  it('Fetch endpoint using easyBusboy, expect correct and indexed files returned', async () => {
    const formData = await prepareFormData();
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      body: formData,
    });
    const { files } = (await res.json()) as IEasyBusboyResponse;

    expect(file1.toJSON()).toEqual(files['file'].buffer);
    expect(file2.toJSON()).toEqual(files['file_2'].buffer);
    expect(file3.toJSON()).toEqual(files['file_3'].buffer);
  });

  it('Fetch endpoint exceeding fields limit, expect error', async () => {
    const formData = new FormData();
    for (const i of Array.from(Array(FIELDS_LIMIT + 10).keys())) {
      formData.append(`f_${i}`, 'x');
    }
    const { status } = await fetch(ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    expect(status).toEqual(500);
  }, 1000);

  const prepareFormData = async () => {
    const formData = new FormData();
    formData.append('text', 'read me or');
    formData.append('text', 'i will push the button');
    formData.append('text', '<rumbling>');
    formData.append('json like field [123] {}', 'what a mess');

    formData.append('file', new Blob([file1]));
    formData.append('file', new Blob([file2]));
    formData.append('file', new Blob([file3]));

    return formData;
  };
});
