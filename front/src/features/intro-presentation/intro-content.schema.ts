import { z } from "zod";

/**
 * Réponses de l'API lues pour construire la présentation.
 *
 * Elles ne servent qu'à l'illustration : un champ absent ou mal formé ne doit
 * jamais bloquer l'affichage, on retombe alors sur les exemples.
 */
const titled = z.object({ title: z.string() });

export const introModulesSchema = z.array(
  z.object({ id: z.number(), title: z.string() }),
);

export const introModuleDetailSchema = z.object({
  data: z.object({
    courses: z
      .array(
        z.object({
          title: z.string(),
          lessons: z.array(z.object({ id: z.number(), title: z.string() })),
        }),
      )
      .optional(),
  }),
});

export const introLessonSchema = z.object({
  activities: z.array(titled.partial().extend({ type: z.string() })),
});

export type IntroModules = z.infer<typeof introModulesSchema>;
export type IntroModuleDetail = z.infer<typeof introModuleDetailSchema>;
export type IntroLesson = z.infer<typeof introLessonSchema>;
