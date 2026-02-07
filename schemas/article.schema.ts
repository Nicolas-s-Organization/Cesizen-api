import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string({ message: "Le titre est requis" })
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères")
    .trim(),

  content: z
    .string({ message: "Le contenu est requis" })
    .min(10, "Le contenu doit contenir au moins 10 caractères")
    .max(5000, "Le contenu ne peut pas dépasser 5000 caractères")
    .trim(),

  categoryId: z
    .string({ message: "La catégorie est requise" })
    .refine((val) => /^[0-9a-fA-F-]{36}$/.test(val), { message: "ID de catégorie invalide" }),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),

  imagePath: z
    .string()
    .refine((val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, { message: "Le chemin de l'image doit être une URL valide" })
    .optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;


export const updateArticleSchema = createArticleSchema.partial();

export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;