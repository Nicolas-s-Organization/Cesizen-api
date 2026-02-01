import type { Request, Response } from "express";

import * as authService from "../services/auth.service";
import { AppError } from "../utils/error";



export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstname,
      lastname,
      birthdate,
      description,
      role,
    } = req.body;

    const result = await authService.register({
      email,
      password,
      firstname,
      lastname,
      birthdate: new Date(birthdate),
      description,
      role,
    });

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
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.login({
      email,
      password,
    });

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