import express from 'express';

import { getAllHotelsHandler } from '../controllers/hotel.controller';

const hotelUserRouter = express.Router();

hotelUserRouter.get('/', getAllHotelsHandler);

export default hotelUserRouter;