export interface CreatePermissionDTO {
    name: string;
    description: string;
    resource: string;
    action: string;
}

export interface UpdatePermissionDTO {
    id: number;
    name: string;
    description?: string;
    resource: string;
    action: string;
}