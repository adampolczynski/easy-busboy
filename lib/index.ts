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
  request: IncomingMessage & { headers: IncomingHttpHeaders },
  config?: Busboy.BusboyConfig
): Promise<IEasyBusboyResponse> => {
  const files: IFiles = {};
  const fields: IFields = {};

  const opts = { ...(config ?? {}), headers: request.headers };

  const busboy = Busboy(opts);
  request.pipe(busboy);

  return new Promise((resolve, reject) => {
    const onField = (name: string, value: string, info: FieldInfo) => {
      // ignore prototype properties
      if (Object.getOwnPropertyDescriptor(Object.prototype, name)) return;

      appendToResult(fields, name, { value, info });
    };

    const onFile = async (
      fieldname: string,
      stream: Readable,
      info: FileInfo
    ) => {
      const tmpName = `${Math.random().toString(20).substring(2)}_${
        info.filename
      }`;

      appendToResult(files, fieldname, {
        buffer: await streamToBuffer(stream),
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

    const onEnd = () => {
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

    request.on('close', cleanup);

    busboy
      .on('field', onField)
      .on('file', onFile)
      .on('fieldsLimit', () => onLimit('parts'))
      .on('filesLimit', () => onLimit('files'))
      .on('partsLimit', () => onLimit('fields'))
      .on('error', onError)
      .on('finish', onEnd);
  });
};
