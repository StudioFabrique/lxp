import { Users } from "lucide-react";
import { type UseQueryResult } from "@tanstack/react-query";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { type StudentGroupSummary } from "../../group/api/group.api";
import CreateTeacherGroup from "./CreateTeacherGroup";
import { ExistingGroup } from "./ExistingGroup";

export default function ExistingTeacherGroups({
  groups,
}: Readonly<{
  groups: UseQueryResult<StudentGroupSummary[], Error>;
}>) {
  const renderContent = () => {
    if (groups.isPending) {
      return <output className="block text-sm">Chargement de vos groupes…</output>;
    }
    if (groups.isError) {
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
    }
    if (groups.data.length) {
      return (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {groups.data.map((group) => (
            <ExistingGroup key={group._id} group={group} />
          ))}
        </ul>
      );
    }
    return (
      <p className="text-sm text-base-content/65">
        Vous n’avez pas encore de groupe. Créez votre premier groupe afin que vos
        apprenants puissent débuter leur parcours.
      </p>
    );
  };

  return (
    <BoxWrapper className="h-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users
            className="size-5 shrink-0 text-secondary"
            aria-hidden="true"
          />
          <h2 className="font-semibold">Vos groupes existants</h2>
        </div>
        <CreateTeacherGroup />
      </div>
      {renderContent()}
    </BoxWrapper>
  );
}
