import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router";
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
    <section
      className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5"
      aria-labelledby="recommended-actions-title"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2
            id="recommended-actions-title"
            className="text-lg font-bold text-primary"
          >
            Actions recommandées
          </h2>
          <p className="text-sm text-base-content/65">
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
          <X className="h-4 w-4" />
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
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <li key={action.id} className="h-full">
                <Link
                  to={action.to}
                  className="group flex h-full min-h-28 items-start gap-3 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm transition hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">
                      Étape {index + 1}
                    </span>
                    <span className="block font-semibold">{action.title}</span>
                    <span className="mt-1 block text-sm text-base-content/65">
                      {action.description}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
