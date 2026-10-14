import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { getChatbotTutorials, type ChatbotTutorial } from "../chatbot-tutorials";
import { resolveTutorialSteps, type ChatbotResolvedStep } from "../chatbot-tutorial-steps";

type ActiveTutorial = { pathname: string; tutorial: ChatbotTutorial; steps: ChatbotResolvedStep[]; index: number };

/**
 * Tutoriel guidé par l'assistant virtuel : une étape à la fois, sur la page où il a été lancé. Il s'arrête
 * seul au changement de page, dont les éléments désignés n'existent plus.
 */
export default function useChatbotTutorial() {
  const { pathname } = useLocation();
  const [state, setState] = useState<ActiveTutorial | null>(null);
  const tutorials = useMemo(() => getChatbotTutorials(pathname), [pathname]);
  const active = state && state.pathname === pathname ? state : null;

  /** Lance un tutoriel, listé ou non dans l'éventail ; sans élément à montrer, l'assistant l'annonce. */
  const startTutorial = useCallback((tutorial: ChatbotTutorial) => {
    setState({ pathname, tutorial, steps: resolveTutorialSteps(tutorial), index: 0 });
  }, [pathname]);

  const start = useCallback((id: string) => {
    const tutorial = tutorials.find((entry) => entry.id === id);
    if (tutorial) startTutorial(tutorial);
  }, [tutorials, startTutorial]);

  const next = useCallback(() => {
    setState((current) => {
      if (!current) return current;
      return current.index + 1 < current.steps.length ? { ...current, index: current.index + 1 } : null;
    });
  }, []);

  const previous = useCallback(() => {
    setState((current) => (current && current.index > 0 ? { ...current, index: current.index - 1 } : current));
  }, []);

  const stop = useCallback(() => setState(null), []);

  /** Arrête le tutoriel `id` seulement : un autre tutoriel lancé entre-temps continue. */
  const stopTutorial = useCallback((id: string) => {
    setState((current) => (current?.tutorial.id === id ? null : current));
  }, []);

  return {
    tutorials,
    active,
    step: active ? (active.steps[active.index] ?? null) : null,
    start,
    startTutorial,
    next,
    previous,
    stop,
    stopTutorial,
  };
}
