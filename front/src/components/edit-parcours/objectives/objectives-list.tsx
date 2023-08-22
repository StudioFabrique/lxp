import { useDispatch, useSelector } from "react-redux";

import Objective from "../../../utils/interfaces/objective";
import ObjectiveItem from "./objective-item";
import ButtonAdd from "../../UI/button-add/button-add";
import useHttp from "../../../hooks/use-http";
import { parcoursObjectivesAction } from "../../../store/redux-toolkit/parcours/parcours-objectives";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import FormObjective from "./form-objective";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const ObjectivesList = () => {
  const objectivesList = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  );
  const parcoursId = useSelector((state: any) => state.parcours.id);
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();

  const handleDrawer = (id: string) => {
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

  const handleReorderObjectives = (list: Array<any>) => {
    const applyData = (data: any) => {
      console.log(data);
    };
    sendRequest(
      {
        path: "/parcours/reorder-objectives",
        method: "put",
        body: { parcoursId, objectivesId: list.map((item) => item.id) },
      },
      applyData
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    // Reorder the objectivesList based on the drag result
    const reorderedObjectives = Array.from(objectivesList);
    const [reorderedObjective] = reorderedObjectives.splice(
      result.source.index,
      1
    );
    reorderedObjectives.splice(result.destination.index, 0, reorderedObjective);
    console.log(reorderedObjectives);

    dispatch(parcoursObjectivesAction.setObjectives(reorderedObjectives));
    handleReorderObjectives(reorderedObjectives);
    // Dispatch action to update the state with the reordered list
    // You'll need to implement the relevant action in your redux logic
    // dispatch(reorderObjectivesAction(reorderedObjectives));
  };
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="objectives-list" type="OBJECTIVE">
          {(provided) => (
            <ul
              className="flex flex-col gap-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {objectivesList && objectivesList.length > 0 ? (
                objectivesList.map((item: Objective, index: number) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id!.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ObjectiveItem
                          objective={item}
                          onDelete={handleDeletion}
                        />
                      </li>
                    )}
                  </Draggable>
                ))
              ) : (
                <p>Objectifs non renseignés</p>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <ButtonAdd
        label="Ajouter un bojectif"
        onClickEvent={() => handleDrawer("add-objective")}
      />

      <RightSideDrawer
        id="add-objective"
        title="Ajouter un objectif"
        onCloseDrawer={handleDrawer}
        visible={false}
      >
        <FormObjective onCloseDrawer={handleDrawer} onSubmit={handleSubmit} />
      </RightSideDrawer>
    </>
  );
};
export default ObjectivesList;

// TODO AJOUTER LE DRAWER
