import { UserDTO } from "../dto/user.dto";

import { createUser, getUserByEmail, getUserById } from "../repositories/user.repository";

export const createUserService = async (dto: UserDTO) => await createUser(dto);

export const loginService = async (email: string) => await getUserByEmail(email);

export const getUserProfile = async (userId: number) => await getUserById(userId);