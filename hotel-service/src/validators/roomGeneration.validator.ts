import { z } from "zod";

export const roomGenerationSchema = z.object({
    roomCategoryId: z.number().positive(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
    scheduleType: z.enum(['immediate', 'scheduled']).default('immediate'),
    scheduledAt: z.iso.datetime().optional(),
    priceOverride: z.number().positive().optional(),
});

export const roomGenerationJobSchema = z.object({
    roomCategoryId: z.number().positive(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
    priceOverride: z.number().positive().optional(),
    batchSize: z.number().positive().default(100),
});