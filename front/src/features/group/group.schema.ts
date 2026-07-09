import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string({ error: "Le nom du groupe est obligatoire" })
    .min(1, "Le nom du groupe est obligatoire"),
  desc: z.string().optional(),
});
