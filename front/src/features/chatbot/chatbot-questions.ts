import type { ChatbotTutorial } from "./chatbot-tutorials";

/** Entrée de l'éventail : une question envoyée à l'IA, une action ou un tutoriel. */
export type ChatbotQuestion =
  | { kind: "input" }
  | { kind: "prompt"; label: string }
  | { kind: "quiz"; label: string }
  | { kind: "tutorial"; label: string; tutorialId: string };

export const chatbotQuestionKey = (question: ChatbotQuestion): string =>
  question.kind === "input" ? "input" : question.kind === "tutorial" ? `tutorial:${question.tutorialId}` : `${question.kind}:${question.label}`;

type Context = {
  /** Faux quand les fonctionnalités IA sont désactivées sur l'instance : seuls les tutoriels restent. */
  aiEnabled: boolean;
  /** Serveur IA injoignable : le champ de question reste, grisé, pour garder l'accès à l'historique ; les tutoriels aussi. */
  aiUnavailable: boolean;
  /** Passage sélectionné dans une activité : les questions portent alors sur lui. */
  hasTextSelection: boolean;
  canSuggestQuiz: boolean;
  tutorials: ChatbotTutorial[];
  selectionPrompts: string[];
};

/**
 * Questions proposées selon le contexte, avec la même logique qu'avant : le passage sélectionné appelle
 * des questions sur ce contenu, une activité assez longue propose un quiz, le reste est général.
 */
export const buildChatbotQuestions = (context: Context): ChatbotQuestion[] => {
  const tutorials = context.tutorials.map((tutorial): ChatbotQuestion => ({ kind: "tutorial", label: tutorial.label, tutorialId: tutorial.id }));
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
