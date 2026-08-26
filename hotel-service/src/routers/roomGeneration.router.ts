import express from "express";

import { generateRoomsHandler } from "../controllers/roomGeneration.controller";
import { getAvailableRoomsHandler, updateBookingIdToRoomsHandler } from "../controllers/room.controller";

import { validateBody, validateQuery } from "../middlewares/validate.middleware";

import { roomGenerationJobSchema, roomGenerationTypeSchema } from "../validators/roomGeneration.validator";
import { getAvailableRoomsSchema, updateBookingIdToRoomsSchema } from "../validators/room.validator";

const roomGenerationRouter = express.Router();

roomGenerationRouter.post('/', validateBody(roomGenerationJobSchema), validateQuery(roomGenerationTypeSchema), generateRoomsHandler)
roomGenerationRouter.get('/available', validateQuery(getAvailableRoomsSchema), getAvailableRoomsHandler)
roomGenerationRouter.post('/update-booking-id', validateBody(updateBookingIdToRoomsSchema), updateBookingIdToRoomsHandler)

export default roomGenerationRouter;