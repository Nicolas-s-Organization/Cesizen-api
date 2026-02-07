import { prisma } from "../lib/prisma";
import fs from "fs";
import path from "path";

import { AppError } from "../utils/error";
import { CreateArticleInput, UpdateArticleInput } from "../schemas/article.schema";


export const getAllArticles = async () => {
    return prisma.article.findMany({
        include: {
            user: true,
            category: true
        },
    });
};


export const getArticleById = async (id: string) => {
    const article = await prisma.article.findUnique({
        where: { id },
        include: {
            user: true,
            category: true
        },
    });

    if (!article) {
        throw new AppError("Article introuvable", "USER_NOT_FOUND", 404);
    }

    return article;
};


export const createArticle = async (userId: string, articleData: CreateArticleInput) => {
    const { title, content, categoryId, status } = articleData;

    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
        },
    });

    if (!category) {
        throw new AppError("Catégorie introuvable", "CATEGORY_NOT_FOUND", 404);
    }

    const article = await prisma.article.create({
        data: {
            title,
            content,
            status,
            userId,
            categoryId,
        },
    });

    return article;
};


export const updateArticleImage = async (userId: string, articleId: string, imagePath: string) => {
    // Vérifier que l’article appartient au user
    const article = await prisma.article.findFirst({
        where: {
            id: articleId,
            userId,
        },
    });

    if (!article) {
        throw new AppError("Article introuvable", "ARTICLE_NOT_FOUND", 404);
    }

    // Supprimer l'ancienne image si elle existe
    if (article.imagePath) {
        const oldImagePath = path.join(__dirname, "../../", article.imagePath);
        console.log(oldImagePath)

        fs.unlink(oldImagePath, (err) => {
            if (err) console.warn("Impossible de supprimer l'ancienne image :", err.message);
        });
    }
    // Update imagePath
    return prisma.article.update({
        where: { id: articleId },
        data: { imagePath },
    });
};


export const updateArticle = async (userId: string, articleId: string, data: UpdateArticleInput) => {
    const article = await prisma.article.findFirst({
        where: {
            id: articleId,
        },
    });

    if (!article) {
        throw new AppError("Article introuvable", "ARTICLE_NOT_FOUND", 404);
    }

    return prisma.article.update({
        where: { id: articleId },
        data,
    });
};


export const deleteArticle = async (userId: string, articleId: string) => {
    // Vérifier que l'article existe
    const article = await prisma.article.findFirst({
        where: {
            id: articleId
        },
    });

    if (!article) {
        throw new AppError("Article introuvable", "ARTICLE_NOT_FOUND", 404);
    }

    // Supprimer l'image si elle existe
    if (article.imagePath) {
        const fullPath = path.join(__dirname, "../../", article.imagePath);
        fs.unlink(fullPath, (err) => {
            if (err) console.warn("Impossible de supprimer l'image :", err.message);
        });
    }

    // Supprimer l'article en DB
    await prisma.article.delete({
        where: { id: articleId },
    });
};







