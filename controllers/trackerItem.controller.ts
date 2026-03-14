import { Request, Response } from "express";

import * as trackerItemService from "../services/trackerItem.service";
import { CreateTrackerItemInput, UpdateTrackerItemInput } from "../schemas/trackerItem.schema";
import { AppError } from "../utils/error";


export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}


export const getTrackerItems = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new AppError("Non authentifié", "UNAUTHORIZED", 401);
        }
        const trackerItems = await trackerItemService.getTrackerItems(req.user.id);
        res.status(200).json(trackerItems);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const getTrackerItemById = async (req: Request, res: Response) => {
    try {
        const { trackerItemId } = req.params;
        if (!trackerItemId || typeof trackerItemId !== "string") {
            throw new AppError("Identifiant de Tracker Item invalide", "INVALID_TRACKER_ID", 400);
        }

        const trackerItem = await trackerItemService.getEmotionById(trackerItemId);

        res.status(200).json(trackerItem);
    }
    catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }

        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const createTrackerItem = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new AppError("Non authentifié", "UNAUTHORIZED", 401);
        }

        const userId = req.user.id;
        const trackerItemdata = req.body as CreateTrackerItemInput;

        const trackerItem = await trackerItemService.createTrackerItem(userId, trackerItemdata);

        return res.status(201).json(trackerItem);
    }
    catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }

        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur", });
    }
};



export const updateTrackerItem = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new AppError("Non authentifié", "UNAUTHORIZED", 401);
        }

        const userId = req.user.id;
        const { trackerItemId } = req.params;
        const trackerItemData = req.body as UpdateTrackerItemInput;

        if (!trackerItemId || typeof trackerItemId !== "string") {
            throw new AppError("ID TrackerItem invalide", "INVALID_TRACKER_ITEM_ID", 400);
        }

        const updatedTrackerItem = await trackerItemService.updateTrackerItem(userId, trackerItemId, trackerItemData);

        return res.status(200).json(updatedTrackerItem);
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};


export const deletetrackerItem = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new AppError("Non authentifié", "UNAUTHORIZED", 401);
        }

        const userId = req.user.id;
        const { trackerItemId } = req.params;
        if (!trackerItemId || typeof trackerItemId !== "string") {
            throw new AppError("ID TrackerItem invalide", "INVALID_TRACKER_ITEM_ID", 400);
        }

        await trackerItemService.deleteTrackerItem(userId, trackerItemId);

        return res.status(200).json({ message: "Tracker Item supprimé avec succès" });
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    }
};
