import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: z.flattenError(result.error).fieldErrors,
        });
    }
    req.body = result.data;
    next();
};
