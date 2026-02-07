import { Request, Response } from "express";

import * as emotionService from "../services/emotion.service";
import { CreateEmotionInput, UpdateEmotionInput } from "../schemas/emotion.schema";
import { AppError } from "../utils/error";


export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}


export const getEmotions = async (req: Request, res: Response) => {
    try {
        const emotions = await emotionService.getEmotions();
        res.status(200).json(emotions);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const getEmotionById = async (req: Request, res: Response) => {
    try {
        const { emotionId } = req.params;
        if (!emotionId || typeof emotionId !== "string") {
            throw new AppError("Identifiant de l'émotion invalide", "INVALID_EMOTION_ID", 400);
        }

        const emotion = await emotionService.getEmotionById(emotionId);

        res.status(200).json(emotion);
    }
    catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }

        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};



export const createEmotion = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new AppError("Utilisateur non authentifié", "UNAUTHORIZED", 401);
        }

        const userId = req.user.id;
        const emotionData = req.body as CreateEmotionInput;

        const emotion = await emotionService.createEmotion(userId, emotionData);

        return res.status(201).json(emotion);
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};



export const updateEmotion = async (req: AuthRequest, res: Response) => {
    try {
        const { emotionId } = req.params;
        const emotionData = req.body as UpdateEmotionInput;

        if (!emotionId || typeof emotionId !== "string") {
            throw new AppError("ID emotion invalide", "INVALID_ARTICLE_ID", 400);
        }

        const updatedEmotion = await emotionService.updateEmotion(emotionId, emotionData);

        return res.status(200).json(updatedEmotion);
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const deleteEmotion = async (req: AuthRequest, res: Response) => {
    try {
        const { emotionId } = req.params;
        if (!emotionId || typeof emotionId !== "string") {
            throw new AppError("ID emotion invalide", "INVALID_ARTICLE_ID", 400);
        }

        await emotionService.deleteEmotion(emotionId);

        return res.status(200).json({ message: "Emotion supprimée avec succès" });
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};



