import { Request, Response } from "express";

import * as userService from "../services/user.service";
import { AppError } from "../utils/error";


// GET /users → récupère tous les users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};