import express from "express";

import userRouter from "./user.router";
import rolesRouter from "./roles.router";

import { jwtAuthMiddlware } from "../middlewares/jwtAuthMiddleware";

const v1Router = express.Router();

v1Router.use(jwtAuthMiddlware);
v1Router.use('/', userRouter);
v1Router.use('/', rolesRouter);

export default v1Router;