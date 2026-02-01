import type { Request, Response } from "express";
import * as authService from "../services/auth.service";


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
    if (error instanceof Error) {
      return res.status(400).json({ code: "BAD_REQUEST", message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};