import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";

import ColumnItem from "./column-item";
import DndModulesList from "./dnd-modules-list";
import Column from "./column";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { setCloneModules } from "../../../store/redux-toolkit/parcours/parcours-modules";
import Module from "../../../utils/interfaces/module";

interface DragNDropAreaprops {
  formationModules: Module[];
}

const DragNDropArea = (props: DragNDropAreaprops) => {
  const { formationModules } = props;
  const [modules, setModules] = useState<DndModulesList | null>(null);
  useState<Module[]>(formationModules);
  const dispatch = useDispatch();
  const parcoursModules = useSelector(
    (state: any) => state.parcoursModule.cloneModules
  );
  const isInitialRender = useRef(true);
  const isInitialEffect = useRef(true);

  console.log("rendering...");

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
    let updatedModulesIds = formationModules.map((module) => String(module.id));
    updatedModulesIds = updatedModulesIds.filter(
      (item) => !parcoursModules.includes(item)
    );
    // on initialise les "colonnes", c'est à dire les emplacements dans lesquels le drag n drop est possible
    const columns = {
      tasks: formationModules,
      columns: {
        destColumn: {
          id: "destColumn",
          title: "Modules ajoutés au parcours",
          modulesIds: parcoursModules,
        },
        sourceColumn: {
          id: "sourceColumn",
          title: "Modules associés à la formation",
          modulesIds: updatedModulesIds,
        },
      },
    };
    setModules(columns);

    // on déclare qi'il ne s'agit plus du premier rendu
    isInitialRender.current = false;
  }

  // utilisation pour éviter les rendus infinis
  // TOTO vérifier s'il y a des rendus infinis sans le useMemo
  const updatedModules = useMemo(() => {
    return modules?.columns.destColumn.modulesIds || [];
  }, [modules]);

  // mise à jour de la liste des modules du parcours en mémoire
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialEffect.current) {
        dispatch(setCloneModules(updatedModules));
      } else {
        isInitialEffect.current = false;
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [updatedModules, dispatch]);

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
        ? modules?.columns["destColumn"]
        : modules?.columns["sourceColumn"];

    const foreign =
      destination.droppableId === "destColumn"
        ? modules?.columns["destColumn"]
        : modules?.columns["sourceColumn"];

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
        tasks: modules!.tasks,
        columns: {
          ...modules!.columns,
          [newColumn.id!]: newColumn,
        },
      };
      setModules(newState);
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
      tasks: modules!.tasks,
      columns: {
        [newHome.id!]: newHome!,
        [newForeign.id!]: newForeign!,
      },
    };
    setModules(newState);
  };

  console.log({ modules });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {modules ? (
        <section className="grid grid-cols-2 gap-y-8">
          <ColumnItem
            isDisabled={false}
            column={modules.columns.sourceColumn}
            modulesList={modules.tasks}
          />
          <ColumnItem
            isDisabled={true}
            column={modules.columns.destColumn}
            modulesList={modules.tasks}
          />
        </section>
      ) : null}
    </DragDropContext>
  );
};

export default DragNDropArea;
