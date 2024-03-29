/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Objective from "../../../utils/interfaces/objective";
import ObjectiveItem from "./objective-item";
import ButtonAdd from "../../UI/button-add/button-add";
import useHttp from "../../../hooks/use-http";
import { parcoursObjectivesAction } from "../../../store/redux-toolkit/parcours/parcours-objectives";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import FormObjective from "./form-objective";
import toast from "react-hot-toast";

const ObjectivesList = () => {
  const objectivesList = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  );
  const parcoursId = useSelector((state: any) => state.parcours.id);
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const [itemToUpdate, setItemToUpdate] = useState<Objective | null>(null);

  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
    setItemToUpdate(null);
  };

  const handleOpenDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  const handleDeletion = (id: number) => {
    const applyData = (_data: {
      id: number;
      success: boolean;
      message: string;
    }) => {
      dispatch(parcoursObjectivesAction.deleteObjective(id));
    };
    sendRequest(
      {
        path: `/objective/${id}`,
        method: "delete",
      },
      applyData
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
    const applyData = (data: any) => {
      dispatch(parcoursObjectivesAction.editObjective(data.data));
    };
    sendRequest(
      {
        path: "/objective",
        method: "put",
        body: objective,
      },
      applyData
    );
  };

  const handleSubmit = (objective: Objective) => {
    const applyData = (data: any) => {
      dispatch(parcoursObjectivesAction.addObjective(data.data[0]));
    };
    sendRequest(
      {
        path: "/parcours/update-objectives",
        method: "put",
        body: { parcoursId, objectives: [objective.description] },
      },
      applyData
    );
  };

  /*   const handleReorderObjectives = (objectivesId: Array<string>) => {
    const applyData = (data: any) => {
      dispatch(parcoursObjectivesAction.setObjectives(data.data.objectives));
    };
    sendRequest(
      {
        path: "/parcours/reorder-objectives",
        method: "put",
        body: { parcoursId, objectivesId },
      },
      applyData
    );
  }; */

  /*   const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    // Reorder the objectivesList based on the drag result
    const reorderedObjectives = Array.from(objectivesList);
    const [reorderedObjective] = reorderedObjectives.splice(
      result.source.index,
      1
    );
    reorderedObjectives.splice(result.destination.index, 0, reorderedObjective);

    handleReorderObjectives(reorderedObjectives.map((item: any) => item.id));
  }; */

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

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
