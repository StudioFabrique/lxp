import { z } from "zod";

const requiredString = z.string().trim().min(1);

/**
 * Étape d'un tutoriel : l'assistant virtuel se place près de l'élément désigné et lit `message`.
 * `target` désigne un élément repéré par `data-chatbot-target` dans le code ; `selector` est un sélecteur CSS
 * pour les éléments déjà identifiables autrement (lien du menu, champ nommé, etc.). Une seule des deux clés.
 */
export const chatbotGuideStepSchema = z
  .object({ target: requiredString.optional(), selector: requiredString.optional(), message: requiredString })
  .refine((step) => (step.target === undefined) !== (step.selector === undefined), {
    message: "Une étape désigne son élément par `target` ou par `selector`, pas les deux.",
  });

/** Question de l'éventail : un tutoriel guidé (`steps`) ou une réponse préenregistrée affichée dans la bulle (`answer`). */
export const chatbotGuideQuestionSchema = z
  .object({
    id: requiredString,
    label: requiredString,
    steps: z.array(chatbotGuideStepSchema).min(1).optional(),
    answer: requiredString.optional(),
  })
  .refine((question) => (question.steps === undefined) !== (question.answer === undefined), {
    message: "Une question porte soit des `steps`, soit une `answer`.",
  });

export const chatbotGuideLayoutSchema = z.object({ questions: z.array(chatbotGuideQuestionSchema) });

/** Page du LXP : `routes` sont des motifs de chemin React Router (`/admin/user/edit/:id`), à correspondance exacte. */
export const chatbotGuidePageSchema = z.object({
  id: requiredString,
  title: requiredString,
  routes: z.array(z.string().startsWith("/")).min(1),
  questions: z.array(chatbotGuideQuestionSchema).min(1),
});

export const chatbotGuideSchema = z.object({
  /** Questions proposées sur toutes les pages d'une interface, après celles de la page. */
  layouts: z.object({ admin: chatbotGuideLayoutSchema, student: chatbotGuideLayoutSchema }),
  pages: z.array(chatbotGuidePageSchema),
});

export type ChatbotGuideStep = z.infer<typeof chatbotGuideStepSchema>;
export type ChatbotGuideQuestion = z.infer<typeof chatbotGuideQuestionSchema>;
export type ChatbotGuidePage = z.infer<typeof chatbotGuidePageSchema>;
export type ChatbotGuide = z.infer<typeof chatbotGuideSchema>;
