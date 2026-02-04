import { Request, Response } from "express";

import * as categoryService from "../services/category.service";
import { CreateCategoryInput, UpdateCategoryInput } from "../schemas/category.schema";
import { AppError } from "../utils/error";


export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}


export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const createCategory = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new AppError("Utilisateur non authentifié", "UNAUTHORIZED", 404);
        }

        const userId = req.user.id;
        const { name } = req.body as CreateCategoryInput;

        const category = await categoryService.createCategory(userId, name);

        return res.status(201).json(category);
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        if (!categoryId || typeof categoryId !== "string") {
            throw new AppError("Identifiant de catégorie invalide", "INVALID_CATEGORY_ID", 400);
        }
        const updateData = req.body as UpdateCategoryInput;

        const updatedCategory = await categoryService.updateCategory(categoryId, updateData);

        return res.status(200).json(updatedCategory);
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
         if (!categoryId || typeof categoryId !== "string") {
            throw new AppError("Identifiant de catégorie invalide", "INVALID_CATEGORY_ID", 400);
        }
        const updatedCategory = await categoryService.deleteCategory(categoryId);

        return res.status(200).json(updatedCategory);
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


