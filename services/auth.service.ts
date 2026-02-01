import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import ms from "ms";

import { AppError } from "../utils/error";
import { UserRole } from "../generated/prisma/enums"
import type { RegisterInput, LoginInput } from "../schemas/auth.schema";


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN as string;


export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError(
      "Un utilisateur avec cet email existe déjà",
      "USER_ALREADY_EXISTS",
      400
    );
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


export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError(
      "Email ou mot de passe incorrect",
      "INVALID_CREDENTIALS",
      401
    );
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(
      "Email ou mot de passe incorrect",
      "INVALID_CREDENTIALS",
      401
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "Ce compte est désactivé",
      "INVALID_CREDENTIALS",
      403
    )
  }

  const { password, ...userWithoutPassword } = user;

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken();

  await storeRefreshToken(refreshToken, user.id);

  return { user: userWithoutPassword, accessToken, refreshToken };
};


export const refreshToken = async (token: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AppError("Refresh token invalide", "INVALID_REFRESH_TOKEN", 401);
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError("Refresh token expiré", "EXPIRED_REFRESH_TOKEN", 401);
  }

  const newAccessToken = generateAccessToken(storedToken.userId);

  return { accessToken: newAccessToken };
};



export const generateAccessToken = (userId: string) => {
  const expiresIn = (ACCESS_TOKEN_EXPIRES_IN || "15m") as NonNullable<SignOptions["expiresIn"]>;
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
};


export const generateRefreshToken = () => {
  const expiresIn = (REFRESH_TOKEN_EXPIRES_IN || "7d") as NonNullable<SignOptions["expiresIn"]>;
  return jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: expiresIn });
}


export const storeRefreshToken = async (refreshToken: string, userId: string,) => {
  const refreshTokenExpiresIn: string = REFRESH_TOKEN_EXPIRES_IN || "7d";
  const expiresAt = new Date(Date.now() + ms(refreshTokenExpiresIn as any));
  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt,
    },
  });
}





