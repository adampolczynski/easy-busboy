import axios from 'axios';
import { openAsBlob } from 'fs';
import path from 'path';

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 3000;

(async () => {
  const formData = new FormData();
  formData.append('text', 'read me or');
  formData.append('text', 'i will push the button');
  formData.append('text', 'rumbling');
  formData.append('some other text [123] {}', 'what a mess');

  const person1FilePath = path.join(__dirname, '../../assets/person1.jpg');
  const person2FilePath = path.join(__dirname, '../../assets/person2.jpg');
  const person3FilePath = path.join(__dirname, '../../assets/person3.jpg');
  const blob1 = await openAsBlob(person1FilePath);
  const blob2 = await openAsBlob(person2FilePath);
  const blob3 = await openAsBlob(person3FilePath);

  formData.append('file', blob1);
  formData.append('file', blob2);
  formData.append('file', blob3);

  axios
    .post(`http://localhost:${PORT}/upload-file`, formData)
    .then((res) => {
      console.warn(res);
    })
    .catch((e) => {
      console.debug(e);
      process.exit(1);
    });
})();
