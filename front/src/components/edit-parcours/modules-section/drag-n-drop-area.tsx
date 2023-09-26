import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";

import ColumnItem from "./column-item";
import DndModulesList from "./dnd-modules-list";
import Column from "./column";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import Module from "../../../utils/interfaces/module";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";

interface DragNDropAreaprops {
  formationModules: Module[];
}

const DragNDropArea = (props: DragNDropAreaprops) => {
  const { formationModules } = props;
  const [dnd, setDnd] = useState<DndModulesList | null>(null);
  //useState<Module[]>(formationModules);
  const dispatch = useDispatch();
  const parcoursModules = useSelector(
    (state: any) => state.parcoursModules.modules
  );
  const isInitialRender = useRef(true);
  const isInitialEffect = useRef(true);
  //const newModule = useSelector((state: any) => state.parcoursModule.newModule);

  console.log("rendering...");

  /*   useEffect(() => {
    setDnd((prevModules) => {
      if (newModule) {
        if (prevModules) {
          return {
            columns: {
              destColumn: {
                ...prevModules!.columns["destColumn"],
                modulesIds: [
                  ...prevModules!.columns["destColumn"].modulesIds,
                  "0",
                ],
              },
              sourceColumn: prevModules!.columns["sourceColumn"],
            },
            tasks: [
              ...prevModules!.tasks,
              {
                id: "0",
                title: "Nouveau module",
                description: "Description",
                duration: 1,
                contacts: [],
                bonusSkills: [],
              },
            ],
          };
        } else if (newModule) {
          return {
            tasks: [
              {
                id: "0",
                title: "Nouveau module",
                description: "Description",
                duration: 1,
                contacts: [],
                bonusSkills: [],
              },
            ],
            columns: {
              destColumn: {
                id: "destColumn",
                title: "Modules ajoutés au parcours",
                modulesIds: ["0"],
              },
              sourceColumn: {
                id: "sourceColumn",
                title: "Modules associés à la formation",
                modulesIds: [],
              },
            },
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
  }, [newModule]); */

  // on vérifie qu'il s'agit du premier rendu et que les "props" sont initialisées
  if (
    isInitialRender.current &&
    parcoursModules &&
    formationModules.length > 0
  ) {
    /**
     * on transforme les ids des modules de la liste initiale en string et on retire de cette liste
     * les modules qui sont déjà associés au parcours pour être sûr de ne pas avoir de doublons dans
     * le parcours
     */
    const parcoursModulesIds = parcoursModules.map((item: Module) =>
      item.id?.toString()
    );

    const parcoursModulesTitles = parcoursModules.map(
      (item: Module) => item.title
    );
    const filteredFormationModules = formationModules.filter(
      (item) => !parcoursModulesTitles.includes(item.title)
    );

    const formationModulesIds = formationModules.map((item) =>
      item.id!.toString()
    );

    const filteredFormationModulesIds = formationModulesIds.filter(
      (module: string) => !parcoursModulesIds.includes(module)
    );

    const tasks = [...filteredFormationModules, ...parcoursModules];
    console.log({ tasks });

    // on initialise les "colonnes", c'est à dire les emplacements dans lesquels le drag n drop est possible
    const columns = {
      tasks: tasks ?? [],
      columns: {
        destColumn: {
          id: "destColumn",
          title: "Modules ajoutés au parcours",
          modulesIds: parcoursModulesIds ?? [],
        },
        sourceColumn: {
          id: "sourceColumn",
          title: "Modules associés à la formation",
          modulesIds: filteredFormationModulesIds ?? [],
        },
      },
    };
    console.log({ columns });

    setDnd(columns);

    // on déclare qi'il ne s'agit plus du premier rendu
    isInitialRender.current = false;
  }

  // utilisation pour éviter les rendus infinis
  // TOTO vérifier s'il y a des rendus infinis sans le useMemo
  const updatedModules = useMemo(() => {
    return (
      dnd?.tasks.filter((item) =>
        dnd.columns.destColumn.modulesIds.includes(item.id as string)
      ) || []
    );
  }, [dnd]);

  // mise à jour de la liste des modules du parcours en mémoire
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialEffect.current) {
        dispatch(parcoursModulesSliceActions.setModules(updatedModules));
      } else {
        isInitialEffect.current = false;
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [updatedModules, dispatch]);

  // Gestion du drag n drop
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const home =
      source.droppableId === "destColumn"
        ? dnd?.columns["destColumn"]
        : dnd?.columns["sourceColumn"];

    const foreign =
      destination.droppableId === "destColumn"
        ? dnd?.columns["destColumn"]
        : dnd?.columns["sourceColumn"];

    if (home === foreign) {
      const newModulesIds = Array.from(home?.modulesIds!);
      newModulesIds.splice(source.index, 1);
      newModulesIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        id: home!.id,
        title: home!.title,
        modulesIds: newModulesIds,
      };

      const newState = {
        tasks: dnd!.tasks,
        columns: {
          ...dnd!.columns,
          [newColumn.id!]: newColumn,
        },
      };
      setDnd(newState);
      return;
    }

    const homeModulesIds = Array.from(home!.modulesIds);
    homeModulesIds.splice(source.index, 1);
    const newHome: Column = {
      id: home!.id,
      title: home!.title,
      modulesIds: homeModulesIds,
    };

    const foreignmodulesIds = Array.from(foreign!.modulesIds);
    foreignmodulesIds.splice(destination.index, 0, draggableId);
    const newForeign: Column = {
      id: foreign!.id,
      title: foreign!.title,
      modulesIds: foreignmodulesIds,
    };

    const newState = {
      tasks: dnd!.tasks,
      columns: {
        [newHome.id!]: newHome!,
        [newForeign.id!]: newForeign!,
      },
    };
    setDnd(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {dnd && dnd.tasks.length > 0 ? (
        <section className="grid grid-cols-2 gap-8">
          <SubWrapper>
            <ColumnItem
              isSource={true}
              column={dnd.columns.sourceColumn}
              modulesList={dnd.tasks}
            />
          </SubWrapper>
          <SubWrapper>
            <ColumnItem
              column={dnd.columns.destColumn}
              modulesList={dnd.tasks}
            />
          </SubWrapper>
        </section>
      ) : (
        <p>
          Aucun module n'a été trouvé, clickez sur le bouton ci dessous pour
          créer vore premier module
        </p>
      )}
    </DragDropContext>
  );
};

export default DragNDropArea;
