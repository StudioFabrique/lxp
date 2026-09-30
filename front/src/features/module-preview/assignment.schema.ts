import type { LessonWithActivitiesCount } from "../../utils/interfaces/lesson";
import { z } from "zod";
import { requiredText } from "../../utils/validation/fields";
export const assignmentFormSchema = z
  .object({
    required: z.boolean(),
    dueAt: z.string(),
    maxScore: z.number(),
    rubricVisible: z.boolean(),
    instructions: z.string(),
    criteria: z.array(
      z.object({ key: z.string(), label: z.string(), weight: z.number() }),
    ),
    files: z.array(z.custom<File>((value) => value instanceof File)),
    removeFileIds: z.array(z.number().int().positive()),
  })
  .superRefine((value, ctx) => {
    if (!value.required) return;
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });
    if (!value.dueAt || Number.isNaN(new Date(value.dueAt).getTime()))
      issue(["dueAt"], "Renseignez une date limite valide.");
    if (!value.instructions.trim())
      issue(["instructions"], "Renseignez les consignes du devoir.");
    if (!Number.isFinite(value.maxScore) || value.maxScore <= 0)
      issue(["maxScore"], "Le barème doit être positif.");
    value.criteria.forEach((criterion, index) => {
      if (!criterion.label.trim())
        issue(
          ["criteria", index, "label"],
          "Le critère doit avoir un libellé.",
        );
      if (!Number.isFinite(criterion.weight) || criterion.weight <= 0)
        issue(
          ["criteria", index, "weight"],
          "Le poids du critère doit être positif.",
        );
    });
    if (
      value.criteria.length &&
      Math.abs(
        value.criteria.reduce((sum, criterion) => sum + criterion.weight, 0) -
          value.maxScore,
      ) >= 0.001
    )
      issue(["criteria"], "Le total des critères doit correspondre au barème.");
  });
export const courseDetailsSchema = z.object({
  title: requiredText("Le titre est obligatoire."),
  description: z.string().trim(),
  visibility: z.boolean(),
  tagIds: z
    .array(z.number().int().positive())
    .min(1, "Sélectionnez au moins un tag."),
  assignment: assignmentFormSchema,
});
export const courseCreationSchema = courseDetailsSchema.extend({
  lessonTitles: z.array(requiredText()),
  selectedContents: z.array(
    z.custom<LessonWithActivitiesCount>((value) =>
      Boolean(
        value &&
        typeof value === "object" &&
        "id" in value &&
        typeof value.id === "number" &&
        value.id > 0 &&
        "source" in value &&
        ["lesson", "resource"].includes(String(value.source)),
      ),
    ),
  ),
});
export const lessonDetailsSchema = z.object({
  title: requiredText("Le titre est obligatoire."),
  description: z.string().trim(),
  modalite: z
    .string()
    .refine(
      (value) => ["distanciel", "presentiel", "hybride"].includes(value),
      "Choisissez une modalité valide.",
    ),
  tagId: z.number().int().positive("Sélectionnez un tag."),
});
export const gradeSchema = (maximum: number) =>
  z
    .number()
    .min(0, "La note doit être positive.")
    .max(maximum, "La note dépasse le barème.");
export const submissionSchema = z.object({
  text: z.string(),
  files: z.array(z.custom<File>((value) => value instanceof File)),
});
export const finalSubmissionSchema = submissionSchema
  .extend({ existingFileCount: z.number().int().nonnegative() })
  .refine(
    (value) =>
      Boolean(value.text.replace(/<[^>]*>/g, "").trim()) ||
      value.files.length > 0 ||
      value.existingFileCount > 0,
    { message: "Ajoutez un texte ou au moins un fichier.", path: ["text"] },
  );

export const gradingFormSchema = (
  maximum: number,
  criteria: { id: number; weight: number }[],
) =>
  z
    .object({
      scores: z.record(z.string(), z.number()),
      freeGrade: z.union([z.literal(""), z.number()]),
      feedback: z.string(),
    })
    .superRefine((value, ctx) => {
      if (!criteria.length) {
        if (
          value.freeGrade === "" ||
          !gradeSchema(maximum).safeParse(value.freeGrade).success
        )
          ctx.addIssue({
            code: "custom",
            path: ["freeGrade"],
            message: "La note doit être comprise entre 0 et le barème.",
          });
      } else
        criteria.forEach((criterion) => {
          if (
            !gradeSchema(criterion.weight).safeParse(
              value.scores[criterion.id] ?? 0,
            ).success
          )
            ctx.addIssue({
              code: "custom",
              path: ["scores", String(criterion.id)],
              message: "La note du critère dépasse les bornes autorisées.",
            });
        });
    });

export const courseTitleSchema = z.object({
  title: requiredText("Le titre du cours est obligatoire."),
});
