import { z } from "zod";
import { requiredText } from "../../utils/validation/fields";
export const roleFormSchema = z.object({
  name: requiredText("Le nom du rôle est obligatoire.").max(50),
  label: requiredText("Le libellé est obligatoire.").max(50),
  rank: z.number().int().min(0).max(4),
});
