import express from 'express';
import { useBusboy } from '../../../lib';

const app = express();

app.post('/upload-file', async (req, res) => {
  const { fields, files } = await useBusboy(req);
  res.status(200).send({ fields, files });
});

const port = 3000;

app.listen(port, () => {
  console.debug(`server listening on ${port}`);
});
