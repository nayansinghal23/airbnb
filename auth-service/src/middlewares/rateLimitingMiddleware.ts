import { rateLimit } from 'express-rate-limit';

export const rateLimitingMiddleware = rateLimit({
    windowMs: 1000, // 1 second
    limit: 5,       // 5 requests per second
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
    statusCode: 429,
});