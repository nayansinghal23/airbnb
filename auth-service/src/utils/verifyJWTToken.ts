import jwt from 'jsonwebtoken';

export function verifyJWTToken(token: string) {
    return jwt.verify(
        token,
        process.env.JWT_SECRET || "learning-backend-development"
    );
}