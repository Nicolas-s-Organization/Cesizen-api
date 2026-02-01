import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

import { UserRole } from "../generated/prisma/enums"


export interface RegisterData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  description: string;
  role?: UserRole;
}


export const register = async (data: RegisterData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Un utilisateur avec cet email existe déjà");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const role = data.role && Object.values(UserRole).includes(data.role as UserRole)
  ? (data.role as UserRole)
  : UserRole.USER;


  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: data.birthdate,
      description: data.description,
      role: role,
      isActive: true,
    },
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

  return user;
};