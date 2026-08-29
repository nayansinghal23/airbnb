import express from "express";
import dotenv from "dotenv";

import v1Router from "./routers/index.router";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1', v1Router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
