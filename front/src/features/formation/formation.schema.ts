import { z } from "zod";
import { requiredText, optionalText, tagSchema } from "../../utils/validation/fields";
export const formationSchema = z.object({
  title: requiredText("Le titre est requis."), description: optionalText, code: optionalText,
  level: z.string().regex(/^[1-8]$/, "Sélectionnez un niveau entre 1 et 8."),
  tags: z.array(tagSchema).min(1, "Au moins un tag est requis pour enregistrer la formation."),
});
export type FormationFormValues = z.infer<typeof formationSchema>;
