import { Request, Response } from "express";

import * as articleService from "../services/article.service";
// import { CreateCategoryInput, UpdateCategoryInput } from "../schemas/category.schema";
import { AppError } from "../utils/error";


export const getArticles = async (req: Request, res: Response) => {
    try {
        const articles = await articleService.getAllArticles();
        res.json(articles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};