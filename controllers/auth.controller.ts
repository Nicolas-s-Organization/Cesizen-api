import type { Request, Response } from "express";

import * as authService from "../services/auth.service";
import { AppError } from "../utils/error";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema";


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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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
    const refreshToken = req.cookies.refreshToken;
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

