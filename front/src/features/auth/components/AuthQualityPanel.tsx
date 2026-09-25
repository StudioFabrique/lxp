import { useEffect, useId, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import AuthQualityLogo from "./AuthQualityLogo";
import { platformQualities } from "./auth-platform-qualities";
import { getExpandedTileBounds, tileHeight, tileWidth, type Geometry } from "./auth-tile-grid";

type Props = {
  quality: number;
  color: string;
  colorIndex: number;
  x: number;
  y: number;
  geometry: Geometry;
  reducedMotion: boolean;
  onClose: () => void;
};

export default function AuthQualityPanel({ quality, color, colorIndex, x, y, geometry, reducedMotion, onClose }: Props) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const [showDetails, setShowDetails] = useState(reducedMotion);
  const titleId = useId();
  const descriptionId = useId();
  const { label, icon: Icon, description, features, screenshot, screenshotAlt } = platformQualities[quality];
  const { left, top, width, height } = getExpandedTileBounds(geometry);

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

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
      className="pointer-events-auto absolute z-20 bg-base-100"
      initial={{ left: x, top: y, width: tileWidth, height: tileHeight, opacity: 0.85 }}
      animate={{ left, top, width, height, opacity: 1 }}
      exit={{ left: x, top: y, width: tileWidth, height: tileHeight, opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[15px] bg-white" initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2, delay: reducedMotion ? 0 : 0.15 }}>
      <div className="relative shrink-0 bg-white p-5 text-black">
        <button ref={closeButton} type="button" className="absolute right-3 top-3 flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900" onClick={onClose} aria-label="Fermer les détails"><X className="size-5" /></button>
        <AuthQualityLogo quality={quality} color={colorIndex} />
        <div className="flex items-center gap-3"><Icon className="size-7 shrink-0" aria-hidden="true" /><h2 id={titleId} className="text-xl font-bold">{label}</h2></div>
        <p id={descriptionId} className="mt-2 text-sm">{description}</p>
      </div>
      <div className={`min-h-0 flex-1 overflow-y-auto rounded-t-[15px] p-5 ${color}`}>
        {showDetails && <motion.div className="flex min-h-full flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
          <h3 className="mb-3 text-sm font-semibold">Les fonctionnalités clés</h3>
          <ul className="space-y-2">{features.map((feature) => <li key={feature} className="flex gap-3 text-sm leading-5"><Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{feature}</span></li>)}</ul>
          <figure className="mt-auto w-full pt-4">
            <img src={screenshot} alt={screenshotAlt} loading="eager" className="aspect-[22/7] w-full rounded-xl object-cover object-top" />
          </figure>
        </motion.div>}
      </div>
      </motion.div>
    </motion.div>
  );
}
