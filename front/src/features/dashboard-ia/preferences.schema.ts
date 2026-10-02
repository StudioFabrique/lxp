import { z } from "zod";

export const dropoutPreferencesSchema = z.object({
  enabled: z.boolean(),
  frequency: z.enum(["weekly", "monthly"]),
  minCritical: z.union([z.literal(1), z.literal(2)]),
});
