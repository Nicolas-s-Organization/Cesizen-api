// app.ts
import express from "express";

// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum UserRole {\n  USER\n  ADMIN\n}\n\nenum ArticleStatus {\n  DRAFT\n  PUBLISHED\n  ARCHIVED\n}\n\nmodel User {\n  id          String   @id @default(uuid()) @db.Uuid\n  email       String   @unique\n  password    String\n  firstname   String\n  lastname    String\n  birthdate   DateTime\n  description String?\n  role        UserRole\n  isActive    Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  trackerItems  TrackerItem[]\n  articles      Article[]\n  categories    Category[]\n  emotions      Emotion[]\n  refreshTokens RefreshToken[]\n\n  @@map("users")\n}\n\nmodel TrackerItem {\n  id        String   @id @default(uuid()) @db.Uuid\n  userId    String   @db.Uuid\n  emotionId String   @db.Uuid\n  comment   String?\n  intensity Int\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  emotion Emotion @relation(fields: [emotionId], references: [id], onDelete: Cascade)\n\n  @@map("tracker_items")\n}\n\nmodel Emotion {\n  id        String   @id @default(uuid()) @db.Uuid\n  parentId  String?  @db.Uuid\n  userId    String   @db.Uuid\n  name      String\n  level     Int\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  parent       Emotion?      @relation("EmotionHierarchy", fields: [parentId], references: [id], onDelete: Restrict)\n  children     Emotion[]     @relation("EmotionHierarchy")\n  trackerItems TrackerItem[]\n\n  @@map("emotions")\n}\n\nmodel Article {\n  id         String        @id @default(uuid()) @db.Uuid\n  userId     String        @db.Uuid\n  categoryId String        @db.Uuid\n  title      String\n  content    String\n  status     ArticleStatus @default(DRAFT)\n  imagePath  String?\n  createdAt  DateTime      @default(now())\n  updatedAt  DateTime      @updatedAt\n\n  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  category Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n\n  @@map("articles")\n}\n\nmodel Category {\n  id        String   @id @default(uuid()) @db.Uuid\n  userId    String   @db.Uuid\n  name      String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  articles Article[]\n\n  @@map("categories")\n}\n\nmodel RefreshToken {\n  id        String   @id @default(uuid()) @db.Uuid\n  userId    String   @db.Uuid\n  token     String   @unique\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("refreshTokens")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"firstname","kind":"scalar","type":"String"},{"name":"lastname","kind":"scalar","type":"String"},{"name":"birthdate","kind":"scalar","type":"DateTime"},{"name":"description","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"trackerItems","kind":"object","type":"TrackerItem","relationName":"TrackerItemToUser"},{"name":"articles","kind":"object","type":"Article","relationName":"ArticleToUser"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"emotions","kind":"object","type":"Emotion","relationName":"EmotionToUser"},{"name":"refreshTokens","kind":"object","type":"RefreshToken","relationName":"RefreshTokenToUser"}],"dbName":"users"},"TrackerItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"emotionId","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"intensity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TrackerItemToUser"},{"name":"emotion","kind":"object","type":"Emotion","relationName":"EmotionToTrackerItem"}],"dbName":"tracker_items"},"Emotion":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"level","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"EmotionToUser"},{"name":"parent","kind":"object","type":"Emotion","relationName":"EmotionHierarchy"},{"name":"children","kind":"object","type":"Emotion","relationName":"EmotionHierarchy"},{"name":"trackerItems","kind":"object","type":"TrackerItem","relationName":"EmotionToTrackerItem"}],"dbName":"emotions"},"Article":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ArticleStatus"},{"name":"imagePath","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ArticleToUser"},{"name":"category","kind":"object","type":"Category","relationName":"ArticleToCategory"}],"dbName":"articles"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"articles","kind":"object","type":"Article","relationName":"ArticleToCategory"}],"dbName":"categories"},"RefreshToken":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"RefreshTokenToUser"}],"dbName":"refreshTokens"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("node:buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole = {
  USER: "USER",
  ADMIN: "ADMIN"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// app.ts
import cookieParser from "cookie-parser";
import path4 from "path";
import cors from "cors";

// utils/error.ts
var AppError = class extends Error {
  statusCode;
  code;
  constructor(message, code, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
};

// routes/user.routes.ts
import { Router } from "express";

// services/user.service.ts
var getAllUsers = async (params) => {
  const { search, role, isActive, page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;
  const where = {
    ...search && {
      OR: [
        { firstname: { contains: search, mode: "insensitive" } },
        { lastname: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    },
    ...role && { role },
    ...isActive !== void 0 && { isActive }
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
        birthdate: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
  ]);
  return {
    data: users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getUserById = async (id) => {
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
      updatedAt: true
    }
  });
  if (!user) {
    throw new AppError("Utilisateur introuvable", "USER_NOT_FOUND", 404);
  }
  return user;
};
var updateUser = async (id, data) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new AppError("Utilisateur introuvable", "USER_NOT_FOUND", 404);
  if (data.email && data.email !== existingUser.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email: data.email } });
    if (emailTaken) throw new AppError("Cet email est d\xE9j\xE0 utilis\xE9", "EMAIL_ALREADY_EXISTS", 409);
  }
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstname: true,
      birthdate: true,
      lastname: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var deleteUser = async (id) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new AppError("Utilisateur introuvable", "USER_NOT_FOUND", 404);
  return prisma.user.delete({ where: { id } });
};

