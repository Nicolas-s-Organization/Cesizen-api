import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ message: "Le nom est requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .transform((val) => val.trim()),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
