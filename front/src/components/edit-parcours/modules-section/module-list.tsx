import Module from "../../../utils/interfaces/module";
import ModuleItem from "./module-item";

interface ModuleListProps {
  modules: Module[];
  isSourceList?: boolean;
  label: string;
  isLoading: boolean;
  onEdit: (id: number) => void;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

const ModuleList = (props: ModuleListProps) => {
  const isSourceList =
    props.isSourceList !== undefined ? props.isSourceList : false;

  return (
    <div>
      <span className="flex gap-x-4 items-center">
        <h2>{props.label}</h2>{" "}
        {props.isLoading && !isSourceList ? (
          <span className="loading loading-spinner text-primary loading-xs"></span>
        ) : null}
      </span>
      <ul className="flex flex-col gap-y-2 mt-4">
        {props.modules.map((module) => (
          <li key={module.id}>
            <ModuleItem
              module={module}
              fromSource={isSourceList!}
              onEdit={props.onEdit}
              onSelect={props.onSelect}
              onDeleteModule={props.onDelete}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ModuleList;
