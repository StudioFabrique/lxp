import { FC, useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Column from "./column";
import Module from "../../../utils/interfaces/module";
import LessonItem from "./lesson-item";

interface ColumnItemProps {
  column: Column;
  isDisabled: boolean;
  modulesList?: Module[];
}

const ColumnItem: FC<ColumnItemProps> = ({
  column,
  isDisabled,
  modulesList,
}) => {
  const [modules, setModules] = useState<Module[] | null>(null);

  useEffect(() => {
    let updatedModules = Array<Module>();
    column.modulesIds.forEach((moduleId: string) => {
      const foundItem = modulesList?.find((item: any) => item.id === moduleId)!;
      if (foundItem) {
        updatedModules = [...updatedModules, foundItem];
      }
    });
    setModules(updatedModules);
  }, [column, modulesList]);

  return (
    <div className="flex flex-col order">
      <div className="h-[50vh] overflow-auto scrollbar scrollbar-thumb-primary/50 scrollbar-track-primary/20">
        <Droppable droppableId={column.id}>
          {(provided) => (
            <ul
              className="flex flex-col gap-y-4 h-full border-primary/20 rounded-lg"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {modules && modules.length > 0 ? (
                <>
                  {modules.map((module, index) => (
                    <li key={module.id}>
                      <LessonItem
                        isDisabled={isDisabled}
                        lesson={module}
                        index={index}
                      />
                    </li>
                  ))}
                </>
              ) : null}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default ColumnItem;
