import express from "express";

import hotelRouter from "./hotel.router";
import roomGenerationRouter from "./roomGeneration.router";
import hotelUserRouter from "./hotelUser.router";

const v1Router = express.Router();

v1Router.use('/users/hotels', hotelUserRouter);
v1Router.use('/hotel', hotelRouter);
v1Router.use('/room', roomGenerationRouter);

export default v1Router;