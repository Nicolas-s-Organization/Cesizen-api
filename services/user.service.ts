import { prisma } from "../lib/prisma";

export interface UserData {
  firstname: string;
  lastname: string;
  birthdate: Date;
  description?: string;
  role: string;
  isActive?: boolean;
}


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


// export const getUserById = async (id: number) => {
//   return prisma.user.findUnique({
//     where: { id },
//     include: {
//       trackerItems: true,
//       articles: true,
//       categories: true,
//       emotions: true,
//     },
//   });
// };


// export const createUser = async (data: UserData) => {
//   return prisma.user.create({
//     data,
//   });
// };


// export const updateUser = async (id: number, data: Partial<UserData>) => {
//   try {
//     return prisma.user.update({
//       where: { id },
//       data,
//     });
//   } catch (error) {
//     return null; 
//   }
// };


// export const deleteUser = async (id: number) => {
//   try {
//     return prisma.user.delete({
//       where: { id },
//     });
//   } catch (error) {
//     return null; 
//   }
// };