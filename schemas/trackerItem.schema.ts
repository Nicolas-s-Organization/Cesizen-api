import { z } from "zod";

export const createTrackerItemSchema = z.object({
  emotionId: z
    .string({ message: "L'émotion est requise" })
    .refine((val) => /^[0-9a-fA-F-]{36}$/.test(val), { message: "ID d'émotion invalide" }),

  intensity: z
    .number({ message: "L'intensité est requise" })
    .min(1, "L'intensité doit être au minimum 1")
    .max(5, "L'intensité doit être au maximum 10"),

  comment: z
    .string()
    .max(500, "Le commentaire est trop long")
    .optional(),
});

export type CreateTrackerItemInput = z.infer<
  typeof createTrackerItemSchema
>;


export const updateTrackerItemSchema = z.object({
  emotionId: z
    .string()
    .refine((val) => /^[0-9a-fA-F-]{36}$/.test(val), { message: "ID d'émotion invalide" })
    .optional(),
    
  intensity: z
    .number()
    .min(1)
    .max(10)
    .optional(),

  comment: z
    .string()
    .max(500, "Le commentaire est trop long")
    .optional()
    .nullable(),
});

export type UpdateTrackerItemInput = z.infer<
  typeof updateTrackerItemSchema
>;
