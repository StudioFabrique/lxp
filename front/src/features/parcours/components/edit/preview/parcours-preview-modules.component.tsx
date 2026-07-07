import { useParcoursSelector } from "../../../store/ParcoursContext";

import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import Module from "../../../../../../src.legacy/utils/interfaces/module";
import PreviewModuleItem from "./preview-module-item";
import EditIcon from "../../../../../../src.legacy/components/UI/svg/edit-icon";

interface ParcoursPreviewModulesProps {
  onEdit: (id: number) => void;
}

const ParcoursPreviewModules = (props: ParcoursPreviewModulesProps) => {
  const modules = useParcoursSelector(
    (state) => state.parcoursModules.modules,
  ) as Module[];

  return (
    <Wrapper>
      <span className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold">Liste des modules</h2>
        <div
          className="w-6 h-6 text-primary cursor-pointer"
          onClick={() => props.onEdit(4)}
        >
          <EditIcon />
        </div>
      </span>
      <ul className="w-full flex flex-wrap gap-4 overflow-auto py-2 ">
        {modules?.map((module) => (
          <li className="w-[300px]" key={module.id}>
            <PreviewModuleItem module={module} />
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default ParcoursPreviewModules;