// controllers/user.controller.ts
var getUsers = async (req, res) => {
  try {
    const { search, role, isActive, page = "1", limit = "10" } = req.query;
    const result = await getAllUsers({
      search,
      role,
      isActive: isActive !== void 0 ? isActive === "true" : void 0,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var getUserById2 = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var updateUser2 = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    if (!userId || typeof userId !== "string") {
      throw new AppError("ID utilisateur invalide", "INVALID_USER_ID", 400);
    }
    const updatedUser = await updateUser(userId, userData);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var deleteUser2 = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || typeof userId !== "string") {
      throw new AppError("ID utilisateur invalide", "INVALID_USER_ID", 400);
    }
    await deleteUser(userId);
    return res.status(200).json({ message: "Utilisateur supprim\xE9 avec succ\xE8s" });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};

// middlewares/auth.middleware.ts
import jwt from "jsonwebtoken";
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
var authMiddleware = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError("Token manquant", "UNAUTHORIZED", 401);
  }
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    throw new AppError("Format du token invalide", "UNAUTHORIZED", 401);
  }
  let payload;
  try {
    payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch {
    throw new AppError("Token invalide ou expir\xE9", "UNAUTHORIZED", 401);
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true
    }
  });
  if (!user || !user.isActive) {
    throw new AppError("Utilisateur non autoris\xE9", "UNAUTHORIZED", 401);
  }
  req.user = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  next();
};

// middlewares/role.middleware.ts
var adminCheck = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Non authentifi\xE9" });
  }
  if (user.role !== "ADMIN") {
    return res.status(403).json({ message: "Acc\xE8s refus\xE9, r\xF4le administrateur requis" });
  }
  next();
};

// middlewares/validate.ts
import { z } from "zod";
var validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }));
        return res.status(400).json({
          code: "VALIDATION_ERROR",
          message: "Erreur de validation",
          errors: formattedErrors
        });
      }
      return res.status(500).json({
        code: "INTERNAL_ERROR",
        message: "Erreur serveur"
      });
    }
  };
};

// schemas/user.schema.ts
import { z as z2 } from "zod";
var updateUserSchema = z2.object({
  firstname: z2.string({ message: "Le pr\xE9nom est requis" }).transform((val) => val.trim()).pipe(
    z2.string().min(2, "Le pr\xE9nom doit contenir au moins 2 caract\xE8res").max(50, "Le pr\xE9nom ne peut pas d\xE9passer 50 caract\xE8res")
  ).optional(),
  lastname: z2.string({ message: "Le nom est requis" }).transform((val) => val.trim()).pipe(
    z2.string().min(2, "Le nom doit contenir au moins 2 caract\xE8res").max(50, "Le nom ne peut pas d\xE9passer 50 caract\xE8res")
  ).optional(),
  email: z2.email({ message: "Format d'email invalide" }).min(1, "L'email est requis").transform((val) => val.toLowerCase().trim()).optional(),
  description: z2.string().trim().min(10, "La description doit contenir au moins 10 caract\xE8res").max(500, "La description ne peut pas d\xE9passer 500 caract\xE8res").optional(),
  birthdate: z2.string({ message: "La date de naissance est requise" }).min(1, "La date de naissance est requise").refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    },
    { message: "Format de date invalide" }
  ).refine(
    (date) => {
      const birthdateDate = new Date(date);
      const today = /* @__PURE__ */ new Date();
      return birthdateDate <= today;
    },
    { message: "La date de naissance ne peut pas \xEAtre dans le futur" }
  ).refine(
    (date) => {
      const birthdateDate = new Date(date);
      const today = /* @__PURE__ */ new Date();
      const age = today.getFullYear() - birthdateDate.getFullYear();
      return age <= 120;
    },
    { message: "Date de naissance invalide" }
  ).optional(),
  role: z2.enum(["USER", "ADMIN"], {
    message: "Le r\xF4le doit \xEAtre l'un des suivants: USER, ADMIN"
  }).optional(),
  isActive: z2.boolean({ message: "isActive doit \xEAtre un bool\xE9en" }).optional()
});

// routes/user.routes.ts
var router = Router();
router.get("/", authMiddleware, adminCheck, getUsers);
router.get("/:userId", authMiddleware, adminCheck, getUserById2);
router.put("/:userId", authMiddleware, adminCheck, validate(updateUserSchema), updateUser2);
router.delete("/:userId", authMiddleware, adminCheck, deleteUser2);
var user_routes_default = router;

// routes/auth.routes.ts
import { Router as Router2 } from "express";

