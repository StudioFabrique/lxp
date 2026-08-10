import { motion, useMotionValue, useSpring } from "motion/react";
import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "../../utils/cn";

type CursorGlowCardProps = {
  children: ReactNode;
  glowSize?: number;
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
};

const CursorGlowCard = ({
  children,
  glowSize = 1,
  glowColor = "primary",
  className,
}: CursorGlowCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-xl transition-transform duration-200 hover:scale-101",
        className,
      )}
    >
      <motion.span
        className={cn(
          "pointer-events-none absolute h-14 w-36 invisible rounded-full opacity-70 blur-xl group-hover:visible",
          glowColor === "primary" && "bg-primary/40",
          glowColor === "secondary" && "bg-secondary/40",
          glowColor === "accent" && "bg-accent/40",
          glowColor === "neutral" && "bg-neutral/40",
          glowColor === "info" && "bg-info/40",
          glowColor === "success" && "bg-success/40",
          glowColor === "warning" && "bg-warning/40",
          glowColor === "error" && "bg-error/40",
        )}
        initial={{ scale: 0 }}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? glowSize : 0,
        }}
        transition={{ duration: 0.5 }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export default CursorGlowCard;
