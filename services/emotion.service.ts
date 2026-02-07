import { prisma } from "../lib/prisma";

import { AppError } from "../utils/error";
import { CreateEmotionInput, UpdateEmotionInput } from "../schemas/emotion.schema";



export const getEmotions = async () => {
    return prisma.emotion.findMany({
        where: {
            parentId: null,
        },
        include : {
            children : true
        },
        orderBy: {
            name: "asc",
        },
    });
};


export const getEmotionById = async (emotionId: string) => {
    const parentEmotion = await prisma.emotion.findFirst({
        where: { id: emotionId, parentId: null },
        include: {
            children: true
        }
    });

    if (!parentEmotion) {
        throw new AppError("Emotion parent introuvable", "EMOTION_NOT_FOUND", 404);
    }

    return parentEmotion;
}



export const createEmotion = async (userId: string, emotionData: CreateEmotionInput) => {
    const { name, level, parentId } = emotionData;
    // Vérification niveau 2 : parent doit exister
    if (level === 2) {
        const parent = await prisma.emotion.findUnique({
            where: { id: parentId }
        });

        if (!parent) {
            throw new AppError("L'émotion parent n'existe pas", "PARENT_NOT_FOUND", 400);
        }
    }

    // Vérification niveau 1 : pas de parent
    if (level === 1 && parentId) {
        throw new AppError("Une émotion de niveau 1 ne peut pas avoir de parent", "INVALID_PARENT", 400);
    }

    const existingEmotion = await prisma.emotion.findFirst({
        where: {
            name
        },
    });

    if (existingEmotion) {
        throw new AppError("Une emotion avec ce nom existe déjà", "EMOTION_ALREADY_EXISTS", 409);
    }

    const emotion = await prisma.emotion.create({
        data: {
            name: name,
            level: level,
            parentId: parentId || null,
            userId,
        }
    });

    return emotion;
};


export const updateEmotion = async (emotionId: string, emotionData: UpdateEmotionInput) => {
    const { name } = emotionData;

    const existingEmotion = await prisma.emotion.findUnique({
        where: { id: emotionId },
    });

    if (!existingEmotion) {
        throw new AppError("Émotion introuvable", "EMOTION_NOT_FOUND", 404);
    }


    const existingEmotionName = await prisma.emotion.findFirst({
        where: {
            name,
            id: { not: emotionId }
        },
    });

    if (existingEmotionName) {
        throw new AppError("Une autre emotion avec ce nom existe déjà", "EMOTION_ALREADY_EXISTS", 409);
    }

    const updatedEmotion = await prisma.emotion.update({
        where: { id: emotionId },
        data: {
            name,
        },
    });

    return updatedEmotion;
}


export const deleteEmotion = async (emotionId: string) => {
    const emotion = await prisma.emotion.findUnique({
        where: { id: emotionId },
        include: { children: true } // récupère les enfants si niveau 1
    });

    if (!emotion) {
        throw new AppError("Émotion introuvable", "EMOTION_NOT_FOUND", 404);
    }

    // Vérifie si niveau 1 et a des enfants
    if (emotion.level === 1 && emotion.children.length > 0) {
        throw new AppError("Impossible de supprimer une émotion de niveau 1 qui a des sous-émotions", "EMOTION_HAS_CHILDREN", 400);
    }

    await prisma.emotion.delete({
        where: { id: emotionId },
    });
};




