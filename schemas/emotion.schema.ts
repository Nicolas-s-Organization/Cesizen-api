import { z } from "zod";

export const createEmotionSchema = z.object({
    name: z
        .string({ message: "Le nom de l'émotion est requis" })
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères")
        .trim(),

    level: z.number().refine(val => val === 1 || val === 2, {
        message: "Le niveau doit être 1 ou 2"
    }),

    parentId: z
        .string()
        .refine((val) => /^[0-9a-fA-F-]{36}$/.test(val), { message: "ID de catégorie invalide" })
        .optional(), // facultatif pour niveau 1
})
    .refine((data) => data.level === 2 ? !!data.parentId : true, {
        message: "Pour une émotion de niveau 2, parentId est requis",
        path: ["parentId"]
    })
    .refine((data) => data.level === 1 ? !data.parentId : true, {
        message: "Pour une émotion de niveau 1, parentId doit être absent",
        path: ["parentId"]
    });

export type CreateEmotionInput = z.infer<typeof createEmotionSchema>;


export const updateEmotionSchema = z.object({
  name: z
    .string({ message: "Le nom de l'émotion est requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .trim(),
});

export type UpdateEmotionInput = z.infer<typeof updateEmotionSchema>;