import type { ChatbotTutorial } from "./chatbot-tutorials";

export type ChatbotResolvedStep = { element: HTMLElement; message: string };

/** Vrai pour un élément réellement affiché : un contenu replié garde sa boîte de mise en page mais n'a plus de taille. */
const isShown = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return element.isConnected && rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== "hidden";
};

/** Étapes dont l'élément est présent à l'écran au lancement ; les autres sont sautées. */
export const resolveTutorialSteps = (tutorial: ChatbotTutorial, root: ParentNode = document): ChatbotResolvedStep[] =>
  tutorial.steps.flatMap((step) => {
    const element = root.querySelector<HTMLElement>(step.selector);
    return element && isShown(element) ? [{ element, message: step.message }] : [];
  });
