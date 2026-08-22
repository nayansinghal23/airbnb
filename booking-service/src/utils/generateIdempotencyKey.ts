import { randomUUID } from 'crypto';

export function generateIdempotencyKey(): string {
    return randomUUID();
}