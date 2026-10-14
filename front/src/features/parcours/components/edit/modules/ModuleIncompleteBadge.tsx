import { useId } from "react";
import { CircleQuestionMark } from "lucide-react";

type ModuleIncompleteBadgeProps = {
  missingRequirements: readonly string[];
};

export default function ModuleIncompleteBadge({
  missingRequirements,
}: ModuleIncompleteBadgeProps) {
  const tooltipId = useId();

  return (
    <span className="group/badge relative inline-flex">
      {/* Infobulle sous le badge, alignée sur son bord gauche et déployée vers la droite. */}
      <span
        className="pointer-events-none absolute top-full z-30 mt-2 w-max max-w-64 rounded-box bg-neutral px-3 py-2 text-left text-sm text-neutral-content opacity-0 shadow-lg transition-opacity duration-150 group-hover/badge:opacity-100 group-focus-within/badge:opacity-100"
        id={tooltipId}
        role="tooltip"
      >
        <span className="block font-semibold">Module incomplet</span>
        <ul className="list-disc pl-4">
          {missingRequirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </span>
      <span
        className="badge badge-warning badge-md select-none gap-1.5"
        tabIndex={0}
        aria-describedby={tooltipId}
      >
        Incomplet
        <CircleQuestionMark className="size-4" aria-hidden="true" />
      </span>
    </span>
  );
}
