import { z } from "zod";
import { hobbySchema, linkSchema } from "../../utils/validation/fields";
export const learningChoicesSchema = z.object({
  pace: z.enum(["progressive", "standard", "intensive", "no_preference"]),
  preferences: z
    .array(
      z.enum([
        "concrete_examples",
        "step_by_step",
        "summary",
        "practical_exercises",
      ]),
    )
    .min(1, "Choisissez au moins une préférence."),
});
export const onboardingDraftSchema = learningChoicesSchema.extend({
  pace: learningChoicesSchema.shape.pace.nullable(),
  preferences: z.array(
    z.enum([
      "concrete_examples",
      "step_by_step",
      "summary",
      "practical_exercises",
    ]),
  ),
  levels: z.record(
    z.string(),
    z.enum(["beginner", "intermediate", "advanced", "unsure"]),
  ),
  hobbies: z.array(hobbySchema),
  links: z.array(linkSchema),
});
export function onboardingStepSchema(kind: string, moduleId?: number) {
  return onboardingDraftSchema.superRefine((values, context) => {
    if (["pace", "preferences", "learning", "summary"].includes(kind)) {
      const choicesSchema =
        kind === "pace"
          ? learningChoicesSchema.pick({ pace: true })
          : kind === "preferences"
            ? learningChoicesSchema.pick({ preferences: true })
            : learningChoicesSchema;
      const result = choicesSchema.safeParse(values);
      if (!result.success)
        result.error.issues.forEach((issue) =>
          context.addIssue({
            code: "custom",
            path: issue.path,
            message: issue.message,
          }),
        );
    }
    if (kind === "module" && moduleId && !values.levels[moduleId]) {
      context.addIssue({
        code: "custom",
        path: ["levels"],
        message: "Choisissez un niveau pour continuer.",
      });
    }
  });
}
export type OnboardingValues = z.infer<typeof onboardingDraftSchema>;
