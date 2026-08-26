import express from "express";

import hotelRouter from "./hotel.router";
import roomGenerationRouter from "./roomGeneration.router";

const v1Router = express.Router();

v1Router.use('/hotel', hotelRouter);
v1Router.use('/room', roomGenerationRouter);

export default v1Router;