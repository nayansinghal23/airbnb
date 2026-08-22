import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import v1Router from "./routers";

import { rateLimitingMiddleware } from "./middlewares/rateLimitingMiddleware";
import { jwtAuthMiddlware } from "./middlewares/jwtAuthMiddleware";

import { proxy } from "./utils/proxy";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use('/api/v1', rateLimitingMiddleware);
app.use('/api/v1', jwtAuthMiddlware);

app.use(
  '/api/v1/booking',
  proxy(process.env.BOOKING_SERVICE_URL || "http://localhost:3000")
);

app.use(express.json());
app.use('/api/v1', v1Router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
