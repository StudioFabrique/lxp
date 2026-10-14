import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, Maximize, Pause, Play, RotateCcw } from "lucide-react";
import { authPresentationStateSchema, type AuthPresentationState } from "./auth-presentation.schema";
import { authTileColors, authTileContentColors } from "./auth-tile-colors";
import { cn } from "../../../utils/cn";

type Props = {
  quality: number;
  label: string;
  colorIndex: number;
  reducedMotion: boolean;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onEnded?: () => void;
  /** Keeps the next sequence unloaded while a turn animation runs, so its heavy start does not stall it. */
  hold?: boolean;
};

const presentationTopics: readonly string[] = [
  "Parcours et niveaux pédagogiques",
  "Thèmes aux couleurs de chacun",
  "Assistant IA dans la leçon",
  "Pilotage des usages et des contenus",
  "Création d’activités",
  "Quiz et entraînement",
  "Calendrier et ressources",
  "Prévention du décrochage",
  "Tableaux de bord par rôle",
  "Progression et profil d’apprentissage",
  "Groupes, promotions et parcours",
  "Formateurs et groupes associés",
  "Tags et contenus reliés",
  "Alertes email et disponibilité des contenus",
  "Identité, thèmes et emails de l’instance",
  "Accomplissements, félicitations et journal",
];

/** Plays the actual Hyperframes feature scenes. */
export default function AuthQualityVideo({ quality, label, colorIndex, reducedMotion, fullscreen = false, onToggleFullscreen, onEnded, hold = false }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
    const colorRef = useRef<HTMLSpanElement>(null);
  const playedRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<AuthPresentationState>("ready");
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [shownQuality, setShownQuality] = useState(quality);
  // Adjusting state during render: the new sequence loads only once the turn animation is over.
  if (!hold && shownQuality !== quality) {
    setShownQuality(quality);
    setLoaded(false);
    setState("ready");
  }
  const pending = shownQuality !== quality;
  const send = useCallback((action: "initialize" | "play" | "pause" | "replay" | "color") => {
    const palette = colorRef.current ? getComputedStyle(colorRef.current) : undefined;
    frameRef.current?.contentWindow?.postMessage({
      channel: "andria-auth-presentation",
      action,
      color: palette?.color,
      contentColor: palette?.outlineColor,
      backgroundColor: palette?.backgroundColor,
      textColor: palette?.borderTopColor,
      autoplay: !reducedMotion,
    }, window.location.origin);
  }, [reducedMotion]);

  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== frameRef.current?.contentWindow || event.origin !== window.location.origin) return;
      const result = authPresentationStateSchema.safeParse(event.data);
      if (!result.success) return;
      setLoaded(true);
      setState(result.data.state);
      if (result.data.state === "ready") send("initialize");
      if (result.data.state === "playing") {
        playedRef.current = true;
        if (completionTimer.current) clearTimeout(completionTimer.current);
        completionTimer.current = null;
      }
      if (result.data.state === "ended" && playedRef.current && !reducedMotion && !completionTimer.current) {
        completionTimer.current = setTimeout(() => {
          completionTimer.current = null;
          if (!document.hidden) onEndedRef.current?.();
        }, 300);
      }
    };
    const onVisibility = () => { if (document.hidden) send("pause"); };
    window.addEventListener("message", onMessage);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("visibilitychange", onVisibility);
      if (completionTimer.current) clearTimeout(completionTimer.current);
      completionTimer.current = null;
    };
  }, [send, reducedMotion]);

  useEffect(() => {
    const timeout = setTimeout(() => { if (!loaded) setState("error"); }, 10000);
    return () => clearTimeout(timeout);
  }, [loaded, attempt]);

  useEffect(() => {
    // The frame stays mounted when a theme changes, retaining playback position.
    const observer = new MutationObserver(() => send("color"));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
    send("color");
    return () => observer.disconnect();
  }, [colorIndex, send]);

  const failed = state === "error";
  const finished = state === "ended";
  // Offered during the final seconds so the learner can replay before the tour moves on.
  const canReplay = finished || state === "ending";
  const playing = state === "playing";
  // Position of this feature in the tour of all presentations, when it is one of them.
  const step = Number.isInteger(quality) && quality >= 0 && quality < presentationTopics.length ? quality + 1 : null;
  return (
    <figure className={cn("auth-quality-video relative flex h-full min-h-0 flex-col gap-3", fullscreen && "bg-base-100 text-base-content")}>
      <span ref={colorRef} aria-hidden="true" className="pointer-events-none absolute invisible" style={{ color: authTileColors[colorIndex % authTileColors.length], outlineColor: authTileContentColors[colorIndex % authTileContentColors.length], backgroundColor: "var(--color-base-100)", borderColor: "var(--color-base-content)" }} />
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-base-100">
        <iframe
          key={attempt}
          ref={frameRef}
          src={`/presentations/andria/index.html?quality=${shownQuality}`}
          title={`Présentation animée ANDRIA : ${label}`}
          className={cn("size-full border-0 transition-opacity duration-300", (!loaded || pending) && "opacity-0")}
          onLoad={() => send("initialize")}
        />
        {!loaded && !failed && <div className="absolute inset-0 flex items-center justify-center bg-base-100 text-base-content transition-opacity delay-500 duration-300 starting:opacity-0" role="status"><LoaderCircle className="size-6 animate-spin motion-reduce:animate-none" aria-hidden="true" /><span className="sr-only">Chargement de la présentation</span></div>}
        {failed && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base-100 p-4 text-center text-base-content"><p role="alert" className="text-sm">La présentation n’a pas pu démarrer.</p><button type="button" className="btn btn-sm btn-outline" onClick={() => { setLoaded(false); setState("ready"); setAttempt(current => current + 1); }}>Réessayer</button></div>}
      </div>
      <figcaption className="flex shrink-0 items-center justify-between gap-3 text-xs">
        <span className="flex min-w-0 items-center gap-2" aria-live="polite">
          {!finished && step !== null && <>
            {/* Inverted tile colours keep the step readable on the tile background. */}
            <span aria-hidden="true" className="badge badge-sm shrink-0 border-0 font-semibold tabular-nums" style={{ backgroundColor: authTileContentColors[colorIndex % authTileContentColors.length], color: authTileColors[colorIndex % authTileColors.length] }}>{step}/{presentationTopics.length}</span>
            <span className="sr-only">{`Étape ${step} sur ${presentationTopics.length} : `}</span>
          </>}
          <span className="truncate">{finished ? (!reducedMotion && onEnded ? "La suite arrive…" : "Présentation terminée") : presentationTopics[quality] ?? label}</span>
        </span>
        <div className="flex items-center gap-1">
          {!failed && <button type="button" className="btn btn-ghost btn-sm gap-2 text-inherit" disabled={!loaded} onClick={() => send(canReplay ? "replay" : playing ? "pause" : "play")}>
            {canReplay ? <RotateCcw className="size-4" aria-hidden="true" /> : playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {canReplay ? "Rejouer" : playing ? "Pause" : "Lire"}
          </button>}
          {onToggleFullscreen && !fullscreen && <button type="button" className="btn btn-ghost btn-sm gap-2 text-inherit" disabled={!loaded || failed} aria-label="Plein écran" onClick={onToggleFullscreen}>
            <Maximize className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Plein écran</span>
          </button>}
        </div>
      </figcaption>
    </figure>
  );
}
