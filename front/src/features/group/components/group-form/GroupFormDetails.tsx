import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { ExternalLink } from "lucide-react";
import { groupApi } from "../../api/group.api";
import type { GroupFormValues } from "../../group.schema";

const GroupFormDetails = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<GroupFormValues>();
  const formationId = watch("formationId");
  const selectedParcoursId = watch("parcoursId");

  const handleFormation = (id: number) => {
    setValue("formationId", id, { shouldDirty: true });
    setValue("parcoursId", 0, { shouldDirty: true, shouldValidate: true });
  };

  const { data: formations = [], isLoading: isLoadingFormations } = useQuery({
    queryKey: ["formations", "group-form"],
    queryFn: groupApi.queries.getFormations,
  });

  const { data: parcoursList = [], isLoading: isLoadingParcours } = useQuery({
    queryKey: ["parcours", "by-formation", formationId],
    queryFn: () => groupApi.queries.getParcoursByFormation(formationId),
    enabled: formationId > 0,
  });

  const selectedParcours = useMemo(
    () => parcoursList.find((parcours) => parcours.id === selectedParcoursId),
    [parcoursList, selectedParcoursId],
  );

  return (
    <Wrapper>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-bold text-xl">Parcours associé</h2>
          <p className="mt-1 text-sm text-base-content/65">
            Vous pouvez associer un parcours au groupe maintenant ou plus tard.
          </p>
        </div>

        <div>
          <label className="flex w-full flex-col gap-2">
            <span className="text-sm font-semibold">Formation</span>
            <select
              className="select select-sm select-bordered w-full"
              value={formationId}
              disabled={isLoadingFormations}
              onChange={(event) => handleFormation(Number(event.target.value))}
            >
              <option value={0}>
                {isLoadingFormations
                  ? "Chargement des formations…"
                  : "Sélectionner une formation"}
              </option>
              {formations.map((formation) => (
                <option key={formation.id} value={formation.id}>
                  {formation.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="flex w-full flex-col gap-2">
            <span className="text-sm font-semibold">Parcours</span>
            <select
              className="select select-sm select-bordered w-full"
              disabled={!formationId || isLoadingParcours}
              value={selectedParcoursId}
              onChange={(event) =>
                setValue("parcoursId", Number(event.target.value), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <option value={0}>
                {isLoadingParcours
                  ? "Chargement des parcours…"
                  : formationId
                    ? "Aucun parcours"
                    : "Choisissez d’abord une formation"}
              </option>
              {parcoursList.map((parcours) => (
                <option key={parcours.id} value={parcours.id}>
                  {parcours.title}
                </option>
              ))}
            </select>
            {errors.parcoursId && (
              <span className="text-xs text-error">
                {errors.parcoursId.message}
              </span>
            )}
          </label>
        </div>

        {selectedParcours && (
          <div className="flex items-center justify-between gap-3 border-t border-base-content/50 pt-4 px-4">
            <div>
              <p className="text-xs text-base-content/60">
                Parcours sélectionné
              </p>
              <p className="font-semibold">{selectedParcours.title}</p>
            </div>
            <a
              href={`/admin/parcours/view/${selectedParcours.id}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-square btn-sm text-sm"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </Wrapper>
  );
};
export default GroupFormDetails;
