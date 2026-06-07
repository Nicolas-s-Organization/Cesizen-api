import express from "express";
import { prisma } from './lib/prisma'
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";

import { AppError } from "./utils/error";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import articleRoutes from "./routes/article.routes";
import emotionRoutes from "./routes/emotion.routes";
import trackerItempsRoutes from "./routes/trackerItem.routes";

async function main() {
    const app = express();
    const port = 3000;

    app.use(cors({
        origin: ['http://localhost:5173'], // à modifier pour la prod
        credentials: true, // pour les cookies
    }))

    app.use(express.json());
    app.use(cookieParser());

    app.use("/auth", authRoutes);
    app.use("/users", userRoutes);
    app.use("/categories", categoryRoutes);
    app.use("/articles", articleRoutes);
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
    app.use("/emotions", emotionRoutes);
    app.use("/trackeritems", trackerItempsRoutes);

    // Route de santé (utilisée par le HEALTHCHECK Docker et le monitoring)
    app.get("/health", (_req: Request, res: Response) => {
        res.status(200).json({ status: "ok", "deployed": "via-watchtower" });
    });


    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({ code: err.code, message: err.message });
        }
        console.error(err);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Erreur serveur" });
    });

    app.listen(port, () => {
        console.log(`Api CesiZen listening on port ${port}`);
    })
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })