import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Pied de page des panneaux d'onboarding : les actions sont empilées en pleine
 * largeur sur mobile (action principale en premier) et alignées en ligne dès `sm`.
 * Les boutons enfants portent `w-full sm:w-auto`.
 */
export default function OnboardingFooter({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mt-5 flex shrink-0 flex-col-reverse gap-2 border-t border-base-300 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
