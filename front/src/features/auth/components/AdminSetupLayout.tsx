import { useContext, type ReactNode } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";
import AndriaLogoLightMode from "../../../assets/andria-logo/logo-lightmode.svg";
import AndriaLogoDarkMode from "../../../assets/andria-logo/logo-darkmode.svg";
import { ThemeContext } from "../../../store/ThemeProvider";
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
  const { theme } = useContext(ThemeContext);
  const reduceMotion = useReducedMotion();

  return (
    <LayoutGroup>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <motion.div
          layout
          transition={{
            duration: reduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={
            isWelcome
              ? "mb-12 mt-[clamp(5rem,15vh,10rem)] flex flex-col items-center gap-2 text-center"
              : "mb-10 mt-0 flex flex-col items-center gap-2 text-center"
          }
        >
          <img
            className="h-auto w-56"
            src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode}
            alt="logo ANDRIA"
          />
          <span className="mt-2 max-w-xs text-xs font-semibold text-base-content">
            Apprentissage Numérique & Développement Renforcé par Intelligence
            Artificielle
          </span>
        </motion.div>
        {isWelcome ? (
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
