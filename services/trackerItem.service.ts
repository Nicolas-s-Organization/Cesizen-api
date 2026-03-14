import { prisma } from "../lib/prisma";

import { AppError } from "../utils/error";
import { CreateTrackerItemInput, UpdateTrackerItemInput } from "../schemas/trackerItem.schema";



export const getTrackerItems = async (userId: string) => {
    return prisma.trackerItem.findMany({
        where: { userId },
        include: {
            emotion: true
        }
    });
};


export const getEmotionById = async (trackerItemId: string) => {
    const trackerItem = await prisma.trackerItem.findFirst({
        where: { id: trackerItemId, },
    });

    if (!trackerItem) {
        throw new AppError("Tracker Item introuvable", "EMOTION_NOT_FOUND", 404);
    }

    return trackerItem;
}


export const createTrackerItem = async (userId: string, data: CreateTrackerItemInput) => {
    const { emotionId, intensity, comment } = data;

    const emotion = await prisma.emotion.findFirst({
        where: { id: emotionId },
    });

    if (!emotion) {
        throw new AppError("Émotion introuvable", "EMOTION_NOT_FOUND", 404);
    }

    if (emotion.level !== 2) {
        throw new AppError("Vous devez sélectionner une émotion de niveau 2", "INVALID_EMOTION_LEVEL", 400);
    }

    const trackerItem = await prisma.trackerItem.create({
        data: {
            userId,
            emotionId,
            intensity,
            comment,
        },
    });

    return trackerItem;
};


export const updateTrackerItem = async (userId: string, trackerItemId: string, trackerItemData: UpdateTrackerItemInput) => {
    const { intensity, comment } = trackerItemData;

    const existingTrackerItem = await prisma.trackerItem.findUnique({
        where: { id: trackerItemId },
    });

    if (!existingTrackerItem) {
        throw new AppError("tracker item introuvable", "TRACKER_ITEM_NOT_FOUND", 404);
    }

    if (existingTrackerItem.userId !== userId) {
        throw new AppError("Ce tracker ne vous appartient pas", "FORBIDDEN", 403);
    }

    const updatedTrackerItem = await prisma.trackerItem.update({
        where: { id: trackerItemId },
        data: {
            intensity,
            comment
        },
    });

    return updatedTrackerItem;
}


export const deleteTrackerItem = async (userId: string, trackerItemId: string) => {
    const existingTrackerItem = await prisma.trackerItem.findUnique({
        where: { id: trackerItemId },
    });

    if (!existingTrackerItem) {
        throw new AppError("tracker item introuvable", "TRACKER_ITEM_NOT_FOUND", 404);
    }

    if (existingTrackerItem.userId !== userId) {
        throw new AppError("Ce tracker ne vous appartient pas", "FORBIDDEN", 403);
    }

    await prisma.trackerItem.delete({
        where: { id: trackerItemId },
    });
};
