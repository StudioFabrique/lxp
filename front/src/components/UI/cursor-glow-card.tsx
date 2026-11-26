import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { useVisualPreferences } from "../../store/VisualPreferences";

type CursorGlowCardProps = {
  children: ReactNode;
  glowSize?: number;
  /** Multiplicateur d'opacité du halo (1 = intensité par défaut). */
  glowIntensity?: number;
  glowColor?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error";
  className?: string;
  allowOverflow?: boolean;
  autoGlow?: boolean;
  disableHoverScale?: boolean;
};

const glowColorClasses: Record<
  NonNullable<CursorGlowCardProps["glowColor"]>,
  string
> = {
  primary: "bg-primary/40",
  secondary: "bg-secondary/40",
  accent: "bg-accent/70",
  neutral: "bg-neutral/40",
  info: "bg-info/70",
  success: "bg-success/40",
  warning: "bg-warning/40",
  error: "bg-error/40",
};

/** Durée de transition du halo : nulle sans animations, plus courte au survol. */
const hoverDuration = (
  animations: boolean,
  isHovered: boolean,
  hoveredDuration: number,
): number => {
  if (!animations) return 0;
  return isHovered ? hoveredDuration : 0.5;
};

const CursorGlowCard = ({
  children,
  glowSize = 1,
  glowIntensity = 1,
  glowColor = "primary",
  className,
  allowOverflow = false,
  autoGlow = false,
  disableHoverScale = false,
}: CursorGlowCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { glow, animations } = useVisualPreferences();
  const reduceMotion = useReducedMotion();
  const glowEnabled = glow && !reduceMotion;
  const autoEnabled = autoGlow && glowEnabled && animations;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: autoGlow ? 35 : 500, damping: autoGlow ? 18 : 50 });
  const springY = useSpring(mouseY, { stiffness: autoGlow ? 35 : 500, damping: autoGlow ? 18 : 50 });

  // Sans animations, le halo automatique reste centré sur la carte.
  useEffect(() => {
    if (autoGlow && glowEnabled && !animations && cardRef.current) {
      mouseX.set(cardRef.current.clientWidth / 2);
      mouseY.set(cardRef.current.clientHeight / 2);
    }
  }, [autoGlow, animations, glowEnabled, mouseX, mouseY]);

  useEffect(() => {
    if (!autoEnabled) return;
    let frame = 0;
    const start = performance.now();
    const move = (now: number) => {
      const card = cardRef.current;
      if (card) {
        const elapsed = (now - start) / 1000;
        mouseX.set(card.clientWidth * (0.5 + 0.34 * Math.sin(elapsed * 0.32)));
        mouseY.set(card.clientHeight * (0.5 + 0.29 * Math.sin(elapsed * 0.23 + 1)));
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [autoEnabled, mouseX, mouseY]);

  const scaleDuration = hoverDuration(animations, isHovered, 0.25);
  const opacityDuration = hoverDuration(animations, isHovered, 0.2);

  const glowBaseOpacity = glowColor === "accent" ? 0.8 : 0.7;
  const glowVisible = glowEnabled && (autoGlow || isHovered);
  const followsPointer = glowEnabled && !autoGlow;

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    handleMouseMove(event);
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={followsPointer ? handleMouseEnter : undefined}
      onMouseLeave={followsPointer ? () => setIsHovered(false) : undefined}
      onMouseMove={followsPointer ? handleMouseMove : undefined}
      className={cn(
        "group relative rounded-xl",
        animations && !disableHoverScale && "transition-transform duration-200 hover:scale-101",
        allowOverflow ? "overflow-visible" : "overflow-hidden",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <motion.span
          className={cn(
            "absolute h-14 w-36 rounded-full blur-xl",
            glowColorClasses[glowColor],
          )}
          initial={{ scale: 0, opacity: 0 }}
          style={{
            x: animations ? springX : mouseX,
            y: animations ? springY : mouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            scale: glowVisible ? glowSize : 0,
            opacity: glowVisible ? glowBaseOpacity * glowIntensity : 0,
          }}
          transition={{
            scale: {
              duration: scaleDuration,
              ease: isHovered ? "easeOut" : "easeInOut",
            },
            opacity: {
              duration: opacityDuration,
              ease: "easeOut",
            },
          }}
          aria-hidden="true"
        />
      </div>
      {children}
    </div>
  );
};

export default CursorGlowCard;
