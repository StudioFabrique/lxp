import { z } from "zod";
import { createGroupSchema } from "../group/group.schema";
export const dropoutPreferencesSchema = z.object({
  enabled: z.boolean(),
  frequency: z.enum(["weekly", "monthly"]),
  minCritical: z.union([z.literal(1), z.literal(2)]),
  createGroupNext: z.boolean(),
  groupName: z.string(),
  parcoursId: z.number().int().nonnegative(),
  selectedStudents: z.record(z.string(), z.boolean()),
});
export const createPreferencesSchema = (createGroup: boolean) =>
  dropoutPreferencesSchema.superRefine((value, ctx) => {
    if (!createGroup || !value.createGroupNext) return;
    const group = createGroupSchema.safeParse({
      name: value.groupName,
      desc: "",
      formationId: 0,
      parcoursId: value.parcoursId,
    });
    if (!group.success)
      group.error.issues.forEach((issue) =>
        ctx.addIssue({
          code: "custom",
          path: [issue.path[0] === "name" ? "groupName" : "parcoursId"],
          message: issue.message,
        }),
      );
  });
