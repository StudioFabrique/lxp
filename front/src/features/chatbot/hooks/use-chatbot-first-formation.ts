import { useCallback, useEffect, useRef, useState } from "react";
import { FIRST_FORMATION_SELECTOR } from "../chatbot-tutorials";

const STORAGE_KEY = "andria-chatbot-first-formation-hidden";

// Le stockage peut être absent ou refusé (navigation privée) : le guide revient alors à chaque visite.
const readHidden = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const writeHidden = (): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Voir readHidden : le choix n'est alors valable que jusqu'au rechargement.
  }
};

const findShownButton = (): HTMLElement | null => {
  const element = document.querySelector<HTMLElement>(FIRST_FORMATION_SELECTOR);
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
 */
export default function useChatbotFirstFormation(
  paused: boolean,
  onFound: (button: HTMLElement) => void,
  onGone: () => void,
) {
  const [hidden, setHidden] = useState(readHidden);
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
      const button = findShownButton();
      if (!button || button === presented.current) return;
      presented.current = button;
      // Cliquer le bouton, c'est suivre le conseil : le guide s'efface, sans empêcher son retour à la prochaine visite.
      const onClick = (): void => {
        clickCleanup.current = null;
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
  }, [hidden, paused]);

  const hideForever = useCallback(() => {
    writeHidden();
    setHidden(true);
  }, []);

  return { hideForever };
}
