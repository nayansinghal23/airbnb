import express from 'express';

import { createBookingSchema } from '../validators/booking.validator';
import { validate } from '../validators/validate';

import { confrimBookingController, createBookingController, getBookingsForUserIdController } from '../controllers/booking.controller';

const bookingRouter = express.Router();

bookingRouter.post('/', validate(createBookingSchema), createBookingController);
bookingRouter.get('/user/:userId', getBookingsForUserIdController);
bookingRouter.post('/confirm/:idempotencyKey', confrimBookingController)

export default bookingRouter;