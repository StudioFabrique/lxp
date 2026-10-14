import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { animate, useDragControls, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { z } from "zod";
import { chatbotMoveDurationMs, chatbotMoveEase } from "../../auth/components/auth-chatbot-motion";
import {
  CHATBOT_AVATAR_SIZE,
  CHATBOT_EDGE_MARGIN,
  chatbotBubbleSide,
  clampChatbotPoint,
  restingChatbotPoint,
  toEdgeOffset,
  type ChatbotBubbleSide,
  type ChatbotEdgeOffset,
  type ChatbotPoint,
  type ChatbotViewport,
} from "../chatbot-position";

const STORAGE_KEY = "andria-chatbot-position";
const edgeOffsetSchema = z.object({ right: z.number().finite(), bottom: z.number().finite() });

const readViewport = (): ChatbotViewport => ({ width: window.innerWidth, height: window.innerHeight });

// Le stockage peut être absent ou refusé (navigation privée) : la position n'est alors simplement pas mémorisée.
const readSavedOffset = (): ChatbotEdgeOffset | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? edgeOffsetSchema.safeParse(JSON.parse(raw)) : null;
    return parsed?.success ? parsed.data : null;
  } catch {
    return null;
  }
};

const writeSavedOffset = (offset: ChatbotEdgeOffset): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(offset));
  } catch {
    // Voir readSavedOffset : une position non mémorisée n'est pas bloquante.
  }
};

/**
 * Position de l'assistant virtuel dans la fenêtre : déplaçable à la souris ou au doigt, mémorisée d'une
 * visite à l'autre, et déplaçable par programme (tutoriels) avec le même mouvement que l'onboarding.
 * `centered` le remonte à mi-hauteur tant que la présentation occupe le bas de l'écran.
 */
export default function useChatbotDock(centered: boolean) {
  const reducedMotion = useReducedMotion();
  const dragControls = useDragControls();
  const [initialOffset] = useState(readSavedOffset);
  const saved = useRef<ChatbotEdgeOffset | null>(initialOffset);
  const animations = useRef<AnimationPlaybackControls[]>([]);
  const dragged = useRef(false);
  const centeredRef = useRef(centered);
  /** Vrai tant que l'assistant virtuel est à sa place de repos : seul ce cas suit le redimensionnement de la fenêtre. */
  const atRest = useRef(true);
  const [viewport, setViewport] = useState(readViewport);
  const [dragging, setDragging] = useState(false);
  const [initial] = useState(() => restingChatbotPoint(readViewport(), initialOffset, centered));
  const x = useMotionValue(initial.x);
  const y = useMotionValue(initial.y);
  const [side, setSide] = useState<ChatbotBubbleSide>(() => chatbotBubbleSide(initial, readViewport()));

  const stopAnimations = useCallback(() => {
    animations.current.forEach((animation) => animation.stop());
    animations.current = [];
  }, []);

  const moveTo = useCallback((point: ChatbotPoint, bubbleSide?: ChatbotBubbleSide) => {
    const target = clampChatbotPoint(point, readViewport());
    stopAnimations();
    setSide(bubbleSide ?? chatbotBubbleSide(target, readViewport()));
    if (reducedMotion) {
      x.set(target.x);
      y.set(target.y);
      return;
    }
    const transition = { duration: chatbotMoveDurationMs / 1000, ease: chatbotMoveEase };
    animations.current = [animate(x, target.x, transition), animate(y, target.y, transition)];
  }, [reducedMotion, stopAnimations, x, y]);

  const returnToRest = useCallback(() => {
    atRest.current = true;
    moveTo(restingChatbotPoint(readViewport(), saved.current, centeredRef.current));
  }, [moveTo]);

  /** Va vers un point choisi par un tutoriel ; la position mémorisée reste celle de l'utilisateur. */
  const moveForTutorial = useCallback((point: ChatbotPoint, bubbleSide: ChatbotBubbleSide) => {
    atRest.current = false;
    moveTo(point, bubbleSide);
  }, [moveTo]);

  // La présentation ouvre ou ferme : l'assistant virtuel rejoint la place de repos qui lui correspond.
  useEffect(() => {
    centeredRef.current = centered;
    if (atRest.current) moveTo(restingChatbotPoint(readViewport(), saved.current, centered));
  }, [centered, moveTo]);

  useEffect(() => {
    const onResize = (): void => {
      const next = readViewport();
      setViewport(next);
      const point = atRest.current
        ? restingChatbotPoint(next, saved.current, centeredRef.current)
        : clampChatbotPoint({ x: x.get(), y: y.get() }, next);
      stopAnimations();
      x.set(point.x);
      y.set(point.y);
      setSide(chatbotBubbleSide(point, next));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [stopAnimations, x, y]);

  const dragContext = useMemo(() => ({
    start: (event: PointerEvent<HTMLButtonElement>): void => {
      if (event.button !== 0) return;
      dragged.current = false;
      stopAnimations();
      dragControls.start(event);
    },
    dragging,
    wasDragged: (): boolean => {
      const result = dragged.current;
      dragged.current = false;
      return result;
    },
  }), [dragControls, dragging, stopAnimations]);

  const onDragStart = useCallback(() => {
    dragged.current = true;
    setDragging(true);
  }, []);

  const onDragEnd = useCallback(() => {
    setDragging(false);
    const current = readViewport();
    const point = { x: x.get(), y: y.get() };
    // Déposé par l'utilisateur : c'est sa nouvelle place de repos.
    atRest.current = true;
    saved.current = toEdgeOffset(point, current);
    writeSavedOffset(saved.current);
    setSide(chatbotBubbleSide(point, current));
  }, [x, y]);

  const dragBounds = useMemo(() => ({
    left: CHATBOT_EDGE_MARGIN,
    top: CHATBOT_EDGE_MARGIN,
    right: viewport.width - CHATBOT_AVATAR_SIZE - CHATBOT_EDGE_MARGIN,
    bottom: viewport.height - CHATBOT_AVATAR_SIZE - CHATBOT_EDGE_MARGIN,
  }), [viewport]);

  return { x, y, side, dragControls, dragContext, dragBounds, onDragStart, onDragEnd, moveForTutorial, returnToRest };
}
