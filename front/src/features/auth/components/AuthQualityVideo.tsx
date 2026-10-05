import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, Maximize, Minimize, Pause, Play, RotateCcw } from "lucide-react";
import { authPresentationStateSchema, type AuthPresentationState } from "./auth-presentation.schema";
import { authTileColors, authTileContentColors } from "./auth-tile-colors";
import { cn } from "../../../utils/cn";

type Props = {
  quality: number;
  label: string;
  colorIndex: number;
  reducedMotion: boolean;
  onEnded?: () => void;
};

const presentationTopics: readonly string[] = [
  "Parcours pédagogiques et thèmes",
  "Assistant IA et pilotage pédagogique",
  "Création d’activités et quiz",
  "Planning et prévention du décrochage",
  "Tableaux de bord, contenus et calendrier",
  "Progression et profil d’apprentissage",
];

/** Plays the actual Hyperframes scenes, ending on their original opening logo. */
export default function AuthQualityVideo({ quality, label, colorIndex, reducedMotion, onEnded }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<HTMLElement>(null);
  const colorRef = useRef<HTMLSpanElement>(null);
  const playedRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<AuthPresentationState>("ready");
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [fullscreen, setFullscreen] = useState(() => document.fullscreenElement?.hasAttribute("data-auth-quality-player") ?? false);
  const [fullscreenError, setFullscreenError] = useState(false);
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
        }, 1200);
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

  useEffect(() => {
    const onFullscreenChange = () => {
      const target = playerRef.current?.closest<HTMLElement>("[data-auth-quality-player]") ?? playerRef.current;
      setFullscreen(document.fullscreenElement === target);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    setFullscreenError(false);
    try {
      const target = playerRef.current?.closest<HTMLElement>("[data-auth-quality-player]") ?? playerRef.current;
      if (document.fullscreenElement === target) {
        await document.exitFullscreen();
      } else if (target?.requestFullscreen) {
        await target.requestFullscreen();
      } else {
        setFullscreenError(true);
      }
    } catch {
      setFullscreenError(true);
    }
  };

  const failed = state === "error";
  const finished = state === "ended";
  const playing = state === "playing";
  return (
    <figure ref={playerRef} className={cn("auth-quality-video relative flex h-full min-h-0 flex-col gap-3", fullscreen && "bg-base-100 text-base-content")}>
      <span ref={colorRef} aria-hidden="true" className="pointer-events-none absolute invisible" style={{ color: authTileColors[colorIndex % authTileColors.length], outlineColor: authTileContentColors[colorIndex % authTileContentColors.length], backgroundColor: "var(--color-base-100)", borderColor: "var(--color-base-content)" }} />
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-base-100">
        <iframe
          key={attempt}
          ref={frameRef}
          src={`/presentations/andria/index.html?quality=${quality}`}
          title={`Présentation animée ANDRIA : ${label}`}
          className="size-full border-0"
          onLoad={() => send("initialize")}
        />
        {!loaded && !failed && <div className="absolute inset-0 flex items-center justify-center bg-base-100 text-base-content" role="status"><LoaderCircle className="size-6 animate-spin motion-reduce:animate-none" aria-hidden="true" /><span className="sr-only">Chargement de la présentation</span></div>}
        {failed && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base-100 p-4 text-center text-base-content"><p role="alert" className="text-sm">La présentation n’a pas pu démarrer.</p><button type="button" className="btn btn-sm btn-outline" onClick={() => { setLoaded(false); setState("ready"); setAttempt(current => current + 1); }}>Réessayer</button></div>}
      </div>
      <figcaption className="flex shrink-0 items-center justify-between gap-3 text-xs">
        <span aria-live="polite">{finished ? (!reducedMotion && onEnded ? "La suite arrive…" : "Présentation terminée") : presentationTopics[quality] ?? label}</span>
        <div className="flex items-center gap-1">
          {!failed && <button type="button" className="btn btn-ghost btn-sm gap-2 text-inherit" disabled={!loaded} onClick={() => send(finished ? "replay" : playing ? "pause" : "play")}>
            {finished ? <RotateCcw className="size-4" aria-hidden="true" /> : playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {finished ? "Revoir" : playing ? "Pause" : "Lire"}
          </button>}
          <button type="button" className="btn btn-ghost btn-sm gap-2 text-inherit" disabled={!loaded || failed} aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"} onClick={() => void toggleFullscreen()}>
            {fullscreen ? <Minimize className="size-4" aria-hidden="true" /> : <Maximize className="size-4" aria-hidden="true" />}
            <span className="hidden sm:inline">{fullscreen ? "Réduire" : "Plein écran"}</span>
          </button>
        </div>
      </figcaption>
      {fullscreenError && <p role="alert" className="text-xs">Le plein écran est indisponible dans ce navigateur. Vous pouvez poursuivre la lecture ici.</p>}
    </figure>
  );
}
