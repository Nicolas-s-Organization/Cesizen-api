import type { Request, Response } from "express";

import * as authService from "../services/auth.service";
import { AppError } from "../utils/error";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema";


export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}


export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body as RegisterInput;

    const result = await authService.register(data);

    res.status(201).json(result);
  }
  catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const data = req.body as LoginInput;

    const { user, accessToken, refreshToken } = await authService.login(data);

    // Dans le cas d'un login depuis l'app mobile on ne veut pas envoyé le refresh token dans les cookies
    if (data.client === "mobile") {
      return res.status(200).json({ user, accessToken, refreshToken });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.status(200).json({
      user,
      accessToken,
    });
  }
  catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};


export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Si la requete vient de l'app web le refresh token est dans un cookie, si elle vient de l'app mobile elle est renvoyée dans le body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      throw new AppError("Refresh token manquant", "NO_REFRESH_TOKEN", 401);
    }

    const accessToken = await authService.refreshToken(refreshToken);

    res.status(200).json({ accessToken });
  }
  catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};


export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError("Utilisateur non authentifié", "UNAUTHORIZED", 404);
    }

    const userId = req.user.id;
    const user = await authService.getMe(userId);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};


export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Déconnecté" });
};

