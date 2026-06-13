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

  email: z
    .email({ message: "Format d'email invalide" })
    .min(1, "L'email est requis")
    .transform((val) => val.toLowerCase().trim())
    .optional(),

  description: z
    .string()
    .trim()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),

  birthdate: z
    .string({ message: "La date de naissance est requise" })
    .min(1, "La date de naissance est requise")
    .refine(
      (date) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      },
      { message: "Format de date invalide" },
    )
    .refine(
      (date) => {
        const birthdateDate = new Date(date);
        const today = new Date();
        return birthdateDate <= today;
      },
      { message: "La date de naissance ne peut pas être dans le futur" },
    )
    .refine(
      (date) => {
        const birthdateDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthdateDate.getFullYear();
        return age <= 120;
      },
      { message: "Date de naissance invalide" },
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