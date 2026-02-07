import { Request, Response } from "express";

import * as articleService from "../services/article.service";
import { CreateArticleInput } from "../schemas/article.schema";
import { AppError } from "../utils/error";


export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

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


export const createArticle = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new AppError("Utilisateur non authentifié", "UNAUTHORIZED", 404);
        }

        const userId = req.user.id;
        const articleData = req.body as CreateArticleInput;

        const article = await articleService.createArticle(userId, articleData);

        return res.status(201).json(article);
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const uploadArticleImage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new AppError("Utilisateur non authentifié", "UNAUTHORIZED", 401);
        }

        const { articleId } = req.params;
        if (!articleId || typeof articleId !== "string") {
            throw new AppError("ID article invalide", "INVALID_ARTICLE_ID", 400);
        }

        if (!req.file) {
            throw new AppError("Aucun fichier envoyé", "NO_FILE", 400);
        }

        console.log(req.file);

        // chemin relatif enregistré en DB
        const imagePath = `/uploads/articles/${req.file.filename}`;

        const updatedArticle = await articleService.updateArticleImage(
            req.user.id,
            articleId,
            imagePath
        );

        return res.status(200).json(updatedArticle);
    }
    catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                code: error.code,
                message: error.message,
            });
        }

        return res.status(500).json({
            code: "INTERNAL_ERROR",
            message: "Erreur serveur",
        });
    }
};







