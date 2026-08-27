import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import v1Router from "./routers";

import { rateLimitingMiddleware } from "./middlewares/rateLimitingMiddleware";
import { jwtAuthMiddlware } from "./middlewares/jwtAuthMiddleware";

import { proxy } from "./utils/proxy";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: allow the frontend to call this service from the browser.
// In production set CORS_ORIGINS to a comma-separated allow-list of origins.
// In development (no CORS_ORIGINS set) any localhost origin is allowed.
const configuredOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : null;

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl/Postman) which send no Origin header.
      if (!origin) return callback(null, true);
      if (configuredOrigins) return callback(null, configuredOrigins.includes(origin));
      // Dev default: allow any localhost / 127.0.0.1 port.
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(cookieParser());

app.use('/api/v1', rateLimitingMiddleware);
app.use('/api/v1', jwtAuthMiddlware);

app.use(
  '/api/v1/booking',
  proxy(process.env.BOOKING_SERVICE_URL || "http://localhost:3000")
);

app.use(
  '/api/v1/hotel',
  proxy(process.env.HOTEL_SERVICE_URL || "http://localhost:3001")
);

app.use(express.json());
app.use('/api/v1', v1Router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
