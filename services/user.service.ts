import { prisma } from "../lib/prisma";
import { AppError } from "../utils/error";

// export interface UserData {
//   firstname: string;
//   lastname: string;
//   birthdate: Date;
//   description?: string;
//   role: string;
//   isActive?: boolean;
// }


export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      trackerItems: true,
      articles: true,
      categories: true,
      emotions: true,
    },
  });
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