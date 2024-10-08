import express from "express";
import { asyncBusboy } from "../lib";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/upload-file", async (req, res) => {
  console.debug(req.headers);
  const res2 = await asyncBusboy(req, {});
  console.debug("response from async busboy", res2);
  res.status(200).send(res2);
});

const port = 3000;

app.listen(port, () => {
  console.debug(`server listening on ${port}`);
});
