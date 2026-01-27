import { Request, Response } from "express";
import * as userService from "../services/user.service";


// GET /users → récupère tous les users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};