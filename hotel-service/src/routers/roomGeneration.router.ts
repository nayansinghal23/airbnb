import express from "express";

import { generateRoomsHandler } from "../controllers/roomGeneration.controller";

import { validateBody } from "../middlewares/validate.middleware";

import { roomGenerationJobSchema } from "../validators/roomGeneration.validator";

const roomGenerationRouter = express.Router();

roomGenerationRouter.post('/', validateBody(roomGenerationJobSchema), generateRoomsHandler)

export default roomGenerationRouter;