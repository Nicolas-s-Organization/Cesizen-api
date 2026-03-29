import { prisma } from "../lib/prisma";
import fs from "fs";
import path from "path";

import { AppError } from "../utils/error";
import { CreateArticleInput, UpdateArticleInput } from "../schemas/article.schema";
import { ArticleStatus } from "../generated/prisma/enums";


// export const getAllArticles = async () => {
//     return prisma.article.findMany({
//         include: {
//             user: true,
//             category: true
//         },
//     });
// };


export const getAllArticles = async (params: {
    search?: string;
    categoryId?: string;
    status?: string;
    page?: number;
    limit?: number;
}) => {
    const { search, categoryId, status, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = {
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                { content: { contains: search, mode: "insensitive" as const } },
            ],
        }),
        ...(categoryId && { categoryId }),
        ...(status && { status: status as ArticleStatus }),
    };

    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                content: true,
                status: true,
                imagePath: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
        prisma.article.count({ where }),
    ]);

    return {
        data: articles,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
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


export const updateArticle = async (articleId: string, data: UpdateArticleInput) => {
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


export const deleteArticle = async (articleId: string) => {
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







