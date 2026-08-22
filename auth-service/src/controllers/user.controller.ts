import { Request, Response } from 'express';

import { encryptPassword } from '../utils/encryptPassword';
import { generateJWTToken } from '../utils/generateJWTToken';
import { verifyJWTToken } from '../utils/verifyJWTToken';
import { verifyPassword } from '../utils/verifyPassword';

import { createUserService, getUserProfile, loginService } from '../services/user.service';

export const createUserController = async (req: Request, res: Response) => {
    const hashedPassword = await encryptPassword(req.body.password);
    if(!hashedPassword) {
        return res.status(500).json({
            message: "Unable to generate token"
        });
    }

    const user = await createUserService({
        ...req.body,
        password: hashedPassword,
    });

    if(!user || !user.id) {
        return res.status(500).json({
            message: "Unable to create a user"
        });
    }

    const token = generateJWTToken(user.id, user.email);
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000,
    }).status(201).json({
        userId: user.id,
    });
}

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await loginService(email);

    if(!user) {
        return res.status(401).json({
            message: "User not found"
        });
    }

    const isPasswordMatch = await verifyPassword(password, user.password);
    if(!isPasswordMatch) {
        return res.status(401).json({
            message: "Incorrect password"
        });
    }
    
    const token = generateJWTToken(user.id, user.email);
    return res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000,
    }).status(200).json({
        message: "Login successfull"
    });
}

export const getUserProfileController = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if(!userId) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const id = Number(userId);
    if(Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID",
        });
    }

    try {
        const user = await getUserProfile(id);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: `User with ${userId} doesn't exists`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user details",
        });
    }
}