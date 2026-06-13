import { z } from "zod";
import { updateUserSchema } from "./user.schema";


export const registerSchema = z.object({
  email: z
    .email({ message: "Format d'email invalide" })
    .min(1, "L'email est requis")
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string({ message: "Le mot de passe est requis" })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),

  firstname: z
    .string({ message: "Le prénom est requis" })
    .min(1, "Le prénom est requis")
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(2, "Le prénom doit contenir au moins 2 caractères")
        .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
    ),

  lastname: z
    .string({ message: "Le nom est requis" })
    .min(1, "Le nom est requis")
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères"),
    ),

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
    ),

  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .trim()
    .optional(),

  role: z
    .enum(["USER", "ADMIN"], {
      message: "Le rôle doit être l'un des suivants: USER, ADMIN",
    })
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
  email: z
    .email({ message: "Format d'email invalide" })
    .min(1, "L'email est requis")
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string({ message: "Le mot de passe est requis" })
    .min(1, "Le mot de passe est requis"),

  client: z.enum(["web", "mobile"]).default("web"),
});

export type LoginInput = z.infer<typeof loginSchema>;


export const updateProfileSchema = updateUserSchema.omit({
  role: true,
  isActive: true,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;


export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
  newPassword: z
    .string({ message: "Le mot de passe est requis" })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;


