import express from "express";
import dotenv from "dotenv";

import { setupMailWorker } from "./processors/email.processor";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  setupMailWorker();
  console.log(`Server listening on port ${PORT}`);
});
