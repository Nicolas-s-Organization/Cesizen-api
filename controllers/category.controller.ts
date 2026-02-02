import { Request, Response } from "express";

import * as categoryService from "../services/category.service";
import { AppError } from "../utils/error";


export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};
