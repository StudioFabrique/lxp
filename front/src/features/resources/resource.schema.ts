import { z } from "zod";
import {
  requiredText,
  optionalText,
  tagSchema,
} from "../../utils/validation/fields";
export const resourceSchema = z.object({
  title: requiredText("Le titre est requis."),
  description: optionalText,
  tags: z.array(tagSchema),
  file: z.custom<File>((value) => value instanceof File).nullable(),
});
export type ResourceFormValues = z.infer<typeof resourceSchema>;
