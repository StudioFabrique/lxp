import { useState } from "react";
import { ArrowRight, FastForward } from "lucide-react";
import { Link } from "react-router";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import type { RecommendedAction } from "./recommended-action-config";

type Props = {
  userId: string;
  actions: RecommendedAction[];
  isLoading?: boolean;
};

const storageKey = (userId: string) =>
  `lxp:recommended-actions:hidden:${userId}`;

export default function RecommendedActions({
  userId,
  actions,
  isLoading = false,
}: Props) {
  const [isHidden, setIsHidden] = useState(
    () => localStorage.getItem(storageKey(userId)) === "true",
  );

  if (isHidden || (!isLoading && actions.length === 0)) return null;

  const hideRecommendations = () => {
    localStorage.setItem(storageKey(userId), "true");
    setIsHidden(true);
  };

  return (
    <section className="p-2" aria-labelledby="recommended-actions-title">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2
            id="recommended-actions-title"
            className="text-xl font-bold text-primary"
          >
            Actions recommandées
          </h2>
          <p className="text-sm text-base-content/80">
            Quelques étapes pour bien démarrer sur la plateforme.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm gap-1"
          onClick={hideRecommendations}
          aria-label="Masquer les actions recommandées"
        >
          <span className="hidden sm:inline">Passer</span>
          <FastForward className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 lg:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-28 skeleton rounded-xl" />
          ))}
        </div>
      ) : (
        <ol className="grid gap-3 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <li key={action.id} className="h-full">
                <Link
                  to={action.to}
                  className="group block h-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <BoxWrapper className="flex-row items-start gap-3 border-primary/40 bg-base-200 p-4 transition group-hover:border-primary/70 group-hover:bg-base-300/60 group-hover:shadow-md">
                    <span className="flex size-10 shrink-0 items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{action.title}</span>
                      <span className="mt-1 block text-sm text-base-content/80">
                        {action.description}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                  </BoxWrapper>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
