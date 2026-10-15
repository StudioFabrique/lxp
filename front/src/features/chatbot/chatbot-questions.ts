import type { ChatbotTutorial } from "./chatbot-tutorials";

/** Nombre de questions du guide montrées à la fois : au-delà, « Autres questions » fait défiler les suivantes. */
export const GUIDE_PAGE_SIZE = 3;

/** Entrée de l'éventail : une question envoyée à l'IA, une action, un tutoriel ou une réponse du guide. */
export type ChatbotQuestion =
  | { kind: "input" }
  | { kind: "prompt"; label: string }
  | { kind: "quiz"; label: string }
  | { kind: "tutorial"; label: string; tutorialId: string }
  | { kind: "more"; label: string };

export const chatbotQuestionKey = (question: ChatbotQuestion): string => {
  if (question.kind === "input") return "input";
  if (question.kind === "tutorial") return `tutorial:${question.tutorialId}`;
  return `${question.kind}:${question.label}`;
};

/** Nombre de séries de questions du guide à faire défiler. */
export const guidePageCount = (tutorialCount: number): number => Math.max(1, Math.ceil(tutorialCount / GUIDE_PAGE_SIZE));

type Context = {
  /** Faux quand les fonctionnalités IA sont désactivées sur l'instance : seuls les tutoriels restent. */
  aiEnabled: boolean;
  /** Serveur IA injoignable : le champ de question reste, grisé, pour garder l'accès à l'historique ; les tutoriels aussi. */
  aiUnavailable: boolean;
  /** Passage sélectionné dans une activité : les questions portent alors sur lui. */
  hasTextSelection: boolean;
  canSuggestQuiz: boolean;
  tutorials: ChatbotTutorial[];
  /** Série de questions du guide affichée, à partir de 0 ; ramenée dans les limites si la liste a changé. */
  guidePage?: number;
  selectionPrompts: string[];
};

/**
 * Questions proposées selon le contexte, avec la même logique qu'avant : le passage sélectionné appelle
 * des questions sur ce contenu, une activité assez longue propose un quiz, le reste est général.
 */
export const buildChatbotQuestions = (context: Context): ChatbotQuestion[] => {
  const pages = guidePageCount(context.tutorials.length);
  const start = ((context.guidePage ?? 0) % pages) * GUIDE_PAGE_SIZE;
  const tutorials: ChatbotQuestion[] = [
    ...context.tutorials
      .slice(start, start + GUIDE_PAGE_SIZE)
      .map((tutorial): ChatbotQuestion => ({ kind: "tutorial", label: tutorial.label, tutorialId: tutorial.id })),
    ...(pages > 1 ? [{ kind: "more", label: "Autres questions" } as const] : []),
  ];
  if (!context.aiEnabled) return tutorials;
  if (context.aiUnavailable) return [{ kind: "input" }, ...tutorials];
  if (context.hasTextSelection) {
    return [...context.selectionPrompts.map((label): ChatbotQuestion => ({ kind: "prompt", label })), { kind: "input" }];
  }
  return [
    { kind: "input" },
    ...(context.canSuggestQuiz ? [{ kind: "quiz", label: "Générer un quiz" } as const] : []),
    ...tutorials,
  ];
};

/** Suggestions successives tirées d'une liste : le point de départ varie avec la graine et le passage, sans aléa au rendu. */
export const pickSelectionPrompts = (prompts: string[], seed: number, textSelection: string, count = 2): string[] => {
  if (prompts.length === 0) return [];
  const start = Math.floor(seed * prompts.length) + textSelection.length;
  return Array.from({ length: Math.min(count, prompts.length) }, (_, index) => prompts[(start + index) % prompts.length]);
};
