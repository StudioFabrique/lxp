import { useEffect, useRef } from "react";
import { Text } from "lucide-react";
import { cn } from "../../../utils/cn";
import {
  publishChatbotDock,
  requestChatbotQuestionsClose,
  useChatbotDockSnapshot,
} from "../../chatbot/chatbot-dock-store";
import {
  bottomBarPlacement,
  isBottomBarReduced,
} from "../helpers/bottom-bar-placement";

type MobileModuleBottomBarProps = {
  onOpenNavigation: () => void;
  /** Reçoit la zone où l'aperçu dépose les boutons précédent / suivant. */
  onNavigationSlotChange: (element: HTMLElement | null) => void;
};

/**
 * Mobile : barre du bas de la page du module, toujours en bas, redimensionnée quand l'assistant virtuel occupe la même bande. Le bouton de gauche ouvre la liste
 * des cours et leçons ; les boutons précédent / suivant de l'activité y sont déposés par l'aperçu du contenu.
 */
export default function MobileModuleBottomBar({
  onOpenNavigation,
  onNavigationSlotChange,
}: MobileModuleBottomBarProps) {
  const dock = useChatbotDockSnapshot();
  const reduced = isBottomBarReduced(dock);
  // Un appui hors des questions les referme dès l'enfoncement du doigt : la barre a déjà repris sa forme normale
  // quand le clic arrive. On retient donc l'état au moment de l'appui.
  const reducedAtPress = useRef(false);
  const handleClick = (): void => {
    const wasReduced = reducedAtPress.current || reduced;
    reducedAtPress.current = false;
    // Réduite, la barre sert seulement à revenir à l'affichage normal ; elle n'ouvre rien.
    if (wasReduced) {
      requestChatbotQuestionsClose();
      return;
    }
    onOpenNavigation();
  };

  // Les questions de l'assistant laissent de la place à la barre tant qu'elle est affichée.
  useEffect(() => {
    publishChatbotDock({ hasBottomBar: true });
    return () => publishChatbotDock({ hasBottomBar: false });
  }, []);

  return (
    <div
      className={cn(
        "fixed flex items-center justify-between gap-2 rounded-full border border-base-300 bg-base-200/90 shadow-lg backdrop-blur transition-[left,right] duration-300 ease-out motion-reduce:transition-none md:hidden",
        // Réduite en cercle, elle passe au-dessus des questions de l'assistant (z-50).
        reduced ? "z-[55] size-12 justify-center p-0" : "z-40 p-1.5",
      )}
      style={bottomBarPlacement(dock)}
    >
      {/* Bouton plein et nommé : c'est l'accès à la liste des cours et leçons ; réduit, il garde la couleur dans un cercle. */}
      <button
        type="button"
        className={cn(
          "btn btn-secondary",
          reduced ? "btn-circle size-full" : "gap-2 rounded-full px-4",
        )}
        onPointerDown={() => {
          reducedAtPress.current = reduced;
        }}
        onClick={handleClick}
        aria-label={reduced ? "Revenir à l'affichage normal" : "Ouvrir la navigation du module"}
        aria-haspopup="dialog"
      >
        <Text className="size-5" aria-hidden="true" />
        {!reduced && <span>Sommaire</span>}
      </button>
      <div
        ref={onNavigationSlotChange}
        className={cn("flex items-center gap-2", reduced && "hidden")}
      />
    </div>
  );
}
