import { Request, Response } from "express";

import * as userService from "../services/user.service";
import { AppError } from "../utils/error";



export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const getUserById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    res.status(200).json(user);
  }
  catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }

    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};
