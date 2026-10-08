import { z } from "zod";

/**
 * Réponses de l'API lues pour construire la présentation.
 *
 * Elles ne servent qu'à l'illustration : un champ absent ou mal formé ne doit
 * jamais bloquer l'affichage, on retombe alors sur les exemples.
 */
const titled = z.object({ title: z.string() });

/** Liste facultative : un champ absent ou mal formé donne `undefined` sans rejeter la réponse. */
const optionalList = <T extends z.ZodType>(item: T) =>
  z.array(item).optional().catch(undefined);
const named = z.object({ name: z.string() });
const described = z.object({ description: z.string() });
const person = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
});

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
          tags: optionalList(named),
          objectives: optionalList(described),
        }),
      )
      .optional(),
    tags: optionalList(named),
    bonusSkills: optionalList(described),
    contacts: optionalList(person),
    duration: z.number().optional().catch(undefined),
  }),
});

/** Détails d'un parcours : tags, groupes, objectifs, compétences et contacts. */
export const introParcoursSchema = z.object({
  tags: optionalList(named),
  groups: optionalList(named),
  objectives: optionalList(described),
  skills: optionalList(described),
  contacts: optionalList(person),
});

export const introLessonSchema = z.object({
  activities: z.array(titled.partial().extend({ type: z.string() })),
  tag: named.optional().catch(undefined),
  modalite: z.string().optional().catch(undefined),
});

export type IntroModules = z.infer<typeof introModulesSchema>;
export type IntroModuleDetail = z.infer<typeof introModuleDetailSchema>;
export type IntroParcours = z.infer<typeof introParcoursSchema>;
export type IntroLesson = z.infer<typeof introLessonSchema>;
