import { useContext } from "react";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import PreviewModuleItem from "./preview-module-item";
import EditIcon from "../../../../../../src/components/UI/svg/edit-icon";
import { useParams } from "react-router";
import { useParcoursModules } from "../../../hooks/useParcoursModules";
import { AuthContext } from "../../../../../store/AuthProvider";
import { getModulesLabel } from "../../../../../utils/helpers/user-role";

interface ParcoursPreviewModulesProps {
  onEdit: (id: number) => void;
}

const ParcoursPreviewModules = (props: ParcoursPreviewModulesProps) => {
  const { id } = useParams();
  const { modules } = useParcoursModules(Number(id));
  const { user } = useContext(AuthContext);

  return (
    <Wrapper>
      <span className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {getModulesLabel(user, "Liste des modules")}
        </h2>
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
