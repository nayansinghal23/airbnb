import { prisma } from "../lib/prisma"

export const getUserRoles = async (userId: number) => {
    const roles = await prisma.userRole.findMany({
        where: { userId },
        select: {
            role: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                }
            }
        }
    });
    return roles.map((r) => r.role) ?? [];
}

export const assingRoleToUser = async (userId: number, roleId: number) => {
    const role = await prisma.userRole.create({
        data: { userId, roleId },
    });
    return role;
}

export const removeRoleFromUser = async (userId: number, roleId: number) => {
    const role = await prisma.userRole.delete({
        where: {
            userId_roleId: {
                roleId,
                userId,
            }
        },
    });
    return role;
}

export const getUserPermissions = async (userId: number) => {
    const userRoles = await prisma.userRole.findMany({
        where: { userId },
        select: {
            role: {
                select: {
                    rolePermissions: {
                        select: {
                            permission: true,
                        }
                    }
                }
            }
        }
    });
    return userRoles.flatMap((userRole) =>
        userRole.role.rolePermissions.map(
            (rolePermission) => rolePermission.permission
        )
    );
}

export const hasPermission = async (userId: number, name: string) => {
    const permission = await prisma.rolePermission.findFirst({
      where: {
        role: {
          userRoles: {
            some: {
              userId,
            },
          },
        },
        permission: { name },
      },
    });
  
    return permission !== null;
};

export const userHasRole = async (userId: number, name: string) => {
    const userRole = await prisma.userRole.findFirst({
      where: {
        userId,
        role: { name },
      },
    });
  
    return userRole !== null;
};

export const hasAllRoles = async (userId: number, roleNames: string[]): Promise<boolean> => {
    const uniqueRoleNames = [...new Set(roleNames)];
  
    if (uniqueRoleNames.length === 0) {
      return true;
    }
  
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        role: {
          name: {
            in: uniqueRoleNames,
          },
        },
      },
      select: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  
    const userRoleNames = new Set(
      userRoles.map((userRole) => userRole.role.name)
    );
  
    return uniqueRoleNames.every((roleName) =>
      userRoleNames.has(roleName)
    );
};

export const hasAnyRole = async (userId: number,roleNames: string[]): Promise<boolean> => {
  if (roleNames.length === 0) {
    return true;
  }

  const userRoles = await prisma.userRole.findMany({
    where: {
      userId,
      role: {
        name: {
          in: roleNames,
        },
      },
    },
    select: {
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  const userRoleNames = new Set(
    userRoles.map((userRole) => userRole.role.name)
  );

  return roleNames.some((roleName) =>
    userRoleNames.has(roleName)
  );
};