import { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Bell, FastForward } from "lucide-react";
import { Link } from "react-router";
import RightSideDrawer from "../../../components/UI/right-side-drawer/right-side-drawer";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import type { RecommendedAction } from "./recommended-action-config";

type Props = {
  userId: string;
  actions: RecommendedAction[];
  isLoading?: boolean;
};

const DRAWER_ID = "recommended-actions-drawer";

const storageKey = (userId: string) =>
  `lxp:recommended-actions:hidden:${userId}`;

/**
 * Bouton de notification (pastille = nombre d'actions restantes) à placer dans l'en-tête de page.
 * Il ouvre un tiroir qui liste les actions recommandées. Le tiroir est monté dans `body` pour rester
 * indépendant de son conteneur (en-tête collant, tiroir d'actions de la barre mobile).
 */
export default function RecommendedActions({
  userId,
  actions,
  isLoading = false,
}: Props) {
  const [isHidden, setIsHidden] = useState(
    () => localStorage.getItem(storageKey(userId)) === "true",
  );
  const [isOpen, setIsOpen] = useState(false);

  if (isHidden || isLoading || actions.length === 0) return null;

  const hideRecommendations = () => {
    localStorage.setItem(storageKey(userId), "true");
    setIsOpen(false);
    setIsHidden(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost gap-2 max-md:w-full max-md:justify-start"
        aria-label={`Actions recommandées, ${actions.length} à réaliser`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span className="indicator">
          <span
            className="indicator-item badge badge-primary badge-xs px-1"
            aria-hidden="true"
          >
            {actions.length}
          </span>
          <Bell className="size-5" aria-hidden="true" />
        </span>
        <span className="md:hidden">Actions recommandées</span>
      </button>

      {createPortal(
        <RightSideDrawer
          id={DRAWER_ID}
          title="Actions recommandées"
          visible={false}
          isOpen={isOpen}
          onCloseDrawer={() => setIsOpen(false)}
          panelClassName="sm:min-w-[26rem] sm:max-w-md"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="text-sm text-base-content/80">
              Quelques étapes pour bien démarrer sur la plateforme.
            </p>
            <button
              type="button"
              className="btn btn-ghost btn-xs shrink-0 gap-1.5 font-medium text-base-content/70 hover:text-base-content"
              onClick={hideRecommendations}
              aria-label="Masquer les actions recommandées"
            >
              Passer
              <FastForward className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <ol className="flex flex-col gap-3">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <li key={action.id}>
                  <Link
                    to={action.to}
                    onClick={() => setIsOpen(false)}
                    className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <BoxWrapper className="flex-row items-start gap-3 border-primary/40 bg-base-100 p-4 transition group-hover:border-primary/70 group-hover:shadow-md">
                      <span className="flex size-10 shrink-0 items-center justify-center text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">
                          {action.title}
                        </span>
                        <span className="mt-1 block text-sm text-base-content/80">
                          {action.description}
                        </span>
                      </span>
                      <ArrowRight
                        className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </BoxWrapper>
                  </Link>
                </li>
              );
            })}
          </ol>
        </RightSideDrawer>,
        document.body,
      )}
    </>
  );
}
