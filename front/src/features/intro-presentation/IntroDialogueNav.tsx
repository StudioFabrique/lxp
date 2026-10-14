import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "../../utils/cn";
import type { IntroGuide } from "./useIntroGuide";

/** Action de fin de suite, qui prend la place de « Suivant » quand il n'y a plus de message à lire. */
export type IntroDialogueAction = { label: string; icon?: ReactNode; onClick: () => void };

type Props = Pick<IntroGuide, "previous" | "next"> & { additionalAction?: IntroDialogueAction };

const buttonClassName = "btn btn-xs h-5 min-h-0 rounded-full px-2 text-[0.65rem] font-normal";

/**
 * « Précédent » (à gauche, en contour, avec sa flèche) et « Suivant » (à droite, avec sa flèche) sous un message
 * de l'assistant virtuel ; au dernier message, `additionalAction` occupe l'emplacement de « Suivant ».
 * Rien s'il n'y a qu'un message sans action.
 */
export default function IntroDialogueNav({ previous, next, additionalAction }: Props) {
  if (!previous && !next && !additionalAction) return null;

  return (
    <div className={cn("mt-2 flex items-center gap-1", previous ? "justify-between" : "justify-end")}>
      {previous && (
        <button type="button" className={cn(buttonClassName, "btn-outline btn-primary")} onClick={previous}>
          <ArrowLeft className="size-3" aria-hidden="true" />
          Précédent
        </button>
      )}
      {next ? (
        <button type="button" className={cn(buttonClassName, "btn-primary")} onClick={next}>
          Suivant
          <ArrowRight className="size-3" aria-hidden="true" />
        </button>
      ) : (
        additionalAction && (
          <button type="button" className={cn(buttonClassName, "btn-primary")} onClick={additionalAction.onClick}>
            {additionalAction.label}
            {additionalAction.icon}
          </button>
        )
      )}
    </div>
  );
}
