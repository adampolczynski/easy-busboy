import { IFiles } from '.';

const path = require('path');
const { createReadStream } = require('fs');
const { readFile } = require('fs/promises');

const { appendToResult, streamToBuffer } = require('./utils');

describe('appendToResult method', () => {
  const testFieldName = 'new_field';
  const testBuffer = Buffer.from([1]);
  const testPayload = {
    filename: 'name',
    encoding: 'utf8',
    nameTruncated: false,
    valueTruncated: false,
    mimeType: 'none',
  };
  const testPayload2 = {
    filename: 'name',
    encoding: 'utf8',
    nameTruncated: false,
    valueTruncated: false,
    mimeType: 'none',
  };

  it('appendToResult method should append field to object', () => {
    const obj: IFiles = {};
    appendToResult(obj, testFieldName, {
      buffer: testBuffer,
      info: testPayload,
    });
    expect(obj[testFieldName].buffer.equals(testBuffer)).toBeTruthy();
    expect(obj[testFieldName].info).toStrictEqual(testPayload);
  });
  it('appendToResult method should append existing fieldname as new property (indexed with number)', () => {
    const obj: IFiles = {
      [testFieldName]: { buffer: testBuffer, info: testPayload },
    };
    appendToResult(obj, testFieldName, {
      buffer: testBuffer,
      info: testPayload2,
    });
    expect(obj[testFieldName].buffer.equals(testBuffer)).toBeTruthy();
    expect(obj[testFieldName].info).toStrictEqual(testPayload);
    expect(obj[`${testFieldName}_2`].buffer.equals(testBuffer)).toBeTruthy();
    expect(obj[`${testFieldName}_2`].info).toStrictEqual(testPayload2);
  });
});

describe('streamToBuffer method', () => {
  it('streamToBuffer method should convert stream to buffer', async () => {
    const person1Buffer = await readFile(
      path.join(__dirname, '../examples/assets/person1.jpg')
    );
    const person1Stream = createReadStream(
      path.join(__dirname, '../examples/assets/person1.jpg')
    );
    const convertedPerson1Buffer = await streamToBuffer(person1Stream);

    expect(person1Buffer.equals(convertedPerson1Buffer)).toBeTruthy();
  });
});
