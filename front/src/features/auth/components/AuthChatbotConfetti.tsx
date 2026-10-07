import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useReward } from "react-rewards";
import { useReducedMotion } from "motion/react";
import { useVisualPreferences } from "../../../store/VisualPreferences";
import { chatbotMoveDurationMs } from "./auth-chatbot-motion";
import { chatbotAvatarSelector } from "./auth-chatbot-handoff";

type Source = { x: number; y: number };

// Le chatbot est placé après 350 ms puis glisse vers son emplacement : on attend qu'il se soit posé.
const settleDelayMs = 350 + chatbotMoveDurationMs + 150;
const pageAvatarSelector = `[data-chatbot-placement="page"] ${chatbotAvatarSelector}`;

// Même bibliothèque que FeedbacksButton. Un spread de 360° donne une explosion radiale ;
// decay et lifetime élevés laissent les pièces en suspension avant leur chute.
const rewardConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 16,
  elementCount: 60,
  decay: 0.92,
  lifetime: 200,
  position: "absolute",
} as const;

/** Éclate une seule fois des confettis depuis l'avatar du chatbot affiché sur la page. */
export default function AuthChatbotConfetti() {
  const { confetti } = useVisualPreferences();
  const reducedMotion = useReducedMotion();
  const rewardId = useId();
  const [source, setSource] = useState<Source | null>(null);
  const { reward } = useReward(rewardId, "confetti", rewardConfig);
  const enabled = confetti && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      const rect = document
        .querySelector<HTMLElement>(pageAvatarSelector)
        ?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      setSource({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }, settleDelayMs);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  // Le point d'origine est rendu avant le déclenchement : l'effet s'exécute après le commit.
  useEffect(() => {
    if (source) reward();
  }, [reward, source]);

  if (!enabled || !source) return null;
  return createPortal(
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1000] overflow-hidden">
      <span
        id={rewardId}
        className="absolute size-0"
        style={{ left: source.x, top: source.y }}
      />
    </div>,
    document.body,
  );
}
