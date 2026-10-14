import { createPortal } from "react-dom";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatTitle } from "../../../utils/helpers/text-helpers";
import RightSideDrawer from "../../../components/UI/right-side-drawer/right-side-drawer";
import { groupApi, type StudentGroupSummary } from "../../group/api/group.api";
import OnboardingStudentIdentity from "./OnboardingStudentIdentity";

export function ExistingGroup({ group }: { group: StudentGroupSummary }) {
  const [expanded, setExpanded] = useState(false);
  const details = useQuery({
    queryKey: ["onboarding-group", group._id],
    queryFn: () => groupApi.queries.getById(group._id),
    enabled: expanded,
  });

  return (
    <li className="overflow-hidden rounded-lg border border-base-300 bg-base-100">
      <button
        type="button"
        className="group flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        aria-haspopup="dialog"
        aria-label={`Voir les apprenants de ${group.name}`}
        onClick={() => setExpanded(true)}
      >
        <span className="min-w-0 flex-1">
          <span className="block break-words font-semibold">
            {formatTitle(group.name)}
          </span>
          <span className="mt-0.5 block text-sm text-base-content/65">
            {group.nbStudents === 0
              ? "Aucun apprenant"
              : `${group.nbStudents} apprenant${group.nbStudents > 1 ? "s" : ""}`}
          </span>
          <span className="mt-2 block text-xs font-semibold text-primary">
            Voir les apprenants
          </span>
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-base-content/45 transition-colors group-hover:text-primary"
          aria-hidden="true"
        />
      </button>
      {expanded &&
        createPortal(
          <RightSideDrawer
            title={`Apprenants de ${formatTitle(group.name)}`}
            id={`onboarding-group-${group._id}`}
            visible={false}
            isOpen
            onCloseDrawer={() => setExpanded(false)}
            panelClassName="min-w-0 w-full max-w-lg"
          >
            {details.isPending ? (
              <p role="status" className="text-sm">
                Chargement des apprenants…
              </p>
            ) : details.isError ? (
              <div role="alert" className="text-sm">
                <p>Impossible de charger les apprenants de ce groupe.</p>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm mt-2"
                  onClick={() => void details.refetch()}
                >
                  Réessayer
                </button>
              </div>
            ) : details.data.users?.length ? (
              <ul
                className="space-y-3"
                aria-label={`Apprenants de ${group.name}`}
              >
                {details.data.users.map((student) => (
                  <li
                    key={student._id}
                    className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm"
                  >
                    <OnboardingStudentIdentity student={student} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-base-content/65">
                Aucun apprenant dans ce groupe.
              </p>
            )}
          </RightSideDrawer>,
          document.body,
        )}
    </li>
  );
}
