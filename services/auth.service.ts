import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import ms from "ms";
import argon2 from "argon2";
import { randomUUID } from "crypto";

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

  const refreshTokenId = randomUUID();
  const refreshToken = generateRefreshToken(refreshTokenId);

  await storeRefreshToken(refreshToken, user.id, refreshTokenId);

  return { user: userWithoutPassword, accessToken, refreshToken };
};


export const refreshToken = async (token: string) => {
  let payload;
  try {
    payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as { jti: string };
  }
  catch {
    throw new AppError("Refresh token invalide", "INVALID_REFRESH_TOKEN", 401);
  }


  const storedToken = await prisma.refreshToken.findUnique({
    where: { id: payload.jti },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AppError("Refresh token révoqué", "INVALID_REFRESH_TOKEN", 401);
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError("Refresh token expiré", "EXPIRED_REFRESH_TOKEN", 401);
  }

  const isValid = await argon2.verify(storedToken.token, token);

  if (!isValid) {
    throw new AppError("Refresh token invalide", "INVALID_REFRESH_TOKEN", 401);
  }

  const newAccessToken = generateAccessToken(storedToken.userId);

  return newAccessToken;
};



export const generateAccessToken = (userId: string) => {
  const expiresIn = (ACCESS_TOKEN_EXPIRES_IN || "15m") as NonNullable<SignOptions["expiresIn"]>;
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
};


export const generateRefreshToken = (tokenId: string) => {
  const expiresIn = (REFRESH_TOKEN_EXPIRES_IN || "7d") as NonNullable<SignOptions["expiresIn"]>;
  return jwt.sign({ jti: tokenId }, REFRESH_TOKEN_SECRET, { expiresIn: expiresIn });
}


export const storeRefreshToken = async (refreshToken: string, userId: string, refreshTokenId: string) => {
  const refreshTokenExpiresIn: string = REFRESH_TOKEN_EXPIRES_IN || "7d";
  const expiresAt = new Date(Date.now() + ms(refreshTokenExpiresIn as any));
  const hashedToken = await argon2.hash(refreshToken);

  await prisma.refreshToken.create({
    data: {
      id: refreshTokenId,
      userId,
      token: hashedToken,
      expiresAt,
    },
  });
}





