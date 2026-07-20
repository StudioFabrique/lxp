import { useState } from "react";
import { useParams } from "react-router";

import Objective from "../../../../../../src/utils/interfaces/objective";
import ObjectiveItem from "./objective-item";
import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import FormObjective from "./form-objective";
import toast from "react-hot-toast";
import ButtonAdd from "../../../../../components/UI/button-add/button-add";
import { useParcoursQuery, useUpdateParcours } from "../../../hooks/useParcoursQuery";

const ObjectivesList = () => {
  const { id } = useParams();
  const parcoursId = Number(id);
  const { data: parcours } = useParcoursQuery(parcoursId);
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
      <ul className="flex flex-col gap-y-2">
        {objectivesList && objectivesList.length > 0 ? (
          objectivesList.map((item: Objective) => (
            <li key={item.id}>
              <ObjectiveItem
                objective={item}
                onDelete={handleDeletion}
                onUpdate={handleUpdateObjective}
              />
            </li>
          ))
        ) : (
          <p>Objectifs non renseignés</p>
        )}
      </ul>

      <div className="w-fit">
        <ButtonAdd
          label="Ajouter un objectif"
          onClickEvent={() => handleOpenDrawer("add-objective")}
        />
      </div>

      {/* Ajout d'un objectif */}
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

      {/* Mise à jour d'un objectif */}
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
    </>
  );
};
export default ObjectivesList;

// TODO AJOUTER LE DRAWER
