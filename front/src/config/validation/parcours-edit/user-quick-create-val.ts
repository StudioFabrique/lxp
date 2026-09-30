import { z } from "zod";
import { informationSchema } from "../../../features/profile/schemas/info-schema";
export const userQuickCreateSchema = informationSchema.extend({ invitationSent: z.boolean() });
