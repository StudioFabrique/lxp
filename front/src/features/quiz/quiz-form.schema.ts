import { z } from "zod";
export const quizReportSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Renseignez le motif du signalement.")
    .max(2000),
});
