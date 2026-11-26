import type { ChatbotRect } from "../auth/components/auth-chatbot-placement";
import { chatbotMoveDurationMs } from "../auth/components/auth-chatbot-motion";
import { OPENING_ANIMATION_MS } from "./intro-dialogue";
import { CHATBOT_BUTTON_OFFSET, CHATBOT_BUTTON_SIZE, CHATBOT_CIRCLE_RATIO, getChatbotSpot } from "./intro-chatbot-spot";

/** Attente du placement : l'assistant virtuel reste à l'endroit où la séquence 3D l'a laissé jusqu'à la fin de l'ouverture animée. */
export const INTRO_CHATBOT_SETTLE_MS = OPENING_ANIMATION_MS;
/** Délai avant le premier message : l'assistant virtuel a d'abord fini son déplacement. */
export const INTRO_ARRIVAL_DELAY_S = (INTRO_CHATBOT_SETTLE_MS + chatbotMoveDurationMs) / 1000;

type Size = { width: number; height: number };

/** Dimensions de la scène de la séquence 3D (voir `public/presentations/andria/player.js`). */
const SCENE_WIDTH = 1920;
const SCENE_HEIGHT = 1080;
const SCENE_MARGIN_PX = 16;

/**
 * Où la séquence 3D termine réellement l'assistant virtuel. Le film est cadré en 16:9 au centre de son
 * cadre et garde le bouton dans cette scène : sur une fenêtre plus haute que large, il s'arrête donc
 * au-dessus du coin de la fenêtre. Même calcul que `player.js`. Le résultat est le cadre de l'avatar.
 */
export const videoChatbotRect = (
  frame: { left: number; top: number; width: number; height: number },
  viewport: Size,
): ChatbotRect => {
  const spot = getChatbotSpot(frame, viewport);
  const scale = Math.min(frame.width / SCENE_WIDTH, frame.height / SCENE_HEIGHT);
  const offsetX = (frame.width - SCENE_WIDTH * scale) / 2;
  const offsetY = (frame.height - SCENE_HEIGHT * scale) / 2;
  const size = Math.min(spot.size / scale, SCENE_HEIGHT);
  const inset = Math.min(size / 2 + SCENE_MARGIN_PX / scale, SCENE_HEIGHT / 2);
  const clamp = (value: number, extent: number): number => Math.min(Math.max(value, inset), extent - inset);
  const centerX = frame.left + offsetX + clamp((spot.centerX - offsetX) / scale, SCENE_WIDTH) * scale;
  const centerY = frame.top + offsetY + clamp((spot.centerY - offsetY) / scale, SCENE_HEIGHT) * scale;
  // Le disque ne remplit que 13/16 du cadre de l'avatar : c'est le cadre que la présentation reprend.
  const frameSize = (size * scale) / CHATBOT_CIRCLE_RATIO;
  return { left: centerX - frameSize / 2, top: centerY - frameSize / 2, width: frameSize, height: frameSize };
};

/**
 * Au-delà, la séquence 3D n'est plus celle qui vient de se terminer (présentation rouverte plus tard).
 * L'emplacement est retenu au démarrage du film, qui dure une quinzaine de secondes : la marge est large.
 */
const HANDOFF_MAX_AGE_MS = 90_000;

let lastVideo: { rect: ChatbotRect; at: number } | null = null;

/** Retient où la séquence 3D termine l'assistant virtuel, pour que la présentation le reprenne exactement là. */
export const rememberVideoChatbotRect = (rect: ChatbotRect): void => {
  lastVideo = { rect, at: Date.now() };
};

/**
 * Emplacement que reprend l'assistant virtuel en ouvrant la présentation : celui où la séquence 3D vient de
 * le laisser, sinon le bouton de l'application (bas à droite de la fenêtre).
 */
export const introChatbotHandoffRect = (viewport: Size): ChatbotRect => {
  const recent = lastVideo && Date.now() - lastVideo.at < HANDOFF_MAX_AGE_MS ? lastVideo.rect : null;
  return (
    recent ?? {
      left: viewport.width - CHATBOT_BUTTON_OFFSET - CHATBOT_BUTTON_SIZE,
      top: viewport.height - CHATBOT_BUTTON_OFFSET - CHATBOT_BUTTON_SIZE,
      width: CHATBOT_BUTTON_SIZE,
      height: CHATBOT_BUTTON_SIZE,
    }
  );
};
