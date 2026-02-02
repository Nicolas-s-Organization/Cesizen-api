import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const adminCheck = (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Non authentifié" });
    }

    if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Accès refusé, rôle administrateur requis" });
    }

    next();
};
