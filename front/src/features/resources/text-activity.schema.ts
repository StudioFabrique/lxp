import { z } from "zod";
import { requiredText } from "../../utils/validation/fields";
export const textActivitySchema = z.object({ title: requiredText("Le titre est obligatoire."), content: z.string().refine((value) => value.replace(/<[^>]*>/g, "").trim().length > 0, "Le contenu est obligatoire.") });
