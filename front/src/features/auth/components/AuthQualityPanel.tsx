import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Minimize, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import AuthQualityLogo from "./AuthQualityLogo";
import AuthQualityVideo from "./AuthQualityVideo";
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
  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === panelRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
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

  const showNextQuality = useCallback(() => {
    if (turning) return;
    if (!reducedMotion) {
      setTurning(true);
      onTurnChange(true);
    }
    setActiveQuality(current => (current + 1) % platformQualities.length);
    setActiveColorIndex(current => (current + 1) % colors.length);
  }, [turning, reducedMotion, onTurnChange, colors.length]);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setShowDetails(true), 350);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement) onCloseRef.current();
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
      className={cn("auth-quality-panel pointer-events-auto absolute z-20", turning ? "bg-transparent" : "bg-base-100")}
      initial={{ left: x, top: y, width: tileWidth, height: tileHeight, opacity: 0.85 }}
      animate={{ left, top, width, height, opacity: 1 }}
      exit={{ left: x, top: y, width: tileWidth, height: tileHeight, opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
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
            initial={reducedMotion ? { opacity: 0 } : { rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { rotateY: -90, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeInOut" }}
            onAnimationComplete={(definition) => {
              if (turning && typeof definition === "object" && "rotateY" in definition && definition.rotateY === 0) {
                setTurning(false);
                onTurnChange(false);
                nextButton.current?.focus({ preventScroll: true });
              }
            }}
          >
            <div className="auth-quality-header relative shrink-0 bg-base-100 p-5 text-base-content">
              <button ref={closeButton} type="button"
                className={cn("btn btn-ghost btn-sm absolute right-3 top-3 text-base-content", !fullscreen && "btn-circle")}
                onClick={() => { if (fullscreen) void document.exitFullscreen(); else onClose(activeQuality, activeColorIndex); }}
                aria-label={fullscreen ? "Quitter le plein écran" : "Fermer les détails"}>
                {fullscreen ? <><Minimize className="size-4" aria-hidden="true" />Réduire</> : <X className="size-5" aria-hidden="true" />}
              </button>
              <button
                ref={nextButton}
                type="button"
                className="auth-quality-next flex cursor-pointer items-center gap-4 rounded-xl border border-transparent p-3 text-left text-base-content transition-colors hover:border-base-300 hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default"
                aria-label={`Qualité suivante : ${platformQualities[(activeQuality + 1) % platformQualities.length].label}`}
                disabled={turning}
                onClick={showNextQuality}
              >
                <AuthQualityLogo color={activeColorIndex} />
                <span className="auth-quality-heading min-w-0">
                  <span id={titleId} role="heading" aria-level={2} className="block text-xl font-bold">{label}</span>
                  <span id={descriptionId} className="mt-1 block text-sm">{description}</span>
                </span>
                <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
              </button>
            </div>
            <div className={cn("auth-quality-media min-h-0 flex-1 overflow-hidden rounded-t-[15px] p-3", colors[activeColorIndex])}>
              {showDetails && <motion.div className="h-full min-h-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
                <AuthQualityVideo quality={activeQuality} label={label} colorIndex={activeColorIndex} reducedMotion={reducedMotion} onEnded={showNextQuality} />
              </motion.div>}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
