import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "E-Mail-Adresse erforderlich.").email("Ungültige E-Mail-Adresse."),
  password: z.string().min(1, "Passwort erforderlich."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "E-Mail-Adresse erforderlich.").email("Ungültige E-Mail-Adresse."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mindestens 8 Zeichen."),
    passwordConfirm: z.string().min(1, "Bitte Passwort bestätigen."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwörter stimmen nicht überein.",
    path: ["passwordConfirm"],
  });

export const inviteUserSchema = z.object({
  email: z.string().trim().min(1, "E-Mail-Adresse erforderlich.").email("Ungültige E-Mail-Adresse."),
  fullName: z.string().trim().min(1, "Name erforderlich."),
  role: z.enum(["admin", "redakteur"]),
});
