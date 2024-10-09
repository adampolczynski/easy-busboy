import type { Readable } from 'stream';
import { IFields, IFiles } from '.';

/**
 * Adds values into given object.
 * @param {Object} object Object that we want to append
 * @param {string} fieldname Fieldname that is going to point its value pair
 * Note: if fieldname repeats itself its gonna be indexed like {fieldname_2}
 * @param {IFieldRecord | IFileRecord} payload A value to be appended to object
 * @return {void}
 */
export const appendToResult = (
  obj: IFiles | IFields,
  fieldname: string,
  payload: IFields[string] | IFiles[string]
) => {
  if (obj[fieldname]) {
    if (obj[`${fieldname}_2`]) {
      const foundField = `${fieldname}_2`;
      const [lastChar] = foundField.slice(
        foundField.length - 1,
        foundField.length
      );

      obj[`${fieldname}_${parseInt(lastChar) + 1}`] = payload;
    } else {
      obj[`${fieldname}_2`] = payload;
    }
  } else {
    obj[fieldname] = payload;
  }
};

/**
 * Converts stream to buffer
 * @param {Readable} stream Stream to be converted
 * @return {Buffer} returns Buffer
 */
export const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise<Buffer>((res, rej) => {
    const buf = Array<Uint8Array>();

    stream.on('data', (chunk) => buf.push(chunk));
    stream.on('end', () => res(Buffer.concat(buf)));
    stream.on('error', (err) => rej(`streamToBuffer error - ${err}`));
  });
};
