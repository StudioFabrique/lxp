import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { authPresentationStateSchema } from "./auth-presentation.schema";
import { cn } from "../../../utils/cn";
import type { ChatbotGesture } from "./auth-chatbot-gestures";

/** The original Hyperframes pixel reveal, cropped to its logo. */
type Props = {
  className?: string;
  /** Overrides the logo colour, which defaults to the theme primary colour. */
  color?: string;
  /** Lets the parent surface show through the logo frame instead of the base background. */
  transparent?: boolean;
  mode?: "logo" | "chatbot";
  replaySignal?: number;
  /** Plays the reveal backwards each time it changes, then calls `onReversed`. */
  reverseSignal?: number;
  onReversed?: () => void;
  gesture?: ChatbotGesture;
};

export default function AuthAnimatedLogo({ className, color, transparent = false, mode = "logo", replaySignal = 0, reverseSignal = 0, onReversed, gesture = "wave" }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [initialGesture] = useState(gesture);
  const paletteRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const onReversedRef = useRef(onReversed);
  useEffect(() => { onReversedRef.current = onReversed; }, [onReversed]);
  const [ready, setReady] = useState(false);
  const send = useCallback((action: "initialize" | "color" | "pause" | "replay" | "reverse") => {
    const palette = paletteRef.current && getComputedStyle(paletteRef.current);
    if (frameRef.current && palette) frameRef.current.style.colorScheme = palette.colorScheme;
    frameRef.current?.contentWindow?.postMessage({
      channel: "andria-auth-presentation", action,
      color: palette?.color,
      backgroundColor: transparent ? palette?.accentColor : palette?.backgroundColor,
      transparentBackground: transparent,
      contentColor: palette?.outlineColor,
      autoplay: !reducedMotion,
      gesture,
      colorScheme: palette?.colorScheme,
    }, window.location.origin);
  }, [reducedMotion, gesture, transparent]);

  useEffect(() => { send("color"); }, [color, send]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      const parsed = authPresentationStateSchema.safeParse(event.data);
      if (!parsed.success) return;
      if (parsed.data.state === "error") { setReady(false); return; }
      if (parsed.data.state === "reversed") { onReversedRef.current?.(); return; }
      if (parsed.data.state === "ready") send("initialize");
      else setReady(true);
    };
    const observer = new MutationObserver(() => send("color"));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
    window.addEventListener("message", onMessage);
    return () => {
      observer.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, [send]);

  useEffect(() => {
    if (reducedMotion) send("pause");
  }, [reducedMotion, send]);

  useEffect(() => {
    if (replaySignal > 0 && !reducedMotion) send("replay");
  }, [replaySignal, reducedMotion, send]);

  useEffect(() => {
    if (reverseSignal > 0) send("reverse");
  }, [reverseSignal, send]);

  return (
    <div
      ref={paletteRef}
      className={cn("relative w-64 max-w-full overflow-hidden text-primary outline-primary-content", mode === "logo" ? cn("aspect-[900/280]", !transparent && "bg-base-100") : "aspect-square bg-transparent", className)}
      style={{ ...(color ? { color } : {}), ...(transparent ? { accentColor: "var(--color-base-100)" } : {}) }}
      role="img"
      aria-label={mode === "logo" ? "logo ANDRIA" : "Chatbot ANDRIA"}
    >
      <iframe
        ref={frameRef}
        src={`/presentations/andria/brand.html?mode=${mode}&gesture=${initialGesture}`}
        title={mode === "logo" ? "Animation du logo ANDRIA" : "Salut animé du chatbot ANDRIA"}
        className={cn("pointer-events-none relative size-full border-0", !ready && "opacity-0")}
        tabIndex={-1}
        aria-hidden="true"
        onLoad={() => send("initialize")}
      />
    </div>
  );
}
