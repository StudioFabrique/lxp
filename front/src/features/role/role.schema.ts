import { z } from "zod";
import { requiredText } from "../../utils/validation/fields";
export const roleOptionSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
  role: z.string(),
  label: z.string(),
  rank: z.number().int().min(0).max(4),
  protection: z.number().int().nonnegative(),
});
export const roleOptionsResponseSchema = z.object({
  data: z.array(roleOptionSchema),
});
export const roleFormSchema = z.object({
  name: requiredText("Le nom du rôle est obligatoire.").max(50),
  label: requiredText("Le libellé est obligatoire.").max(50),
  rank: z.number().int().min(0).max(4),
});
