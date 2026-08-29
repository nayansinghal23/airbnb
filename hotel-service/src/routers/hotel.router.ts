import express from "express";

import { createHotelHandler, fetchHotelsByOwnerIdHandler, findRoomCategoriesByHotelIdHandler, getAllHotelsHandler, getHotelByIdHandler, softDeleteHotelHandler } from "../controllers/hotel.controller";

import { validateBody } from "../middlewares/validate.middleware";

import { createHotelSchema } from "../validators/hotel.validator";

const hotelRouter = express.Router();

hotelRouter.post('/', validateBody(createHotelSchema), createHotelHandler);
hotelRouter.get('/', getAllHotelsHandler);
hotelRouter.get('/owner/:ownerId', fetchHotelsByOwnerIdHandler);
hotelRouter.get('/:hotelId', getHotelByIdHandler);
hotelRouter.get('/:hotelId/room-categories', findRoomCategoriesByHotelIdHandler);
hotelRouter.post('/:hotelId/delete', softDeleteHotelHandler);

export default hotelRouter;