// services/auth.service.ts
import bcrypt from "bcrypt";
import jwt2 from "jsonwebtoken";
import ms from "ms";
import argon2 from "argon2";
import { randomUUID } from "crypto";
var ACCESS_TOKEN_SECRET2 = process.env.ACCESS_TOKEN_SECRET;
var ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
var REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
var REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
var register = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });
  if (existingUser) {
    throw new AppError(
      "Un utilisateur avec cet email existe d\xE9j\xE0",
      "USER_ALREADY_EXISTS",
      400
    );
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const role = data.role && Object.values(UserRole).includes(data.role) ? data.role : UserRole.USER;
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: new Date(data.birthdate),
      description: data.description,
      role,
      isActive: true
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
      updatedAt: true
    }
  });
  return user;
};
var login = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
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
      "Ce compte est d\xE9sactiv\xE9",
      "INVALID_CREDENTIALS",
      403
    );
  }
  if (data.client === "web" && user.role !== "ADMIN") {
    throw new AppError("Acc\xE8s r\xE9serv\xE9 aux administrateurs", "FORBIDDEN", 403);
  }
  const { password, ...userWithoutPassword } = user;
  const accessToken = generateAccessToken(user.id);
  const refreshTokenId = randomUUID();
  const refreshToken3 = generateRefreshToken(refreshTokenId);
  await storeRefreshToken(refreshToken3, user.id, refreshTokenId);
  return { user: userWithoutPassword, accessToken, refreshToken: refreshToken3 };
};
var refreshToken = async (token) => {
  let payload;
  try {
    payload = jwt2.verify(token, REFRESH_TOKEN_SECRET);
  } catch {
    throw new AppError("Refresh token invalide", "INVALID_REFRESH_TOKEN", 401);
  }
  const storedToken = await prisma.refreshToken.findUnique({
    where: { id: payload.jti },
    include: { user: true }
  });
  if (!storedToken) {
    throw new AppError("Refresh token r\xE9voqu\xE9", "INVALID_REFRESH_TOKEN", 401);
  }
  if (storedToken.expiresAt < /* @__PURE__ */ new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError("Refresh token expir\xE9", "EXPIRED_REFRESH_TOKEN", 401);
  }
  const isValid = await argon2.verify(storedToken.token, token);
  if (!isValid) {
    throw new AppError("Refresh token invalide", "INVALID_REFRESH_TOKEN", 401);
  }
  const newAccessToken = generateAccessToken(storedToken.userId);
  return newAccessToken;
};
var getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      updatedAt: true
    }
  });
  if (!user) throw new AppError("Utilisateur introuvable", "USER_NOT_FOUND", 404);
  return user;
};
var updateMe = async (userId, data) => {
  if (data.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing && existing.id !== userId) {
      throw new AppError("Cet email est d\xE9j\xE0 utilis\xE9", "EMAIL_ALREADY_TAKEN", 400);
    }
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      ...data.birthdate && { birthdate: new Date(data.birthdate) }
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
      updatedAt: true
    }
  });
  return user;
};
var logout = async (refreshToken3) => {
  try {
    const payload = jwt2.verify(refreshToken3, REFRESH_TOKEN_SECRET);
    await prisma.refreshToken.delete({ where: { id: payload.jti } });
  } catch (_) {
  }
};
var changePassword = async (userId, data) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("Utilisateur introuvable", "USER_NOT_FOUND", 404);
  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) {
    throw new AppError("Mot de passe actuel incorrect", "INVALID_PASSWORD", 400);
  }
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
};
var generateAccessToken = (userId) => {
  const expiresIn = ACCESS_TOKEN_EXPIRES_IN || "15m";
  return jwt2.sign({ userId }, ACCESS_TOKEN_SECRET2, { expiresIn });
};
var generateRefreshToken = (tokenId) => {
  const expiresIn = REFRESH_TOKEN_EXPIRES_IN || "7d";
  return jwt2.sign({ jti: tokenId }, REFRESH_TOKEN_SECRET, { expiresIn });
};
var storeRefreshToken = async (refreshToken3, userId, refreshTokenId) => {
  const refreshTokenExpiresIn = REFRESH_TOKEN_EXPIRES_IN || "7d";
  const expiresAt = new Date(Date.now() + ms(refreshTokenExpiresIn));
  const hashedToken = await argon2.hash(refreshToken3);
  await prisma.refreshToken.create({
    data: {
      id: refreshTokenId,
      userId,
      token: hashedToken,
      expiresAt
    }
  });
};

// controllers/auth.controller.ts
var register2 = async (req, res) => {
  try {
    const data = req.body;
    const result = await register(data);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var login2 = async (req, res) => {
  try {
    const data = req.body;
    const { user, accessToken, refreshToken: refreshToken3 } = await login(data);
    if (data.client === "mobile") {
      return res.status(200).json({ user, accessToken, refreshToken: refreshToken3 });
    }
    res.cookie("refreshToken", refreshToken3, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 jours
    });
    res.status(200).json({
      user,
      accessToken
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var refreshToken2 = async (req, res) => {
  try {
    const refreshToken3 = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken3) {
      throw new AppError("Refresh token manquant", "NO_REFRESH_TOKEN", 401);
    }
    const accessToken = await refreshToken(refreshToken3);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var getMe2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Utilisateur non authentifi\xE9", "UNAUTHORIZED", 404);
    }
    const userId = req.user.id;
    const user = await getMe(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var updateMe2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Utilisateur non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    const user = await updateMe(req.user.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var logout2 = async (req, res) => {
  const refreshToken3 = req.cookies.refreshToken || req.body.refreshToken;
  if (refreshToken3) {
    await logout(refreshToken3);
  }
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "D\xE9connect\xE9" });
};
var changePassword2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Utilisateur non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    await changePassword(req.user.id, req.body);
    res.status(200).json({ message: "Mot de passe modifi\xE9 avec succ\xE8s" });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};

// schemas/auth.schema.ts
import { z as z3 } from "zod";
var registerSchema = z3.object({
  email: z3.email({ message: "Format d'email invalide" }).min(1, "L'email est requis").transform((val) => val.toLowerCase().trim()),
  password: z3.string({ message: "Le mot de passe est requis" }).min(8, "Le mot de passe doit contenir au moins 8 caract\xE8res").regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule").regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule").regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  firstname: z3.string({ message: "Le pr\xE9nom est requis" }).min(1, "Le pr\xE9nom est requis").transform((val) => val.trim()).pipe(
    z3.string().min(2, "Le pr\xE9nom doit contenir au moins 2 caract\xE8res").max(50, "Le pr\xE9nom ne peut pas d\xE9passer 50 caract\xE8res")
  ),
  lastname: z3.string({ message: "Le nom est requis" }).min(1, "Le nom est requis").transform((val) => val.trim()).pipe(
    z3.string().min(2, "Le nom doit contenir au moins 2 caract\xE8res").max(50, "Le nom ne peut pas d\xE9passer 50 caract\xE8res")
  ),
  birthdate: z3.string({ message: "La date de naissance est requise" }).min(1, "La date de naissance est requise").refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    },
    { message: "Format de date invalide" }
  ).refine(
    (date) => {
      const birthdateDate = new Date(date);
      const today = /* @__PURE__ */ new Date();
      return birthdateDate <= today;
    },
    { message: "La date de naissance ne peut pas \xEAtre dans le futur" }
  ).refine(
    (date) => {
      const birthdateDate = new Date(date);
      const today = /* @__PURE__ */ new Date();
      const age = today.getFullYear() - birthdateDate.getFullYear();
      return age <= 120;
    },
    { message: "Date de naissance invalide" }
  ),
  description: z3.string().min(10, "La description doit contenir au moins 10 caract\xE8res").max(500, "La description ne peut pas d\xE9passer 500 caract\xE8res").trim().optional(),
  role: z3.enum(["USER", "ADMIN"], {
    message: "Le r\xF4le doit \xEAtre l'un des suivants: USER, ADMIN"
  }).optional()
});
var loginSchema = z3.object({
  email: z3.email({ message: "Format d'email invalide" }).min(1, "L'email est requis").transform((val) => val.toLowerCase().trim()),
  password: z3.string({ message: "Le mot de passe est requis" }).min(1, "Le mot de passe est requis"),
  client: z3.enum(["web", "mobile"]).default("web")
});
var updateProfileSchema = updateUserSchema.omit({
  role: true,
  isActive: true
});
var changePasswordSchema = z3.object({
  currentPassword: z3.string().min(1, "Le mot de passe actuel est requis"),
  newPassword: z3.string({ message: "Le mot de passe est requis" }).min(8, "Le mot de passe doit contenir au moins 8 caract\xE8res").regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule").regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule").regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
});

