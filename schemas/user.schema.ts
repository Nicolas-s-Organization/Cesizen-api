import { z } from "zod";

export const updateUserSchema = z.object({
  firstname: z
    .string({ message: "Le prénom est requis" })
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(2, "Le prénom doit contenir au moins 2 caractères")
        .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
    )
    .optional(),

  lastname: z
    .string({ message: "Le nom est requis" })
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères"),
    )
    .optional(),

  role: z
    .enum(["USER", "ADMIN"], {
      message: "Le rôle doit être l'un des suivants: USER, ADMIN",
    })
    .optional(),

  isActive: z.boolean({ message: "isActive doit être un booléen" }).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;