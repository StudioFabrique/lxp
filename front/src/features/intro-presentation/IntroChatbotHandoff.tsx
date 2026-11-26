import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

import type { ChatbotRect } from "../auth/components/auth-chatbot-placement";
import { chatbotAvatarSelector } from "../auth/components/auth-chatbot-handoff";
import { CHATBOT_CIRCLE_RATIO } from "./intro-chatbot-spot";
import { INTRO_CHATBOT_SETTLE_MS } from "./intro-chatbot-arrival";

/** Au plus long, la pastille s'efface même si l'avatar n'a jamais fini de charger. */
const MAX_VISIBLE_MS = 6000;

type Props = {
  /** Cadre de l'avatar là où la séquence précédente l'a laissé. */
  rect: ChatbotRect;
};

/** Vrai quand l'avatar de l'assistant virtuel est affiché : son animation est chargée et visible. */
const isAvatarShown = (): boolean => {
  const frame = document.querySelector<HTMLElement>(`[data-chatbot-placement="page"] ${chatbotAvatarSelector} iframe`);
  return frame !== null && Number.parseFloat(getComputedStyle(frame).opacity) >= 1;
};

/**
 * Pastille de l'assistant virtuel posée là où la séquence 3D l'a laissé, par-dessus son avatar, jusqu'à ce
 * qu'il soit affiché et prêt à se déplacer : sans elle l'assistant disparaîtrait un instant entre les deux
 * séquences, puis son geste de départ le ferait changer de taille.
 */
const IntroChatbotHandoff = ({ rect }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const started = Date.now();
    const poll = window.setInterval(() => {
      const elapsed = Date.now() - started;
      // L'avatar rejoue son geste de départ à l'arrivée : la pastille le masque jusqu'à ce qu'il se mette en route.
      // Elle laisse une image à l'avatar pour se peindre avant de disparaître.
      if ((isAvatarShown() && elapsed >= INTRO_CHATBOT_SETTLE_MS) || elapsed > MAX_VISIBLE_MS) {
        window.clearInterval(poll);
        window.requestAnimationFrame(() => setIsVisible(false));
      }
    }, 50);
    return () => window.clearInterval(poll);
  }, []);

  if (!isVisible) return null;
  const size = rect.width * CHATBOT_CIRCLE_RATIO;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-50 hidden place-items-center rounded-full bg-primary text-primary-content lg:grid"
      style={{
        left: rect.left + (rect.width - size) / 2,
        top: rect.top + (rect.height - size) / 2,
        width: size,
        height: size,
        // Mêmes proportions que l'avatar animé (`brand.html`) : anneau de 8/274 du disque et icône sur 61 % de celui-ci.
        border: `${size * 0.0293}px solid color-mix(in srgb, var(--color-primary-content) 85%, var(--color-base-100))`,
      }}
    >
      <Bot style={{ width: size * 0.61, height: size * 0.61 }} />
    </div>
  );
};

export default IntroChatbotHandoff;
