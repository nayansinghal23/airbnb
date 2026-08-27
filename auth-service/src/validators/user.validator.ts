import { z } from 'zod';

export const createUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 8 characters"),
    role: z.enum(['admin', 'user'])
});

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 8 characters"),
});