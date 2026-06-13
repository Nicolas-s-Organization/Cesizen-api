import { Request, Response, NextFunction } from "express";


export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, birthdate, role } = req.body;


    if (!firstname || !lastname || !birthdate || !role) {
        return res.status(400).json({ error: "Missing required fields" });
    }


    if (isNaN(Date.parse(birthdate))) {
        return res.status(400).json({ error: "Invalid birthdate" });
    }

    next();
};