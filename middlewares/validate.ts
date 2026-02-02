import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          code: "VALIDATION_ERROR",
          message: "Erreur de validation",
          errors: formattedErrors,
        });
      }

      return res.status(500).json({
        code: "INTERNAL_ERROR",
        message: "Erreur serveur",
      });
    }
  };
};