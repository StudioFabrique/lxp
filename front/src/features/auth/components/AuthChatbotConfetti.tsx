import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useReward } from "react-rewards";
import { useReducedMotion } from "motion/react";
import { useVisualPreferences } from "../../../store/VisualPreferences";
import { chatbotAvatarSelector } from "./auth-chatbot-handoff";

type Source = { x: number; y: number };

const pageAvatarSelector = `[data-chatbot-placement="page"] ${chatbotAvatarSelector}`;
const pageBubbleSelector = '[data-chatbot-placement="page"] [data-chatbot-bubble]';
const pollMs = 100;
// Position identique sur ce nombre de relevés : le chatbot a fini de glisser.
const stableChecks = 3;
const giveUpMs = 10000;

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

  // Les confettis partent une fois le chatbot visible, immobile et son message affiché (plus de points d'attente).
  useEffect(() => {
    if (!enabled) return;
    let last = "";
    let stable = 0;
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (Date.now() - startedAt > giveUpMs) return window.clearInterval(timer);
      const avatar = document.querySelector<HTMLElement>(pageAvatarSelector);
      const host = avatar?.closest<HTMLElement>('[data-chatbot-placement="page"]');
      const rect = avatar?.getBoundingClientRect();
      const typing = document.querySelector(`${pageBubbleSelector} [role="status"]`) !== null;
      if (!rect || rect.width === 0 || !host || typing || getComputedStyle(host).visibility !== "visible") {
        stable = 0;
        return;
      }
      const key = `${Math.round(rect.left)}:${Math.round(rect.top)}`;
      stable = key === last ? stable + 1 : 0;
      last = key;
      if (stable < stableChecks) return;
      window.clearInterval(timer);
      setSource({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }, pollMs);
    return () => window.clearInterval(timer);
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
