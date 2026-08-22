import jwt from 'jsonwebtoken';

export function generateJWTToken(userId: number, email: string) {
    const token = jwt.sign(
        { userId, email },
        process.env.JWT_TOKEN || "learning-backend-development",
        {
            expiresIn: "1h",
        }
    );
    return token;
}