// routes/auth.routes.ts
var router2 = Router2();
router2.post("/register", validate(registerSchema), register2);
router2.post("/login", validate(loginSchema), login2);
router2.post("/refresh", refreshToken2);
router2.get("/me", authMiddleware, getMe2);
router2.put("/me", authMiddleware, validate(updateProfileSchema), updateMe2);
router2.post("/logout", logout2);
router2.put("/me/password", authMiddleware, validate(changePasswordSchema), changePassword2);
var auth_routes_default = router2;

// routes/category.routes.ts
import { Router as Router3 } from "express";

// services/category.service.ts
var getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      articles: true
    }
  });
};
var createCategory = async (userId, name) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId,
      name
    }
  });
  if (existingCategory) {
    throw new AppError("Une cat\xE9gorie avec ce nom existe d\xE9j\xE0", "CATEGORY_ALREADY_EXISTS", 409);
  }
  const category = await prisma.category.create({
    data: {
      name,
      userId
    }
  });
  return category;
};
var updateCategory = async (categoryId, updateData) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    throw new AppError("Cat\xE9gorie introuvable", "CATEGORY_NOT_FOUND", 404);
  }
  if (updateData.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: updateData.name,
        NOT: { id: categoryId }
      }
    });
    if (existingCategory) {
      throw new AppError("Une cat\xE9gorie avec ce nom existe d\xE9j\xE0", "CATEGORY_ALREADY_EXISTS", 409);
    }
  }
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: updateData
  });
  return updatedCategory;
};
var deleteCategory = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: {
          articles: true
        }
      }
    }
  });
  if (!category) {
    throw new AppError("Cat\xE9gorie introuvable", "CATEGORY_NOT_FOUND", 404);
  }
  if (category._count.articles > 0) {
    throw new AppError("Impossible de supprimer une cat\xE9gorie contenant des articles", "CATEGORY_NOT_EMPTY", 400);
  }
  const updatedCategory = await prisma.category.delete({
    where: { id: categoryId }
  });
  return updatedCategory;
};

// controllers/category.controller.ts
var getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var createCategory2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Utilisateur non authentifi\xE9", "UNAUTHORIZED", 404);
    }
    const userId = req.user.id;
    const { name } = req.body;
    const category = await createCategory(userId, name);
    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId || typeof categoryId !== "string") {
      throw new AppError("Identifiant de cat\xE9gorie invalide", "INVALID_CATEGORY_ID", 400);
    }
    const updateData = req.body;
    const updatedCategory = await updateCategory(categoryId, updateData);
    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId || typeof categoryId !== "string") {
      throw new AppError("Identifiant de cat\xE9gorie invalide", "INVALID_CATEGORY_ID", 400);
    }
    const updatedCategory = await deleteCategory(categoryId);
    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};

// schemas/category.schema.ts
import { z as z4 } from "zod";
var createCategorySchema = z4.object({
  name: z4.string({ message: "Le nom est requis" }).min(2, "Le nom doit contenir au moins 2 caract\xE8res").max(100, "Le nom ne peut pas d\xE9passer 100 caract\xE8res").transform((val) => val.trim())
});
var updateCategorySchema = createCategorySchema.partial();

// routes/category.routes.ts
var router3 = Router3();
router3.get("/", getCategories);
router3.post("/", authMiddleware, adminCheck, validate(createCategorySchema), createCategory2);
router3.put("/:id", authMiddleware, adminCheck, validate(updateCategorySchema), updateCategory2);
router3.delete("/:id", authMiddleware, adminCheck, deleteCategory2);
var category_routes_default = router3;

// routes/article.routes.ts
import { Router as Router4 } from "express";

