import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string({ error: "Le nom du groupe est obligatoire" })
    .trim()
    .min(1, "Le nom du groupe est obligatoire"),
  desc: z.string(),
  formationId: z.number().int().nonnegative(),
  parcoursId: z
    .number()
    .int()
    .positive("Veuillez sélectionner le parcours associé au groupe"),
});

export type GroupFormValues = z.infer<typeof createGroupSchema>;
