import express from "express";

import { assignRoleToUser, getAllRolesController, getRoleByIdController } from "../controllers/roles.controller";

import { fetchAllRolesMiddleware } from "../middlewares/fetchAllRolesMiddleware";

const rolesRouter = express.Router();

rolesRouter.get('/roles', getAllRolesController);
rolesRouter.get('/roles/:roleId', getRoleByIdController);
rolesRouter.post('/roles/:userId/assign/:roleId',  fetchAllRolesMiddleware('admin'), assignRoleToUser); // only admins can assign a role
export default rolesRouter;