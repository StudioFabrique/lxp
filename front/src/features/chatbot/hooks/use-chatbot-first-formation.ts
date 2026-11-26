import { useCallback, useEffect, useRef, useState } from "react";
import { FIRST_FORMATION_SELECTOR } from "../chatbot-tutorials";

const FIRST_FORMATION_STORAGE_KEY = "andria-chatbot-first-formation-hidden";

/** Bouton que l'assistant virtuel désigne seul, et comment son guide se retire. */
export type ChatbotGuidedButton = {
  selector: string;
  /** Clé de stockage du choix « ne plus afficher ». */
  storageKey: string;
  /** Vrai pour un guide de première visite : cliquer le bouton le retire pour de bon, il ne revient pas. */
  hideOnClick: boolean;
};

export const FIRST_FORMATION_BUTTON: ChatbotGuidedButton = {
  selector: FIRST_FORMATION_SELECTOR,
  storageKey: FIRST_FORMATION_STORAGE_KEY,
  hideOnClick: false,
};

// Le stockage peut être absent ou refusé (navigation privée) : le guide revient alors à chaque visite.
const readHidden = (storageKey: string): boolean => {
  try {
    return window.localStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
};

const writeHidden = (storageKey: string): void => {
  try {
    window.localStorage.setItem(storageKey, "true");
  } catch {
    // Voir readHidden : le choix n'est alors valable que jusqu'au rechargement.
  }
};

const findShownButton = (selector: string): HTMLElement | null => {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? element : null;
};

/**
 * Détecte le bouton « Créer ma première formation » dès qu'il est affiché (il dépend de données chargées
 * après la page) et appelle `onFound` une fois par apparition, tant que l'utilisateur ne l'a pas masqué.
 * `onGone` est appelé quand le bouton a rempli son rôle : cliqué, ou retiré de la page (première
 * formation créée), pour que le guide ne reste pas sur un élément qui n'existe plus.
 * `paused` retarde l'appel : présentation d'accueil ou fenêtre de conversation ouverte.
 * `guided` choisit le bouton visé (par défaut « Créer ma première formation »).
 */
export default function useChatbotFirstFormation(
  paused: boolean,
  onFound: (button: HTMLElement) => void,
  onGone: () => void,
  guided: ChatbotGuidedButton = FIRST_FORMATION_BUTTON,
) {
  const { selector, storageKey, hideOnClick } = guided;
  const [hidden, setHidden] = useState(() => readHidden(storageKey));
  // Dernier bouton déjà présenté : un nouvel affichage (retour sur la page) relance le guide.
  const presented = useRef<HTMLElement | null>(null);
  const onFoundRef = useRef(onFound);
  const onGoneRef = useRef(onGone);
  useEffect(() => {
    onFoundRef.current = onFound;
    onGoneRef.current = onGone;
  }, [onFound, onGone]);
  const clickCleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => clickCleanup.current?.(), []);

  useEffect(() => {
    if (hidden || paused) return;
    let frame = 0;
    const forget = (): void => {
      clickCleanup.current?.();
      clickCleanup.current = null;
      presented.current = null;
      onGoneRef.current();
    };
    const check = (): void => {
      frame = 0;
      if (presented.current && !presented.current.isConnected) forget();
      const button = findShownButton(selector);
      if (!button || button === presented.current) return;
      presented.current = button;
      // Cliquer le bouton, c'est suivre le conseil : le guide s'efface, sans empêcher son retour à la prochaine visite.
      const onClick = (): void => {
        clickCleanup.current = null;
        // Guide de première visite : le bouton cliqué, l'apprenant a compris, le guide ne revient pas.
        if (hideOnClick) writeHidden(storageKey);
        onGoneRef.current();
      };
      button.addEventListener("click", onClick, { once: true });
      clickCleanup.current = () => button.removeEventListener("click", onClick);
      onFoundRef.current(button);
    };
    const schedule = (): void => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    schedule();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [hidden, paused, selector, storageKey, hideOnClick]);

  const hideForever = useCallback(() => {
    writeHidden(storageKey);
    setHidden(true);
  }, [storageKey]);

  return { hideForever };
}
