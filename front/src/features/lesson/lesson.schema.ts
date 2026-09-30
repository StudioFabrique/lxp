import { z } from "zod";

export const activiteMetaDataSchema = z.object({
  title: z
    .string({ error: "Un titre est requis" })
    .trim().min(1, "Un titre est requis"),
  description: z.string().optional(),
});
