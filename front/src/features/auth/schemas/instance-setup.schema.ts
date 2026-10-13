import { z } from "zod";
import { avatarImageMaxSize } from "../../../config/images-sizes";
import {
  instanceEmailSchema,
  instanceIdentitySchema,
} from "../../profile/schemas/instance-schema";

export const instanceSetupSchema = instanceIdentitySchema.extend({
  ...instanceEmailSchema.shape,
  logo: z.object({
    file: z.instanceof(File)
      .refine((file) => file.size <= avatarImageMaxSize, "Le logo ne doit pas dépasser 500 Ko.")
      .refine((file) => /^image\/(jpeg|png)$/.test(file.type) && /\.(jpe?g|png)$/i.test(file.name), "Choisissez un logo JPG ou PNG.")
      .nullable(),
    url: z.string().nullable(),
  }),
});

export type InstanceSetupValues = z.infer<typeof instanceSetupSchema>;
