import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../../utils/cn";

export default function AuthLogoCaption({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span
      data-auth-caption
      className={cn("mt-2 max-w-xs text-center text-xs font-semibold text-primary", className)}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reducedMotion ? 0 : 0.8, duration: reducedMotion ? 0 : 0.8 }}
    >
      Apprentissage Numérique &amp; Développement Renforcé par Intelligence Artificielle
    </motion.span>
  );
}
