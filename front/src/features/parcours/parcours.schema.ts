import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../config/constantes";

export const infosParCoursSchema = z.object({
  title: z
    .string({ error: "Le titre du parcours est obligatoire" })
    .trim()
    .min(1, "Le titre du parcours est obligatoire"),
  description: z.string().optional(),
});

export const moduleCreateSchema = z.object({
  moduleId: z.number().optional(),
  title: z
    .string({ error: "Un titre est requis pour le nouveau module" })
    .trim()
    .min(1, "Le titre du module est obligatoire")
    .trim()
    .min(1, "Ce champ est obligatoire.")
    .regex(regexGeneric, {
      message: "Le titre du module contient des caractères invalides",
    }),
  description: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La description du module contient des caractères invalides",
    })
    .optional()
    .default(""),
  duration: z
    .number({ error: "La durée du module est obligatoire" })
    .positive("La durée du module doit être supérieure à 0 heure"),
  quizInstructions: z
    .string({ error: "Les instructions pour le quiz sont obligatoires" })
    .trim()
    .trim()
    .min(1, "Les instructions pour le quiz sont obligatoires")
    .trim()
    .min(1, "Ce champ est obligatoire.")
    .regex(regexGeneric, {
      message:
        "Les instructions du professeur du module contiennent des caractères invalides",
    }),
});

export type ModuleCreateFormValues = z.input<typeof moduleCreateSchema>;

export const descriptionFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "La description est obligatoire.")
    .regex(regexGeneric),
});
export const newParcoursSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Donnez un titre à votre parcours")
    .regex(regexGeneric),
  formationId: z.number().int().positive("Sélectionnez une formation"),
});

export const parcoursImportSchema = z.object({
  formationChoice: z
    .union([z.number().int().positive(), z.literal("create")])
    .optional()
    .refine((value) => value !== undefined, "Sélectionnez une formation."),
  publishCourses: z.boolean(),
});
