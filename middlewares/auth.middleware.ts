import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/error";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authMiddleware = async (req: AuthRequest,_res: Response,next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token manquant", "UNAUTHORIZED", 401);
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
        throw new AppError("Format du token invalide", "UNAUTHORIZED", 401);
    }

    let payload: { userId: string };

    try {
        payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };
    }
    catch {
        throw new AppError("Token invalide ou expiré", "UNAUTHORIZED", 401);
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
        },
    });

    if (!user || !user.isActive) {
        throw new AppError("Utilisateur non autorisé", "UNAUTHORIZED", 401);
    }

    req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    next();
};
