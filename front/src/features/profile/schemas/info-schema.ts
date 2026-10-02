import { z } from "zod";
import {
  emailField,
  requiredText,
  optionalText,
  phoneField,
  postCodeField,
  hobbySchema,
  linkSchema,
} from "../../../utils/validation/fields";

export const informationSchema = z.object({
  firstname: requiredText("Le prénom est obligatoire"),
  lastname: requiredText("Le nom est obligatoire"),
  email: emailField,
  nickname: optionalText.optional(),
  address: optionalText.optional(),
  city: optionalText.optional(),
  postCode: postCodeField.optional(),
  phoneNumber: phoneField.optional(),
});
export const profileInformationSchema = informationSchema.extend({
  hobbies: z.array(hobbySchema),
  links: z.array(linkSchema),
});
