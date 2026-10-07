import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Minimize, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import AuthAnimatedLogo from "./AuthAnimatedLogo";
import AuthQualityLogo from "./AuthQualityLogo";
import AuthQualityVideo from "./AuthQualityVideo";
import { authTileColors } from "./auth-tile-colors";
import { platformQualities } from "./auth-platform-qualities";
import { getExpandedTileBounds, tileHeight, tileWidth, type Geometry } from "./auth-tile-grid";
import { cn } from "../../../utils/cn";

type Props = {
  quality: number;
  colors: readonly string[];
  colorIndex: number;
  x: number;
  y: number;
  geometry: Geometry;
  reducedMotion: boolean;
  onClose: (quality: number, colorIndex: number) => void;
  onTurnChange: (turning: boolean) => void;
};

export default function AuthQualityPanel({ quality, colors, colorIndex, x, y, geometry, reducedMotion, onClose, onTurnChange }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const fullscreenRef = useRef(false);
  useEffect(() => { fullscreenRef.current = fullscreen; }, [fullscreen]);
  // Fullscreen is limited to the browser window. The popover top layer lifts the panel above the
  // clipping and transformed ancestors without moving it in the DOM, so the presentation keeps playing.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!fullscreen || !panel || typeof panel.showPopover !== "function") return;
    panel.setAttribute("popover", "manual");
    panel.showPopover();
    return () => {
      if (panel.matches(":popover-open")) panel.hidePopover();
      panel.removeAttribute("popover");
    };
  }, [fullscreen]);
  const closeButton = useRef<HTMLButtonElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(() => onClose(quality, colorIndex));
  const [showDetails, setShowDetails] = useState(reducedMotion);
  const [activeQuality, setActiveQuality] = useState(quality);
  const [activeColorIndex, setActiveColorIndex] = useState(colorIndex);
  const [turning, setTurning] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const { label, description } = platformQualities[activeQuality];
  const { left, top, width, height } = getExpandedTileBounds(geometry);

  useEffect(() => { onCloseRef.current = () => onClose(activeQuality, activeColorIndex); }, [onClose, activeQuality, activeColorIndex]);

  const [reverseSignal, setReverseSignal] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const pendingStep = useRef<1 | -1 | null>(null);
  const applyChange = useCallback((step: 1 | -1) => {
    pendingStep.current = null;
    setLeaving(false);
    setActiveQuality(current => (current + step + platformQualities.length) % platformQualities.length);
    setActiveColorIndex(current => (current + step + colors.length) % colors.length);
  }, [colors.length]);
  const commitPending = useCallback(() => {
    if (pendingStep.current !== null) applyChange(pendingStep.current);
  }, [applyChange]);
  const changeQuality = useCallback((step: 1 | -1) => {
    if (turning) return;
    if (reducedMotion) { applyChange(step); return; }
    setTurning(true);
    onTurnChange(true);
    if (fullscreen) {
      // The header logo vanishes by playing its reveal backwards before the next sequence replaces it.
      pendingStep.current = step;
      setLeaving(true);
      setReverseSignal(current => current + 1);
    } else {
      applyChange(step);
    }
  }, [turning, reducedMotion, fullscreen, onTurnChange, applyChange]);
  // Safety net in case the logo frame never reports the end of its reversal.
  useEffect(() => {
    if (reverseSignal === 0) return;
    const timer = setTimeout(commitPending, 1500);
    return () => clearTimeout(timer);
  }, [reverseSignal, commitPending]);
  const finishTurn = useCallback(() => {
    setTurning(false);
    onTurnChange(false);
    nextButton.current?.focus({ preventScroll: true });
  }, [onTurnChange]);
  const showNextQuality = useCallback(() => changeQuality(1), [changeQuality]);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setShowDetails(true), 350);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (fullscreenRef.current) setFullscreen(false);
      else onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-auth-quality-player
      data-fullscreen={fullscreen || undefined}
      className={cn("auth-quality-panel pointer-events-auto absolute z-20", turning ? "bg-transparent" : "bg-base-100")}
      initial={{ left: x, top: y, width: tileWidth, height: tileHeight, opacity: 0.85 }}
      animate={{ left, top, width, height, opacity: 1 }}
      exit={{ left: x, top: y, width: tileWidth, height: tileHeight, opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <button ref={closeButton} type="button"
        className={cn("auth-quality-close btn btn-ghost btn-sm absolute right-3 top-3 z-10 text-base-content", !fullscreen && "btn-circle", turning && !fullscreen && "invisible")}
        onClick={() => { if (fullscreen) setFullscreen(false); else onClose(activeQuality, activeColorIndex); }}
        aria-label={fullscreen ? "Quitter le plein écran" : "Fermer les détails"}>
        {fullscreen ? <><Minimize className="size-4" aria-hidden="true" />Réduire</> : <X className="size-5" aria-hidden="true" />}
      </button>
      {fullscreen && <div role="group" aria-label="Navigation entre les animations" className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
        <button type="button" className="btn btn-sm btn-ghost rounded-l-full rounded-r-md border-base-300 text-base-content/60 hover:border-base-300 hover:bg-base-200 hover:text-base-content" disabled={turning} aria-label={`Animation précédente : ${platformQualities[(activeQuality - 1 + platformQualities.length) % platformQualities.length].label}`} onClick={() => changeQuality(-1)}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button type="button" className="btn btn-sm btn-ghost rounded-l-md rounded-r-full border-base-300 text-base-content/60 hover:border-base-300 hover:bg-base-200 hover:text-base-content" disabled={turning} aria-label={`Animation suivante : ${platformQualities[(activeQuality + 1) % platformQualities.length].label}`} onClick={showNextQuality}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>}
      <motion.div
        className="h-full [perspective:1200px]"
        initial={{ opacity: reducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.2, delay: reducedMotion ? 0 : 0.15 }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeQuality}
            className="flex h-full min-h-0 flex-col overflow-hidden rounded-[15px] bg-base-100"
            style={{ backfaceVisibility: "hidden" }}
            initial={fullscreen && !reducedMotion ? false : reducedMotion ? { opacity: 0 } : { rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={fullscreen && !reducedMotion ? undefined : reducedMotion ? { opacity: 0 } : { rotateY: -90, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeInOut" }}
            onAnimationComplete={(definition) => {
              if (turning && typeof definition === "object" && "opacity" in definition && definition.opacity === 1) finishTurn();
            }}
          >
            <div className="auth-quality-header relative shrink-0 bg-base-100 p-5 text-base-content">
              <button
                ref={nextButton}
                type="button"
                className="auth-quality-next flex cursor-pointer items-center gap-4 rounded-xl border border-transparent p-3 text-left text-base-content transition-colors hover:border-base-300 hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default"
                aria-label={`Qualité suivante : ${platformQualities[(activeQuality + 1) % platformQualities.length].label}`}
                disabled={turning}
                onClick={showNextQuality}
              >
                {/* In fullscreen the logo plays its reveal backwards and replays its pixel reveal in the new colour. */}
                {fullscreen && !reducedMotion
                  ? <AuthAnimatedLogo reverseSignal={reverseSignal} onReversed={commitPending} color={authTileColors[activeColorIndex % authTileColors.length]} className="w-28 shrink-0" transparent />
                  : <AuthQualityLogo color={activeColorIndex} />}
                {/* In fullscreen only the title block turns; the rest of the content swaps without moving. */}
                <motion.span
                  key={activeQuality}
                  className="auth-quality-heading min-w-0"
                  style={{ transformPerspective: 800, backfaceVisibility: "hidden" }}
                  initial={fullscreen && !reducedMotion && turning ? { rotateY: -90 } : false}
                  animate={{ rotateY: leaving ? 90 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut", delay: leaving ? 0.2 : 0 }}
                  onAnimationComplete={(definition) => {
                    if (fullscreen && turning && typeof definition === "object" && "rotateY" in definition && definition.rotateY === 0) finishTurn();
                  }}
                >
                  <span id={titleId} role="heading" aria-level={2} className="block text-xl font-bold">{label}</span>
                  <span id={descriptionId} className="mt-1 block text-sm">{description}</span>
                </motion.span>
                <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
              </button>
            </div>
            <div className={cn("auth-quality-media min-h-0 flex-1 overflow-hidden rounded-t-[15px] p-3", colors[activeColorIndex])}>
              {showDetails && <motion.div className="h-full min-h-0" initial={{ opacity: 0 }} animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
                <AuthQualityVideo quality={activeQuality} label={label} colorIndex={activeColorIndex} reducedMotion={reducedMotion} fullscreen={fullscreen} hold={turning && fullscreen} onToggleFullscreen={() => setFullscreen(current => !current)} onEnded={showNextQuality} />
              </motion.div>}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
