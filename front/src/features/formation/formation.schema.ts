import { z } from "zod";

export const formationSchema = z.object({
  title: z
    .string({ required_error: "Un titre est requis pour la formation." })
    .min(1, "Le titre est requis."),
  description: z.string().optional(),
  level: z
    .string({ required_error: "Le niveau de la formation est requis." })
    .min(1, "Le niveau est requis."),
  code: z.string().optional(),
});
