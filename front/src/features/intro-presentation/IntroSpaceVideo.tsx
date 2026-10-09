import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { authPresentationStateSchema } from "../auth/components/auth-presentation.schema";
import { cn } from "../../utils/cn";
import { getChatbotSpot } from "./intro-chatbot-spot";
import { prefersReducedMotion } from "./intro-motion";
import type { IntroSpaceContent } from "./intro-space-content";

type Props = {
  content: IntroSpaceContent;
  onEnded: () => void;
};

/** Index de la séquence « Tableaux de bord par rôle » dans `manifest.json`. */
const DASHBOARDS_SEQUENCE = 8;
const LOAD_TIMEOUT_MS = 10_000;
const SPACE_LABELS: Record<IntroSpaceContent["space"], string> = {
  student: "l'espace apprenant",
  team: "l'espace de l'équipe pédagogique",
};

/**
 * Joue la séquence Hyperframes de construction de l'interface (avec le chatbot)
 * limitée à l'espace du rôle détecté, et prévient à sa fin.
 */
const IntroSpaceVideo = ({ content, onEnded }: Props) => {
  const { space } = content;
  const frameRef = useRef<HTMLIFrameElement>(null);
  const paletteRef = useRef<HTMLSpanElement>(null);
  const onEndedRef = useRef(onEnded);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const send = useCallback(
    (action: "initialize" | "color") => {
      // Le contenu du rôle précède toujours le démarrage : la séquence le lit avant sa première image.
      if (action === "initialize") {
        // Le film se termine sur le bouton du chatbot à la place qu'il aura dans l'application.
        const frame = frameRef.current?.getBoundingClientRect();
        frameRef.current?.contentWindow?.postMessage(
          {
            channel: "andria-auth-presentation",
            action: "content",
            content,
            chatbot: frame
              ? getChatbotSpot(frame, { width: window.innerWidth, height: window.innerHeight })
              : undefined,
          },
          window.location.origin,
        );
      }
      const palette = paletteRef.current
        ? getComputedStyle(paletteRef.current)
        : undefined;
      frameRef.current?.contentWindow?.postMessage(
        {
          channel: "andria-auth-presentation",
          action,
          color: palette?.color,
          contentColor: palette?.outlineColor,
          backgroundColor: palette?.backgroundColor,
          textColor: palette?.borderTopColor,
          autoplay: !reducedMotion,
        },
        window.location.origin,
      );
    },
    [reducedMotion, content],
  );

  useEffect(() => {
    let endTimer: ReturnType<typeof setTimeout> | undefined;
    const onMessage = (event: MessageEvent<unknown>) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow
      ) {
        return;
      }
      const parsed = authPresentationStateSchema.safeParse(event.data);
      if (!parsed.success) return;
      const { state } = parsed.data;
      if (state === "error") {
        setHasFailed(true);
        return;
      }
      setIsLoaded(true);
      if (state === "ready") send("initialize");
      if (state === "ended") {
        setHasEnded(true);
        // Avec les animations réduites, la scène s'ouvre déjà terminée : l'utilisateur continue lui-même.
        if (!reducedMotion && !document.hidden) {
          endTimer = setTimeout(() => onEndedRef.current(), 400);
        }
      }
    };
    // Suit les changements de thème sans relancer la lecture.
    const observer = new MutationObserver(() => send("color"));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      observer.disconnect();
      clearTimeout(endTimer);
    };
  }, [send, reducedMotion]);

  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(() => setHasFailed(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoaded, attempt]);

  const retry = () => {
    setHasFailed(false);
    setIsLoaded(false);
    setAttempt((current) => current + 1);
  };

  return (
    <div className="relative size-full bg-base-100">
      {/* Les couleurs du thème courant sont lues ici pour teinter la séquence. */}
      <span
        ref={paletteRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute"
        style={{
          color: "var(--color-primary)",
          outlineColor: "var(--color-primary-content)",
          backgroundColor: "var(--color-base-100)",
          borderColor: "var(--color-base-content)",
        }}
      />
      <iframe
        key={attempt}
        ref={frameRef}
        src={`/presentations/andria/index.html?quality=${DASHBOARDS_SEQUENCE}&role=${space}`}
        title={`Présentation animée de ${SPACE_LABELS[space]}`}
        className={cn(
          "size-full border-0 transition-opacity duration-300",
          !isLoaded && "opacity-0",
        )}
        onLoad={() => send("initialize")}
      />
      {!isLoaded && !hasFailed ? (
        <div
          className="absolute inset-0 grid place-items-center bg-base-100"
          role="status"
        >
          <LoaderCircle
            className="size-6 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span className="sr-only">Chargement de la présentation</span>
        </div>
      ) : null}
      {hasFailed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base-100 p-4 text-center">
          <p role="alert" className="text-sm">
            La présentation n'a pas pu démarrer.
          </p>
          <button type="button" className="btn btn-sm btn-outline" onClick={retry}>
            Réessayer
          </button>
        </div>
      ) : null}
      {hasEnded && reducedMotion ? (
        <button
          type="button"
          className="btn btn-primary btn-sm absolute bottom-4 right-4"
          onClick={onEnded}
        >
          Continuer
        </button>
      ) : null}
    </div>
  );
};

export default IntroSpaceVideo;
