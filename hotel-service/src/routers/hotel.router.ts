import express from "express";

import { createHotelHandler, getHotelByIdHandler } from "../controllers/hotel.controller";

import { validateBody } from "../middlewares/validate.middleware";

import { createHotelSchema } from "../validators/hotel.validator";

const hotelRouter = express.Router();

hotelRouter.post('/', validateBody(createHotelSchema), createHotelHandler);
hotelRouter.get('/:hotelId', getHotelByIdHandler);

export default hotelRouter;