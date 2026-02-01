import express from "express";
import { prisma } from './lib/prisma'
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";


async function main() {
    const app = express();
    const port = 3000;

    app.use(express.json());
    app.use(cookieParser()); 

    app.use("/users", userRoutes);
    app.use("/auth", authRoutes);

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