// services/article.service.ts
import fs from "fs";
import path2 from "path";
var getAllArticles = async (params) => {
  const { search, categoryId, status, page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;
  const where = {
    ...search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ]
    },
    ...categoryId && { categoryId },
    ...status && { status }
  };
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        imagePath: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    prisma.article.count({ where })
  ]);
  return {
    data: articles,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getArticleById = async (id) => {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      user: true,
      category: true
    }
  });
  if (!article) {
    throw new AppError("Article introuvable", "USER_NOT_FOUND", 404);
  }
  return article;
};
var createArticle = async (userId, articleData) => {
  const { title, content, categoryId, status } = articleData;
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId
    }
  });
  if (!category) {
    throw new AppError("Cat\xE9gorie introuvable", "CATEGORY_NOT_FOUND", 404);
  }
  const article = await prisma.article.create({
    data: {
      title,
      content,
      status,
      userId,
      categoryId
    }
  });
  return article;
};
var updateArticleImage = async (userId, articleId, imagePath) => {
  const article = await prisma.article.findFirst({
    where: {
      id: articleId,
      userId
    }
  });
  if (!article) {
    throw new AppError("Article introuvable", "ARTICLE_NOT_FOUND", 404);
  }
  if (article.imagePath) {
    const oldImagePath = path2.join(process.cwd(), article.imagePath);
    console.log(oldImagePath);
    fs.unlink(oldImagePath, (err) => {
      if (err) console.warn("Impossible de supprimer l'ancienne image :", err.message);
    });
  }
  return prisma.article.update({
    where: { id: articleId },
    data: { imagePath }
  });
};
var updateArticle = async (articleId, data) => {
  const article = await prisma.article.findFirst({
    where: {
      id: articleId
    }
  });
  if (!article) {
    throw new AppError("Article introuvable", "ARTICLE_NOT_FOUND", 404);
  }
  return prisma.article.update({
    where: { id: articleId },
    data
  });
};
var deleteArticle = async (articleId) => {
  const article = await prisma.article.findFirst({
    where: {
      id: articleId
    }
  });
  if (!article) {
    throw new AppError("Article introuvable", "ARTICLE_NOT_FOUND", 404);
  }
  if (article.imagePath) {
    const fullPath = path2.join(process.cwd(), article.imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) console.warn("Impossible de supprimer l'image :", err.message);
    });
  }
  await prisma.article.delete({
    where: { id: articleId }
  });
};

// controllers/article.controller.ts
var getArticles = async (req, res) => {
  try {
    const { search, categoryId, status, page = "1", limit = "10" } = req.query;
    const result = await getAllArticles({
      search,
      categoryId,
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var getArticleById2 = async (req, res) => {
  try {
    const { articleId } = req.params;
    if (!articleId || typeof articleId !== "string") {
      throw new AppError("Identifiant de l'article invalide", "INVALID_ARTICLE_ID", 400);
    }
    const user = await getArticleById(articleId);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var createArticle2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Utilisateur non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    const userId = req.user.id;
    const articleData = req.body;
    const article = await createArticle(userId, articleData);
    return res.status(201).json(article);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var uploadArticleImage = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Utilisateur non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    const { articleId } = req.params;
    if (!articleId || typeof articleId !== "string") {
      throw new AppError("ID article invalide", "INVALID_ARTICLE_ID", 400);
    }
    if (!req.file) {
      throw new AppError("Aucun fichier envoy\xE9", "NO_FILE", 400);
    }
    console.log(req.file);
    const imagePath = `/uploads/articles/${req.file.filename}`;
    const updatedArticle = await updateArticleImage(req.user.id, articleId, imagePath);
    return res.status(200).json(updatedArticle);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message
      });
    }
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Erreur serveur"
    });
  }
};
var updateArticle2 = async (req, res) => {
  try {
    const { articleId } = req.params;
    const articleData = req.body;
    if (!articleId || typeof articleId !== "string") {
      throw new AppError("ID article invalide", "INVALID_ARTICLE_ID", 400);
    }
    const updatedArticle = await updateArticle(articleId, articleData);
    return res.status(200).json(updatedArticle);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var deleteArticle2 = async (req, res) => {
  try {
    const { articleId } = req.params;
    if (!articleId || typeof articleId !== "string") {
      throw new AppError("ID article invalide", "INVALID_ARTICLE_ID", 400);
    }
    await deleteArticle(articleId);
    return res.status(200).json({ message: "Article supprim\xE9 avec succ\xE8s" });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};

// schemas/article.schema.ts
import { z as z5 } from "zod";
var createArticleSchema = z5.object({
  title: z5.string({ message: "Le titre est requis" }).min(3, "Le titre doit contenir au moins 3 caract\xE8res").max(200, "Le titre ne peut pas d\xE9passer 200 caract\xE8res").trim(),
  content: z5.string({ message: "Le contenu est requis" }).min(10, "Le contenu doit contenir au moins 10 caract\xE8res").max(5e3, "Le contenu ne peut pas d\xE9passer 5000 caract\xE8res").trim(),
  categoryId: z5.string({ message: "La cat\xE9gorie est requise" }).refine((val) => /^[0-9a-fA-F-]{36}$/.test(val), { message: "ID de cat\xE9gorie invalide" }),
  status: z5.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  imagePath: z5.string().refine((val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Le chemin de l'image doit \xEAtre une URL valide" }).optional()
});
var updateArticleSchema = createArticleSchema.partial();

// middlewares/upload.middleware.ts
import multer from "multer";
import path3 from "path";
import fs2 from "fs";
var uploadDir = path3.join(process.cwd(), "uploads/articles");
if (!fs2.existsSync(uploadDir)) {
  fs2.mkdirSync(uploadDir, { recursive: true });
}
var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path3.extname(file.originalname);
    const uniqueName = Date.now().toString() + ext;
    cb(null, uniqueName);
  }
});
var fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autoris\xE9es"));
  }
};
var uploadArticleImage2 = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
    // max 2MB
  }
});

// routes/article.routes.ts
var router4 = Router4();
router4.get("/", getArticles);
router4.get("/:articleId", getArticleById2);
router4.post("/", authMiddleware, adminCheck, validate(createArticleSchema), createArticle2);
router4.patch("/:articleId/image", authMiddleware, adminCheck, uploadArticleImage2.single("file"), uploadArticleImage);
router4.patch("/:articleId", authMiddleware, adminCheck, validate(updateArticleSchema), updateArticle2);
router4.delete("/:articleId", authMiddleware, adminCheck, deleteArticle2);
var article_routes_default = router4;

// routes/emotion.routes.ts
import { Router as Router5 } from "express";

// services/emotion.service.ts
var getEmotions = async () => {
  return prisma.emotion.findMany({
    where: {
      parentId: null
    },
    include: {
      children: true
    },
    orderBy: {
      name: "asc"
    }
  });
};
var getEmotionById = async (emotionId) => {
  const parentEmotion = await prisma.emotion.findFirst({
    where: { id: emotionId, parentId: null },
    include: {
      children: true
    }
  });
  if (!parentEmotion) {
    throw new AppError("Emotion parent introuvable", "EMOTION_NOT_FOUND", 404);
  }
  return parentEmotion;
};
var createEmotion = async (userId, emotionData) => {
  const { name, level, parentId } = emotionData;
  if (level === 2) {
    const parent = await prisma.emotion.findUnique({
      where: { id: parentId }
    });
    if (!parent) {
      throw new AppError("L'\xE9motion parent n'existe pas", "PARENT_NOT_FOUND", 400);
    }
  }
  if (level === 1 && parentId) {
    throw new AppError("Une \xE9motion de niveau 1 ne peut pas avoir de parent", "INVALID_PARENT", 400);
  }
  const existingEmotion = await prisma.emotion.findFirst({
    where: {
      name
    }
  });
  if (existingEmotion) {
    throw new AppError("Une emotion avec ce nom existe d\xE9j\xE0", "EMOTION_ALREADY_EXISTS", 409);
  }
  const emotion = await prisma.emotion.create({
    data: {
      name,
      level,
      parentId: parentId || null,
      userId
    }
  });
  return emotion;
};
var updateEmotion = async (emotionId, emotionData) => {
  const { name } = emotionData;
  const existingEmotion = await prisma.emotion.findUnique({
    where: { id: emotionId }
  });
  if (!existingEmotion) {
    throw new AppError("\xC9motion introuvable", "EMOTION_NOT_FOUND", 404);
  }
  const existingEmotionName = await prisma.emotion.findFirst({
    where: {
      name,
      id: { not: emotionId }
    }
  });
  if (existingEmotionName) {
    throw new AppError("Une autre emotion avec ce nom existe d\xE9j\xE0", "EMOTION_ALREADY_EXISTS", 409);
  }
  const updatedEmotion = await prisma.emotion.update({
    where: { id: emotionId },
    data: {
      name
    }
  });
  return updatedEmotion;
};
var deleteEmotion = async (emotionId) => {
  const emotion = await prisma.emotion.findUnique({
    where: { id: emotionId },
    include: { children: true }
    // récupère les enfants si niveau 1
  });
  if (!emotion) {
    throw new AppError("\xC9motion introuvable", "EMOTION_NOT_FOUND", 404);
  }
  if (emotion.level === 1 && emotion.children.length > 0) {
    throw new AppError("Impossible de supprimer une \xE9motion de niveau 1 qui a des sous-\xE9motions", "EMOTION_HAS_CHILDREN", 400);
  }
  await prisma.emotion.delete({
    where: { id: emotionId }
  });
};

