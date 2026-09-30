import { z } from "zod";
export const analysisFeedbackSchema = z.object({
  verdict: z
    .string()
    .refine(
      (value) =>
        [
          "appropriate",
          "overestimated",
          "underestimated",
          "uncertain",
        ].includes(value),
      "Choisissez un avis.",
    ),
  comment: z.string().trim().max(2000),
  actionTaken: z.string().trim().max(2000),
  outcome: z
    .string()
    .refine((value) => ["", "graduate", "fail", "dropout"].includes(value)),
});
export const feelingFeedbackSchema = z.object({
  feelingLevel: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .max(2000, "Le commentaire est limité à 2000 caractères."),
});
