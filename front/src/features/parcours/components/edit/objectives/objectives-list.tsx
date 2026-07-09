import { useState } from "react";
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import { useMutation } from "@tanstack/react-query";

import Objective from "../../../../../../src/utils/interfaces/objective";
import ObjectiveItem from "./objective-item";
import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import FormObjective from "./form-objective";
import toast from "react-hot-toast";
import { parcoursApi } from "../../../api/parcours.api";
import ButtonAdd from "../../../../../components/UI/button-add/button-add";

const ObjectivesList = () => {
  const objectivesList = useParcoursSelector(
    (state) => state.parcoursObjectives.objectives
  );
  const parcoursId = useParcoursSelector((state) => state.parcours.id);
  const dispatch = useParcoursDispatch();
  const [itemToUpdate, setItemToUpdate] = useState<Objective | null>(null);

  const { mutate: deleteObjective } = useMutation({
    mutationFn: (id: number) => parcoursApi.mutations.deleteObjective(id),
    onSuccess: (_data, id) => {
      dispatch({ type: "DELETE_OBJECTIVE", payload: id });
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const { mutate: updateObjective } = useMutation({
    mutationFn: (objective: Record<string, unknown>) =>
      parcoursApi.mutations.updateObjective(objective),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        dispatch({ type: "EDIT_OBJECTIVE", payload: data.data });
      }
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const { mutate: addObjective } = useMutation({
    mutationFn: (description: string) =>
      parcoursApi.mutations.updateParcoursObjectives({
        parcoursId: parcoursId!,
        objectives: [description],
      }),
    onSuccess: (data) => {
      dispatch({ type: "ADD_OBJECTIVE", payload: data.data[0] });
    },
    onError: () => toast.error("Erreur lors de l'ajout"),
  });

  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
    setItemToUpdate(null);
  };

  const handleOpenDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  const handleDeletion = (id: number) => {
    deleteObjective(id);
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
    updateObjective(objective as unknown as Record<string, unknown>);
  };

  const handleSubmit = (objective: Objective) => {
    addObjective(objective.description);
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
