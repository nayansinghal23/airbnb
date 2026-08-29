import express from 'express';

import { validate } from '../validators/validate';
import { createUserSchema, loginSchema } from '../validators/user.validator';

import { createUserController, getUserProfileController, logOutController, loginController } from '../controllers/user.controller';

import { confirmAnyRoleMiddleware } from '../middlewares/confirmAnyRoleMiddleWare';
import { getUserRoles } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/register', validate(createUserSchema), createUserController);
userRouter.post('/login', validate(loginSchema), loginController);
userRouter.post('/logout', logOutController);
userRouter.get('/user/:userId', confirmAnyRoleMiddleware('user', 'admin'), getUserProfileController);
userRouter.get('/user/:userId/roles', getUserRoles);

export default userRouter;
