import { motion, useMotionValue, useSpring } from "motion/react";
import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "../../utils/cn";

type CursorGlowCardProps = {
  children: ReactNode;
  className?: string;
};

const CursorGlowCard = ({ children, className }: CursorGlowCardProps) => {
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
        className="pointer-events-none absolute h-14 w-36 invisible rounded-full bg-primary/50 opacity-70 blur-xl group-hover:visible"
        initial={{ scale: 0 }}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export default CursorGlowCard;
