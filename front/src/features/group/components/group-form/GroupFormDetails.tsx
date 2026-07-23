import { FC, useEffect, useMemo, useState } from "react";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import apiClient from "../../../../lib/axios";
import Group from "../../../../../src/utils/interfaces/group";
import Formation from "../../../../../src/utils/interfaces/formation";
import Parcours from "../../../../../src/utils/interfaces/parcours";

const GroupFormDetails: FC<{
  group?: Group;
  onSelectParcours: (id: number) => void;
  selectedParcoursId?: number | null;
}> = ({ group, onSelectParcours, selectedParcoursId }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [formationId, setFormationId] = useState<number | undefined>(
    group?.formationId,
  );
  const [parcoursList, setParcoursList] = useState<Parcours[]>([]);
  const [isLoadingParcours, setIsLoadingParcours] = useState(false);

  const handleFormation = (id: number) => {
    setFormationId(id || undefined);
    setParcoursList([]);
    onSelectParcours(0);
  };

  useEffect(() => {
    if (formationId !== undefined) {
      (async () => {
        setIsLoadingParcours(true);
        try {
          const response = await apiClient.get(
            `/parcours/parcours-by-formation/${formationId}`,
          );
          const data = response.data as { data: Array<Parcours> };
          setParcoursList(data.data);
        } catch {
          setParcoursList([]);
        } finally {
          setIsLoadingParcours(false);
        }
      })();
    }
  }, [formationId]);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiClient.get("/formation");
        const data = response.data as Array<Formation>;
        setFormations(data);
      } catch {
        // silently fail
      }
    })();
  }, []);

  useEffect(() => {
    if (
      group?.parcoursId &&
      parcoursList.some((parcours) => parcours.id === group.parcoursId)
    ) {
      onSelectParcours(group.parcoursId);
    }
  }, [group?.parcoursId, parcoursList, onSelectParcours]);

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
            Les apprenants du groupe accéderont au parcours sélectionné.
          </p>
        </div>

        <div>
          <label className="flex w-full flex-col gap-2">
            <span className="text-sm font-semibold">Formation</span>
            <select
              className="select select-sm select-bordered w-full"
              value={formationId ?? 0}
              onChange={(event) => handleFormation(Number(event.target.value))}
            >
              <option value={0}>Sélectionner une formation</option>
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
              value={selectedParcoursId ?? 0}
              onChange={(event) =>
                onSelectParcours(Number(event.target.value))
              }
            >
              <option value={0}>
                {isLoadingParcours
                  ? "Chargement des parcours…"
                  : formationId
                    ? "Sélectionner un parcours"
                    : "Choisissez d’abord une formation"}
              </option>
              {parcoursList.map((parcours) => (
                <option key={parcours.id} value={parcours.id}>
                  {parcours.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {formationId && !isLoadingParcours && parcoursList.length === 0 && (
          <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">
            Aucun parcours n’est disponible pour cette formation.
          </p>
        )}

        {selectedParcours && (
          <div className="flex items-center justify-between gap-3 border-t border-base-300 pt-4">
            <div>
              <p className="text-xs text-base-content/60">
                Parcours sélectionné
              </p>
              <p className="font-semibold">{selectedParcours.title}</p>
            </div>
            <div>
              <a
                href={`/admin/parcours/view/${selectedParcours.id}`}
                target="_blank"
                rel="noreferrer"
                className="link link-primary text-sm"
              >
                Vérifier
              </a>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};
export default GroupFormDetails;