// controllers/emotion.controller.ts
var getEmotions2 = async (req, res) => {
  try {
    const emotions = await getEmotions();
    res.status(200).json(emotions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var getEmotionById2 = async (req, res) => {
  try {
    const { emotionId } = req.params;
    if (!emotionId || typeof emotionId !== "string") {
      throw new AppError("Identifiant de l'\xE9motion invalide", "INVALID_EMOTION_ID", 400);
    }
    const emotion = await getEmotionById(emotionId);
    res.status(200).json(emotion);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var createEmotion2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Utilisateur non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    const userId = req.user.id;
    const emotionData = req.body;
    const emotion = await createEmotion(userId, emotionData);
    return res.status(201).json(emotion);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var updateEmotion2 = async (req, res) => {
  try {
    const { emotionId } = req.params;
    const emotionData = req.body;
    if (!emotionId || typeof emotionId !== "string") {
      throw new AppError("ID emotion invalide", "INVALID_ARTICLE_ID", 400);
    }
    const updatedEmotion = await updateEmotion(emotionId, emotionData);
    return res.status(200).json(updatedEmotion);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var deleteEmotion2 = async (req, res) => {
  try {
    const { emotionId } = req.params;
    if (!emotionId || typeof emotionId !== "string") {
      throw new AppError("ID emotion invalide", "INVALID_ARTICLE_ID", 400);
    }
    await deleteEmotion(emotionId);
    return res.status(200).json({ message: "Emotion supprim\xE9e avec succ\xE8s" });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};

// schemas/emotion.schema.ts
import { z as z6 } from "zod";
var createEmotionSchema = z6.object({
  name: z6.string({ message: "Le nom de l'\xE9motion est requis" }).min(2, "Le nom doit contenir au moins 2 caract\xE8res").max(50, "Le nom ne peut pas d\xE9passer 50 caract\xE8res").trim(),
  level: z6.number().refine((val) => val === 1 || val === 2, {
    message: "Le niveau doit \xEAtre 1 ou 2"
  }),
  parentId: z6.string().refine((val) => /^[0-9a-fA-F-]{36}$/.test(val), { message: "ID de cat\xE9gorie invalide" }).optional()
  // facultatif pour niveau 1
}).refine((data) => data.level === 2 ? !!data.parentId : true, {
  message: "Pour une \xE9motion de niveau 2, parentId est requis",
  path: ["parentId"]
}).refine((data) => data.level === 1 ? !data.parentId : true, {
  message: "Pour une \xE9motion de niveau 1, parentId doit \xEAtre absent",
  path: ["parentId"]
});
var updateEmotionSchema = z6.object({
  name: z6.string({ message: "Le nom de l'\xE9motion est requis" }).min(2, "Le nom doit contenir au moins 2 caract\xE8res").max(50, "Le nom ne peut pas d\xE9passer 50 caract\xE8res").trim()
});

// routes/emotion.routes.ts
var router5 = Router5();
router5.get("/", authMiddleware, getEmotions2);
router5.get("/:emotionId", authMiddleware, getEmotionById2);
router5.post("/", authMiddleware, adminCheck, validate(createEmotionSchema), createEmotion2);
router5.patch("/:emotionId", authMiddleware, adminCheck, validate(updateEmotionSchema), updateEmotion2);
router5.delete("/:emotionId", authMiddleware, adminCheck, deleteEmotion2);
var emotion_routes_default = router5;

// routes/trackerItem.routes.ts
import { Router as Router6 } from "express";

// services/trackerItem.service.ts
var getTrackerItems = async (userId) => {
  return prisma.trackerItem.findMany({
    where: { userId },
    include: {
      emotion: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getTrackerItemById = async (trackerItemId) => {
  const trackerItem = await prisma.trackerItem.findFirst({
    where: { id: trackerItemId },
    include: { emotion: true }
  });
  if (!trackerItem) {
    throw new AppError("Tracker Item introuvable", "EMOTION_NOT_FOUND", 404);
  }
  return trackerItem;
};
var createTrackerItem = async (userId, data) => {
  const { emotionId, intensity, comment } = data;
  const emotion = await prisma.emotion.findFirst({
    where: { id: emotionId }
  });
  if (!emotion) {
    throw new AppError("\xC9motion introuvable", "EMOTION_NOT_FOUND", 404);
  }
  if (emotion.level !== 2) {
    throw new AppError("Vous devez s\xE9lectionner une \xE9motion de niveau 2", "INVALID_EMOTION_LEVEL", 400);
  }
  const trackerItem = await prisma.trackerItem.create({
    data: {
      userId,
      emotionId,
      intensity,
      comment
    }
  });
  return trackerItem;
};
var updateTrackerItem = async (userId, trackerItemId, trackerItemData) => {
  const { intensity, comment, emotionId } = trackerItemData;
  const existingTrackerItem = await prisma.trackerItem.findUnique({
    where: { id: trackerItemId }
  });
  if (!existingTrackerItem) {
    throw new AppError("tracker item introuvable", "TRACKER_ITEM_NOT_FOUND", 404);
  }
  if (existingTrackerItem.userId !== userId) {
    throw new AppError("Ce tracker ne vous appartient pas", "FORBIDDEN", 403);
  }
  if (emotionId) {
    const emotion = await prisma.emotion.findFirst({
      where: { id: emotionId }
    });
    if (!emotion) {
      throw new AppError("\xC9motion introuvable", "EMOTION_NOT_FOUND", 404);
    }
    if (emotion.level !== 2) {
      throw new AppError("Vous devez s\xE9lectionner une \xE9motion de niveau 2", "INVALID_EMOTION_LEVEL", 400);
    }
  }
  const updatedTrackerItem = await prisma.trackerItem.update({
    where: { id: trackerItemId },
    data: {
      intensity,
      comment,
      ...emotionId && { emotionId }
    }
  });
  return updatedTrackerItem;
};
var deleteTrackerItem = async (userId, trackerItemId) => {
  const existingTrackerItem = await prisma.trackerItem.findUnique({
    where: { id: trackerItemId }
  });
  if (!existingTrackerItem) {
    throw new AppError("tracker item introuvable", "TRACKER_ITEM_NOT_FOUND", 404);
  }
  if (existingTrackerItem.userId !== userId) {
    throw new AppError("Ce tracker ne vous appartient pas", "FORBIDDEN", 403);
  }
  await prisma.trackerItem.delete({
    where: { id: trackerItemId }
  });
};
var getReports = async (userId, period) => {
  const now = /* @__PURE__ */ new Date();
  let startDate;
  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      break;
    case "month":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
      break;
    case "quarter":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3);
      break;
    case "year":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1e3);
      break;
    default:
      throw new AppError("P\xE9riode invalide", "INVALID_PERIOD", 400);
  }
  const trackerItems = await prisma.trackerItem.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: now
      }
    },
    include: {
      emotion: {
        include: {
          parent: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  const totalEntries = trackerItems.length;
  if (totalEntries === 0) {
    return {
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      totalEntries: 0,
      averageIntensity: 0,
      mostFrequentEmotion: null,
      distribution: [],
      averageIntensityByEmotion: [],
      intensityOverTime: []
    };
  }
  const averageIntensity = parseFloat(
    (trackerItems.reduce((sum, item) => sum + item.intensity, 0) / totalEntries).toFixed(1)
  );
  const emotionMap = /* @__PURE__ */ new Map();
  for (const item of trackerItems) {
    const parentEmotion = item.emotion.parent ?? item.emotion;
    const key = parentEmotion.id;
    if (!emotionMap.has(key)) {
      emotionMap.set(key, {
        name: parentEmotion.name,
        count: 0,
        totalIntensity: 0
      });
    }
    const entry = emotionMap.get(key);
    entry.count++;
    entry.totalIntensity += item.intensity;
  }
  const distribution = Array.from(emotionMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    count: data.count
  })).sort((a, b) => b.count - a.count);
  const mostFrequentEmotion = distribution[0] ?? null;
  const averageIntensityByEmotion = Array.from(emotionMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    average: parseFloat((data.totalIntensity / data.count).toFixed(1))
  })).sort((a, b) => b.average - a.average);
  const dailyMap = /* @__PURE__ */ new Map();
  for (const item of trackerItems) {
    const dateKey = item.createdAt.toISOString().split("T")[0];
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { total: 0, count: 0 });
    }
    const entry = dailyMap.get(dateKey);
    entry.total += item.intensity;
    entry.count++;
  }
  const intensityOverTime = Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    average: parseFloat((data.total / data.count).toFixed(1))
  })).sort((a, b) => a.date.localeCompare(b.date));
  return {
    period,
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    totalEntries,
    averageIntensity,
    mostFrequentEmotion,
    distribution,
    averageIntensityByEmotion,
    intensityOverTime
  };
};

// controllers/trackerItem.controller.ts
var getTrackerItems2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    const trackerItems = await getTrackerItems(req.user.id);
    res.status(200).json(trackerItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var getTrackerItemById2 = async (req, res) => {
  try {
    const { trackerItemId } = req.params;
    if (!trackerItemId || typeof trackerItemId !== "string") {
      throw new AppError("Identifiant de Tracker Item invalide", "INVALID_TRACKER_ID", 400);
    }
    const trackerItem = await getTrackerItemById(trackerItemId);
    res.status(200).json(trackerItem);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var createTrackerItem2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    const userId = req.user.id;
    const trackerItemdata = req.body;
    const trackerItem = await createTrackerItem(userId, trackerItemdata);
    return res.status(201).json(trackerItem);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var updateTrackerItem2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    const userId = req.user.id;
    const { trackerItemId } = req.params;
    const trackerItemData = req.body;
    if (!trackerItemId || typeof trackerItemId !== "string") {
      throw new AppError("ID TrackerItem invalide", "INVALID_TRACKER_ITEM_ID", 400);
    }
    const updatedTrackerItem = await updateTrackerItem(userId, trackerItemId, trackerItemData);
    return res.status(200).json(updatedTrackerItem);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var deletetrackerItem = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    const userId = req.user.id;
    const { trackerItemId } = req.params;
    if (!trackerItemId || typeof trackerItemId !== "string") {
      throw new AppError("ID TrackerItem invalide", "INVALID_TRACKER_ITEM_ID", 400);
    }
    await deleteTrackerItem(userId, trackerItemId);
    return res.status(200).json({ message: "Tracker Item supprim\xE9 avec succ\xE8s" });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
var getReports2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Non authentifi\xE9", "UNAUTHORIZED", 401);
    }
    const period = req.query.period || "month";
    const reports = await getReports(req.user.id, period);
    return res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};

// schemas/trackerItem.schema.ts
import { z as z7 } from "zod";
var createTrackerItemSchema = z7.object({
  emotionId: z7.string({ message: "L'\xE9motion est requise" }).refine((val) => /^[0-9a-fA-F-]{36}$/.test(val), { message: "ID d'\xE9motion invalide" }),
  intensity: z7.number({ message: "L'intensit\xE9 est requise" }).min(1, "L'intensit\xE9 doit \xEAtre au minimum 1").max(5, "L'intensit\xE9 doit \xEAtre au maximum 10"),
  comment: z7.string().max(500, "Le commentaire est trop long").optional()
});
var updateTrackerItemSchema = z7.object({
  emotionId: z7.string().refine((val) => /^[0-9a-fA-F-]{36}$/.test(val), { message: "ID d'\xE9motion invalide" }).optional(),
  intensity: z7.number().min(1).max(10).optional(),
  comment: z7.string().max(500, "Le commentaire est trop long").optional().nullable()
});

// routes/trackerItem.routes.ts
var router6 = Router6();
router6.get("/reports", authMiddleware, getReports2);
router6.get("/", authMiddleware, getTrackerItems2);
router6.get("/:trackerItemId", authMiddleware, getTrackerItemById2);
router6.post("/", authMiddleware, validate(createTrackerItemSchema), createTrackerItem2);
router6.patch("/:trackerItemId", authMiddleware, validate(updateTrackerItemSchema), updateTrackerItem2);
router6.delete("/:trackerItemId", authMiddleware, deletetrackerItem);
var trackerItem_routes_default = router6;

// app.ts
async function main() {
  const app = express();
  const port = 3e3;
  app.use(cors({
    origin: ["http://localhost:5173"],
    // à modifier pour la prod
    credentials: true
    // pour les cookies
  }));
  app.use(express.json());
  app.use(cookieParser());
  app.use("/auth", auth_routes_default);
  app.use("/users", user_routes_default);
  app.use("/categories", category_routes_default);
  app.use("/articles", article_routes_default);
  app.use("/uploads", express.static(path4.join(process.cwd(), "uploads")));
  app.use("/emotions", emotion_routes_default);
  app.use("/trackeritems", trackerItem_routes_default);
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app.use((err, req, res, _next) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ code: err.code, message: err.message });
    }
    console.error(err);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  });
  app.listen(port, () => {
    console.log(`Api CesiZen listening on port ${port}`);
  });
}
main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
