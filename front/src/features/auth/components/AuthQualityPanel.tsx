import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import AuthQualityLogo from "./AuthQualityLogo";
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
  const closeButton = useRef<HTMLButtonElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(() => onClose(quality, colorIndex));
  const [showDetails, setShowDetails] = useState(reducedMotion);
  const [activeQuality, setActiveQuality] = useState(quality);
  const [activeColorIndex, setActiveColorIndex] = useState(colorIndex);
  const [turning, setTurning] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const { label, description, features, screenshot, screenshotAlt } = platformQualities[activeQuality];
  const { left, top, width, height } = getExpandedTileBounds(geometry);

  useEffect(() => { onCloseRef.current = () => onClose(activeQuality, activeColorIndex); }, [onClose, activeQuality, activeColorIndex]);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setShowDetails(true), 350);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cn("pointer-events-auto absolute z-20", turning ? "bg-transparent" : "bg-base-100")}
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
            <div className="relative shrink-0 bg-base-100 p-5 text-base-content">
              <button ref={closeButton} type="button" className="absolute right-3 top-3 flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-base-content transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={() => onClose(activeQuality, activeColorIndex)} aria-label="Fermer les détails"><X className="size-5" /></button>
              <AuthQualityLogo color={activeColorIndex} />
              <div className="flex items-center justify-between gap-3">
                <h2 id={titleId} className="text-xl font-bold">{label}</h2>
                <button
                  ref={nextButton}
                  type="button"
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-base-content transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default"
                  aria-label={`Qualité suivante : ${platformQualities[(activeQuality + 1) % platformQualities.length].label}`}
                  disabled={turning}
                  onClick={() => {
                    if (!reducedMotion) {
                      setTurning(true);
                      onTurnChange(true);
                    }
                    setActiveQuality((current) => (current + 1) % platformQualities.length);
                    setActiveColorIndex((current) => (current + 1) % colors.length);
                  }}
                >
                  <ArrowRight className="size-5" aria-hidden="true" />
                </button>
              </div>
              <p id={descriptionId} className="mt-2 text-sm">{description}</p>
            </div>
            <div className={cn("min-h-0 flex-1 overflow-y-auto rounded-t-[15px] p-5", colors[activeColorIndex])}>
              {showDetails && <motion.div className="flex min-h-full flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
                <h3 className="mb-3 text-sm font-semibold">Les fonctionnalités clés</h3>
                <ul className="space-y-2">{features.map((feature) => <li key={feature} className="flex gap-3 text-sm leading-5"><Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{feature}</span></li>)}</ul>
                <figure className="mt-auto w-full pt-4">
                  <img src={screenshot} alt={screenshotAlt} loading="eager" className="aspect-[22/7] w-full rounded-xl object-cover object-top" />
                </figure>
              </motion.div>}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
