import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthIntroContext } from "./AuthIntroContext";
import AuthOnboardingChatbot from "./AuthOnboardingChatbot";
import AuthAnimatedLogo from "./AuthAnimatedLogo";
import AuthLogoCaption from "./AuthLogoCaption";
import { cn } from "../../../utils/cn";

type Props = {
  intro: boolean;
  className?: string;
};

/** The same frame grows at the center, then settles at the left of the welcome. */
export default function AuthOnboardingBrand({ intro, className }: Props) {
  const reducedMotion = useReducedMotion();
  const setIntroActive = useContext(AuthIntroContext);
  const [greetingReady, setGreetingReady] = useState(false);
  useEffect(() => {
    if (!intro || reducedMotion) return;
    const timer = window.setTimeout(() => setGreetingReady(true), 1000);
    return () => window.clearTimeout(timer);
  }, [intro, reducedMotion]);
  useLayoutEffect(() => {
    setIntroActive(intro);
    return () => setIntroActive(false);
  }, [intro, setIntroActive]);
  const transition = { duration: reducedMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] as const };
  return (
    <motion.div
      layout="position"
      transition={transition}
      className={cn("flex w-full flex-col items-center", intro && "my-auto", className)}
    >
      <motion.div
        layout
        transition={transition}
        className={cn("relative flex max-w-full flex-col items-center gap-2 text-center", intro ? "w-[36rem]" : "w-72")}
      >
        <AuthAnimatedLogo className="w-full" />
        <AuthLogoCaption className={cn(intro ? "max-w-md sm:text-sm" : "max-w-xs")} />
        <AnimatePresence>
          {intro && greetingReady && !reducedMotion && (
            <motion.div
              className="absolute top-full mt-4 max-w-full"
              initial={false}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <AuthOnboardingChatbot />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
