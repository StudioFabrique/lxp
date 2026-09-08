import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type ParcoursFilterBadgesProps = {
  parcours: string[];
  selectedParcours: string | null;
  onSelect: (parcours: string | null) => void;
};

const INITIAL_PARCOURS_COUNT = 5;

const ParcoursFilterBadges = ({
  parcours,
  selectedParcours,
  onSelect,
}: ParcoursFilterBadgesProps) => {
  const [showAll, setShowAll] = useState(false);
  const uniqueParcours = useMemo(
    () =>
      [...new Set(parcours)]
        .filter(Boolean)
        .sort((first, second) =>
          first.localeCompare(second, "fr", { sensitivity: "base" }),
        ),
    [parcours],
  );
  const hasMore = uniqueParcours.length > INITIAL_PARCOURS_COUNT;
  const collapsedParcours = uniqueParcours.slice(0, INITIAL_PARCOURS_COUNT);
  const visibleParcours = showAll
    ? uniqueParcours
    : selectedParcours &&
        uniqueParcours.includes(selectedParcours) &&
        !collapsedParcours.includes(selectedParcours)
      ? [...collapsedParcours.slice(0, -1), selectedParcours]
      : collapsedParcours;

  if (uniqueParcours.length === 0) return null;

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">
        Filtrer par parcours
      </legend>
      <div
        className="flex flex-wrap items-center gap-2"
        aria-label="Filtres par parcours"
        role="group"
      >
        <button
          type="button"
          className={`badge badge-lg cursor-pointer transition-colors ${
            selectedParcours === null
              ? "badge-primary bg-primary text-primary-content"
              : "badge-outline hover:badge-primary"
          }`}
          aria-pressed={selectedParcours === null}
          onClick={() => onSelect(null)}
        >
          Tous les parcours
        </button>

        {visibleParcours.map((parcoursTitle) => {
          const isSelected = selectedParcours === parcoursTitle;

          return (
            <button
              key={parcoursTitle}
              type="button"
              className={`badge badge-lg cursor-pointer transition-colors ${
                isSelected
                  ? "badge-primary bg-primary text-primary-content"
                  : "badge-outline hover:badge-primary"
              }`}
              aria-pressed={isSelected}
              onClick={() => onSelect(isSelected ? null : parcoursTitle)}
            >
              {parcoursTitle}
            </button>
          );
        })}

        {hasMore ? (
          <button
            type="button"
            className="badge badge-secondary badge-soft badge-lg cursor-pointer gap-1"
            aria-expanded={showAll}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? (
              <>
                <ChevronUp className="size-3.5" aria-hidden />
                Réduire
              </>
            ) : (
              <>
                <ChevronDown className="size-3.5" aria-hidden />
                Afficher plus de parcours ({
                  uniqueParcours.length - INITIAL_PARCOURS_COUNT
                })
              </>
            )}
          </button>
        ) : null}
      </div>
    </fieldset>
  );
};

export default ParcoursFilterBadges;
