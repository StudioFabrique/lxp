import Module from "../../../utils/interfaces/module";
import ModuleItem from "./module-item";

interface ModuleListProps {
  modules: Module[];
  isSourceList?: boolean;
  label: string;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

const ModuleList = (props: ModuleListProps) => {
  const isSourceList =
    props.isSourceList !== undefined ? props.isSourceList : false;

  const handleSelect = (id: number) => {
    props.onSelect(id);
  };

  return (
    <div>
      <h2>{props.label}</h2>
      <ul className="flex flex-col gap-y-2 mt-4">
        {props.modules.map((module) => (
          <li key={module.id} onClick={() => handleSelect(module.id!)}>
            <ModuleItem
              module={module}
              fromSource={isSourceList!}
              onEdit={props.onSelect}
              onDeleteModule={props.onDelete}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ModuleList;
