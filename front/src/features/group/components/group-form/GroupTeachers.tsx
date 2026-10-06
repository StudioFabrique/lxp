import { Link } from "react-router";
import { Pencil, Users } from "lucide-react";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { toTitleCase } from "../../../../utils/helpers/text-helpers";
import type Group from "../../../../utils/interfaces/group";

type Props = {
  group?: Group;
  teachers?: Array<Pick<NonNullable<Group["teachers"]>[number], "_id" | "firstname" | "lastname">>;
  parcoursId?: number;
  isCreating?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export default function GroupTeachers({
  group,
  teachers = group?.teachers,
  parcoursId = group?.parcoursId,
  isCreating = false,
  isLoading = !group && !isCreating,
  isError = false,
  onRetry,
}: Props) {
  return (
    <BoxWrapper className="h-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Users className="size-6" aria-hidden="true" /> Formateurs liés au groupe
          </h2>
          <p className="mt-1 text-sm text-base-content/65">
            Les affectations des formateurs se modifient depuis le parcours associé.
          </p>
        </div>
        {parcoursId && (
          <Link
            className="btn btn-outline btn-primary btn-sm"
            to={`/admin/parcours/edit/${parcoursId}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Modifier les formateurs dans un nouvel onglet"
          >
            <Pencil className="size-4" aria-hidden="true" /> Modifier
          </Link>
        )}
      </div>
      {isLoading ? (
        <p role="status" className="text-sm">Chargement des formateurs…</p>
      ) : isError ? (
        <div role="alert" className="alert alert-error">
          <span>Impossible de charger les formateurs associés au parcours.</span>
          <button type="button" className="btn btn-sm" onClick={onRetry}>Réessayer</button>
        </div>
      ) : teachers?.length ? (
        <ul className="flex flex-wrap gap-2">
          {teachers.map((teacher) => (
            <li key={teacher._id} className="rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm font-semibold">
              {toTitleCase(`${teacher.firstname} ${teacher.lastname}`)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-base-content/65">
          {isCreating
            ? parcoursId
              ? "Aucun formateur associé à ce parcours."
              : "Sélectionnez un parcours pour afficher les formateurs associés."
            : "Aucun formateur lié à ce groupe."}
        </p>
      )}
    </BoxWrapper>
  );
}
