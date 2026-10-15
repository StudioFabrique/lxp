import { useSyncExternalStore } from "react";

/** Où se trouve l'assistant virtuel : les autres éléments fixes de l'écran (barre du bas du mobile) s'y adaptent. */
export type ChatbotDockSnapshot = {
  /** Faux quand l'assistant est retiré de l'écran (fenêtre de conversation ouverte, page sans assistant). */
  visible: boolean;
  /** Coin haut gauche de l'assistant, en pixels de la fenêtre. */
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
  /** Vrai tant que les questions de l'assistant (éventail ou pile) sont ouvertes. */
  questionsOpen: boolean;
  /** Vrai quand la page affiche une barre fixe en bas de l'écran, à laquelle les questions doivent laisser sa place. */
  hasBottomBar: boolean;
};

let snapshot: ChatbotDockSnapshot = {
  visible: false,
  x: 0,
  y: 0,
  viewportWidth: 0,
  viewportHeight: 0,
  questionsOpen: false,
  hasBottomBar: false,
};
const listeners = new Set<() => void>();

/** Met à jour la position ou la visibilité ; les abonnés ne sont prévenus que si une valeur change. */
export const publishChatbotDock = (patch: Partial<ChatbotDockSnapshot>): void => {
  const next = { ...snapshot, ...patch };
  if (
    next.visible === snapshot.visible &&
    next.x === snapshot.x &&
    next.y === snapshot.y &&
    next.viewportWidth === snapshot.viewportWidth &&
    next.viewportHeight === snapshot.viewportHeight &&
    next.questionsOpen === snapshot.questionsOpen &&
    next.hasBottomBar === snapshot.hasBottomBar
  ) {
    return;
  }
  snapshot = next;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useChatbotDockSnapshot = (): ChatbotDockSnapshot =>
  useSyncExternalStore(subscribe, () => snapshot, () => snapshot);

const closeListeners = new Set<() => void>();

/** Demande à l'assistant de refermer ses questions (ex. depuis un élément de page qui y est réduit). */
export const requestChatbotQuestionsClose = (): void => {
  closeListeners.forEach((listener) => listener());
};

/** Écoute les demandes de fermeture des questions ; renvoie de quoi se désabonner. */
export const onChatbotQuestionsCloseRequest = (listener: () => void): (() => void) => {
  closeListeners.add(listener);
  return () => closeListeners.delete(listener);
};
