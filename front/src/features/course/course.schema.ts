import { z } from "zod";

export const infosCourseSchema = z.object({
  title: z
    .string({ error: "Le titre du cours est obligatoire" })
    .trim().min(1, "Le titre du cours est obligatoire"),
  description: z.string().optional(),
  visibility: z.boolean(),
});
