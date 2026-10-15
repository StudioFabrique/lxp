import { useState, type ReactNode } from "react";
import { useParams } from "react-router";

import Objective from "../../../../../../src/utils/interfaces/objective";
import ObjectiveItem from "./objective-item";
import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import FormObjective from "./form-objective";
import toast from "react-hot-toast";
import EmptyStatePlaceholder from "../../../../../components/UI/empty-state-placeholder";
import ButtonAdd from "../../../../../components/UI/button-add/button-add";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { useUpdateParcours } from "../../../hooks/useUpdateParcours";
import LoadingSkeleton from "../../../../../components/loaders/LoadingSkeleton";

type ObjectivesListProps = {
  readOnly?: boolean;
  header?: ReactNode;
};

const ObjectivesList = ({ readOnly = false, header }: ObjectivesListProps) => {
  const { id } = useParams();
  const parcoursId = Number(id);
  const { data: parcours, isPending, isError } = useParcoursQuery(parcoursId);
  const objectivesList = parcours?.objectives ?? [];
  const updateParcours = useUpdateParcours(parcoursId);
  const [itemToUpdate, setItemToUpdate] = useState<Objective | null>(null);

  const saveObjectives = (descriptions: string[], successMessage: string) => {
    updateParcours.mutate(
      { objectives: descriptions },
      {
        onSuccess: () => toast.success(successMessage),
        onError: () => toast.error("Erreur lors de la sauvegarde des objectifs"),
      },
    );
  };

  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
    setItemToUpdate(null);
  };

  const handleOpenDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  const handleDeletion = (id: number) => {
    saveObjectives(
      objectivesList
        .filter((objective) => objective.id !== id)
        .map((objective) => objective.description),
      "Objectif supprimé",
    );
  };

  const handleUpdateObjective = (id: number) => {
    const objectiveToUpdate = objectivesList.find(
      (item: Objective) => item.id === id
    );
    if (objectiveToUpdate) {
      setItemToUpdate(objectiveToUpdate);
      handleOpenDrawer("update-objective");
    }
  };

  const submitUpdateObjective = (objective: Objective) => {
    setItemToUpdate(null);
    saveObjectives(
      objectivesList.map((item) =>
        item.id === objective.id ? objective.description : item.description,
      ),
      "Objectif mis à jour",
    );
  };

  const handleSubmit = (objective: Objective) => {
    saveObjectives(
      [...objectivesList.map((item) => item.description), objective.description],
      "Objectif ajouté",
    );
  };

  return (
    <>
      {/* Mobile : l'en-tête d'import et le bouton d'ajout s'empilent, chacun sur toute la largeur. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 sm:flex-1">{header}</div>
        <ButtonAdd
          label="Ajouter un objectif"
          outline={true}
          onClickEvent={() => handleOpenDrawer("add-objective")}
          isDisabled={readOnly}
        />
      </div>

      {objectivesList.length > 0 ? (
        <ul className="flex flex-col gap-y-2">
          {objectivesList.map((item: Objective) => (
            <li key={item.id}>
              <ObjectiveItem
                objective={item}
                onDelete={handleDeletion}
                onUpdate={handleUpdateObjective}
                readOnly={readOnly}
              />
            </li>
          ))}
        </ul>
      ) : isPending ? (
        <LoadingSkeleton variant="rows" label="Chargement des objectifs" />
      ) : isError ? (
        <p role="alert">Impossible de charger les objectifs.</p>
      ) : (
        <EmptyStatePlaceholder
          title="Aucun objectif renseigné"
          withBorder={false}
        />
      )}

      {/* Ajout d'un objectif */}
      {!readOnly ? (
        <RightSideDrawer
          id="add-objective"
          title="Ajouter un objectif"
          onCloseDrawer={handleCloseDrawer}
          visible={false}
        >
          <FormObjective
            onCloseDrawer={handleCloseDrawer}
            onSubmit={handleSubmit}
          />
        </RightSideDrawer>
      ) : null}

      {/* Mise à jour d'un objectif */}
      {!readOnly ? (
        <RightSideDrawer
          id="update-objective"
          title="Modifier un objectif"
          onCloseDrawer={handleCloseDrawer}
          visible={false}
        >
          {itemToUpdate ? (
            <FormObjective
              objective={itemToUpdate}
              onCloseDrawer={handleCloseDrawer}
              onSubmit={submitUpdateObjective}
            />
          ) : null}
        </RightSideDrawer>
      ) : null}
    </>
  );
};
export default ObjectivesList;

// TODO AJOUTER LE DRAWER
