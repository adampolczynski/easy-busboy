import axios from 'axios';
import { openAsBlob } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { IFields, IFiles } from '../../../lib/index';

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 3000;

(async () => {
  const formData = new FormData();
  formData.append('text', 'read me or');
  formData.append('text', 'i will push the button');
  formData.append('text', '<rumbling>');
  formData.append('json like field [123] {}', 'what a mess');

  const person1FilePath = path.join(__dirname, '../../assets/person1.jpg');
  const person2FilePath = path.join(__dirname, '../../assets/person2.jpg');
  const person3FilePath = path.join(__dirname, '../../assets/person3.jpg');
  const blob1 = await openAsBlob(person1FilePath);
  const blob2 = await openAsBlob(person2FilePath);
  const blob3 = await readFile(person3FilePath);

  formData.append('file', blob1);
  formData.append('file', blob2);
  formData.append('file', new Blob([blob3]));

  axios
    .post<{ fields: IFields; files: IFiles }>(
      `http://localhost:${PORT}/upload-file`,
      formData
    )
    .then(async ({ data }) => {
      console.debug(`Fields keys: ${Object.keys(data.fields).join(', ')}`);
      console.debug(`Files keys: ${Object.keys(data.files).join(', ')}`);

      const file = data.files['file'];
      await writeFile(
        path.join(__dirname, '/check.jpg'),
        Buffer.from(file.buffer)
      );
    })
    .catch((e) => {
      console.debug(e);
      process.exit(1);
    });
})();
