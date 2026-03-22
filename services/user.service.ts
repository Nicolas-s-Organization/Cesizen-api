import { prisma } from "../lib/prisma";
import { UpdateUserInput } from "../schemas/user.schema";
import { AppError } from "../utils/error";
import { UserRole } from "../generated/prisma/enums";

// export interface UserData {
//   firstname: string;
//   lastname: string;
//   birthdate: Date;
//   description?: string;
//   role: string;
//   isActive?: boolean;
// }


// export const getAllUsers = async () => {
//   return prisma.user.findMany({
//     include: {
//       trackerItems: true,
//       articles: true,
//       categories: true,
//       emotions: true,
//     },
//   });
// };


export const getAllUsers = async (params: {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) => {
  const { search, role, isActive, page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { firstname: { contains: search, mode: "insensitive" as const } },
        { lastname: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(role && {  role: role as UserRole  }),
    ...(isActive !== undefined && { isActive }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      birthdate: true,
      description: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("Utilisateur introuvable","USER_NOT_FOUND",404);
  }

  return user;
};


export const updateUser = async (id: string, data: UpdateUserInput) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) throw new AppError("Utilisateur introuvable", "USER_NOT_FOUND", 404);

  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};


export const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  
  if (!existingUser) throw new AppError("Utilisateur introuvable", "USER_NOT_FOUND", 404);

  return prisma.user.delete({ where: { id } });
};