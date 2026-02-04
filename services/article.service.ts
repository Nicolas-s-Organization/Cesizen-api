import { prisma } from "../lib/prisma";
import { AppError } from "../utils/error";


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