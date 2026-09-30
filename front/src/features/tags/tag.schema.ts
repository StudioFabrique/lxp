import { z } from "zod";
import { requiredText, tagSchema } from "../../utils/validation/fields";
export const tagNameSchema = z.object({ name: requiredText("Le nom du tag est obligatoire.") });
export const tagSelectionSchema = z.object({ tags: z.array(tagSchema).min(1, "Ajoutez au moins un tag.") });
export const tagDraftSchema = z.object({ tag: z.string() });
