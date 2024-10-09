import express from 'express';
import { easyBusboy } from '../../../lib';
import type { IFields, IFiles } from '../../../lib';

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 3000;

const app = express();

app.post<{ fields: IFields; files: IFiles }>(
  '/upload-file',
  async (req, res) => {
    const { fields, files } = await easyBusboy(req);
    res.status(200).send({ fields, files });
  }
);

app.listen(PORT, () => {
  console.debug(`Express5 listening on localhost:${PORT} 🚀`);
});
