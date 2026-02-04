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


export const getArticleById = async (req: Request, res: Response) => {
    try {
        const { articleId } = req.params;
        if (!articleId || typeof articleId !== "string") {
            throw new AppError("Identifiant de l'article invalide", "INVALID_ARTICLE_ID", 400);
        }
        
        const user = await articleService.getArticleById(articleId);

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