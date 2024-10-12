import Busboy, { FieldInfo, FileInfo } from 'busboy';
import type { IncomingHttpHeaders, IncomingMessage } from 'http';
import type { Readable } from 'stream';

import { appendToResult, streamToBuffer } from './utils';

interface IFileRecord {
  buffer: Buffer;
  info: FileInfo;
}

interface IFieldRecord {
  value: string;
  info: FieldInfo;
}

export interface ITempFiles
  extends Record<
    string,
    Omit<IFileRecord, 'buffer'> & { promise: Promise<Buffer> }
  > {}
export interface IFiles extends Record<string, IFileRecord> {}
export interface IFields extends Record<string, IFieldRecord> {}

export interface IEasyBusboyResponse {
  files: IFiles;
  fields: IFields;
}

/**
 * * Main method to utilize busboy, accepts Express's request
 *   object and BusboyConfig
 * * When multiple files/fields with the same fieldname are provided
 * these going to be indexed automatically
 * @param {IncomingMessage & { headers: string }} request request object
 * @param {Busboy.BusboyConfig} config Optional busboy config
 * const instanceCfg = {
      limits: cfg.limits,
      headers,
      conType,
      highWaterMark: undefined,
      fileHwm: undefined,
      defCharset: undefined,
      defParamCharset: undefined,
      preservePath: false,
    };
 * @return {IEasyBusboyResponse} returns Promise<{ fields, files }>
 */
export const easyBusboy = (
  request: IncomingMessage & { headers: IncomingHttpHeaders; rawBody?: Buffer },
  config?: Busboy.BusboyConfig
): Promise<IEasyBusboyResponse> => {
  const files: IFiles = {};
  const tempFiles: ITempFiles = {};
  const fields: IFields = {};

  const opts = { ...(config ?? {}), headers: request.headers };

  const busboy = Busboy(opts);

  return new Promise((resolve, reject) => {
    const onField = (name: string, value: string, info: FieldInfo) => {
      // ignore prototype properties
      if (Object.getOwnPropertyDescriptor(Object.prototype, name)) return;

      appendToResult(fields, name, { value, info });
    };

    const onFile = (fieldname: string, stream: Readable, info: FileInfo) => {
      const tmpName = `${Math.random().toString(20).substring(2)}_${
        info.filename
      }`;

      appendToResult(tempFiles, fieldname, {
        promise: streamToBuffer(stream),
        info: { ...info, filename: tmpName },
      });
    };

    const onError = (err: Error) => {
      reject(err.message);
    };

    const onLimit = (type: 'parts' | 'files' | 'fields') => {
      const err = new Error(`${type} limit`);
      err.name = `Req_${type}_limit`;
      onError(err);
    };

    const onEnd = async () => {
      const fileKeys = Object.keys(tempFiles);
      if (fileKeys.length !== 0) {
        for await (const k of fileKeys) {
          const buffer = await tempFiles[k].promise;
          files[k] = {
            info: tempFiles[k].info,
            buffer,
          };
        }
      }
      resolve({
        fields,
        files,
      });
    };

    const cleanup = () => {
      request.removeListener('close', cleanup);
      busboy.removeListener('field', onField);
      busboy.removeListener('file', onFile);
      busboy.removeListener('partsLimit', () => onLimit('parts'));
      busboy.removeListener('filesLimit', () => onLimit('files'));
      busboy.removeListener('fieldsLimit', () => onLimit('fields'));
      busboy.removeListener('error', onError);
      busboy.removeListener('finish', onEnd);
    };

    busboy
      .on('field', onField)
      .on('file', onFile)
      .on('fieldsLimit', () => onLimit('parts'))
      .on('filesLimit', () => onLimit('files'))
      .on('partsLimit', () => onLimit('fields'))
      .on('error', onError)
      .on('finish', onEnd);

    if (request.rawBody) {
      busboy.end(request.rawBody);
    } else {
      request.on('close', cleanup);
      request.pipe(busboy);
    }
  });
};
