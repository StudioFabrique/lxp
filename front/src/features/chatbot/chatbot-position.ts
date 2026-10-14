export type ChatbotPoint = { x: number; y: number };
export type ChatbotViewport = { width: number; height: number };
export type ChatbotRect = { left: number; top: number; width: number; height: number };
/** Distances de l'assistant virtuel aux bords droit et bas : elles survivent à un changement de taille de fenêtre. */
export type ChatbotEdgeOffset = { right: number; bottom: number };
export type ChatbotBubbleSide = "left" | "right";

export const CHATBOT_AVATAR_SIZE = 64;
export const CHATBOT_BUBBLE_WIDTH = 300;
/** Marge minimale entre l'assistant virtuel et le bord de l'écran. */
export const CHATBOT_EDGE_MARGIN = 20;
/** Même retrait que l'ancien bouton flottant, repris par la séquence de présentation (`intro-chatbot-spot`). */
export const CHATBOT_DEFAULT_OFFSET = 24;
const BUBBLE_GAP = 12;
// Le cadre de mise en évidence dépasse déjà l'élément d'une dizaine de pixels : l'assistant garde de l'air au-delà.
const TARGET_CLEARANCE = 28;

export const clampChatbotPoint = (point: ChatbotPoint, viewport: ChatbotViewport, size = CHATBOT_AVATAR_SIZE): ChatbotPoint => ({
  x: Math.max(CHATBOT_EDGE_MARGIN, Math.min(point.x, viewport.width - size - CHATBOT_EDGE_MARGIN)),
  y: Math.max(CHATBOT_EDGE_MARGIN, Math.min(point.y, viewport.height - size - CHATBOT_EDGE_MARGIN)),
});

export const toEdgeOffset = (point: ChatbotPoint, viewport: ChatbotViewport, size = CHATBOT_AVATAR_SIZE): ChatbotEdgeOffset => ({
  right: viewport.width - size - point.x,
  bottom: viewport.height - size - point.y,
});

/**
 * Position de repos : celle enregistrée par l'utilisateur, sinon le coin bas droit de l'ancien bouton.
 * `centered` la remonte à mi-hauteur pendant la présentation, dont le bas porte ses propres commandes.
 */
export const restingChatbotPoint = (
  viewport: ChatbotViewport,
  saved: ChatbotEdgeOffset | null,
  centered = false,
  size = CHATBOT_AVATAR_SIZE,
): ChatbotPoint => {
  const offset = saved ?? { right: CHATBOT_DEFAULT_OFFSET, bottom: CHATBOT_DEFAULT_OFFSET };
  const point = { x: viewport.width - size - offset.right, y: viewport.height - size - offset.bottom };
  return clampChatbotPoint(centered ? { x: point.x, y: (viewport.height - size) / 2 } : point, viewport, size);
};

/** La bulle se place à gauche de l'assistant virtuel, sauf si elle n'y tient pas : elle passe alors à droite. */
export const chatbotBubbleSide = (point: ChatbotPoint): ChatbotBubbleSide =>
  point.x - BUBBLE_GAP - CHATBOT_BUBBLE_WIDTH >= CHATBOT_EDGE_MARGIN ? "left" : "right";

const overlaps = (a: ChatbotRect, b: ChatbotRect): boolean =>
  a.left < b.left + b.width && a.left + a.width > b.left && a.top < b.top + b.height && a.top + a.height > b.top;

export type ChatbotTutorialPlacement = { point: ChatbotPoint; side: ChatbotBubbleSide };

/**
 * Choisit où poser l'assistant virtuel pour désigner un élément : collé à l'élément, du côté tourné vers
 * le centre de l'écran, la bulle s'étendant à l'opposé pour ne jamais le cacher. Sans place suffisante
 * (élément qui occupe presque tout l'écran), il retourne `null` et l'appelant garde sa position.
 */
export const chooseTutorialPlacement = (
  target: ChatbotRect,
  viewport: ChatbotViewport,
  size = CHATBOT_AVATAR_SIZE,
): ChatbotTutorialPlacement | null => {
  const bubbleSpan = CHATBOT_BUBBLE_WIDTH + BUBBLE_GAP;
  // Un élément plus haut ou plus large que l'écran garde l'assistant virtuel dans la partie visible.
  const centerY = Math.max(CHATBOT_EDGE_MARGIN, Math.min(target.top + target.height / 2 - size / 2, viewport.height - size - CHATBOT_EDGE_MARGIN));
  const centerX = Math.max(CHATBOT_EDGE_MARGIN, Math.min(target.left + target.width / 2 - size / 2, viewport.width - size - CHATBOT_EDGE_MARGIN));
  const clearTarget: ChatbotRect = {
    left: target.left - TARGET_CLEARANCE,
    top: target.top - TARGET_CLEARANCE,
    width: target.width + TARGET_CLEARANCE * 2,
    height: target.height + TARGET_CLEARANCE * 2,
  };
  const candidates: ChatbotTutorialPlacement[] = [
    { point: { x: target.left + target.width + TARGET_CLEARANCE, y: centerY }, side: "right" },
    { point: { x: target.left - TARGET_CLEARANCE - size, y: centerY }, side: "left" },
    { point: { x: centerX, y: target.top + target.height + TARGET_CLEARANCE }, side: centerX + size / 2 > viewport.width / 2 ? "left" : "right" },
    { point: { x: centerX, y: target.top - TARGET_CLEARANCE - size }, side: centerX + size / 2 > viewport.width / 2 ? "left" : "right" },
  ];
  const targetOnLeft = target.left + target.width / 2 < viewport.width / 2;
  const ordered = targetOnLeft ? candidates : [candidates[1], candidates[0], candidates[2], candidates[3]];
  return ordered.find(({ point, side }) => {
    const avatar: ChatbotRect = { left: point.x, top: point.y, width: size, height: size };
    const bubbleLeft = side === "left" ? point.x - bubbleSpan : point.x + size + BUBBLE_GAP;
    const fitsViewport = point.x >= CHATBOT_EDGE_MARGIN && point.y >= CHATBOT_EDGE_MARGIN
      && point.x + size <= viewport.width - CHATBOT_EDGE_MARGIN && point.y + size <= viewport.height - CHATBOT_EDGE_MARGIN
      && bubbleLeft >= CHATBOT_EDGE_MARGIN && bubbleLeft + CHATBOT_BUBBLE_WIDTH <= viewport.width - CHATBOT_EDGE_MARGIN;
    return fitsViewport && !overlaps(avatar, clearTarget);
  }) ?? null;
};
