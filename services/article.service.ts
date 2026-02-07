import { prisma } from "../lib/prisma";

import { AppError } from "../utils/error";
import { CreateArticleInput } from "../schemas/article.schema";


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


