import express from 'express';
import bookingRouter from './booking.router';

const v1Router = express.Router();

v1Router.use('/booking', bookingRouter);

export default v1Router;