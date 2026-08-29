import { Request, Response } from 'express';

import { encryptPassword } from '../utils/encryptPassword';
import { generateJWTToken } from '../utils/generateJWTToken';
import { verifyPassword } from '../utils/verifyPassword';

import { createUserService, fetchUserRoles, getUserProfile, loginService } from '../services/user.service';
import { assignUserRole } from '../services/roles.service';

export const createUserController = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await encryptPassword(req.body.password);
        if(!hashedPassword) {
            return res.status(500).json({
                message: "Unable to generate token"
            });
        }

        const existingUser = await loginService(req.body.email);
        if(existingUser) {
            return res.status(400).json({
                message: "User with this mail already exists"
            });
        }
    
        const user = await createUserService({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
    
        if(!user || !user.id) {
            return res.status(500).json({
                message: "Unable to create a user"
            });
        }
        
        const role = req.body.role;
        await assignUserRole(user.id, role === "admin" ? 1 : 2);
    
        const token = generateJWTToken(user.id, user.email);
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
        }).status(201).json({
            userId: user.id,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create a user",
        });
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
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
            message: "Login successfull",
            token,
            userId: user.id,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to login",
        });
    }
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

export const logOutController = async (req: Request, res: Response) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}

export const getUserRoles = async (req: Request, res: Response) => {
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
        const roles = await fetchUserRoles(id);
        if(roles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No role assigned to user",
            });
        }

        return res.status(200).json({
            success: true,
            role: roles[0].name,
            message: "User roles fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user roles",
        });
    }
}