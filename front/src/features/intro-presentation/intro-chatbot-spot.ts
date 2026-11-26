/**
 * Bouton de l’assistant virtuel de l'application (`ChatbotButton`) : pastille de `w-16`, collée à
 * `right-6` et `bottom-6` de la fenêtre. La séquence 3D s'y termine par un dézoom.
 */
export const CHATBOT_BUTTON_SIZE = 64;
export const CHATBOT_BUTTON_OFFSET = 24;
/**
 * Le disque orange de l'avatar ne remplit pas tout son cadre de 64 px : il en occupe 13/16 (52 px). La
 * séquence 3D doit s'arrêter sur un disque de cette taille pour que l'assistant garde la même taille ensuite.
 */
export const CHATBOT_CIRCLE_RATIO = 13 / 16;

export type ChatbotSpot = {
  /** Centre du bouton, en pixels depuis le coin haut gauche de la séquence. */
  centerX: number;
  centerY: number;
  /** Diamètre du disque orange, en pixels. */
  size: number;
};

/** Place du bouton réel, exprimée dans le repère de l'élément qui porte la séquence. */
export const getChatbotSpot = (
  frame: { left: number; top: number },
  viewport: { width: number; height: number },
): ChatbotSpot => ({
  centerX: viewport.width - CHATBOT_BUTTON_OFFSET - CHATBOT_BUTTON_SIZE / 2 - frame.left,
  centerY: viewport.height - CHATBOT_BUTTON_OFFSET - CHATBOT_BUTTON_SIZE / 2 - frame.top,
  size: CHATBOT_BUTTON_SIZE * CHATBOT_CIRCLE_RATIO,
});
