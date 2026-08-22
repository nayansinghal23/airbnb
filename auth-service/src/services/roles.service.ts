import { CreateRoleDTO, UpdateRoleDTO } from "../dto/role.dto";

import { addPermissionToRole, getRolePermissionByRoleId } from "../repositories/role_permissions.repository";
import { createRole, deleteRoleById, getAllRoles, getRoleById, getRoleByName, updateRole } from "../repositories/roles.repository";
import { assingRoleToUser, hasAllRoles, hasAnyRole } from "../repositories/user_roles.repository";

export const fetchRoleById = async (id: number) => getRoleById(id);

export const fetchRoleByName = async (name: string) => getRoleByName(name);

export const fetchAllRoles= async () => getAllRoles();

export const createNewRole = async (role: CreateRoleDTO) => createRole(role);

export const deleteRole = async (id: number) => deleteRoleById(id);

export const modifyRole = async (role: UpdateRoleDTO) => updateRole(role);

export const getRolePermissions = async (roleId: number) => getRolePermissionByRoleId(roleId);

export const addRolePermission = async (roleId: number, permissionId: number) => addPermissionToRole(roleId, permissionId);

export const checkPermission = async (userId: number, roles: string[]) => hasAllRoles(userId, roles);

export const assignUserRole = async (userId: number, roleId: number) => assingRoleToUser(userId, roleId);

export const contiansAnyRole = async (userId: number, roles: string[]) => hasAnyRole(userId, roles);