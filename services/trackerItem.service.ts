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


export const getReports = async (userId: string, period: string) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
        case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case "month":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case "quarter":
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case "year":
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            throw new AppError("Période invalide", "INVALID_PERIOD", 400);
    }

    const trackerItems = await prisma.trackerItem.findMany({
        where: {
            userId,
            createdAt: {
                gte: startDate,
                lte: now,
            },
        },
        include: {
            emotion: {
                include: {
                    parent: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const totalEntries = trackerItems.length;

    if (totalEntries === 0) {
        return {
            period,
            startDate: startDate.toISOString(),
            endDate: now.toISOString(),
            totalEntries: 0,
            averageIntensity: 0,
            mostFrequentEmotion: null,
            distribution: [],
            averageIntensityByEmotion: [],
            intensityOverTime: [],
        };
    }

    // Intensité moyenne globale
    const averageIntensity = parseFloat(
        (trackerItems.reduce((sum, item) => sum + item.intensity, 0) / totalEntries).toFixed(1)
    );

    // Distribution par émotion parente (level 1)
    const emotionMap = new Map<string, { name: string; count: number; totalIntensity: number }>();

    for (const item of trackerItems) {
        const parentEmotion = item.emotion.parent ?? item.emotion;
        const key = parentEmotion.id;

        if (!emotionMap.has(key)) {
            emotionMap.set(key, {
                name: parentEmotion.name,
                count: 0,
                totalIntensity: 0,
            });
        }

        const entry = emotionMap.get(key)!;
        entry.count++;
        entry.totalIntensity += item.intensity;
    }

    // Distribution
    const distribution = Array.from(emotionMap.entries())
        .map(([id, data]) => ({
            id,
            name: data.name,
            count: data.count,
        }))
        .sort((a, b) => b.count - a.count);

    // Émotion la plus fréquente
    const mostFrequentEmotion = distribution[0] ?? null;

    // Intensité moyenne par émotion
    const averageIntensityByEmotion = Array.from(emotionMap.entries())
        .map(([id, data]) => ({
            id,
            name: data.name,
            average: parseFloat((data.totalIntensity / data.count).toFixed(1)),
        }))
        .sort((a, b) => b.average - a.average);

    // Évolution de l'intensité par jour
    const dailyMap = new Map<string, { total: number; count: number }>();

    for (const item of trackerItems) {
        const dateKey = item.createdAt.toISOString().split("T")[0];

        if (!dailyMap.has(dateKey)) {
            dailyMap.set(dateKey, { total: 0, count: 0 });
        }

        const entry = dailyMap.get(dateKey)!;
        entry.total += item.intensity;
        entry.count++;
    }

    const intensityOverTime = Array.from(dailyMap.entries())
        .map(([date, data]) => ({
            date,
            average: parseFloat((data.total / data.count).toFixed(1)),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalEntries,
        averageIntensity,
        mostFrequentEmotion,
        distribution,
        averageIntensityByEmotion,
        intensityOverTime,
    };
};

