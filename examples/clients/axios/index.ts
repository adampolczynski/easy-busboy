import axios from 'axios';
import { openAsBlob } from 'fs';

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 3000;

const formData = new FormData();
formData.append('text', 'read me or');
formData.append('text', 'i will push the button');
formData.append('some other text [123] {}', 'what a mess');
formData.append('file', await openAsBlob('../assets/person1.jpg'));

axios
  .post(`http://localhost:${PORT}/upload-file`, {
    body: formData,
  })
  .then((res) => {
    console.warn(res);
  })
  .catch((e) => {
    process.exit(e);
  });
