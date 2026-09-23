import { useContext, type ReactNode, type Ref } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ThemeContext } from "../../store/ThemeProvider";
import { cn } from "../../utils/cn";

type Props = {
  children: ReactNode;
  contentKey: string;
  currentStep: number;
  stepCount: number;
  progressLabel: string;
  className?: string;
  contentClassName?: string;
  contentRef?: Ref<HTMLDivElement>;
  footer?: ReactNode;
};

export default function OnboardingProgressPanel({
  children,
  contentKey,
  currentStep,
  stepCount,
  progressLabel,
  className,
  contentClassName,
  contentRef,
  footer,
}: Props) {
  const { theme } = useContext(ThemeContext);
  const reduceMotion = useReducedMotion();
  const progress = Math.round((currentStep / stepCount) * 100);

  return (
    <section
      className={cn(
        "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border p-5 sm:p-7",
        theme === "dark"
          ? "border-primary/40 bg-base-300 shadow-xl"
          : "border-base-300 bg-base-100 shadow-sm",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        role="progressbar"
        aria-label={progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={`Étape ${currentStep} sur ${stepCount}`}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
        />
      </div>
      <div
        ref={contentRef}
        className={cn("min-h-0 flex-1 overflow-x-hidden overflow-y-auto", contentClassName)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={contentKey}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      {footer}
    </section>
  );
}
