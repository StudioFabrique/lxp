import { z } from "zod";
import { informationSchema } from "../profile/schemas/info-schema";
import { hobbySchema, linkSchema, requiredText, optionalText, postCodeField, phoneField } from "../../utils/validation/fields";
export const graduationSchema = z.object({ _id: z.string().optional(), id: z.number().optional(),
  title: requiredText("Le diplôme est obligatoire."), degree: optionalText, date: z.coerce.date<Date>() });
export const userFormSchema = informationSchema.extend({
  nickname: optionalText, address: optionalText, city: optionalText, postCode: postCodeField, phoneNumber: phoneField,
  description: optionalText, birthDate: z.coerce.date<Date>().nullable().refine((value) => !value || value <= new Date(), "La date de naissance ne peut pas être future."),
  graduations: z.array(graduationSchema), links: z.array(linkSchema), hobbies: z.array(hobbySchema),
  roleId: z.string().nullable(), invitationSent: z.boolean(),
});
export type UserFormValues = z.infer<typeof userFormSchema>;
