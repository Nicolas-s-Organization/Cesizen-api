import { Request, Response } from "express";

import * as userService from "../services/user.service";
import { AppError } from "../utils/error";
import { UpdateUserInput } from "../schemas/user.schema";


export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}


// export const getUsers = async (req: Request, res: Response) => {
//     try {
//         const users = await userService.getAllUsers();
//         res.json(users);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
//     }
// };


export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, isActive, page = "1", limit = "10" } = req.query;

    const result = await userService.getAllUsers({
      search: search as string | undefined,
      role: role as string | undefined,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};


export const getUserById = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await userService.getUserById(userId);

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


export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const userData = req.body as UpdateUserInput;

    if (!userId || typeof userId !== "string") {
      throw new AppError("ID utilisateur invalide", "INVALID_USER_ID", 400);
    }

    const updatedUser = await userService.updateUser(userId, userData);

    return res.status(200).json(updatedUser);
  } 
  catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId || typeof userId !== "string") {
      throw new AppError("ID utilisateur invalide", "INVALID_USER_ID", 400);
    }

    await userService.deleteUser(userId);

    return res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } 
  catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
  }
};

