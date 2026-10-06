import AuthOnboardingBrand from "./AuthOnboardingBrand";
import { useAuthIntro } from "../hooks/useAuthIntro";
import { type ReactNode } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";
import { cn } from "../../../utils/cn";

type Props = {
  children: ReactNode;
  isWelcome?: boolean;
  currentStep?: 1 | 2;
  contentKey?: string;
  contentClassName?: string;
};

export default function AdminSetupLayout({
  children,
  isWelcome = false,
  currentStep = 1,
  contentKey = String(currentStep),
  contentClassName,
}: Props) {
  const reduceMotion = useReducedMotion();
  const showIntro = useAuthIntro(isWelcome);

  return (
    <LayoutGroup>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <AuthOnboardingBrand
          intro={showIntro}
          className={cn(!showIntro && (isWelcome ? "mb-12 mt-[clamp(5rem,15vh,10rem)]" : "mb-10"))}
        />
        {showIntro ? null : isWelcome ? (
          children
        ) : (
          <motion.div
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.45,
              delay: reduceMotion ? 0 : 0.15,
            }}
          >
            <OnboardingProgressPanel
              contentKey={contentKey}
              currentStep={currentStep}
              stepCount={2}
              animateProgressOnMount={currentStep === 1}
              progressLabel="Progression de la configuration"
              className="min-h-[600px] flex-none lg:min-h-0 lg:flex-1"
              contentClassName={cn("flex flex-col", contentClassName)}
            >
              {children}
            </OnboardingProgressPanel>
          </motion.div>
        )}
      </div>
    </LayoutGroup>
  );
}
