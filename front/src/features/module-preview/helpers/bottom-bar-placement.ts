import type { CSSProperties } from "react";
import { CHATBOT_AVATAR_SIZE, CHATBOT_DEFAULT_OFFSET } from "../../chatbot/chatbot-position";
import type { ChatbotDockSnapshot } from "../../chatbot/chatbot-dock-store";

const EDGE = 16;
const GAP = 8;
/** Marge gauche des questions empilées de l'assistant. */
const REDUCED_EDGE = 12;
/** Aligné sur la question libre, qui mesure ici environ 46 px, à 24 px du bas (`bottom-6` de la pile de questions). */
const REDUCED_BOTTOM = 23;
/** Hauteur de la barre (bouton de 48 px et marges) : elle occupe la bande du bas de l'écran. */
const BAR_HEIGHT = 60;
/** Distance au bas de l'écran : la barre est centrée sur la place de repos de l'assistant virtuel (même niveau). */
const BAR_BOTTOM = CHATBOT_DEFAULT_OFFSET + CHATBOT_AVATAR_SIZE / 2 - BAR_HEIGHT / 2;

/** Largeur sous laquelle les questions de l'assistant s'empilent sur tout l'écran (voir `ChatbotAssistant`). */
const STACKED_QUESTIONS_MAX_WIDTH = 640;

/**
 * Les questions de l'assistant, empilées en bas de l'écran, laissent à la barre la place d'un cercle à gauche
 * de la question libre : elle se réduit alors à son bouton de navigation.
 */
export const isBottomBarReduced = (dock: ChatbotDockSnapshot): boolean =>
  dock.questionsOpen && dock.viewportWidth > 0 && dock.viewportWidth < STACKED_QUESTIONS_MAX_WIDTH;

/**
 * Place de la barre : toujours en bas de l'écran, sans suivre l'assistant virtuel.
 * Quand l'assistant se trouve dans la même bande du bas, collé à un bord, la barre lui laisse sa place ;
 * s'il est retiré de la bande (déplacé plus haut, masqué), elle prend toute la largeur.
 */
export const bottomBarPlacement = (dock: ChatbotDockSnapshot): CSSProperties => {
  // Réduite : un cercle à gauche, à hauteur de la question libre.
  if (isBottomBarReduced(dock)) return { left: REDUCED_EDGE, bottom: REDUCED_BOTTOM };

  const fullWidth: CSSProperties = { left: EDGE, right: EDGE, bottom: BAR_BOTTOM };
  if (!dock.visible || dock.viewportWidth === 0) return fullWidth;

  const bandTop = dock.viewportHeight - BAR_BOTTOM - BAR_HEIGHT;
  const isInBottomBand = dock.y + CHATBOT_AVATAR_SIZE > bandTop && dock.y < dock.viewportHeight - BAR_BOTTOM;
  if (!isInBottomBand) return fullWidth;

  const isOnRight = dock.x + CHATBOT_AVATAR_SIZE / 2 > dock.viewportWidth / 2;
  return {
    bottom: BAR_BOTTOM,
    left: isOnRight ? EDGE : dock.x + CHATBOT_AVATAR_SIZE + GAP,
    right: isOnRight ? dock.viewportWidth - dock.x + GAP : EDGE,
  };
};
