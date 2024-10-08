import express from 'express';
import { useBusboy } from '../../../lib';

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 3000;

const app = express();

app.post('/upload-file', async (req, res) => {
  const { fields, files } = await useBusboy(req);
  res.status(200).send({ fields, files });
});

app.listen(PORT, () => {
  console.debug(`Express5 listening on localhost:${PORT} 🚀`);
});
