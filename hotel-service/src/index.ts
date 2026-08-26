import express from "express";
import dotenv from "dotenv";

import v1Router from "./routers";

import { setupRoomGenerationWorker } from "./processors/roomGeneration.processor";

import { startScheduler } from "./scheduler/roomScheduler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1', v1Router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  setupRoomGenerationWorker();
  // startScheduler(); // Commenting it as it will keep on pushing in DB every minute.
});
