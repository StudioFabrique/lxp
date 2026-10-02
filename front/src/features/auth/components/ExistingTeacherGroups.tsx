import { createPortal } from "react-dom";
import { useState } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { formatTitle } from "../../../utils/helpers/text-helpers";
import RightSideDrawer from "../../../components/UI/right-side-drawer/right-side-drawer";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { groupApi, type StudentGroupSummary } from "../../group/api/group.api";
import OnboardingStudentIdentity from "./OnboardingStudentIdentity";

function ExistingGroup({ group }: { group: StudentGroupSummary }) {
  const [expanded, setExpanded] = useState(false);
  const details = useQuery({
    queryKey: ["onboarding-group", group._id],
    queryFn: () => groupApi.queries.getById(group._id),
    enabled: expanded,
  });

  return (
    <li className="overflow-hidden rounded-lg border border-base-300 bg-base-100">
      <div className="flex flex-col gap-3 p-3">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="break-words font-semibold">
              {formatTitle(group.name)} ({group.nbStudents})
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm self-start"
          aria-haspopup="dialog"
          aria-label={`Voir les apprenants de ${group.name}`}
          onClick={() => setExpanded(true)}
        >
          Voir les apprenants
        </button>
      </div>
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

export default function ExistingTeacherGroups({
  groups,
}: {
  groups: UseQueryResult<StudentGroupSummary[], Error>;
}) {
  if (groups.isPending)
    return (
      <p role="status" className="text-sm">
        Chargement de vos groupes…
      </p>
    );
  if (groups.isError)
    return (
      <div role="alert" className="text-sm">
        <p>Impossible de charger vos groupes.</p>
        <button
          type="button"
          className="btn btn-ghost btn-sm mt-2"
          onClick={() => void groups.refetch()}
        >
          Réessayer
        </button>
      </div>
    );
  if (!groups.data.length) return null;

  return (
    <BoxWrapper className="h-auto">
      <div>
        <h2 className="font-semibold">Les groupes existants</h2>
      </div>
      <ul className="space-y-2">
        {groups.data.map((group) => (
          <ExistingGroup key={group._id} group={group} />
        ))}
      </ul>
    </BoxWrapper>
  );
}
